"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const assets = {
  heart: "/figma/heart.svg",
  hero: "/figma/phones.png",
  chartSmall: "/figma/case-chart-small.png",
  chartBig: "/figma/case-chart-big.png",
  discoveryActivation: "/figma/case-discovery-activation.png",
  discoveryCost: "/figma/case-discovery-cost.png",
  discoveryFeedback1: "/figma/case-discovery-feedback-1.png",
  discoveryFeedback2: "/figma/case-discovery-feedback-2.png",
  competitorWhatsapp: "/figma/case-competitor-whatsapp.png",
  competitorOpenphone: "/figma/case-competitor-openphone.png",
  userflow: "/figma/case-userflow.png",
  solutionSuccess: "/figma/case-solution-success.png",
  solutionCost: "/figma/case-solution-cost.png",
  solutionError: "/figma/case-solution-error.png"
};

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
  const userflowBase = { width: 750, height: 309 };
  const userflowDisplay = { width: 750, height: 309 };
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
      const scrollPos =
        (document.documentElement.scrollTop || document.body.scrollTop || window.scrollY) + 140;
      let current = sections[0]?.dataset.sectionAnchor || "overview";
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) {
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
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const next = (entry.target as HTMLElement).dataset.sectionAnchor;
              if (next) {
                setActiveSection(next);
              }
            }
          });
        },
        { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach((section) => observer?.observe(section));
    }
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      window.removeEventListener("scroll", updateFromScroll);
      observer?.disconnect();
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
    <main className="bg-[#171717] text-white">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="sticky top-0 z-10 h-[74px] w-full bg-[rgba(23,23,23,0.6)] backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
      >
        <div className="flex h-full w-full items-center justify-between px-4 py-[13px] sm:px-8">
          <Link href="/" className="font-oldenburg flex items-center gap-1 text-[18px] leading-[160%] tracking-[0.32px]">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[18px] leading-[160%] tracking-[0.32px]"
              href="https://drive.google.com/file/d/18tN5uIByWigg_ULyk6VbnGD9G_4Ftf31/view?usp=sharing"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[18px] leading-[160%] tracking-[0.32px]"
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
        className="flex w-full flex-col gap-y-[50px] px-4 pb-[120px] pt-[66px] sm:mx-auto sm:max-w-[800px] sm:px-0 sm:pt-[66px] sm:pb-[140px] md:gap-y-[100px]"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-6 sm:gap-6"
        >
          <div className="flex flex-col gap-3 text-white">
            <h1 className="text-[40px] font-semibold leading-[48px]">MCN Softphone</h1>
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              — мобильное приложение для звонков через интернет и управление личным кабинетом. Аудитория —
              путешественники, которым нужна дешёвая и надёжная связь за границей.
            </p>
          </div>
            <div className="-mx-4 bg-[#222] py-6 sm:mx-0">
            <div className="mx-auto w-full max-w-[417px] px-4 sm:px-0">
              <Image
                alt=""
                src={assets.hero}
                width={417}
                height={400}
                sizes="(max-width: 640px) 100vw, 417px"
                className="h-auto w-full object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-[32px] font-semibold leading-[40px]">О проекте</h2>
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Когда я пришла в команду, продукт уже находился на стадии MVP около 9 месяцев.
              Пользователи скачивали приложение, но звонков было мало и результаты для бизнеса были
              ниже ожидаемых. Нужно было разобраться, что конкретно не работает и исправить это.
            </p>
            <div className="h-px w-full bg-[#282828]" />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[24px] font-semibold leading-[32px]">Проблема</h3>
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Первичный анализ выявил системную проблему — пользователь остается в неведении на
              критических этапах: после регистрации, во время звонка, при технических сбоях. Это
              напрямую повлияло на ключевые метрики:
            </p>
            <ul className="list-disc space-y-4 pl-6 text-[18px] leading-[160%] tracking-[0.32px]">
              <li>
                <span className="font-semibold">Низкая конверсия в первый звонок</span>
                {` — только 1/3 пользователей доходит до звонка, потому что большинство не понимает, когда номер уже активен.`}
              </li>
            </ul>
            <div className="mx-auto w-full max-w-[323px]">
              <Image
                alt=""
                src={assets.chartSmall}
                width={323}
                height={64}
                sizes="(max-width: 640px) 100vw, 323px"
                className="h-auto w-full object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
            <ul className="list-disc space-y-4 pl-6 text-[18px] leading-[160%] tracking-[0.32px]">
              <li>
                <span className="font-semibold">Низкий Retention</span>
                {` — люди скачивали приложение, пробовали разобраться, но из 2.1К новых пользователей возвращалась лишь половина. По данным аналитики Retention падает до 15% к четвёртой неделе.`}
              </li>
            </ul>
            <div className="mx-auto w-full max-w-[527px]">
              <Image
                alt=""
                src={assets.chartBig}
                width={527}
                height={300}
                sizes="(max-width: 640px) 100vw, 527px"
                className="h-auto w-full object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
            <ul className="list-disc space-y-4 pl-6 text-[18px] leading-[160%] tracking-[0.32px]">
              <li>
                <span className="font-semibold">Растущие затраты на поддержку</span>
                {` — 40% NST (обращений) — вопросы про статус аккаунта и списания, которые можно было бы закрыть сразу в приложении`}
              </li>
            </ul>
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Главная причина снижения метрик — потеря коммуникации между системой и пользователем.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[24px] font-semibold leading-[32px]">Задача</h3>
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Основная задача проекта состояла в том, чтобы внедрить в продукт систему коммуникации
              из четких шагов, подсказок и с полной прозрачностью расходов. Это позволит вернуть
              пользователю ощущение контроля и уверенности, сократив отток и нагрузку на поддержку.
            </p>
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              <span className="font-semibold">Метрики успеха</span>
              {` — рост количества звонков из приложения, снижение повторных обращений в поддержку.`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[24px] font-semibold leading-[32px]">Что я сделала</h3>
            <ol className="list-decimal space-y-2 pl-6 text-[18px] leading-[160%] tracking-[0.32px]">
              <li>Проанализировала MVP и обратную связь от пользователей.</li>
              <li>Определила проблемы и сформулировала гипотезы (вместе с командой).</li>
              <li>Спроектировала и упростила ключевые сценарии.</li>
              <li>Проверила решения на быстрых прототипах с пользователями.</li>
              <li>Подготовила дизайн и компоненты для передачи в разработку + материалы для релиза.</li>
            </ol>
          </div>
        </motion.section>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-3"
        >
          <h2 className="text-[32px] font-semibold leading-[40px]">Дискавери</h2>

          <div className="flex flex-col gap-8">
            <div className="text-[18px] leading-[160%] tracking-[0.32px]">
              <p>В рамках discovery я опиралась на:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Анализ текущих пользовательских сценариев и логики экранов.</li>
                <li>Обращения пользователей в поддержку (частые вопросы и типовые ошибки).</li>
                <li>Обзор аналогичных softphone- и коммуникационных решений.</li>
                <li>Обсуждения с командой поддержки и разработки.</li>
              </ul>
            </div>

            <div className="h-px w-full bg-[#282828]" />

            <div className="flex flex-col gap-3">
              <h3 className="text-[24px] font-semibold leading-[32px]">Анализ текущей версии</h3>
              <p className="text-[18px] leading-[160%] tracking-[0.32px]">
                Цель этапа — понять, где именно пользователи теряются, совершают ошибки или тратят
                лишнее время, и какие из этих проблем особенно критичны для MVP перед релизом. Поэтому
                я начала с анализа текущего пользовательского пути и точек неопределённости:
              </p>
            </div>

            <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
              <p className="font-semibold">1. Сценарий активации разорван между вебом и приложением</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Регистрация вынесена в веб-кабинет и требует ручной верификации менеджером.</li>
                <li>После отправки заявки нет объяснения со статусом и следующими действиями.</li>
              </ul>
              <p>
                Пользователи откладывают покупку номера и первый звонок →{" "}
                <span className="text-[#ff6060]">отток на этапе регистрации</span>.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[760px]">
              <Image
                alt=""
                src={assets.discoveryActivation}
                width={800}
                height={757}
                sizes="(max-width: 640px) 100vw, 760px"
                className="h-auto w-full object-contain"
                loading="lazy"
                unoptimized
              />
            </div>

            <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
              <p className="font-semibold">2. Стоимость и списания не прозрачны в момент звонка</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Информацию о стоимости звонков в роуминге нужно было искать на сайте.</li>
                <li>После завершения звонка списания выглядят неожиданными.</li>
              </ul>
              <p>
                Пользователи не понимают, сколько и за что они платят →{" "}
                <span className="text-[#ff6060]">рост обращений в поддержку</span>.
              </p>
            </div>

            <div className="-mx-4 bg-[#222] py-6 sm:mx-0">
              <div className="mx-auto w-full max-w-[427px] px-4 sm:px-0">
                <Image
                  alt=""
                  src={assets.discoveryCost}
                  width={427}
                  height={400}
                  sizes="(max-width: 640px) 100vw, 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
              <p className="font-semibold">3. Некачественная обратная связь</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>В приложении нет понятной точки входа в поддержку.</li>
                <li>Пользователи ищут ответы в разных каналах и повторяют вопросы.</li>
              </ul>
              <p>
                Пользователи не знают, где искать помощь →{" "}
                <span className="text-[#ff6060]">повторные обращения в разных каналах</span>.
              </p>
            </div>

            <div className="-mx-4 bg-[#222] py-6 sm:mx-0">
              <div className="mx-auto flex w-full max-w-[427px] flex-col gap-4 px-4 sm:px-0">
                <Image
                  alt=""
                  src={assets.discoveryFeedback1}
                  width={427}
                  height={136}
                  sizes="(max-width: 640px) 100vw, 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  unoptimized
                />
                <Image
                  alt=""
                  src={assets.discoveryFeedback2}
                  width={427}
                  height={103}
                  sizes="(max-width: 640px) 100vw, 427px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>

            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Анализ обращений в поддержку показал, что основная причина проблем пользователей —
              непонимание текущего состояния аккаунта и баланса. Это особенно критично в путешествиях,
              где важна немедленная доступность связи и интернета.
            </p>

            <div className="flex flex-col gap-3">
              <h3 className="text-[24px] font-semibold leading-[32px]">Анализ конкурентов</h3>
              <p className="text-[18px] leading-[160%] tracking-[0.32px]">
                В ходе discovery я также изучила аналогичные продукты, в которых есть звонки.
                Например, после опыта работы с мессенджерами у пользователей формируется ожидание
                мгновенной готовности к коммуникации (и звонкам в том числе) сразу после регистрации.
              </p>
            </div>

            <div className="-mx-4 bg-[#222] py-6 sm:mx-0">
              <div className="mx-auto w-full max-w-[600px] px-4 sm:px-0">
                <Image
                  alt=""
                  src={assets.competitorWhatsapp}
                  width={600}
                  height={300}
                  sizes="(max-width: 640px) 100vw, 600px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <p className="mt-4 px-4 text-center text-[14px] leading-[1.4] text-[#afafaf] sm:px-0">
                WhatsApp (регистрация – выбор контакта – звонок)
              </p>
            </div>

            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              В softphone-приложениях, где есть обязательные шаги (выбор номера, верификация,
              тарификация), путь к первому звонку объективно сложнее. Поэтому в таком сценарии
              пользователю необходима понятная и непрерывная обратная связь о его прогрессе и статусе.
            </p>

            <div className="-mx-4 bg-[#222] py-6 sm:mx-0">
              <div className="mx-auto w-full max-w-[754px] px-4 sm:px-0">
                <Image
                  alt=""
                  src={assets.competitorOpenphone}
                  width={754}
                  height={300}
                  sizes="(max-width: 640px) 100vw, 754px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <p className="mt-4 px-4 text-center text-[14px] leading-[1.4] text-[#afafaf] sm:px-0">
                Open Phone (выбор номера – регистрация – покупка – звонок)
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[24px] font-semibold leading-[32px]">Гипотезы</h3>
              <p className="text-[18px] leading-[160%] tracking-[0.32px]">На основе анализа и инсайтов я составила список основных гипотез:</p>
              <div className="flex flex-col gap-4 text-[18px] leading-[160%] tracking-[0.32px]">
                <div>
                  <p className="font-semibold">1. Онбординг</p>
                  <p>
                    Если мы перенесём процесс активации в приложение, показывая прогресс и статус на
                    каждом этапе, то отток уменьшится, а конверсия в первый звонок вырастет, потому
                    что пользователь поймёт, когда можно начать звонить.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">2. Тарификация</p>
                  <p>
                    Если показывать стоимость звонка до его начала и баланс на экране набора, то
                    количество обращений в поддержку по списаниям уменьшится, потому что пользователь
                    будет видеть цену заранее.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">3. Поддержка</p>
                  <p>
                    Если добавить в меню раздел «Поддержка» с FAQ и чатом, то повторные обращения в
                    разные каналы снизятся, потому что пользователь найдёт ответ за 2 шага.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">4. Подсказки</p>
                  <p>
                    Если добавить интерактивные подсказки, то обращения в техподдержку снизятся, так
                    как следующее действие будет всегда очевидно.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="design"
          data-section-anchor="design"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-3"
        >
          <h2 className="text-[32px] font-semibold leading-[40px]">Проектирование</h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <p className="text-[18px] leading-[160%] tracking-[0.32px]">
                Цель этапа — определить, как система будет вести себя в диалоге с пользователем, чтобы
                он не терялся в случае если что-то пойдёт не так. Основные решения касались логики
                сценариев, проработки состояний и корнер-кейсов.
              </p>
              <p className="text-[18px] leading-[160%] tracking-[0.32px]">
                Когда я проектировала новый путь, главным было убрать неопределённость. Пользователь не
                должен гадать: «А номер уже мой? А сколько это стоит? А что делать, если что-то пошло не
                так?». Вот что получилось:
              </p>
            </div>

            <div className="-mx-4 bg-[#222] py-6 sm:mx-0">
              <div className="mx-auto w-full max-w-[750px] px-4 sm:px-6">
                <button
                  type="button"
                  aria-label="Open userflow"
                  onClick={() => setIsUserflowOpen(true)}
                  className="w-full cursor-zoom-in"
                >
                  <Image
                    alt=""
                    src={assets.userflow}
                    width={userflowDisplay.width}
                    height={userflowDisplay.height}
                    sizes="(max-width: 640px) 100vw, 750px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    unoptimized
                  />
                </button>
              </div>
              <p className="mt-4 px-4 text-center text-[14px] leading-[1.4] text-[#9e9e9e] sm:px-0">
                UserFlow сценария звонка (чтобы увеличить нажмите на картинку).
              </p>
            </div>

            <ul className="list-disc space-y-2 pl-6 text-[18px] leading-[160%] tracking-[0.32px]">
              <li>От первого запуска приложения до звонка — 4–5 шагов (вместо 8-10).</li>
              <li>
                Стали показывать стоимость звонка ещё до вызова, а после ключевых шагов success screen
                (на схеме — ✅), чтобы убрать тревогу и неопределенность.
              </li>
              <li>Ошибки не оставляют в тупике, а предлагают решение и возвращают на сценарий.</li>
              <li>
                Поддержка всегда доступна, но не как основной, а как дополнительный шаг в решении
                проблемы.
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-6"
        >
          <div className="flex flex-col">
            <h2 className="text-[32px] font-semibold leading-[40px]">Решение</h2>
            <p className="mt-3 text-[18px] leading-[160%] tracking-[0.32px]">
              Первый раунд тестирования показал: даже там, где логика казалась очевидной, пользователи
              ошибались. Я собрала обратную связь, переработала несколько сценариев и проверила их:
            </p>
          </div>

          <div className="-mt-3 flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
            <p className="font-semibold">1. Экран успеха после регистрации</p>
            <p>
              Сначала это был отдельный экран с галочкой и кнопкой «Продолжить», но на тестах я увидела,
              что люди зависали на 2-3 минуты — галочка привлекала внимание, а кнопка терялась.
            </p>
            <p>
              <span className="text-[#89FF45]">→</span> Объединила экран успеха с оформлением заказа, чтобы после регистрации через Госуслуги
              пользователь сразу видел свой номер и условия тарифа — без лишних шагов и пауз.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[800px]">
              <Image
                alt=""
                src={assets.solutionSuccess}
                width={2400}
                height={1440}
                sizes="(max-width: 640px) 100vw, 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
                unoptimized
            />
          </div>

          <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
            <p className="font-semibold">2. Узнать стоимость звонка</p>
            <p>
              В первой версии цену можно было увидеть, только начав набирать номер. Некоторым пользователям
              было неудобно вводить знакомый номер каждый раз, чтобы оценить стоимость.
            </p>
            <p>
              <span className="text-[#89FF45]">→</span> Добавила кнопку «Выбрать контакт» прямо на экран набора. При выборе контакта цена
              сразу отображается — как и при ручном вводе.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[800px]">
              <Image
                alt=""
                src={assets.solutionCost}
                width={2400}
                height={1290}
                sizes="(max-width: 640px) 100vw, 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
                unoptimized
            />
          </div>

          <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
            <p className="font-semibold">3. Помощь и подсказки</p>
            <p>
              Ранее был экран ошибки, где просто выводилась причина: «Регистрация не пройдена»,
              «Недостаточно средств» и другие, но пользователи всё равно не понимали, что делать
              дальше и писали в поддержку.
            </p>
            <p>
              <span className="text-[#89FF45]">→</span> Добавила контекстные кнопки для возвращения на сценарий — «Вернуться в Госуслуги»,
              «Пополнить баланс» и «Написать в поддержку», чтобы пользователь мог что-то уточнить или
              задать вопрос о проблеме.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[800px]">
              <Image
                alt=""
                src={assets.solutionError}
                width={2400}
                height={1380}
                sizes="(max-width: 640px) 100vw, 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
                unoptimized
            />
          </div>

          <p className="text-[18px] leading-[160%] tracking-[0.32px]">
            Каждая итерация убирала конкретную точку трения, и хотя визуально интерфейс почти не
            менялся, пользовательский путь стал прозрачнее.
          </p>
        </motion.section>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-3"
        >
          <h2 className="text-[32px] font-semibold leading-[40px]">Результаты</h2>
          <div className="flex flex-col gap-6">
            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Теперь пользователь видит, когда номер активен, сколько стоит звонок и что делать, если
              что-то пошло не так. Коммуникация перестала быть просто функциональной и начала напрямую
              влиять на поведение — сокращать путь и снижать количество ошибок.
            </p>

            <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
              <p>Изменения в интерфейсе закономерно отразились на ключевых метриках продукта:</p>
              <ul className="list-disc space-y-0 pl-[27px]">
                <li>
                  <span className="text-[#89ff45]">Путь до звонка сократился</span>
                  {" "}с 8 шагов и переходами в веб до 3 шагов в приложении.
                </li>
                <li>
                  <span className="text-[#89ff45]">Конверсия в первый звонок выросла</span>
                  {" "}на 23%, а общее количество звонков при том же трафике увеличилось (13k → 17k).
                </li>
                <li>
                  <span className="text-[#89ff45]">Удержание пользователей увеличилось</span>
                  {" "}для 2 недели — на 11 %, а 4-й — на 6 %.
                </li>
                <li>
                  <span className="text-[#89ff45]">Обращения в поддержку сократились</span>
                  {" "}почти в 2 раза (40% → 18%).
                </li>
              </ul>
            </div>

            <p className="text-[18px] leading-[160%] tracking-[0.32px]">
              Дальнейшее развитие софтфона продолжилось через обратную связь от пользователей:
              добавление избранных контактов, повтор звонка из истории и push-уведомления о низком
              балансе. Всё это ушло в бэклог и дальше — в ближайшие обновления.
            </p>

            <div className="h-px w-full bg-[#282828]" />

            <div className="flex flex-col gap-2 text-[18px] leading-[160%] tracking-[0.32px]">
              <p>Этот проект стал для меня важной точкой роста. Вот что я вынесла:</p>
              <div className="space-y-0">
                <p>1. Прозрачность интерфейса — основа доверия и коммуникации с пользователем.</p>
                <p>2. Большие результаты часто приходят через маленькие изменения.</p>
                <p>3. Тесты — лучший инструмент для аргументации своих решений перед бизнесом.</p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>

      <nav className="pointer-events-none fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
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
            className="group pointer-events-auto flex items-center justify-end gap-3 text-right"
            onClick={(event) => handleSectionNavClick(event, item.id)}
          >
            <span className="pointer-events-none max-w-[160px] rounded-full bg-[#2a2a2a] px-3 py-1 text-[14px] leading-[1.4] text-[#cfcfcf] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {item.label}
            </span>
            <span
              className={`h-[6px] w-[22px] rounded-full transition-colors duration-200 ${
                activeSection === item.id ? "bg-white" : "bg-[#3a3a3a]"
              }`}
            />
          </a>
        ))}
      </nav>

      {isUserflowOpen ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center px-6"
          onClick={() => setIsUserflowOpen(false)}
          role="presentation"
          onTouchMove={(event) => event.preventDefault()}
        >
          <div className="lightbox-backdrop absolute inset-0" />
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
                  setIsUserflowOpen(false);
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
                    sizes="80vw"
                    className="pointer-events-none h-full w-full select-none object-contain"
                    draggable={false}
                    priority
                    unoptimized
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
                  setLightboxScale((value) => Math.max(1, Math.round((value - 0.5) * 10) / 10));
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
                  setLightboxScale((value) => Math.min(3, Math.round((value + 0.5) * 10) / 10));
                }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2b2b2b] text-[#a0a0a0]">
                  +
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
