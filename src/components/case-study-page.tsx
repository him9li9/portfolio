"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const assets = {
  heart: "/figma/Icons/heart.svg",
  phone1: "/figma/Case_1/Section_1/softphone-success.png",
  phone2: "/figma/Case_1/Section_1/softphone-home.png",
  phone3: "/figma/Case_1/Section_1/softphone-dialpad.png",
  arrowForward: "/figma/Icons/arrow_forward.svg",
  legacySignIn: "/figma/Case_1/Section_2/mvp-sign-in.jpg",
  legacyStorefront: "/figma/Case_1/Section_2/mvp-number-storefront.png",
  userflow: "/figma/Case_1/Section_3/case-userflow.png",
  solutionSuccess: "/figma/Case_1/Section_4/case-solution-success.png",
  callFlowVideo: "/figma/Case_1/Section_4/call-flow.mp4",
  solutionError: "/figma/Case_1/Section_4/case-solution-error.png",
  solutionErrorMobile: "/figma/Case_1/Section_4/case-solution-error.png"
};

const lightboxItems = {
  userflow: {
    src: assets.userflow,
    imageWidth: 4096,
    imageHeight: 1690,
    baseWidth: 1000,
    baseHeight: 413,
    mobileScale: 1.6,
    desktopScale: 1.5,
    mobileStart: "left"
  }
} as const;

function ZoomIcon() {
  return (
    <span
      className="pointer-events-none absolute bottom-space-3 right-space-3 flex h-10 w-10 items-center justify-center rounded-full bg-elevated-hover text-primary"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
    </span>
  );
}

function ZoomImageShade() {
  return (
    <span className="pointer-events-none absolute inset-0 bg-primary/0 transition-colors duration-200 group-hover:bg-primary/20" />
  );
}

