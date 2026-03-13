"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const USERFLOW_BASE = { width: 750, height: 309 };

type UserflowLightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
};

export function UserflowLightbox({ isOpen, onClose, src }: UserflowLightboxProps) {
  const [scale, setScale] = useState(1.2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({
    isDown: false,
    moved: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });
  const bodyScrollYRef = useRef(0);

  const clampOffset = (x: number, y: number, nextScale: number) => {
    if (!viewportRef.current) {
      return { x: 0, y: 0 };
    }
    const rect = viewportRef.current.getBoundingClientRect();
    const edgePadding = rect.width < 640 ? 16 : 32;
    const scaledWidth = USERFLOW_BASE.width * nextScale;
    const scaledHeight = USERFLOW_BASE.height * nextScale;
    const maxX = Math.max(0, (scaledWidth - (rect.width - edgePadding * 2)) / 2);
    const maxY = Math.max(0, (scaledHeight - (rect.height - edgePadding * 2)) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const initialScale = isMobile ? 1.2 : 1.5;
    setScale(initialScale);
    requestAnimationFrame(() => {
      if (!viewportRef.current) {
        return;
      }
      const rect = viewportRef.current.getBoundingClientRect();
      const scaledWidth = USERFLOW_BASE.width * initialScale;
      const maxX = Math.max(0, (scaledWidth - rect.width) / 2);
      const initialX = isMobile ? -maxX : 0;
      setOffset(clampOffset(initialX, 0, initialScale));
    });
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    bodyScrollYRef.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${bodyScrollYRef.current}px`;
    document.body.style.width = "100%";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo({ top: bodyScrollYRef.current, left: 0, behavior: "instant" });
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setOffset((prev) => clampOffset(prev.x, prev.y, scale));
  }, [isOpen, scale]);

  useEffect(() => {
    if (!isOpen || !viewportRef.current) {
      return;
    }
    const update = () => {
      if (!viewportRef.current) {
        return;
      }
      const rect = viewportRef.current.getBoundingClientRect();
      const scaledWidth = USERFLOW_BASE.width * scale;
      const scaledHeight = USERFLOW_BASE.height * scale;
      setCanDrag(scaledWidth > rect.width || scaledHeight > rect.height);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isOpen, scale]);

  const startDrag = (clientX: number, clientY: number) => {
    if (!canDrag) {
      return;
    }
    dragRef.current.isDown = true;
    dragRef.current.moved = false;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.startOffsetX = offset.x;
    dragRef.current.startOffsetY = offset.y;
    setIsDragging(false);
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!dragRef.current.isDown) {
      return;
    }
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    if (!dragRef.current.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      dragRef.current.moved = true;
      setIsDragging(true);
    }
    const nextX = dragRef.current.startOffsetX + dx;
    const nextY = dragRef.current.startOffsetY + dy;
    setOffset(clampOffset(nextX, nextY, scale));
  };

  const endDrag = () => {
    dragRef.current.isDown = false;
    setIsDragging(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startDrag(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) {
      return;
    }
    event.preventDefault();
    moveDrag(event.clientX, event.clientY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag();
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const touch = event.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown || event.touches.length === 0) {
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center px-6"
      role="presentation"
      onTouchMove={(event) => event.preventDefault()}
    >
      <div className="lightbox-backdrop absolute inset-0" onClick={onClose} />
      <div className="relative h-[88vh] w-[96vw] overflow-hidden rounded-[28px] bg-[#222] p-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:w-[90vw] sm:p-0">
        <div className="absolute right-3 top-3 z-10 flex gap-2 sm:right-6 sm:top-6">
          <button
            type="button"
            aria-label="Close"
            className="relative flex h-12 w-12 items-center justify-center sm:h-6 sm:w-6 sm:cursor-default"
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2b2b2b] text-[#a0a0a0]">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        </div>
        <div
          ref={viewportRef}
          className={`relative h-full w-full overflow-hidden ${
            canDrag ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute left-1/2 top-1/2">
            <div
              style={{
                width: `${USERFLOW_BASE.width}px`,
                height: `${USERFLOW_BASE.height}px`,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center",
              }}
            >
              <Image
                alt=""
                src={src}
                width={USERFLOW_BASE.width}
                height={USERFLOW_BASE.height}
                sizes={isMobile ? "(max-width: 640px) 90vw, 80vw" : "80vw"}
                className="h-full w-full select-none object-contain pointer-events-none"
                draggable={false}
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 z-10 flex gap-2 sm:bottom-6 sm:right-6">
          <button
            type="button"
            aria-label="Zoom out"
            className="relative flex h-12 w-12 items-center justify-center sm:h-6 sm:w-6"
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setScale((value) => Math.max(1, Math.round((value - 0.5) * 10) / 10));
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2b2b2b] text-[#a0a0a0]">
              –
            </span>
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            className="relative flex h-12 w-12 items-center justify-center sm:h-6 sm:w-6"
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setScale((value) => Math.min(3, Math.round((value + 0.5) * 10) / 10));
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2b2b2b] text-[#a0a0a0]">
              +
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
