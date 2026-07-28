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
  chartSmall: "/figma/Case_1/Section_1/case-chart-small.png",
  caseDiscovery: "/figma/Case_1/Section_2/case-discovery.png",
  discoveryFeedback1: "/figma/Case_1/Section_2/case-discovery-feedback-1-figma.png",
  discoveryFeedback2: "/figma/Case_1/Section_2/case-discovery-feedback-2-figma.png",
  benchmark: "/figma/Case_1/Section_2/case-benchmark-figma.png",
  userflow: "/figma/Case_1/Section_3/case-userflow.png",
  solutionSuccess: "/figma/Case_1/Section_4/case-solution-success.png",
  callFlowVideo: "/figma/Case_1/Section_4/call-flow-site.mp4",
  callFlowPoster: "/figma/Case_1/Section_4/call-flow-poster.png",
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

function ZoomIcon({ floating = true }: { floating?: boolean }) {
  return (
    <span
      className={`${floating ? "pointer-events-none absolute bottom-space-3 right-space-3" : ""} flex h-10 w-10 items-center justify-center rounded-full bg-elevated-hover text-primary`}
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
  const solutionPhonesRef = useRef<HTMLDivElement | null>(null);
  const bodyScrollYRef = useRef(0);
  const setSolutionPhonesElement = useCallback((element: HTMLDivElement | null) => {
    solutionPhonesRef.current = element;
    if (!element || !window.matchMedia("(max-width: 639px)").matches) {
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const imageContainer = element.firstElementChild as HTMLElement | null;
        if (imageContainer) {
          element.scrollLeft = Math.max(
            0,
            (imageContainer.offsetWidth - element.clientWidth) / 2
          );
        }
      });
    });
  }, []);
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
    const centerSolutionPhones = () => {
      const element = solutionPhonesRef.current;
      const imageContainer = element?.firstElementChild as HTMLElement | null;
      if (!element || !imageContainer || !window.matchMedia("(max-width: 639px)").matches) {
        return;
      }
      element.scrollLeft = Math.max(0, (imageContainer.offsetWidth - element.clientWidth) / 2);
    };

    const centerPhoneGalleries = () => {
      if (!window.matchMedia("(max-width: 639px)").matches) {
        return;
      }
      const heroElement = heroPhonesRef.current;
      if (heroElement) {
        heroElement.scrollLeft = (heroElement.scrollWidth - heroElement.clientWidth) / 2;
      }
      centerSolutionPhones();
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
              href="https://drive.google.com/file/d/1srTs3sn5jrgr6PlKthMkucNrslEvm0Tp/view?usp=sharing"
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
        className="flex w-full flex-col gap-y-[140px] px-space-4 pb-[40px] pt-[140px] sm:mx-auto sm:max-w-[800px] sm:px-0"
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
                Product Designer · 2024 — Present
              </p>
            </div>
            <p className="text-body-18">
              A mobile app for making internet calls and managing a personal account.
              Its audience is travelers who need affordable connectivity abroad without complex
              SIM card or roaming setup.
            </p>
            <p className="text-body-18">
              I joined the project at the MVP stage, a few months before the planned release. Within the
              team, I was responsible for the user journey from registration to the first call, including
              number activation, billing, and support.
            </p>
          </div>
          <div
            ref={heroPhonesRef}
            className="case-horizontal-scroll relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto sm:flex sm:w-[800px] sm:items-center sm:justify-center sm:overflow-visible"
          >
            <div className="flex w-max items-center justify-center gap-space-6 sm:w-auto sm:gap-space-4">
              <Image
                alt="MCN Softphone registration screen"
                src={assets.phone1}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 210px, 240px"
                className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-[240px]"
                priority
                quality={100}
              />
              <Image
                alt="MCN Softphone plan screen"
                src={assets.phone2}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 294px, 280px"
                className="h-[600px] w-auto shrink-0 sm:h-auto sm:w-[280px]"
                priority
                quality={100}
              />
              <Image
                alt="MCN Softphone call screen"
                src={assets.phone3}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 210px, 240px"
                className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-[240px]"
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
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h3-stack">
            <h3 className="text-h3">Problem</h3>
            <div className="case-text-stack text-body-18">
              <p>
                Before the app launched, the core user journey was split between the mobile and web
                experiences. To register and activate a number, users had to switch to the web account,
                wait for manual verification, and figure out for themselves when they could make a call.
              </p>
              <p>
                Users could not see the call cost in advance, did not always understand what caused an
                error, and could not quickly find help within the app.
              </p>
            </div>
          </div>

          <div className="case-h3-stack">
            <h3 className="text-h3">Objective</h3>
            <div className="case-text-stack text-body-18">
              <p>
                Make the journey to the first call clear and predictable, so more users could complete
                activation independently and start using the app.
              </p>
              <p>
                <span className="text-body-18-semibold">Metrics:</span>{" "}
                registration-to-first-call conversion and the number of support requests about activation,
                balance, and charges.
              </p>
            </div>
          </div>
        </motion.section>
        </div>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-space-16 case-h2-stack"
        >
          <h2 className="text-h2">Discovery</h2>

          <div className="case-content-stack">
            <p className="text-body-18">
              I started by studying the journey from registration to the first call: the current
              screens, user requests, competitor solutions, and technical constraints discussed
              with support and development. The goal was to understand what prevented users from
              activating a number and starting to use the app on their own.
            </p>

            <div className="case-h3-stack">
              <h3 className="text-h3">Key flow problems</h3>
              <p className="text-body-18">
                During the audit of the current MVP, I identified three main barriers on the way to
                the first call:
              </p>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">1.&nbsp;The activation flow is fragmented</p>
              <p>
                Registration and number activation take place in the web account, but after
                submitting the request users cannot see the status or next step in the app.
              </p>
              <p className="italic">
                → The first call is delayed, and some users do not complete activation.
              </p>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">2.&nbsp;Pricing and charges are unclear</p>
              <p>Users cannot see the price before a call or a clear breakdown after it ends.</p>
              <p className="italic">
                → Users do not understand the charges and contact support.
              </p>
            </div>

            <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col items-center justify-center sm:w-[calc(100vw-32px)] sm:max-w-[1000px]">
              <div className="case-figure-stack w-full items-center gap-[6px] bg-secondary pb-space-6 pt-space-8 sm:rounded-[12px] sm:px-space-8">
                <div className="case-horizontal-scroll w-full overflow-x-auto pl-space-4 sm:overflow-visible sm:pl-0">
                  <div
                    className="relative w-[850px] max-w-none sm:mx-auto sm:w-full sm:max-w-[850px]"
                    style={{ aspectRatio: "2550 / 1206" }}
                  >
                    <Image
                      alt="The MVP user journey to the first call"
                      src={assets.caseDiscovery}
                      fill
                      sizes="(max-width: 640px) 850px, 850px"
                      className="object-contain"
                      loading="lazy"
                      quality={100}
                      unoptimized
                    />
                  </div>
                  <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
                </div>
                <p className="px-space-4 text-center text-caption-14 text-secondary sm:px-0">
                  Key screens in the current version of MSN Softphone
                </p>
              </div>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">3.&nbsp;Help is difficult to get</p>
              <p>
                Users cannot find answers about setup and call availability in the app and have to
                look for help through other communication channels.
              </p>
              <p className="italic">
                → Even common questions require contacting support.
              </p>
            </div>

            <div className="-mx-space-4 bg-[#1c1c1c] px-space-4 py-space-8 sm:mx-0 sm:rounded-[12px]">
              <div className="mx-auto flex w-full max-w-[427px] flex-col gap-space-4">
                <Image
                  alt="User request about account status"
                  src={assets.discoveryFeedback1}
                  width={1044}
                  height={332}
                  sizes="(max-width: 640px) calc(100vw - 64px), 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <Image
                  alt="User request about an account charge"
                  src={assets.discoveryFeedback2}
                  width={2116}
                  height={512}
                  sizes="(max-width: 640px) calc(100vw - 64px), 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
              </div>
            </div>

            <p className="text-body-18">
              Support request analysis also showed that users{" "}
              <span className="text-body-18-semibold">
                did not understand the current state of their account
              </span>{" "}
              — whether the number was active, whether calls were available, or why the balance had
              changed. This uncertainty is especially critical while traveling, when calls and
              internet access are often needed immediately.
            </p>

            <div id="hypotheses" className="case-h3-stack scroll-mt-space-16">
              <h3 className="text-h3">Competitor analysis</h3>
              <p className="text-body-18">
                I compared registration, the transition to dialing, and feedback after key actions
                across competitor products. The journey to a call was contained in one sequential
                flow, and users could see the system state and the next available step at every
                stage.
              </p>
            </div>

            <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col items-center justify-center sm:w-[calc(100vw-32px)] sm:max-w-[1000px]">
              <div className="case-figure-stack w-full items-center gap-[6px] bg-secondary pb-space-6 pt-space-8 sm:gap-space-4 sm:rounded-[12px] sm:px-space-8">
                <div className="case-horizontal-scroll w-full overflow-x-auto pl-space-4 sm:overflow-visible sm:pl-0">
                  <div
                    className="relative w-[1700px] max-w-none sm:mx-auto sm:w-full"
                    style={{ aspectRatio: "4096 / 1150" }}
                  >
                    <Image
                      alt="Competitor journeys from registration to the first call"
                      src={assets.benchmark}
                      fill
                      sizes="(max-width: 640px) 1700px, 936px"
                      className="object-cover"
                      loading="lazy"
                      quality={100}
                      unoptimized
                    />
                  </div>
                  <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
                </div>
                <p className="px-space-4 text-center text-caption-14 text-secondary sm:px-0">
                  Sequential path to the first call in competitor apps
                </p>
              </div>
            </div>

            <div className="text-body-18">
              <p>I took three principles from the analysis:</p>
              <ul className="list-disc pl-space-6">
                <li>confirm the completion of each key action</li>
                <li>show activation status and when calling becomes available</li>
                <li>
                  explain not only the cause of an error, but also how to return to the flow
                </li>
              </ul>
            </div>

            <div className="case-media-stack w-full max-w-[800px]">
              <div className="case-h3-stack">
                <h3 className="text-h3">Hypotheses</h3>
                <p className="text-body-18">
                  Based on the research, I identified three hypotheses that could affect the key
                  product metrics. They formed the basis for the next design stage.
                </p>
              </div>
              <div className="flex flex-col gap-space-4">
                <div className="case-point-stack text-body-18">
                  <p className="text-body-18-semibold">1.&nbsp;Guided activation</p>
                  <p>
                    If number activation is moved into the app and the status and next step are
                    shown, more users will complete setup and make their first call.
                  </p>
                  <p><span className="text-body-18-semibold">Metric:</span> registration-to-first-call CR.</p>
                </div>
                <div className="case-point-stack text-body-18">
                  <p className="text-body-18-semibold">2.&nbsp;Transparent pricing</p>
                  <p>
                    If the price is shown before a call and the charge is explained afterward,
                    users will find it easier to control their spending.
                  </p>
                  <p><span className="text-body-18-semibold">Metric:</span> pricing and billing support requests.</p>
                </div>
                <div className="case-point-stack text-body-18">
                  <p className="text-body-18-semibold">3.&nbsp;Contextual help</p>
                  <p>
                    If an error is explained and a way to continue is offered immediately, fewer
                    users will abandon activation or contact support.
                  </p>
                  <p><span className="text-body-18-semibold">Metric:</span> first-call CR and support requests.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="design"
          data-section-anchor="design"
          variants={item}
          className="scroll-mt-space-16 case-h2-stack"
        >
          <h2 className="text-h2">Design process</h2>
          <div className="case-content-stack">
            <div className="case-text-stack">
              <p className="text-body-18">
                <span className="text-body-18-semibold">The goal of this stage was to</span> define how the system would communicate with users so
                they would not become confused if something went wrong. The main decisions concerned
                flow logic, states, and edge cases.
              </p>
              <p className="text-body-18">
                My main priority when designing the new journey was to eliminate uncertainty. Users
                should not have to wonder: “Is the number mine yet? How much will this cost? What do I
                do if something goes wrong?” Here is the result:
              </p>
            </div>

            <div className="relative left-1/2 flex w-screen max-w-[1000px] -translate-x-1/2 flex-col items-center justify-center sm:w-[calc(100vw-32px)]">
              <div className="flex w-full flex-col items-center gap-0 bg-secondary p-space-4 sm:rounded-[12px] sm:p-space-6">
                <button
                  type="button"
                  aria-label="Open userflow"
                  onClick={() => setOpenLightbox("userflow")}
                  className="group relative block w-full cursor-zoom-in overflow-hidden"
                >
                  <Image
                    alt=""
                    src={assets.userflow}
                    width={4096}
                    height={1690}
                    sizes="(max-width: 640px) calc(100vw - 80px), 952px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  quality={100}
                  />
                  <ZoomImageShade />

                </button>
                <div className="grid w-full grid-cols-[1fr_40px] items-end gap-0">
                  <p className="text-center text-caption-14 text-secondary">
                    New first-call user flow
                  </p>
                  <button
                    type="button"
                    aria-label="Open userflow scheme"
                    onClick={() => setOpenLightbox("userflow")}
                    className="group cursor-zoom-in"
                  >
                    <ZoomIcon floating={false} />
                  </button>
                </div>
              </div>
            </div>

            <ul className="list-disc space-y-space-2 pl-space-6 text-body-18">
              <li>the path to the first call was reduced from eight steps to three</li>
              <li>
                call costs were shown before dialing, while success screens after key steps
                reduced anxiety and uncertainty
              </li>
              <li>errors no longer led to dead ends; they offered a solution and returned users to the flow</li>
              <li>
                support remained readily available as an additional, rather than primary, step
                in resolving a problem
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-content-stack">
            <div className="case-h2-stack">
              <h2 className="text-h2">Solution</h2>
              <p className="text-body-18">
                Initial tests showed that users made mistakes even where the logic seemed obvious.
              I therefore gathered feedback, reworked several flows, and tested them again:
            </p>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">1.&nbsp;Success screen after registration</p>
              <p>
                Initially, this was a separate screen with a checkmark and a “Continue” button, but testing
              showed that people paused for two to three minutes: the checkmark drew attention while the button was overlooked.
            </p>
              <p>
                <span>→</span>{" "}
                <span className="italic">
                  I combined the success screen with checkout so that after registering through Gosuslugi,
                users immediately saw their number and plan terms, without unnecessary steps or pauses.
              </span>
              </p>
            </div>
          </div>

            <div className="case-numbered-point-media relative left-1/2 flex w-screen max-w-[850px] -translate-x-1/2 items-center justify-center pl-space-4 sm:w-[calc(100vw-32px)] sm:pl-0">
            <div
              ref={setSolutionPhonesElement}
              data-solution-gallery
              className="case-horizontal-scroll w-full overflow-x-auto sm:overflow-visible"
            >
              <div className="w-[850px] max-w-none sm:mx-auto sm:w-full sm:max-w-[850px]">
                <Image
                  alt=""
                  src={assets.solutionSuccess}
                  width={2535}
                  height={1620}
                  sizes="(max-width: 640px) 850px, 850px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
              </div>
              <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
            </div>
          </div>

          <div className="case-point-stack text-body-18">
            <p className="text-body-18-semibold">2.&nbsp;Checking the cost of a call</p>
            <p>
              In the first version, users could see the price only after they started entering a number.
              Some found it inconvenient to enter a familiar number every time they wanted an estimate.
            </p>
            <p>
              <span>→</span>{" "}
              <span className="italic">
                I added a “Choose contact” button directly to the dialer. Selecting a contact now
                displays the price immediately, just as manual entry does.
              </span>
            </p>
          </div>

          <div className="case-numbered-point-media case-numbered-point-media-captioned relative left-1/2 flex w-[calc(100vw-32px)] max-w-[950px] -translate-x-1/2 flex-col items-center justify-center gap-space-1">
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
                  poster={assets.callFlowPoster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
            <p className="w-full text-center text-caption-14 text-secondary">
              The per-minute call rate is visible immediately
            </p>
          </div>

          <div className="case-point-stack text-body-18">
            <p className="text-body-18-semibold">3.&nbsp;Help and guidance</p>
            <p>
              Previously, the error screen simply displayed a reason such as “Registration incomplete”
              or “Insufficient funds.” Users still did not know what to do next and contacted support.
            </p>
            <p>
              <span>→</span>{" "}
              <span className="italic">
                I added contextual buttons to return users to the flow—“Return to Gosuslugi,”
                “Top up balance,” and “Contact support”—so they could quickly take the
                appropriate action or reach support.
              </span>
            </p>
          </div>

          <div className="case-numbered-point-media case-numbered-point-media-captioned relative left-1/2 flex w-screen max-w-[1100px] -translate-x-1/2 items-center justify-center pl-space-4 sm:w-[calc(100vw-32px)] sm:pl-0">
            <div className="w-full">
              <div className="case-horizontal-scroll overflow-x-auto sm:overflow-visible">
                <div className="w-[1000px] max-w-none sm:hidden">
                  <Image
                    alt=""
                    src={assets.solutionErrorMobile}
                    width={1052}
                    height={532}
                    sizes="1000px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    quality={100}
                  />
                </div>
                <div className="hidden sm:mx-auto sm:block sm:w-full sm:max-w-[1000px]">
                  <Image
                    alt=""
                    src={assets.solutionError}
                    width={1052}
                    height={532}
                    sizes="1000px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    quality={100}
                  />
                </div>
                <span aria-hidden="true" className="block w-space-4 shrink-0 sm:hidden" />
              </div>
              <p className="mt-[6px] w-full text-center text-caption-14 leading-[160%] text-secondary sm:mx-auto sm:mt-space-3 sm:max-w-[1000px]">
                Return users to the flow while keeping support within reach
              </p>
            </div>
          </div>

          <div className="case-text-stack text-body-18">
            <p>
              Each iteration resolved a specific point of uncertainty: users could see when their
              number was active, how much a call would cost, and what to do after an error. This
              shortened the journey and reduced support requests.
            </p>
            <p>
              Further softphone development continued in response to user feedback, including
              favorite contacts, redialing from call history, and low-balance push notifications.
              These improvements entered the backlog and were planned for upcoming releases.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-space-16 case-h2-stack"
        >
          <h2 className="text-h2">Results</h2>
          <div className="case-content-stack">
            <p className="text-body-18">
              The key changes addressed the main problems identified at the outset: the path to the
              first call became shorter, users better understood their status and the cost of actions,
              and some questions no longer reached support. With the same traffic, the number of calls rose
              from <span className="text-body-18-semibold">13k</span> to{" "}
              <span className="text-body-18-semibold">17k.</span>
            </p>

            <div className="grid grid-cols-1 gap-space-3 min-[440px]:grid-cols-2 lg:grid-cols-[repeat(4,184px)]">
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3 lg:w-[184px]">
                <div className="flex h-10 items-start gap-0 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-center text-[32px] font-semibold leading-10">8</span>
                  <span className="inline-flex h-10 items-center">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-10 items-center text-[32px] font-semibold leading-10">3</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  steps to a call
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3 lg:w-[184px]">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[18px] leading-[160%]">+</span>
                  <span className="text-[32px] leading-10">23</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  first-call conversion
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3 lg:w-[184px]">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[32px] leading-10">15</span>
                  <span className="inline-flex h-10 items-center">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="text-[32px] leading-10">22</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  week-four retention
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3 lg:w-[184px]">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[32px] leading-10">40</span>
                  <span className="inline-flex h-10 items-center">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="text-[32px] leading-10">18</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  support requests
                </p>
              </div>
            </div>

            <p className="text-body-18">
              My key takeaway was that trust in mobile products is built through clear communication
              at critical moments: status, cost, errors, and the next step.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Page navigation"
          className="-mt-[88px] flex w-full items-start justify-between border-t border-border-elevated pt-space-2 text-body-18 sm:mt-0"
        >
          <Link href="/" className="group shrink-0">
            <span className="link-underline">
              ← Home
            </span>
          </Link>
          <Link href="/work" className="group shrink-0">
            <span className="link-underline">
              KOMPaaS case study →
            </span>
          </Link>
        </motion.nav>
      </motion.div>

      <nav className="pointer-events-none fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-space-3 lg:flex">
        {[
          { id: "overview", label: "About the project" },
          { id: "discovery", label: "Discovery" },
          { id: "design", label: "Design process" },
          { id: "solution", label: "Solution" },
          { id: "results", label: "Results" },
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div
              ref={userflowViewportRef}
              className={`relative h-full w-full overflow-hidden ${
                canDragUserflow ? (isDraggingUserflow ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
              }`}
              style={{ touchAction: "none" }}
              onMouseDown={handleUserflowMouseDown}
              onMouseMove={handleUserflowMouseMove}
              onMouseUp={handleUserflowMouseUp}
              onMouseLeave={handleUserflowMouseLeave}
              onTouchStart={handleUserflowTouchStart}
              onTouchMove={handleUserflowTouchMove}
              onTouchEnd={handleUserflowTouchEnd}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute left-1/2 top-1/2">
                <div
                  style={{
                    width: `${activeLightbox.baseWidth}px`,
                    height: `${activeLightbox.baseHeight}px`,
                    transform: `translate(-50%, -50%) translate(${userflowOffset.x}px, ${userflowOffset.y}px) scale(${lightboxScale})`,
                    transformOrigin: "center",
                  }}
                >
                  <Image
                    alt=""
                    src={activeLightbox.src}
                    width={activeLightbox.imageWidth}
                    height={activeLightbox.imageHeight}
                    sizes="(max-width: 640px) 1600px, 1500px"
                    className="pointer-events-none h-full w-full select-none object-contain"
                    draggable={false}
                    priority
                    quality={100}
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 z-10 flex gap-space-2 sm:bottom-6 sm:right-6">
              <button
                type="button"
                aria-label="Zoom out"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  const minScale = window.matchMedia("(max-width: 639px)").matches ? 0.3 : 1;
                  setLightboxScale((value) => Math.max(minScale, Math.round((value - 0.5) * 10) / 10));
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxScale((value) => Math.min(3, Math.round((value + 0.5) * 10) / 10));
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M12 6v12M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
