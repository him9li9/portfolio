"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const assets = {
  heart: "/figma/heart.svg",
  phone1: "/figma/Main/phone%201.png?v=20260621b",
  phone2: "/figma/Main/phone%202.png?v=20260621b",
  phone3: "/figma/Main/phone%203.png?v=20260621b",
  arrowForward: "/figma/Main/arrow_forward.svg",
  chartSmall: "/figma/case-chart-small.png?v=20260621b",
  chartBig: "/figma/case-chart-big.png?v=20260621b",
  discoveryActivation: "/figma/case-discovery-activation.png?v=20260712b",
  discoveryCost: "/figma/case-discovery-cost.png?v=20260621b",
  discoveryFeedback1: "/figma/case-discovery-feedback-1.png?v=20260621b",
  discoveryFeedback2: "/figma/case-discovery-feedback-2.png?v=20260621b",
  competitorWhatsapp: "/figma/case-competitor-whatsapp.png?v=20260712b",
  competitorOpenphone: "/figma/case-competitor-openphone.png?v=20260621b",
  userflow: "/figma/case-userflow.png?v=20260621b",
  solutionSuccess: "/figma/case-solution-success.png?v=20260712b",
  callFlowVideo: "/figma/call-flow-site.mp4",
  callFlowPoster: "/figma/call-flow-poster.png",
  solutionError: "/figma/case-solution-error.png?v=20260712b"
};

const workStages = [
  { label: "Дискавери", href: "#discovery" },
  { label: "Гипотезы", href: "#hypotheses" },
  { label: "Проектирование", href: "#design" },
  { label: "Тестирование", href: "#solution" },
  { label: "Передача в разработку", href: "#results" }
];