function ComparisonImage({
  src,
  alt,
  width,
  height,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Увеличить: ${alt}`}
        className={`group relative block cursor-zoom-in overflow-hidden rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      >
        <Image alt={alt} src={src} width={width} height={height} sizes={sizes} className="h-auto w-full" quality={100} />
        <ZoomImageShade />
        <ZoomIcon />
      </button>
      <dialog
        ref={dialogRef}
        aria-label={alt}
        className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[1000px] rounded-xl bg-secondary p-0 text-primary backdrop:bg-black/70"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="relative">
          <form method="dialog" className="sticky top-0 z-10 flex h-0 justify-end">
            <button
              type="submit"
              aria-label="Закрыть"
              className="mr-3 mt-3 grid size-10 shrink-0 place-items-center rounded-full bg-elevated text-primary hover:bg-elevated-hover"
            >
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>
          </form>
          <div className="max-h-[90dvh] overflow-auto overscroll-contain p-space-4">
            <Image
              alt={alt}
              src={src}
              width={width}
              height={height}
              sizes="(max-width: 640px) 640px, 1000px"
              className={width > height ? "h-auto w-full min-w-[620px]" : "mx-auto h-auto w-full max-w-[430px]"}
              quality={100}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}

export function CaseStudyPage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [openLightbox, setOpenLightbox] = useState<keyof typeof lightboxItems | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1.3);
  const [isDraggingUserflow, setIsDraggingUserflow] = useState(false);
  const [canDragUserflow, setCanDragUserflow] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [userflowOffset, setUserflowOffset] = useState({ x: 0, y: 0 });
  const userflowViewportRef = useRef<HTMLDivElement | null>(null);
  const heroPhonesRef = useRef<HTMLDivElement | null>(null);
  const bodyScrollYRef = useRef(0);
  const activeLightbox = openLightbox ? lightboxItems[openLightbox] : null;
  const userflowDragRef = useRef({
    isDown: false,
    moved: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.35 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.6, ease: cubicBezier(0.16, 1, 0.3, 1) }
    }
  };

  const clampUserflowOffset = useCallback((x: number, y: number, scale: number) => {
    if (!userflowViewportRef.current || !activeLightbox) {
      return { x: 0, y: 0 };
    }
    const rect = userflowViewportRef.current.getBoundingClientRect();
    const edgePadding = rect.width < 640 ? 16 : 32;
    const scaledWidth = activeLightbox.baseWidth * scale;
    const scaledHeight = activeLightbox.baseHeight * scale;
    const maxX = Math.max(0, (scaledWidth - (rect.width - edgePadding * 2)) / 2);
    const maxY = Math.max(0, (scaledHeight - (rect.height - edgePadding * 2)) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, [activeLightbox]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;

        if (currentY <= 80) {
          setHideTopbar(false);
        } else if (delta > 6) {
          setHideTopbar(true);
        } else if (delta < -6) {
          setHideTopbar(false);
        }

        lastY = currentY;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const centerPhoneGalleries = () => {
      if (!window.matchMedia("(max-width: 639px)").matches) {
        return;
      }
      const heroElement = heroPhonesRef.current;
      if (heroElement) {
        heroElement.scrollLeft = (heroElement.scrollWidth - heroElement.clientWidth) / 2;
      }
    };
    const raf = requestAnimationFrame(centerPhoneGalleries);
    window.addEventListener("resize", centerPhoneGalleries);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", centerPhoneGalleries);
    };
  }, []);

  useEffect(() => {
    if (!openLightbox) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenLightbox(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    const previousOverscroll = document.body.style.overscrollBehavior;
    bodyScrollYRef.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${bodyScrollYRef.current}px`;
    document.body.style.width = "100%";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo({ top: bodyScrollYRef.current, left: 0, behavior: "instant" });
    };
  }, [openLightbox]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (activeLightbox) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const initialScale = isMobile ? activeLightbox.mobileScale : activeLightbox.desktopScale;
      setLightboxScale(initialScale);
      setUserflowOffset({ x: 0, y: 0 });
      requestAnimationFrame(() => {
        if (!userflowViewportRef.current) {
          return;
        }
        const rect = userflowViewportRef.current.getBoundingClientRect();
        const scaledWidth = activeLightbox.baseWidth * initialScale;
        const maxX = Math.max(0, (scaledWidth - rect.width) / 2);
        const initialX = isMobile && activeLightbox.mobileStart === "left" ? maxX : 0;
        setUserflowOffset(clampUserflowOffset(initialX, 0, initialScale));
      });
    }
  }, [activeLightbox, clampUserflowOffset]);

  useEffect(() => {
    if (!activeLightbox) {
      return;
    }
    const updateCanDrag = () => {
      if (!userflowViewportRef.current) {
        return;
      }
      const rect = userflowViewportRef.current.getBoundingClientRect();
      const scaledWidth = activeLightbox.baseWidth * lightboxScale;
      const scaledHeight = activeLightbox.baseHeight * lightboxScale;
      setCanDragUserflow(scaledWidth > rect.width || scaledHeight > rect.height);
    };
    updateCanDrag();
    window.addEventListener("resize", updateCanDrag);
    return () => window.removeEventListener("resize", updateCanDrag);
  }, [activeLightbox, lightboxScale]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-anchor]")
    );
    if (sections.length === 0) {
      return;
    }
    const updateFromScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.scrollY;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const isAtPageEnd = scrollTop + viewportHeight >= documentHeight - 2;
      const activationY = Math.min(220, viewportHeight * 0.35);
      let current = sections[0]?.dataset.sectionAnchor || "overview";
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if ((rect.top <= activationY && rect.bottom > 0) || (isAtPageEnd && index === sections.length - 1)) {
          current = section.dataset.sectionAnchor || current;
        }
      });
      setActiveSection(current);
    };
    updateFromScroll();
    const timeouts = [0, 120, 300, 600, 1000].map((delay) =>
      window.setTimeout(updateFromScroll, delay)
    );
    const raf = requestAnimationFrame(updateFromScroll);
    const fontsReady = document.fonts?.ready;
    fontsReady?.then(() => updateFromScroll());
    window.addEventListener("pageshow", updateFromScroll);
    window.addEventListener("resize", updateFromScroll);
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, []);

  useEffect(() => {
    if (!activeLightbox) {
      return;
    }
    setUserflowOffset((prev) => clampUserflowOffset(prev.x, prev.y, lightboxScale));
  }, [activeLightbox, lightboxScale, clampUserflowOffset]);

  const startUserflowDrag = (clientX: number, clientY: number) => {
    if (!canDragUserflow) {
      return;
    }
    if (!userflowViewportRef.current) {
      return;
    }
    userflowDragRef.current.isDown = true;
    userflowDragRef.current.moved = false;
    userflowDragRef.current.startX = clientX;
    userflowDragRef.current.startY = clientY;
    userflowDragRef.current.startOffsetX = userflowOffset.x;
    userflowDragRef.current.startOffsetY = userflowOffset.y;
    setIsDraggingUserflow(false);
  };

  const moveUserflowDrag = (clientX: number, clientY: number) => {
    if (!userflowViewportRef.current || !userflowDragRef.current.isDown) {
      return;
    }
    const dx = clientX - userflowDragRef.current.startX;
    const dy = clientY - userflowDragRef.current.startY;
    if (!userflowDragRef.current.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      userflowDragRef.current.moved = true;
      setIsDraggingUserflow(true);
    }
    const nextX = userflowDragRef.current.startOffsetX + dx;
    const nextY = userflowDragRef.current.startOffsetY + dy;
    setUserflowOffset(clampUserflowOffset(nextX, nextY, lightboxScale));
  };

  const endUserflowDrag = () => {
    userflowDragRef.current.isDown = false;
    setIsDraggingUserflow(false);
  };

  const handleUserflowMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    startUserflowDrag(event.clientX, event.clientY);
  };

  const handleUserflowMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!userflowDragRef.current.isDown) {
      return;
    }
    event.preventDefault();
    moveUserflowDrag(event.clientX, event.clientY);
  };

  const handleUserflowMouseUp = () => {
    endUserflowDrag();
  };

  const handleUserflowMouseLeave = () => {
    endUserflowDrag();
  };

  const handleUserflowTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 0) {
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    startUserflowDrag(touch.clientX, touch.clientY);
  };

  const handleUserflowTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 0) {
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    moveUserflowDrag(touch.clientX, touch.clientY);
  };

  const handleUserflowTouchEnd = () => {
    endUserflowDrag();
  };

  const handleSectionNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault();
    setActiveSection(id);
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };


  return (
    <main className="overflow-x-hidden bg-primary text-primary">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="fixed top-0 z-10 h-[74px] w-full bg-primary/60 backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
      >
        <div className="flex h-full w-full items-center justify-between px-space-4 py-space-3 sm:px-space-8">
          <motion.div
            whileHover={canHover ? { scale: 1.05 } : undefined}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link href="/" className="font-oldenburg flex items-center gap-space-1 text-body-18">
              <span>nastya</span>
              <span>with</span>
              <img alt="" src={assets.heart} className="h-6 w-6" />
            </Link>
          </motion.div>
          <div className="flex items-center gap-space-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "var(--color-bg-elevated-hover)", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-elevated px-space-4 py-space-2 text-body-16 text-primary"
              href="https://drive.google.com/file/d/1jXFLR65AUPIRSsSU4JpdDGOdRiS_aMF4/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "var(--color-bg-elevated-hover)", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-elevated px-space-4 py-space-2 text-body-16 text-primary"
              href="https://t.me/him9li9"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </motion.a>
          </div>
        </div>
      </motion.header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-y-[140px] px-space-4 pb-[40px] pt-[140px] sm:mx-auto sm:max-w-[832px] sm:px-space-4"
      >
        <div className="flex flex-col gap-space-8">
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4 text-primary">
            <div className="flex flex-col gap-space-1">
              <h1 className="text-h1">MCN Softphone</h1>
              <p className="text-body-16 text-secondary">
                Продуктовый дизайнер · 2024 — н.в.
              </p>
            </div>
            <p className="text-h3">8 → 3 шага до первого звонка</p>
            <p className="text-body-18">
              MCN Softphone помогает путешественникам звонить через интернет. Я подключилась на стадии MVP
              и отвечала за путь от регистрации до первого звонка: подключение номера, тарифы и поддержку.
            </p>
          </div>
          <div
            ref={heroPhonesRef}
            className="case-horizontal-scroll case-visual-spacing relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto sm:flex sm:w-full sm:items-center sm:justify-center sm:overflow-visible"
          >
            <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
            <div className="flex w-max items-center justify-center gap-space-6 sm:grid sm:w-full sm:grid-cols-[240fr_280fr_240fr] sm:gap-space-4">
              <Image
                alt="Экран регистрации MCN Softphone"
                src={assets.phone1}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 210px, 240px"
                className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-full"
                priority
                quality={100}
              />
              <Image
                alt="Экран тарифа MCN Softphone"
                src={assets.phone2}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 294px, 280px"
                className="h-[600px] w-auto shrink-0 sm:h-auto sm:w-full"
                priority
                quality={100}
              />
              <Image
                alt="Экран звонка MCN Softphone"
                src={assets.phone3}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 210px, 240px"
                className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-full"
                priority
                quality={100}
              />
            </div>
            <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
          </div>
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-6 text-[16px] leading-[26px]"
        >
          <div className="case-h3-stack">
            <h2 className="text-h3">Проблема</h2>
            <p>В MVP кнопка «Купить номер» открывала веб-кабинет. Там пользователь вводил данные документов и ждал проверки менеджером. После возвращения было непонятно, готов ли номер к звонку.</p>
          </div>
          <div className="case-h3-stack">
            <h2 className="text-h3">Задача</h2>
            <p>Сократить путь от регистрации до первого звонка, сохранив обязательное подтверждение личности владельца номера. Показать, что делать дальше, чтобы пройти сценарий без помощи поддержки.</p>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Путь до первого звонка</h2>
            <div className="case-text-stack text-[16px] leading-[26px]">
              <p>Для подтверждения личности выбрали Госуслуги: пользователю не нужно вводить данные документов вручную и ждать проверки менеджером.</p>
              <p>В первом прототипе после регистрации появлялся отдельный экран с галочкой и кнопкой «Продолжить». На тесте пользователи замечали галочку, но пропускали кнопку. Я перенесла подтверждение на экран заказа. На нём сразу видны номер, тариф и следующее действие: «Перейти к оплате».</p>
            </div>
          </div>

          <div className="case-visual-spacing flex flex-col gap-space-6" aria-labelledby="first-call-comparison">
            <h3 id="first-call-comparison" className="text-h3">С 8 до 3 шагов до первого звонка</h3>

            <figure className="flex flex-col gap-space-3">
              <figcaption>
                <p className="text-body-16 font-semibold">До · Фрагмент старого пути</p>
                <p className="text-caption-14 text-secondary">Чтобы купить номер, нужно было перейти в браузер и дождаться ручной проверки документов.</p>
              </figcaption>
              <div className="grid max-w-[480px] grid-cols-[1fr_0.9492fr] items-start gap-space-4 sm:gap-space-6">
                <ComparisonImage
                  alt="Старый экран входа со ссылкой «Купить номер»"
                  src={assets.legacySignIn}
                  width={470}
                  height={966}
                  sizes="(max-width: 520px) 42vw, 236px"
                  className="w-full border border-border-elevated"
                />
                <div className="flex min-w-0 flex-col gap-space-2">
                  <ComparisonImage
                    alt="Архивный макет витрины номеров в мобильном браузере"
                    src={assets.legacyStorefront}
                    width={750}
                    height={1624}
                    sizes="(max-width: 520px) 40vw, 224px"
                    className="w-full border border-border-elevated"
                  />
                  <p className="text-caption-14 text-secondary">Архивный макет веб-витрины</p>
                </div>
              </div>
            </figure>

            <figure className="flex min-w-0 flex-col gap-space-3 border-t border-border-elevated pt-space-6">
              <figcaption>
                <p className="text-body-16 font-semibold">После · Три ключевых экрана</p>
                <p className="text-caption-14 text-secondary">Подтверждение через Госуслуги и оплата в приложении.</p>
              </figcaption>
              <div className="case-horizontal-scroll w-full overflow-x-auto sm:overflow-visible">
                <ComparisonImage
                  alt="Три экрана нового приложения: вход, номер и тариф перед оплатой, набор номера"
                  src={assets.solutionSuccess}
                  width={2400}
                  height={1584}
                  sizes="(max-width: 640px) 510px, 800px"
                  className="w-[510px] max-w-none sm:w-full"
                />
              </div>
            </figure>
          </div>

          <div className="case-point-stack text-[16px] leading-[26px]">
            <h3 className="text-h3">Как упростили проверку цены звонка</h3>
            <p>
              Раньше, чтобы узнать цену, приходилось набирать номер вручную, даже если он уже был в контактах. Я добавила кнопку «Выбрать контакт» на экран набора. Теперь стоимость минуты видна сразу при наборе номера или выборе контакта, ещё до звонка.
            </p>
          </div>

          <div className="case-numbered-point-media case-numbered-point-media-captioned case-visual-spacing relative left-1/2 flex w-[calc(100vw-32px)] max-w-[950px] -translate-x-1/2 flex-col items-center justify-center gap-space-1">
            <div
              className="flex w-full items-center justify-center px-space-4 sm:px-0"
              style={{ height: 600 }}
            >
              <div
                className="relative h-full max-w-full"
                style={{ width: "min(339px, calc(100vw - 64px))" }}
              >
                <video
                  className="h-full w-full object-contain"
                  style={{ height: "100%", maxHeight: "100%" }}
                  src={assets.callFlowVideo}
                  aria-label="Выбор контакта и просмотр стоимости звонка"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
            <p className="w-full text-center text-caption-14 text-secondary">
              Выбор контакта на экране набора
            </p>
          </div>

          <div className="case-point-stack text-[16px] leading-[26px]">
            <h3 className="text-h3">Помощь в момент ошибки</h3>
            <figure className="my-space-2 flex max-w-[660px] flex-col gap-space-2">
              <figcaption className="text-caption-14 text-secondary">
                Из отзыва о старой версии: пользователь вошёл, но не понял, как настроить звонки.
              </figcaption>
              <Image
                alt="Фрагмент отзыва: пользователь спрашивает, где найти инструкцию по настройке звонков на iPhone, и пишет, что видит баланс, но не видит выбора аккаунта."
                src="/figma/Case_1/Section_2/mvp-feedback-setup-excerpt.png"
                width={1750}
                height={308}
                sizes="(max-width: 700px) calc(100vw - 32px), 660px"
                className="h-auto w-full rounded-lg"
              />
            </figure>
            <p>
              В новом сценарии экран ошибки подсказывает, что делать дальше: вернуться в Госуслуги, пополнить баланс или написать в поддержку.
            </p>
          </div>

          <div className="case-numbered-point-media case-numbered-point-media-captioned case-visual-spacing relative left-1/2 flex w-screen max-w-[1100px] -translate-x-1/2 items-center justify-center pl-space-4 sm:w-[calc(100vw-32px)] sm:pl-0">
            <div className="w-full">
              <div className="case-horizontal-scroll overflow-x-auto sm:overflow-visible">
                <div className="w-[1000px] max-w-none sm:hidden">
                  <Image
                    alt="Состояния ошибок с действиями для продолжения сценария"
                    src={assets.solutionErrorMobile}
                    width={2850}
                    height={1440}
                    sizes="1000px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    quality={100}
                  />
                </div>
                <div className="hidden sm:mx-auto sm:block sm:w-full sm:max-w-[1000px]">
                  <Image
                    alt="Состояния ошибок с действиями для продолжения сценария"
                    src={assets.solutionError}
                    width={2850}
                    height={1440}
                    sizes="1000px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    quality={100}
                  />
                </div>
                <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
              </div>
              <p className="mt-[6px] w-full text-center text-caption-14 leading-[160%] text-secondary sm:mx-auto sm:mt-space-3 sm:max-w-[1000px]">
                Возвращаем на сценарий, но оставляем возможность написать в поддержку
              </p>
            </div>
          </div>

          <details className="rounded-[12px] border border-border-elevated px-space-4 py-space-3">
            <summary className="cursor-pointer text-body-16">Посмотреть схему первого звонка</summary>
            <div className="mt-space-4 flex flex-col items-center gap-space-2 rounded-[12px] bg-secondary p-space-4 sm:p-space-6">
              <button
                type="button"
                aria-label="Увеличить схему первого звонка"
                onClick={() => setOpenLightbox("userflow")}
                className="group relative block w-full cursor-zoom-in overflow-hidden"
              >
                <Image
                  alt="Схема нового пути до первого звонка"
                  src={assets.userflow}
                  width={4096}
                  height={1690}
                  sizes="(max-width: 640px) calc(100vw - 100px), 720px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <ZoomImageShade />
                <ZoomIcon />
              </button>
              <p className="text-center text-caption-14 text-secondary">Новый путь до первого звонка</p>
            </div>
          </details>
        </motion.section>
        </div>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-space-16 case-h2-stack case-results-stack"
        >
          <h2 className="text-h2">Результаты</h2>
          <div className="case-content-stack text-[16px] leading-[26px]">
            <ul className="grid gap-x-space-6 gap-y-space-4 sm:grid-cols-3">
              <li className="border-t border-border-elevated pt-space-3 text-balance"><strong className="font-semibold">С 8 до 3 шагов</strong> сократился путь от регистрации до первого звонка.</li>
              <li className="border-t border-border-elevated pt-space-3 text-balance"><strong className="font-semibold">Вдвое меньше обращений</strong> по подключению, стоимости звонков и списаниям.</li>
              <li className="border-t border-border-elevated pt-space-3 text-balance"><strong className="font-semibold">15+ сценариев</strong> спроектировала: от регистрации и оплаты до роуминга, eSIM и AI-поддержки.</li>
            </ul>
            <p>
              После релиза в бэклог по обратной связи попали избранные контакты, повтор звонка из истории
              и уведомления о низком балансе.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Навигация между страницами"
          className="-mt-[108px] flex w-full items-start justify-between border-t border-border-elevated pt-space-4 text-body-18"
        >
          <Link href="/" className="group shrink-0">
            <span className="link-underline">
              ← На главную
            </span>
          </Link>
          <Link href="/work" className="group shrink-0">
            <span className="link-underline">
              Кейс KOMPaaS →
            </span>
          </Link>
        </motion.nav>
      </motion.div>

      <nav aria-label="Разделы кейса" className="pointer-events-none fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-space-3 lg:flex">
        {[
          { id: "overview", label: "О проекте" },
          { id: "about", label: "Проблема и задача" },
          { id: "solution", label: "Путь до звонка" },
          { id: "results", label: "Результаты" },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group pointer-events-auto flex items-center justify-end gap-space-3 text-right"
            onClick={(event) => handleSectionNavClick(event, item.id)}
          >
            <span className="pointer-events-none max-w-[160px] rounded-full bg-elevated-hover px-space-3 py-space-1 text-caption-14 text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {item.label}
            </span>
            <span
              className={`h-[6px] w-[22px] rounded-full transition-colors duration-200 ${
                activeSection === item.id ? "bg-text-primary" : "bg-elevated-hover"
              }`}
            />
          </a>
        ))}
      </nav>

      {activeLightbox ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center px-space-6"
          onClick={() => setOpenLightbox(null)}
          role="presentation"
          onTouchMove={(event) => event.preventDefault()}
        >
          <div className="lightbox-backdrop absolute inset-0" />
          <div className="relative h-[88vh] w-[96vw] overflow-hidden rounded-[12px] bg-secondary p-0 sm:w-[90vw] sm:p-0">
            <div className="absolute right-3 top-3 z-10 flex gap-space-2 sm:right-6 sm:top-6">
              <button
                type="button"
                aria-label="Close"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenLightbox(null);
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div
              ref={userflowViewportRef}
              className={`h-full w-full overflow-hidden ${canDragUserflow ? (isDraggingUserflow ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
              onMouseDown={handleUserflowMouseDown}
              onMouseMove={handleUserflowMouseMove}
              onMouseUp={handleUserflowMouseUp}
              onMouseLeave={handleUserflowMouseLeave}
              onTouchStart={handleUserflowTouchStart}
              onTouchMove={handleUserflowTouchMove}
              onTouchEnd={handleUserflowTouchEnd}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="absolute left-1/2 top-1/2 origin-center"
                style={{
                  transform: `translate(-50%, -50%) translate(${userflowOffset.x}px, ${userflowOffset.y}px) scale(${lightboxScale})`,
                  width: activeLightbox.baseWidth,
                  height: activeLightbox.baseHeight,
                }}
              >
                <Image
                  src={activeLightbox.src}
                  alt=""
                  width={activeLightbox.imageWidth}
                  height={activeLightbox.imageHeight}
                  className="h-full w-full select-none object-contain"
                  draggable={false}
                  quality={100}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

