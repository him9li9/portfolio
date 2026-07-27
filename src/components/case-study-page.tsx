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
    const centerHeroPhones = () => {
      if (!heroPhonesRef.current || !window.matchMedia("(max-width: 639px)").matches) {
        return;
      }
      const element = heroPhonesRef.current;
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    };
    const raf = requestAnimationFrame(centerHeroPhones);
    window.addEventListener("resize", centerHeroPhones);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", centerHeroPhones);
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
          <div className="flex flex-col gap-space-5 text-primary">
            <div className="flex flex-col gap-space-1">
              <h1 className="text-h1">MCN Softphone</h1>
              <p className="text-body-16 text-secondary">
                Продуктовый дизайнер · 2024 — н.в.
              </p>
            </div>
            <p className="text-body-18">
              Мобильное приложение для звонков через интернет и управления личным кабинетом.
              Аудитория — путешественники, которым нужна доступная связь за границей без сложной
              настройки SIM и роуминга.
            </p>
            <p className="text-body-18">
              Я присоединилась к проекту на стадии MVP за несколько месяцев до планируемого релиза. В
              команде я отвечала за пользовательский путь от регистрации до первого звонка, подключение
              номера, тарификацию и поддержку.
            </p>
          </div>
          <div
            ref={heroPhonesRef}
            className="case-horizontal-scroll relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto sm:flex sm:w-[800px] sm:items-center sm:justify-center sm:overflow-visible"
          >
            <div className="flex w-max items-center justify-center gap-space-6 sm:w-auto sm:gap-space-4">
              <Image
                alt="Экран регистрации MCN Softphone"
                src={assets.phone1}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 210px, 240px"
                className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-[240px]"
                priority
                quality={100}
              />
              <Image
                alt="Экран тарифа MCN Softphone"
                src={assets.phone2}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 294px, 280px"
                className="h-[600px] w-auto shrink-0 sm:h-auto sm:w-[280px]"
                priority
                quality={100}
              />
              <Image
                alt="Экран звонка MCN Softphone"
                src={assets.phone3}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 210px, 240px"
                className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-[240px]"
                priority
                quality={100}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h3-stack">
            <h3 className="text-h3">Проблема</h3>
            <div className="case-text-stack text-body-18">
              <p>
                До запуска приложения ключевой путь пользователя был разорван между мобильной и веб-
                версиями. Для регистрации и подключения номера приходилось переходить в личный кабинет,
                ждать ручной проверки и самостоятельно выяснять, когда можно совершить звонок.
              </p>
              <p>
                Пользователь не видел стоимость звонка заранее, не всегда понимал причину ошибки и не мог
                быстро найти помощь внутри приложения.
              </p>
            </div>
          </div>

          <div className="case-h3-stack">
            <h3 className="text-h3">Задача</h3>
            <div className="case-text-stack text-body-18">
              <p>
                Сделать путь до первого звонка понятным и предсказуемым, чтобы больше пользователей
                самостоятельно завершали подключение и начинали пользоваться приложением.
              </p>
              <p>
                <span className="text-body-18-semibold">Метрики:</span>{" "}
                конверсия из регистрации в первый звонок и количество обращений по вопросам подключения,
                баланса и списаний.
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
          <h2 className="text-h2">Дискавери</h2>

          <div className="case-content-stack">
            <p className="text-body-18">
              Для начала я изучила путь от регистрации до первого звонка: текущие экраны, обращения
              пользователей, решения конкурентов и обсудила технические ограничения с поддержкой и
              разработкой. Цель — определить, что мешает пользователям самостоятельно подключить
              номер и начать пользоваться приложением.
            </p>

            <div className="case-h3-stack">
              <h3 className="text-h3">Основные проблемы сценария</h3>
              <p className="text-body-18">
                Во время аудита текущего MVP я выявила 3 основных барьера на пути к первому звонку:
              </p>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">1.&nbsp;Сценарий активации разорван</p>
              <p>
                Регистрация и подключение номера проходят в веб-кабинете, но после отправки заявки
                пользователь не видит статус и следующий шаг в приложении.
              </p>
              <p className="italic">
                → Первый звонок откладывается, часть пользователей не завершает подключение.
              </p>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">2.&nbsp;Стоимость и списания непрозрачны</p>
              <p>До звонка нельзя узнать стоимость, а после завершения нет понятной детализации.</p>
              <p className="italic">
                → Пользователи не понимают причину списаний и обращаются в поддержку.
              </p>
            </div>

            <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col items-center justify-center pl-space-4 sm:w-[calc(100vw-32px)] sm:max-w-[1000px] sm:pl-0">
              <div className="case-figure-stack w-full items-center gap-[6px] sm:rounded-[12px] sm:bg-secondary sm:px-space-8 sm:pb-space-6 sm:pt-space-8">
                <div className="case-horizontal-scroll w-full overflow-x-auto sm:overflow-visible">
                  <div
                    className="relative w-[850px] max-w-none sm:mx-auto sm:w-full sm:max-w-[850px]"
                    style={{ aspectRatio: "2550 / 1206" }}
                  >
                    <Image
                      alt="Путь пользователя к первому звонку в MVP"
                      src={assets.caseDiscovery}
                      fill
                      sizes="(max-width: 640px) 850px, 850px"
                      className="object-contain"
                      loading="lazy"
                      quality={100}
                      unoptimized
                    />
                  </div>
                </div>
                <p className="text-center text-caption-14 text-secondary">
                  В MVP путь к первому звонку был разорван между несколькими разделами
                </p>
              </div>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">3.&nbsp;Помощь трудно получить</p>
              <p>
                Пользователи не находят ответы по настройке и доступности звонков внутри приложения
                и вынуждены обращаться за помощью в другие каналы связи.
              </p>
              <p className="italic">
                → Даже типовые вопросы требуют обращения в поддержку.
              </p>
            </div>

            <div className="-mx-space-4 bg-[#1c1c1c] px-space-4 py-space-8 sm:mx-0 sm:rounded-[12px]">
              <div className="mx-auto flex w-full max-w-[427px] flex-col gap-space-4">
                <Image
                  alt="Обращение пользователя о статусе аккаунта"
                  src={assets.discoveryFeedback1}
                  width={1044}
                  height={332}
                  sizes="(max-width: 640px) calc(100vw - 64px), 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <Image
                  alt="Обращение пользователя о списании средств"
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
              Анализ обращений в поддержку также показал, что пользователи{" "}
              <span className="text-body-18-semibold">
                не понимали текущее состояние аккаунта
              </span>{" "}
              — подключён ли номер, доступны ли звонки и почему изменился баланс. В путешествиях такая
              неопределённость особенно критична, поскольку связь и интернет часто нужны сразу.
            </p>

            <div id="hypotheses" className="case-h3-stack scroll-mt-space-16">
              <h3 className="text-h3">Анализ конкурентов</h3>
              <p className="text-body-18">
                Среди конкурентов я сравнила регистрацию, переход к набору номера и обратную связь
                после ключевых действий. Путь к звонку был собран внутри одного последовательного
                сценария, пользователь на каждом этапе видел состояние системы и следующий доступный
                шаг.
              </p>
            </div>

            <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col items-center justify-center pl-space-4 sm:w-[calc(100vw-32px)] sm:max-w-[1000px] sm:pl-0">
              <div className="case-figure-stack w-full items-center gap-[6px] sm:gap-space-4 sm:rounded-[12px] sm:bg-secondary sm:px-space-8 sm:pb-space-6 sm:pt-space-8">
                <div className="case-horizontal-scroll w-full overflow-x-auto sm:overflow-visible">
                  <div
                    className="relative w-[936px] max-w-none sm:mx-auto sm:w-full"
                    style={{ aspectRatio: "952 / 268" }}
                  >
                    <Image
                      alt="Последовательный путь до первого звонка в приложениях конкурентов"
                      src={assets.benchmark}
                      fill
                      sizes="(max-width: 640px) 936px, 936px"
                      className="object-cover"
                      loading="lazy"
                      quality={100}
                      unoptimized
                    />
                  </div>
                </div>
                <p className="text-center text-caption-14 text-secondary">
                  Последовательный путь до первого звонка в приложениях конкурентов
                </p>
              </div>
            </div>

            <div className="text-body-18">
              <p>Для работы я взяла из анализа 3 принципа:</p>
              <ul className="list-disc pl-space-6">
                <li>подтверждать завершение ключевого действия</li>
                <li>показывать статус подключения и момент, когда звонки становятся доступны</li>
                <li>
                  не только объяснять причину ошибки, но и предлагать варианты возвращения на сценарий
                </li>
              </ul>
            </div>

            <div className="case-media-stack w-full max-w-[800px]">
              <div className="case-h3-stack">
                <h3 className="text-h3">Гипотезы</h3>
                <p className="text-body-18">
                  На основе исследования выделила 3 гипотезы, которые могли повлиять на ключевые
                  продуктовые метрики. Они легли в основу дальнейшего проектирования.
                </p>
              </div>
              <div className="flex flex-col gap-space-4">
                <div className="case-point-stack text-body-18">
                  <p className="text-body-18-semibold">1.&nbsp;Управляемая активация</p>
                  <p>
                    Если перенести подключение номера в приложение и показывать статус и следующий
                    шаг, больше пользователей завершат настройку и совершат первый звонок.
                  </p>
                  <p><span className="text-body-18-semibold">Метрика:</span> CR из регистрации в 1-й звонок.</p>
                </div>
                <div className="case-point-stack text-body-18">
                  <p className="text-body-18-semibold">2.&nbsp;Прозрачная тарификация</p>
                  <p>
                    Если показать стоимость до звонка и объяснить списание после него, пользователям
                    будет проще контролировать расходы.
                  </p>
                  <p><span className="text-body-18-semibold">Метрика:</span> обращения по вопросам стоимости и списаний.</p>
                </div>
                <div className="case-point-stack text-body-18">
                  <p className="text-body-18-semibold">3.&nbsp;Помощь в контексте</p>
                  <p>
                    Если объяснять ошибку и сразу предлагать способ продолжить сценарий, меньше
                    пользователей прервут подключение или обратятся в поддержку.
                  </p>
                  <p><span className="text-body-18-semibold">Метрика:</span> CR в 1-й звонок, обращения в поддержку.</p>
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
          <h2 className="text-h2">Проектирование</h2>
          <div className="case-content-stack">
            <div className="case-text-stack">
              <p className="text-body-18">
                <span className="text-body-18-semibold">Цель этапа —</span> определить, как система будет вести себя в диалоге с пользователем, чтобы
                он не терялся в случае если что-то пойдёт не так. Основные решения касались логики
                сценариев, проработки состояний и корнер-кейсов.
              </p>
              <p className="text-body-18">
                Когда я проектировала новый путь, главным было убрать неопределённость. Пользователь не
                должен гадать: «А номер уже мой? А сколько это стоит? А что делать, если что-то пошло не
                так?». Вот что получилось:
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
                    Новый userflow 1-го звонка
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
              <li>путь до первого звонка сократился с 8 до 3 шагов</li>
              <li>
                стали показывать стоимость звонка ещё до вызова, а после ключевых шагов — success screen,
                чтобы убрать тревогу и неопределённость
              </li>
              <li>ошибки не оставляют в тупике, а предлагают решение и возвращают на сценарий</li>
              <li>
                поддержка всегда доступна, но не как основной, а как дополнительный шаг в решении
                проблемы
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
              <h2 className="text-h2">Решение</h2>
              <p className="text-body-18">
                Первые тесты показали: даже там, где логика казалась очевидной, пользователи
                ошибались. Поэтому я собрала обратную связь, переработала несколько сценариев и
                перепроверила их:
              </p>
            </div>

            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">1.&nbsp;Экран успеха после регистрации</p>
              <p>
                Сначала это был отдельный экран с галочкой и кнопкой «Продолжить», но на тестах я увидела,
                что люди зависали на 2-3 минуты — галочка привлекала внимание, а кнопка терялась.
              </p>
              <p>
                <span>→</span>{" "}
                <span className="italic">
                  Объединила экран успеха с оформлением заказа, чтобы после регистрации через Госуслуги
                  пользователь сразу видел свой номер и условия тарифа — без лишних шагов и пауз.
                </span>
              </p>
            </div>
          </div>

            <div className="case-numbered-point-media relative left-1/2 flex w-screen max-w-[850px] -translate-x-1/2 items-center justify-center pl-space-4 sm:w-[calc(100vw-32px)] sm:pl-0">
            <div className="case-horizontal-scroll w-full overflow-x-auto sm:overflow-visible">
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
            </div>
          </div>

          <div className="case-point-stack text-body-18">
            <p className="text-body-18-semibold">2.&nbsp;Узнать стоимость звонка</p>
            <p>
              В первой версии цену можно было увидеть, только начав набирать номер. Некоторым пользователям
              было неудобно вводить знакомый номер каждый раз, чтобы оценить стоимость.
            </p>
            <p>
              <span>→</span>{" "}
              <span className="italic">
                Добавила кнопку «Выбрать контакт» прямо на экран набора. При выборе контакта цена
                сразу отображается — как и при ручном вводе.
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
              Стоимость за минуту звонка видна сразу
            </p>
          </div>

          <div className="case-point-stack text-body-18">
            <p className="text-body-18-semibold">3.&nbsp;Помощь и подсказки</p>
            <p>
              Ранее был экран ошибки, где просто выводилась причина: «Регистрация не пройдена»,
              «Недостаточно средств» и другие, но пользователи всё равно не понимали, что делать
              дальше и писали в поддержку.
            </p>
            <p>
              <span>→</span>{" "}
              <span className="italic">
                Добавила контекстные кнопки для возвращения в сценарий — «Вернуться в Госуслуги»,
                «Пополнить баланс» и «Написать в поддержку», чтобы пользователь мог быстро перейти к
                нужному действию или написать в поддержку.
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
              </div>
              <p className="mt-[6px] w-full text-center text-caption-14 leading-[160%] text-secondary sm:mx-auto sm:mt-space-3 sm:max-w-[1000px]">
                Возвращаем на сценарий, но оставляем возможность написать в поддержку
              </p>
            </div>
          </div>

          <div className="case-text-stack text-body-18">
            <p>
              Каждая итерация закрывала конкретную точку неопределённости: пользователь видел, когда
              номер активен, сколько стоит звонок и что делать при ошибке. За счёт этого путь стал
              короче, а обращений в поддержку стало меньше.
            </p>
            <p>
              Дальнейшее развитие софтфона продолжилось через обратную связь от пользователей:
              добавление избранных контактов, повтор звонка из истории и push-уведомления о низком
              балансе. Всё это ушло в бэклог и дальше — в ближайшие обновления.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-space-16 case-h2-stack"
        >
          <h2 className="text-h2">Результаты</h2>
          <div className="case-content-stack">
            <p className="text-body-18">
              Ключевые изменения закрыли основные проблемы, выявленные на старте: путь до первого
              звонка стал короче, пользователи лучше понимали статус и стоимость действий, а часть
              вопросов больше не уходила в поддержку. При том же трафике количество звонков выросло
              с <span className="text-body-18-semibold">13k</span> до{" "}
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
                  шага до звонка
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3 lg:w-[184px]">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[18px] leading-[160%]">+</span>
                  <span className="text-[32px] leading-10">23</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  конверсия в 1-й звонок
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
                  retention на 4-й неделе
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
                  вопросов в поддержку
                </p>
              </div>
            </div>

            <p className="text-body-18">
              Для себя я вынесла, что в мобильных продуктах доверие строится через понятную
              коммуникацию в критические моменты: статус, стоимость, ошибки и следующий шаг.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Навигация между страницами"
          className="-mt-[88px] flex w-full items-start justify-between border-t border-border-elevated pt-space-2 text-body-18 sm:mt-0"
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

      <nav className="pointer-events-none fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-space-3 lg:flex">
        {[
          { id: "overview", label: "О проекте" },
          { id: "discovery", label: "Дискавери" },
          { id: "design", label: "Проектирование" },
          { id: "solution", label: "Решение" },
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