export function CaseStudyPage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [isUserflowOpen, setIsUserflowOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1.3);
  const [isDraggingUserflow, setIsDraggingUserflow] = useState(false);
  const [canDragUserflow, setCanDragUserflow] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [userflowOffset, setUserflowOffset] = useState({ x: 0, y: 0 });
  const userflowViewportRef = useRef<HTMLDivElement | null>(null);
  const bodyScrollYRef = useRef(0);
  const userflowDragRef = useRef({
    isDown: false,
    moved: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });
  const userflowBase = { width: 1000, height: 413 };

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

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      const isDown = currentY > lastY;
      const pastThreshold = currentY > 80;
      setHideTopbar(isDown && pastThreshold);
      lastY = currentY;
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
    if (!isUserflowOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserflowOpen(false);
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
  }, [isUserflowOpen]);

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
    if (isUserflowOpen) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const initialScale = isMobile ? 1.6 : 1.5;
      setLightboxScale(initialScale);
      setUserflowOffset({ x: 0, y: 0 });
      requestAnimationFrame(() => {
        if (!userflowViewportRef.current) {
          return;
        }
        const rect = userflowViewportRef.current.getBoundingClientRect();
        const scaledWidth = userflowBase.width * initialScale;
        const maxX = Math.max(0, (scaledWidth - rect.width) / 2);
        const initialX = isMobile ? -maxX : 0;
        setUserflowOffset(clampUserflowOffset(initialX, 0, initialScale));
      });
    }
  }, [isUserflowOpen]);

  useEffect(() => {
    if (!isUserflowOpen) {
      return;
    }
    const updateCanDrag = () => {
      if (!userflowViewportRef.current) {
        return;
      }
      const rect = userflowViewportRef.current.getBoundingClientRect();
      const scaledWidth = userflowBase.width * lightboxScale;
      const scaledHeight = userflowBase.height * lightboxScale;
      setCanDragUserflow(scaledWidth > rect.width || scaledHeight > rect.height);
    };
    updateCanDrag();
    window.addEventListener("resize", updateCanDrag);
    return () => window.removeEventListener("resize", updateCanDrag);
  }, [isUserflowOpen, lightboxScale]);

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

  const clampUserflowOffset = (x: number, y: number, scale: number) => {
    if (!userflowViewportRef.current) {
      return { x: 0, y: 0 };
    }
    const rect = userflowViewportRef.current.getBoundingClientRect();
    const edgePadding = rect.width < 640 ? 16 : 32;
    const scaledWidth = userflowBase.width * scale;
    const scaledHeight = userflowBase.height * scale;
    const maxX = Math.max(0, (scaledWidth - (rect.width - edgePadding * 2)) / 2);
    const maxY = Math.max(0, (scaledHeight - (rect.height - edgePadding * 2)) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  useEffect(() => {
    if (!isUserflowOpen) {
      return;
    }
    setUserflowOffset((prev) => clampUserflowOffset(prev.x, prev.y, lightboxScale));
  }, [isUserflowOpen, lightboxScale]);

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
    <main className="bg-primary text-primary">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="sticky top-0 z-10 h-[74px] w-full bg-primary/60 backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
      >
        <div className="flex h-full w-full items-center justify-between px-space-4 py-space-3 sm:px-space-8">
          <Link href="/" className="font-oldenburg flex items-center gap-space-1 text-body-18">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-space-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "var(--color-bg-elevated-hover)", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-elevated px-space-4 py-space-2 text-body-16 text-primary"
              href="https://drive.google.com/file/d/18tN5uIByWigg_ULyk6VbnGD9G_4Ftf31/view?usp=sharing"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "var(--color-bg-elevated-hover)", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-elevated px-space-4 py-space-2 text-body-16 text-primary"
              href="https://t.me/him9li9"
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
        className="flex w-full flex-col gap-y-[120px] px-space-4 pb-space-16 pt-space-16 sm:mx-auto sm:max-w-[800px] sm:px-0 sm:pt-space-16 sm:pb-space-16"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8 sm:gap-space-8"
        >
          <div className="flex flex-col gap-space-4 text-primary">
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
          </div>
          <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1100px] -translate-x-1/2 items-center justify-center gap-space-4 sm:gap-space-6">
              <Image
                alt="Экран регистрации MCN Softphone"
                src={assets.phone1}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 27vw, 236px"
                className="h-auto w-[27%] max-w-[236px] sm:w-[236px]"
                priority
              quality={100}
              />
              <Image
                alt="Экран тарифа MCN Softphone"
                src={assets.phone2}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 34vw, 280px"
                className="h-auto w-[34%] max-w-[280px] sm:w-[280px]"
                priority
              quality={100}
              />
              <Image
                alt="Экран звонка MCN Softphone"
                src={assets.phone3}
                width={900}
                height={1840}
                sizes="(max-width: 640px) 27vw, 236px"
                className="h-auto w-[27%] max-w-[236px] sm:w-[236px]"
                priority
              quality={100}
              />
          </div>
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col">
            <h2 className="text-h2">О проекте</h2>
            <p className="mt-space-4 text-body-18">
              Когда я присоединилась к проекту, приложение существовало в формате MVP, но проседала
              основная метрика — количество звонков. Вместе с командой мне предстояло разобраться,
              почему так происходит, и исправить это.
            </p>
          </div>

          <div className="flex flex-col items-center gap-space-6">
            <div className="flex w-full flex-col gap-space-4">
              <h3 className="text-h3">Проблема</h3>
              <p className="text-body-18">
                На обсуждении с командой выяснилась системная проблема — пользователь не понимал
                статус в процессе подключения, стоимость звонка и следующий шаг в критические
                моменты. Потеря коммуникации между системой и пользователем напрямую повлияла на
                метрики.
              </p>
            </div>
            <div className="flex w-full flex-col gap-space-4">
              <ul className="list-disc pl-space-6 text-body-18">
                <li>
                  <span className="text-body-18-semibold">Низкая конверсия в первый звонок</span>
                  {` — только 1/3 пользователей доходит до звонка, потому что большинство не понимает, когда номер уже активен.`}
                </li>
              </ul>
              <div className="flex flex-col items-center gap-[16px]">
                <div className="w-[323px] max-w-full">
                  <Image
                    alt=""
                    src={assets.chartSmall}
                    width={726}
                    height={144}
                    sizes="(max-width: 640px) calc(100vw - 64px), 323px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    quality={100}
                  />
                </div>
                <p className="text-center text-caption-14 text-secondary">
                  CR в 1-й звонок, 2023 г.
                </p>
              </div>
              <ul className="list-disc pl-space-6 text-body-18">
                <li>
                  <span className="text-body-18-semibold">Низкий Retention</span>
                  {` — люди скачивали приложение, пробовали разобраться, но из 2.1К новых пользователей возвращалась лишь половина. Retention падает до 15% к 4-й неделе.`}
                </li>
              </ul>
              <ul className="list-disc pl-space-6 text-body-18">
                <li>
                  <span className="text-body-18-semibold">Растущие затраты на поддержку</span>
                  {` — 40% обращений в поддержку касались статуса аккаунта и списаний — вопросов, которые можно было закрыть сразу в приложении.`}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <h3 className="text-h3">Задача</h3>
            <p className="text-body-18">
              Основная задача проекта состояла в том, чтобы внедрить в продукт систему коммуникации
              с чёткими шагами, подсказками и полной прозрачностью расходов. Это позволит вернуть
              пользователю ощущение контроля и уверенности, сократив отток и нагрузку на поддержку.
            </p>
            <p className="text-body-18">
              <span className="text-body-18-semibold">Метрики успеха</span>
              {` — рост количества звонков из приложения, снижение повторных обращений в поддержку.`}
            </p>
          </div>

          <div className="flex flex-col gap-space-3">
            <h3 className="text-h3">Этапы работы</h3>
            <div className="flex flex-wrap items-center gap-space-1">
              {workStages.map((stage, index) => (
                <div key={stage.label} className="flex items-center gap-space-1">
                  <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                    {stage.label}
                  </span>
                  {index < workStages.length - 1 ? (
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4 brightness-0 invert-[51%]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-4"
        >
          <h2 className="text-h2">Дискавери</h2>

          <div className="flex flex-col gap-[24px]">
            <div className="text-body-18">
              <p>В рамках discovery я опиралась на:</p>
              <ul className="list-disc space-y-space-2 pl-space-6">
                <li>анализ текущих пользовательских сценариев и логики экранов</li>
                <li>обращения пользователей в поддержку (частые вопросы и типовые ошибки)</li>
                <li>обзор аналогичных softphone- и коммуникационных решений</li>
                <li>обсуждения с командой поддержки и разработки</li>
              </ul>
            </div>

            <div className="flex flex-col gap-space-4">
              <h3 className="text-h3">Анализ текущей версии</h3>
              <p className="text-body-18">
                <span className="text-body-18-semibold">Цель этапа —</span> понять, где именно пользователи теряются, совершают ошибки или тратят
                лишнее время, и какие из этих проблем особенно критичны для MVP перед релизом. Поэтому
                я начала с анализа текущего пользовательского пути и точек неопределённости:
              </p>
            </div>

            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">1. Сценарий активации разорван между вебом и приложением</p>
              <ul className="list-disc space-y-space-2 pl-space-6">
                <li>регистрация вынесена в веб-кабинет и требует ручной верификации менеджером</li>
                <li>после отправки заявки нет объяснения со статусом и следующими действиями</li>
              </ul>
              <p>
                Пользователи откладывают покупку номера и первый звонок <span className="italic">→</span>{" "}
                <span className="italic">отток на этапе регистрации</span>
              </p>
            </div>

            <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 flex-col items-center justify-center">
              <div className="flex w-full flex-col items-center gap-[20px] rounded-[12px] bg-secondary px-[24px] pb-[24px] pt-[16px]">
                <Image
                  alt=""
                  src={assets.discoveryActivation}
                  width={2256}
                  height={2541}
                  sizes="(max-width: 640px) calc(100vw - 80px), 752px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                quality={100}
                />
                <p className="text-center text-caption-14 text-secondary">
                  Анализ основных сценариев в MVP приложения
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">2. Стоимость и списания не прозрачны в момент звонка</p>
              <ul className="list-disc space-y-space-2 pl-space-6">
                <li>информацию о стоимости звонков в роуминге нужно было искать на сайте</li>
                <li>после завершения звонка списания выглядят неожиданными</li>
              </ul>
              <p>
                Пользователи не понимают, сколько и за что они платят <span className="italic">→</span>{" "}
                <span className="italic">рост обращений в поддержку</span>
              </p>
            </div>

            <div className="-mx-space-4 overflow-hidden rounded-[12px] bg-secondary py-space-8 sm:mx-0">
              <div className="mx-auto w-full max-w-[427px] px-space-4 sm:px-0">
                <Image
                  alt=""
                  src={assets.discoveryCost}
                  width={1070}
                  height={1002}
                  sizes="(max-width: 640px) calc(100vw - 64px), 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                quality={100}
                />
              </div>
            </div>

            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">3. Некачественная обратная связь</p>
              <ul className="list-disc space-y-space-2 pl-space-6">
                <li>в приложении нет понятной точки входа в поддержку</li>
                <li>пользователи ищут ответы в разных каналах и повторяют вопросы</li>
              </ul>
              <p>
                Пользователи не знают, где искать помощь <span className="italic">→</span>{" "}
                <span className="italic">повторные обращения в разных каналах</span>
              </p>
            </div>

            <div className="-mx-space-4 overflow-hidden rounded-[12px] bg-secondary py-space-8 sm:mx-0">
              <div className="mx-auto flex w-full max-w-[427px] flex-col gap-space-4 px-space-4 sm:px-0">
                <Image
                  alt=""
                  src={assets.discoveryFeedback1}
                  width={1044}
                  height={332}
                  sizes="(max-width: 640px) calc(100vw - 64px), 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                quality={100}
                />
                <Image
                  alt=""
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
              Анализ обращений в поддержку показал, что основная причина проблем пользователей —
              <span className="text-body-18-semibold">непонимание текущего состояния аккаунта и баланса</span>. Это особенно критично в путешествиях,
              где важна немедленная доступность связи и интернета.
            </p>

            <div id="hypotheses" className="flex scroll-mt-space-16 flex-col gap-space-4">
              <h3 className="text-h3">Анализ конкурентов</h3>
              <p className="text-body-18">
                В ходе discovery я также изучила аналогичные продукты, в которых есть звонки.
                Например, после опыта работы с мессенджерами у пользователей формируется ожидание
                мгновенной готовности к коммуникации (и звонкам в том числе) сразу после регистрации.
              </p>
            </div>

            <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1100px] -translate-x-1/2 flex-col items-center justify-center gap-[12px]">
              <div className="w-full max-w-[800px]">
                <Image
                  alt=""
                  src={assets.competitorWhatsapp}
                  width={800}
                  height={399}
                  sizes="(max-width: 640px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                quality={100}
                />
              </div>
              <p className="text-center text-caption-14 text-secondary">
                WhatsApp  (регистрация · выбор контакта · звонок)
              </p>
            </div>

            <p className="text-body-18">
              В softphone-приложениях, где есть обязательные шаги (выбор номера, верификация,
              тарификация), путь к первому звонку объективно сложнее. Поэтому в таком сценарии
              пользователю необходима понятная и непрерывная обратная связь о его прогрессе и статусе.
            </p>

            <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1100px] -translate-x-1/2 flex-col items-center justify-center gap-[16px]">
              <div className="w-full max-w-[1000px]">
                <Image
                  alt=""
                  src={assets.competitorOpenphone}
                  width={3901}
                  height={1552}
                  sizes="(max-width: 640px) calc(100vw - 32px), 1000px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                quality={100}
                />
              </div>
              <p className="text-center text-caption-14 text-secondary">
                Open Phone  (выбор номера · регистрация · покупка номера · звонок)
              </p>
            </div>

            <div className="flex w-full max-w-[800px] flex-col gap-space-6">
              <div className="flex flex-col gap-space-4">
                <h3 className="text-h3">Гипотезы</h3>
                <p className="text-body-18">
                  На основе анализа я сформулировала гипотезы, связанные с ключевыми метриками продукта.
                </p>
              </div>
              <div className="flex flex-col gap-space-3 sm:flex-row sm:flex-wrap">
                <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[390px]">
                  <p className="text-body-18-semibold">1. Ясность на старте</p>
                  <p className="text-body-16 text-secondary-elevated">
                    Если пользователь понимает, на каком этапе онбординга находится и когда сможет
                    начать звонить, ему проще дойти до первого звонка.
                  </p>
                  <p className="text-body-16">
                    <span className="text-caption-14-semibold">Метрика: </span>CR в первый звонок
                  </p>
                </div>
                <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[390px]">
                  <p className="text-body-18-semibold">2. Прозрачность стоимости</p>
                  <p className="text-body-16 text-secondary-elevated">
                    Если пользователь видит стоимость звонка и состояние баланса до начала вызова,
                    условия тарификации станут более прозрачными.
                  </p>
                  <p className="text-body-16">
                    <span className="text-caption-14-semibold">Метрика: </span>retention, обращения в поддержку
                  </p>
                </div>
                <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[390px]">
                  <p className="text-body-18-semibold">3. Доступность ответов</p>
                  <p className="text-body-16 text-secondary-elevated">
                    Если ответы на частые вопросы доступны внутри приложения, он реже будет
                    прерывать сценарий и обращаться в поддержку.
                  </p>
                  <p className="text-body-16">
                    <span className="text-caption-14-semibold">Метрика: </span>обращения в поддержку
                  </p>
                </div>
                <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[390px]">
                  <p className="text-body-18-semibold">4. Очевидность следующего шага</p>
                  <p className="text-body-16 text-secondary-elevated">
                    Если после ошибки или незавершённого действия пользователь понимает, что делать
                    дальше, ему проще вернуться к действию.
                  </p>
                  <p className="text-body-16">
                    <span className="text-caption-14-semibold">Метрика: </span>retention, обращения в поддержку
                  </p>
                </div>
              </div>
              <p className="text-body-18">
                Гипотезы помогли определить основные направления работы, но в процессе проверки на
                реальных сценариях они могли уточняться и корректироваться.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="design"
          data-section-anchor="design"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-4"
        >
          <h2 className="text-h2">Проектирование</h2>
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-space-4">
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

            <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1100px] -translate-x-1/2 flex-col items-center justify-center gap-[12px]">
              <div className="w-full max-w-[1000px]">
                <button
                  type="button"
                  aria-label="Open userflow"
                  onClick={() => setIsUserflowOpen(true)}
                  className="w-full cursor-zoom-in"
                >
                  <Image
                    alt=""
                    src={assets.userflow}
                    width={4096}
                    height={1690}
                    sizes="(max-width: 640px) calc(100vw - 64px), 1000px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  quality={100}
                  />
                </button>
              </div>
              <p className="text-center text-caption-14 text-secondary">
                Новый userflow 1-го звонка (регистрация · покупка номера · звонок)
              </p>
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
          className="scroll-mt-space-16 flex flex-col gap-space-6"
        >
          <div className="flex flex-col">
            <h2 className="text-h2">Решение</h2>
            <p className="mt-space-4 text-body-18">
              Первые тесты показали: даже там, где логика казалась очевидной, пользователи
              ошибались. Поэтому я собрала обратную связь, переработала несколько сценариев и
              перепроверила их:
            </p>
          </div>

          <div className="mt-space-2 flex flex-col gap-space-2 text-body-18">
            <p className="text-body-18-semibold">1. Экран успеха после регистрации</p>
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

          <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1000px] -translate-x-1/2 items-center justify-center">
            <div className="flex w-full items-center justify-center rounded-[12px] bg-secondary px-[32px] pb-[24px] pt-[32px]">
              <div className="w-full max-w-[845px]">
                <Image
                  alt=""
                  src={assets.solutionSuccess}
                  width={2535}
                  height={1620}
                  sizes="(max-width: 640px) calc(100vw - 96px), 845px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-2 text-body-18">
            <p className="text-body-18-semibold">2. Узнать стоимость звонка</p>
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

          <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1100px] -translate-x-1/2 items-center justify-center">
            <div
              className="flex w-full items-center justify-center px-space-4 sm:px-0"
              style={{ height: 600 }}
            >
              <div
                className="relative h-full max-w-full"
                style={{ width: "min(299px, calc(100vw - 64px))" }}
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
          </div>

          <div className="flex flex-col gap-space-2 text-body-18">
            <p className="text-body-18-semibold">3. Помощь и подсказки</p>
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

          <div className="relative left-1/2 flex w-[calc(100vw-32px)] max-w-[1100px] -translate-x-1/2 items-center justify-center">
            <div className="flex w-full items-center justify-center rounded-[12px] bg-secondary px-[40px] pb-[24px] pt-[32px]">
              <div className="w-full max-w-[1020px]">
                <Image
                  alt=""
                  src={assets.solutionError}
                  width={3060}
                  height={1644}
                  sizes="(max-width: 640px) calc(100vw - 112px), 1020px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-8 text-body-18">
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
          className="scroll-mt-space-16 flex flex-col gap-space-4"
        >
          <h2 className="text-h2">Результаты</h2>
          <div className="flex flex-col gap-space-5">
            <p className="text-body-18">
              Ключевые изменения закрыли основные проблемы, выявленные на старте: путь до первого
              звонка стал короче, пользователи лучше понимали статус и стоимость действий, а часть
              вопросов больше не уходила в поддержку. При том же трафике количество звонков выросло
              с <span className="text-body-18-semibold">13k</span> до{" "}
              <span className="text-body-18-semibold">17k.</span>
            </p>

            <div className="grid grid-cols-1 gap-space-3 min-[440px]:grid-cols-2 lg:grid-cols-[repeat(4,184px)]">
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <div className="flex h-10 items-start gap-0 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-center text-[32px] font-semibold leading-10">8</span>
                  <span className="inline-flex h-10 items-center">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-10 items-center text-[32px] font-semibold leading-10">3</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  шага до звонка
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[18px] leading-[160%]">+</span>
                  <span className="text-[32px] leading-10">23</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  конверсия в 1-й звонок
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <div className="flex items-center gap-0 whitespace-nowrap text-primary">
                  <span className="text-[32px] font-semibold leading-10">15</span>
                  <span className="inline-flex">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="text-[32px] font-semibold leading-10">22</span>
                  <span className="text-[18px] font-semibold leading-[160%]">%</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  retention на 4-й неделе
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <div className="flex items-center gap-0 whitespace-nowrap text-primary">
                  <span className="text-[32px] font-semibold leading-10">40</span>
                  <span className="inline-flex">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="text-[32px] font-semibold leading-10">18</span>
                  <span className="text-[18px] font-semibold leading-[160%]">%</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
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
          className="flex w-full items-start justify-between border-t border-border-elevated pt-space-4 text-body-18"
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
          { id: "overview", label: "Введение" },
          { id: "about", label: "О проекте" },
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
            <span className="pointer-events-none max-w-[160px] rounded-full bg-elevated-hover px-space-3 py-space-1 text-caption-14 text-secondary-elevated opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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

      {isUserflowOpen ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center px-space-6"
          onClick={() => setIsUserflowOpen(false)}
          role="presentation"
          onTouchMove={(event) => event.preventDefault()}
        >
          <div className="lightbox-backdrop absolute inset-0" />
          <div className="relative h-[88vh] w-[96vw] overflow-hidden rounded-[12px] bg-secondary p-0 sm:w-[90vw] sm:p-0">
            <div className="absolute right-3 top-3 z-10 flex gap-space-2 sm:right-6 sm:top-6">
              <button
                type="button"
                aria-label="Close"
                className="relative flex h-12 w-12 items-center justify-center sm:h-6 sm:w-6 sm:cursor-default"
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsUserflowOpen(false);
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-elevated text-secondary-elevated">
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
                    width: `${userflowBase.width}px`,
                    height: `${userflowBase.height}px`,
                    transform: `translate(-50%, -50%) translate(${userflowOffset.x}px, ${userflowOffset.y}px) scale(${lightboxScale})`,
                    transformOrigin: "center",
                  }}
                >
                  <Image
                    alt=""
                    src={assets.userflow}
                    width={userflowBase.width}
                    height={userflowBase.height}
                    sizes="(max-width: 640px) 96vw, 80vw"
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
                className="relative flex h-12 w-12 items-center justify-center sm:h-6 sm:w-6"
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxScale((value) => Math.max(1, Math.round((value - 0.5) * 10) / 10));
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-elevated text-secondary-elevated">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
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
                  setLightboxScale((value) => Math.min(3, Math.round((value + 0.5) * 10) / 10));
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-elevated text-secondary-elevated">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M6 3v6M3 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
