"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/Icons/heart.svg",
  hero: "/figma/Case_2/Section_1/vpbx-canvas.png",
  arrowForward: "/figma/Icons/arrow_forward.svg",
  oldCanvas: "/figma/Case_2/Section_2/old-canvas.png",
  addFlow: "/figma/Case_2/Section_2/flow.png?v=20260714c",
  table: "/figma/Case_2/Section_2/table.png",
  leftSidebar: "/figma/Case_2/Section_4/left_sidebar.png",
  rightSidebar: "/figma/Case_2/Section_4/right_sidebar.png",
  canvasMotion: "/figma/Case_2/Section_4/canvas.mp4",
  minimap: "/figma/Case_2/Section_4/minimap.png",
  publishMotion: "/figma/Case_2/Section_4/publish_motion.mp4"
};

const zoomImages = {
  hero: {
    alt: "KOMPaaS canvas",
    src: assets.hero,
    mediaType: "image",
    width: 2400,
    height: 1500,
    hasPanel: false
  },
  oldCanvas: {
    alt: "Текущая версия редактора сценариев",
    src: assets.oldCanvas,
    mediaType: "image",
    width: 2100,
    height: 1188,
    hasPanel: false
  },
  addFlow: {
    alt: "Флоу работы с элементами",
    src: assets.addFlow,
    mediaType: "image",
    width: 2700,
    height: 1749,
    hasPanel: true
  },
  table: {
    alt: "Таблица анализа конкурентов",
    src: assets.table,
    mediaType: "image",
    width: 2400,
    height: 1371,
    hasPanel: false
  },
  leftSidebar: {
    alt: "Навигация по сценариям и быстрые действия",
    src: assets.leftSidebar,
    mediaType: "image",
    width: 2400,
    height: 1200,
    hasPanel: false
  },
  rightSidebar: {
    alt: "Библиотека элементов и настройки правой панели",
    src: assets.rightSidebar,
    mediaType: "image",
    width: 2400,
    height: 1800,
    hasPanel: false
  },
  canvasMotion: {
    alt: "Пользователь добавляет и настраивает блок, оставаясь в контексте",
    src: assets.canvasMotion,
    mediaType: "video",
    hasPanel: false
  },
  minimap: {
    alt: "Minimap и навигация по большой схеме",
    src: assets.minimap,
    mediaType: "image",
    width: 2400,
    height: 1539,
    hasPanel: false
  },
  publishMotion: {
    alt: "После публикации изменений статус обновляется, а кнопка становится неактивной",
    src: assets.publishMotion,
    mediaType: "video",
    hasPanel: false
  }
} as const;

function ZoomIcon({ floating = true }: { floating?: boolean }) {
  return (
    <span className={`${floating ? "pointer-events-none absolute bottom-space-3 right-space-3" : ""} flex h-10 w-10 items-center justify-center rounded-full bg-elevated-hover text-primary`}>
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

function ZoomImageShade({ rounded = true }: { rounded?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 bg-primary/0 transition-colors duration-200 group-hover:bg-primary/20 ${
        rounded ? "rounded-[8px]" : ""
      }`}
    />
  );
}

export function WorkCasePage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [openImage, setOpenImage] = useState<keyof typeof zoomImages | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const activeZoomImage = openImage ? zoomImages[openImage] : null;

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
    if (!activeZoomImage) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenImage(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeZoomImage]);

  useEffect(() => {
    setZoomScale(1);
  }, [openImage]);

  const handleZoomOpen = (
    image: keyof typeof zoomImages,
    desktopEnabled = true
  ) => {
    if (!desktopEnabled && window.matchMedia("(min-width: 640px)").matches) {
      return;
    }
    setOpenImage(image);
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
        className="flex w-full flex-col gap-[140px] px-space-4 pb-[40px] pt-[140px] sm:mx-auto sm:max-w-[800px] sm:px-0"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4 text-primary">
            <div className="flex flex-col gap-space-1">
              <h1 className="text-h1">KOMPaaS</h1>
              <p className="text-body-16 text-secondary">
                Продуктовый дизайнер · 2023 — 2024
              </p>
            </div>
            <p className="text-body-18">
              B2B-платформа для автоматизации контакт-центров. Используется в банках, клиниках,
              образовательных продуктах и ритейле — везде, где важна скорость обработки обращений и
              уровень клиентского сервиса.
            </p>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
            <button
              type="button"
              className="group relative block w-full cursor-zoom-in"
              onClick={() => setOpenImage("hero")}
              aria-label="Увеличить схему KOMPaaS canvas"
            >
              <Image
                alt="KOMPaaS canvas"
                src={assets.hero}
                width={800}
                height={500}
                sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                className="h-auto w-full rounded-[8px] object-contain"
                priority
                quality={100}
              />
              <span className="sm:hidden">
                <ZoomImageShade />
              </span>
              <span className="sm:hidden">
                <ZoomIcon />
              </span>
            </button>
          </div>
        </motion.section>

        <motion.section
          variants={item}
          className="-mt-space-14 scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h3-stack mt-space-4">
            <h3 className="text-h3">Моя роль</h3>
            <p className="text-body-18">
              Я работала над одним из продуктов платформы — конструктором сценариев звонков. Отвечала
              за исследование текущего процесса и проектирование редактора: навигации, создания и
              настройки элементов, работы со сложными схемами и публикации изменений.
            </p>
          </div>

          <div className="case-h3-stack mt-space-4">
            <h3 className="text-h3">Проблема</h3>
            <p className="text-body-18">
              Любые изменения в сценариях требовали участия разработки и занимали часы или дни. Из-за
              этого сценарии не успевали адаптироваться под изменения процессов, росли операционные
              затраты и риск ошибок в продакшене. Для клиентов с SLA это было особенно критично:
              задержки и ошибки могли напрямую влиять на качество обслуживания.
            </p>
          </div>

          <div className="case-h3-stack mt-space-4">
            <h3 className="text-h3">Задача</h3>
            <p className="text-body-18">
              Нужно было снизить зависимость клиентов от разработки и сделать понятный редактор, в
              котором менеджеры смогут самостоятельно находить, изменять и публиковать сценарии.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Дискавери</h2>
            <p className="text-body-18">
              Чтобы разобраться, как менеджеры работают со сценариями в текущей версии, я изучила
              реальные сценарии и обращения в поддержку, сравнила workflow-конструкторы и обсудила
              ограничения с поддержкой и разработкой. Цель — определить, что мешает менеджерам
              самостоятельно находить, изменять и публиковать сценарии.
            </p>
          </div>

          <div className="case-h3-stack mt-space-4">
            <h3 className="text-h3">Анализ текущей версии</h3>
            <p className="text-body-18">
              В текущем процессе выделила несколько проблемных зон, которые усложняли
              самостоятельную работу менеджеров со сценариями:
            </p>
          </div>

          <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
            <div className="mx-auto w-full max-w-[800px]">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in"
                onClick={() => setOpenImage("oldCanvas")}
                aria-label="Увеличить текущую версию редактора сценариев"
              >
                <Image
                  alt="Текущая версия редактора сценариев"
                  src={assets.oldCanvas}
                  width={800}
                  height={453}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full rounded-[8px] object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade />
                </span>
                <span className="absolute bottom-space-3 right-space-3 sm:hidden">
                  <ZoomIcon floating={false} />
                </span>
              </button>
            </div>
            <p className="w-full text-center text-caption-14 text-secondary">
              Текущий редактор: 1.&nbsp;сценарии&nbsp; 2.&nbsp;настройка&nbsp; 3.&nbsp;элементы&nbsp; 4.&nbsp;канвас
            </p>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">1.&nbsp;Сценариями неудобно управлять</p>
            <p className="text-body-18">
              Список сценариев в сайдбаре ограничен по высоте, отсутствовал поиск и группировка.
            </p>
            <p className="text-body-18-italic">
              → Приходилось долго искать нужный сценарий, при этом было непонятно, какие можно
              безопасно редактировать, а какие уже используются.
            </p>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">2.&nbsp;Настройка разделена между экранами</p>
            <p className="text-body-18">
              Создание элемента, его настройка и добавление на canvas происходили в разных местах.
            </p>
            <p className="text-body-18-italic">
              → Из-за этого терялся контекст и не всегда было понятно, как отдельный блок влияет на
              сценарий целиком.
            </p>
          </div>

          <div className="relative left-1/2 mb-space-10 mt-space-10 flex w-screen max-w-[1000px] -translate-x-1/2 flex-col items-center bg-secondary p-space-4 sm:w-[calc(100vw-32px)] sm:rounded-[12px] sm:p-space-6">
            <div className="mx-auto w-full max-w-[800px]">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in"
                onClick={() => setOpenImage("addFlow")}
                aria-label="Увеличить флоу работы с элементами"
              >
                <Image
                  alt="Флоу работы с элементами"
                  src={assets.addFlow}
                  width={2700}
                  height={1749}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <ZoomImageShade rounded={false} />
              </button>
            </div>
            <button
              type="button"
              className="group absolute bottom-space-6 right-space-6 cursor-zoom-in"
              onClick={() => setOpenImage("addFlow")}
              aria-label="Увеличить флоу работы с элементами"
            >
              <ZoomIcon floating={false} />
            </button>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">3.&nbsp;Сложности с библиотекой элементов</p>
            <p className="text-body-18">
              Элементы не были сгруппированы по сценариям использования, а названия не всегда
              отражали их поведение.
            </p>
            <p className="text-body-18-italic">
              → Пользователи выбирали элементы методом проб и ошибок, часто добавляя лишние, которые
              потом не использовались и перегружали схему.
            </p>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">4.&nbsp;Сценарии не масштабируются</p>
            <p className="text-body-18">
              По мере роста схемы связи пересекались, ветки накладывались друг на друга, а основной
              поток было сложно отличить от второстепенных.
            </p>
            <p className="text-body-18-italic">
              → Трудно быстро понять логику или внести изменения без риска сломать структуру.
            </p>
          </div>

          <p className="text-body-18">
            В итоге пользователи не воспринимали сценарий как единую систему и избегали
            самостоятельных изменений: без тестирования и явной публикации было непонятно, когда
            правки повлияют на реальные звонки.
          </p>

          <div className="case-h3-stack mt-space-4">
            <h3 className="text-h3">Анализ конкурентов</h3>
            <p className="text-body-18">
              Чтобы понять, как упростить работу с конструктором, я изучила прямых конкурентов и
              решения из смежных областей. Сравнивала подходы к визуализации сценариев,
              редактированию, работе со сложной логикой и публикацией сценариев.
            </p>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
            <button
              type="button"
              className="group relative block w-full cursor-zoom-in sm:cursor-default"
              onClick={() => handleZoomOpen("table", false)}
              aria-label="Увеличить таблицу анализа конкурентов"
            >
              <Image
                alt="Таблица анализа конкурентов"
                src={assets.table}
                width={800}
                height={457}
                sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
                quality={100}
              />
              <span className="sm:hidden">
                <ZoomImageShade rounded={false} />
              </span>
              <span className="sm:hidden">
                <ZoomIcon />
              </span>
            </button>
          </div>

          <p className="text-body-18">
            <span className="text-body-18-semibold">Вывод:</span> workflow-builder инструменты уходят от
            отдельных настроек к управлению процессом как единой системой, поскольку пользователю важно
            понимать состояние сценария и контролировать изменения до того, как они попадут в работу.
          </p>

          <div className="case-media-stack w-full max-w-[800px]">
            <div className="case-text-stack">
              <div className="case-h3-stack mt-space-4">
                <h3 className="text-h3">Гипотезы</h3>
                <p className="text-body-18">
                  На основе анализа я выделила направления, которые могли повлиять на ключевые метрики:
                </p>
              </div>
              <div className="flex flex-col gap-space-6 text-body-18">
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">1.&nbsp;Организация сценариев</p>
                <p>
                  Если сценарии станут более структурированными, пользователям будет проще находить
                  нужный сценарий и быстрее вносить изменения.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">2.&nbsp;Единый контекст</p>
                <p>
                  Если работа со сценарием будет происходить в одном контексте, снизится количество
                  ошибок и нагрузка на поддержку, так как изменения станут более предсказуемыми.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">3.&nbsp;Понятные сущности</p>
                <p>
                  Если элементы будут названы и сгруппированы по задачам пользователя, снизится
                  порог входа и сократится time-to-change.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">4.&nbsp;Читаемость</p>
                <p>
                  Если структура сценария останется понятной даже при росте, пользователям будет
                  проще воспринимать сценарий как единую систему и быстрее его редактировать.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">5.&nbsp;Безопасные изменения</p>
                <p>
                  Если пользователь будет понимать, что изменения можно проверить до публикации,
                  снизится зависимость от разработки и вырастет self-service rate.
                </p>
              </div>
              </div>
            </div>
            <p className="text-body-18">
              Гипотезы помогли определить основные направления работы, но в процессе проверки на
              реальных сценариях они могли уточняться и корректироваться.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="design"
          data-section-anchor="design"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Проектирование</h2>
            <p className="text-body-18">
              Проектирование строилось вокруг трёх ключевых принципов:
            </p>
          </div>

          <div className="flex flex-col gap-space-3 md:grid md:grid-cols-3">
            <div className="flex flex-col items-start gap-space-4 rounded-[20px] bg-card p-space-6 md:min-w-0">
              <div className="flex h-[38px] w-full items-center gap-space-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated-accent text-h4 text-primary">
                  1
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <p className="text-body-18-semibold text-primary">Understand</p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#828282]">Понять сценарий</p>
                </div>
              </div>
              <p className="w-full text-[14px] leading-[160%] text-primary">
                Быстро считать структуру сценария и понять, как он работает.
              </p>
              <div className="flex w-full flex-col gap-space-1 text-[14px] leading-[160%] text-primary">
                <p>• Группировка элементов</p>
                <p>• Понятные названия</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-space-4 rounded-[20px] bg-card p-space-6 md:min-w-0">
              <div className="flex h-[38px] w-full items-center gap-space-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated-accent text-h4 text-primary">
                  2
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <p className="text-body-18-semibold text-primary">Edit</p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#828282]">Внести изменения</p>
                </div>
              </div>
              <p className="w-full text-[14px] leading-[160%] text-primary">
                Внести изменения без лишних переходов и потери контекста.
              </p>
              <div className="flex w-full flex-col gap-space-1 text-[14px] leading-[160%] text-primary">
                <p>• Создание и настройка элементов на схеме</p>
                <p>• Inline-редактирование</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-space-4 rounded-[20px] bg-card p-space-6 md:min-w-0">
              <div className="flex h-[38px] w-full items-center gap-space-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated-accent text-h4 text-primary">
                  3
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <p className="text-body-18-semibold text-primary">Publish</p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#828282]">Опубликовать</p>
                </div>
              </div>
              <p className="w-full text-[14px] leading-[160%] text-primary">
                Понимать, какие изменения уже влияют на звонки.
              </p>
              <div className="flex w-full flex-col gap-space-1 text-[14px] leading-[160%] text-primary">
                <div>
                  <p>• Статусы для сценариев</p>
                  <p>(черновик / опубликовано)</p>
                </div>
                <p>• Публикация изменений</p>
              </div>
            </div>
          </div>

          <div className="case-content-stack">
            <p className="text-body-18">
              В итоговом решении нужно было учесть, что пользователям важно понимать, когда сценарий
              опубликован и какие изменения уже влияют на реальные звонки.
            </p>

            <div className="case-h3-stack mt-space-4">
              <h3 className="text-h3">Было</h3>
              <p className="text-body-18">
                Создаёт сценарий →{" "}
                <span className="line-through">Переходит в раздел «Настройки»</span> →{" "}
                <span className="line-through">Создаёт элемент</span> → Настраивает →{" "}
                <span className="line-through">Возвращается на сценарий</span> → Добавляет
                элемент на схему
              </p>
              <p className="text-body-18-italic">
                Действия разорваны между экранами, а изменения сразу влияют на рабочий сценарий.
              </p>
            </div>

            <div className="case-h3-stack mt-space-4">
              <h3 className="text-h3">Стало</h3>
              <div>
                <p className="text-body-18">
                  Создаёт сценарий → Добавляет и настраивает элементы на схеме → Публикует изменения
                </p>
              </div>
              <p className="text-body-18-italic">
                Работа происходит в едином контексте, а публикация становится отдельным и более
                осознанным действием.
              </p>
            </div>

            <p className="text-body-18">
              <span className="text-body-18-semibold">Пользователь больше не теряет контекст</span>
              {` — создание, настройка и публикация сценария происходят на одном экране. Это позволило системно закрыть как проблемы восприятия, так и страх ошибок, чтобы менеджер мог работать самостоятельно.`}
            </p>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Решение</h2>
            <p className="text-body-18">
              Работая над редактором я проверяла, насколько менеджеры понимают структуру сценария,
              могут вносить изменения самостоятельно и не боятся публиковать обновления. После каждой
              итерации я обсуждала спорные места с командой, чтобы решение оставалось понятным и
              реализуемым.
            </p>
          </div>

          <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
            <div className="mx-auto w-full max-w-[800px]">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in"
                onClick={() => setOpenImage("hero")}
                aria-label="Увеличить схему единого рабочего пространства"
              >
                <Image
                  alt="KOMPaaS solution overview"
                  src={assets.hero}
                  width={800}
                  height={500}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full rounded-[8px] object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
            <p className="text-center text-caption-14 text-secondary">
              Сценарии, canvas, элементы и публикация — в&nbsp;едином рабочем пространстве
            </p>
          </div>

          <div className="case-numbered-points">
          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">1.&nbsp;Организовать сценарии</p>
              <p>
                Я сохранила привычную модель списка и улучшила навигацию по сценариям: добавила
                группировку по проектам, поиск, статусы и быстрые действия.
              </p>
              <p className="italic">
                → Пользователь быстрее находит нужный сценарий и понимает его текущее состояние.
              </p>
            </div>

            <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("leftSidebar", false)}
                aria-label="Увеличить навигацию по сценариям и быстрые действия"
              >
                <Image
                  alt="Навигация по сценариям и быстрые действия"
                  src={assets.leftSidebar}
                  width={800}
                  height={400}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade rounded={false} />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
          </div>

          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">2.&nbsp;Сделать элементы понятнее</p>
              <p>
                Во время тестов пользователи часто выбирали элементы по названию и не всегда
                понимали разницу между ними. Чтобы это исправить, я провела карточную сортировку,
                сгруппировала элементы по сценариям использования и добавила описания, объясняющие
                поведение блока.
              </p>
              <p className="italic">
                → Пользователям стало проще выбрать нужный элемент и добавить его на схему.
              </p>
            </div>

            <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("rightSidebar", false)}
                aria-label="Увеличить библиотеку элементов и настройки правой панели"
              >
                <Image
                  alt="Библиотека элементов и настройки правой панели"
                  src={assets.rightSidebar}
                  width={800}
                  height={600}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade rounded={false} />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-space-6">
          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">3.&nbsp;Вернуть пользователю контекст</p>
              <p>
                Перенесла создание и настройку блоков прямо в canvas, чтобы пользователь мог
                добавлять элементы на схему, редактировать их и сразу увидеть как изменения влияют
                на сценарий.
              </p>
              <p>
                Для сложных настроек оставили модальные окна, это стало компромиссом между скоростью
                редактирования и более точной настройкой элементов, когда это действительно
                необходимо.
              </p>
              <p className="italic">
                → Сократилось количество переходов между экранами, а работа с элементами стала
                единым процессом.
              </p>
            </div>

            <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
              <div className="mx-auto w-full max-w-[800px]">
                <button
                  type="button"
                  className="group relative block w-full cursor-zoom-in sm:cursor-default"
                  onClick={() => handleZoomOpen("canvasMotion", false)}
                  aria-label="Увеличить анимацию добавления и настройки блока"
                >
                  <video
                    src={assets.canvasMotion}
                    className="h-auto w-full rounded-[8px] object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="Пользователь добавляет и настраивает блок, оставаясь в контексте"
                  />
                  <span className="sm:hidden">
                    <ZoomImageShade />
                  </span>
                  <span className="sm:hidden">
                    <ZoomIcon />
                  </span>
                </button>
              </div>
              <p className="text-center text-caption-14 text-secondary">
                Пользователь добавляет и настраивает блок, оставаясь в контексте.
              </p>
            </div>
          </div>

          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">4.&nbsp;Сделать большие сценарии читаемыми</p>
              <p>
                Чтобы большие флоу было проще читать, я упростила вторичные ветки, добавила
                подсветку связей между блоками, minimap и панель для навигации по схеме.
              </p>
              <p className="italic">
                → Пользователю стало проще ориентироваться в структуре сценария, отличать основной
                флоу от второстепенных веток и понимать, какие участки затронет изменение.
              </p>
            </div>

            <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("minimap", false)}
                aria-label="Увеличить minimap и навигацию по большой схеме"
              >
                <Image
                  alt="Minimap и навигация по большой схеме"
                  src={assets.minimap}
                  width={800}
                  height={513}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade rounded={false} />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
          </div>
          </div>

          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">5.&nbsp;Сделать публикацию предсказуемой</p>
              <p>
                Ранее менеджеры не всегда понимали, какие изменения уже влияют на реальные звонки, а
                какие ещё находятся в работе. Поэтому я добавила статусы сценария (draft / published)
                и вынесла публикацию как отдельное действие.
              </p>
              <p className="italic">
                → Пользователь видит, находится сценарий в черновике или уже опубликован, и понимает,
                когда изменения попадут в работу.
              </p>
            </div>

            <div className="flex flex-col gap-space-6">
            <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("publishMotion", false)}
                aria-label="Увеличить анимацию публикации сценария"
              >
                <video
                  src={assets.publishMotion}
                  className="aspect-[2278/1068] w-full rounded-[8px] object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="После публикации изменений статус обновляется, а кнопка становится неактивной"
                />
                <span className="sm:hidden">
                  <ZoomImageShade />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
              <p className="text-center text-caption-14 text-secondary">
                После публикации изменений статус обновляется, а кнопка становится неактивной.
              </p>
            </div>

            <p className="text-body-18">
              Полноценное тестирование и историю версий вынесли в следующий этап. После проверки
              редактирования и публикации с клиентскими кейсами я подготовила финальные макеты и
              спецификации для передачи в разработку.
            </p>
            </div>
          </div>
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
            <div className="flex flex-col gap-space-6 text-body-18">
              <div className="case-point-stack gap-space-6">
                <p className="text-body-18-semibold">2 → 1 workspace</p>
                <p>
                  Объединила поиск сценария, редактирование схемы, настройку элементов и публикацию.
                  Менеджеру больше не нужно переключаться между экранами при работе со сценарием.
                </p>
              </div>
              <div className="case-point-stack gap-space-6">
                <p className="text-body-18-semibold">Self-service</p>
                <p>
                  Часть типовых изменений перешла от разработчиков к менеджерам — от добавления
                  элементов на схему до публикации новой версии.
                </p>
              </div>
              <div className="case-point-stack gap-space-6">
                <p className="text-body-18-semibold">Меньше ошибок</p>
                <p>
                  Разделение черновика и опубликованной версии снизило риск случайных изменений в
                  работающих сценариях и на 21% уменьшило количество ошибок на продакшене.
                </p>
              </div>
            </div>

            <p className="text-body-18">
              В итоге работа со сценариями стала более самостоятельной: менеджеры смогли вносить
              изменения без участия разработки, а сам процесс, включая публикацию, стал более
              последовательным и контролируемым.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Навигация между страницами"
          className="-mt-[124px] flex w-full items-start justify-between border-t border-border-elevated pt-space-4 text-body-18"
        >
          <Link href="/" className="group shrink-0">
            <span className="link-underline">
              ← На главную
            </span>
          </Link>
          <Link href="/app" className="group shrink-0">
            <span className="link-underline">
              Кейс MCN Softphone →
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

      {activeZoomImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary px-space-4 py-space-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeZoomImage.alt}
          onClick={() => setOpenImage(null)}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute right-space-4 top-space-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
            onClick={(event) => {
              event.stopPropagation();
              setOpenImage(null);
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
          <div
            className={`relative flex max-h-full w-full max-w-[1100px] items-start justify-start overflow-auto rounded-[12px] sm:items-center sm:justify-center ${
              activeZoomImage.hasPanel ? "bg-secondary p-space-4 sm:p-space-6" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {activeZoomImage.mediaType === "video" ? (
              <video
                src={activeZoomImage.src}
                className="relative h-[var(--zoom-image-height)] w-auto max-w-none object-contain sm:h-auto sm:max-h-[calc(100vh-64px)] sm:w-full"
                style={{
                  "--zoom-image-height": `calc(${zoomScale * 100}vh - ${96 * zoomScale}px)`
                } as React.CSSProperties}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                alt={activeZoomImage.alt}
                src={activeZoomImage.src}
                width={activeZoomImage.width}
                height={activeZoomImage.height}
                sizes="100vw"
                className="relative h-[var(--zoom-image-height)] w-auto max-w-none object-contain sm:h-auto sm:max-h-[calc(100vh-64px)] sm:w-full"
                style={{
                  "--zoom-image-height": `calc(${zoomScale * 100}vh - ${96 * zoomScale}px)`
                } as React.CSSProperties}
                quality={100}
              />
            )}
          </div>
          <div className="absolute bottom-space-4 right-space-4 z-10 flex gap-space-2 sm:hidden">
            <button
              type="button"
              aria-label="Уменьшить"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
              onClick={(event) => {
                event.stopPropagation();
                setZoomScale((value) => Math.max(0.3, Math.round((value - 0.25) * 100) / 100));
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Увеличить"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
              onClick={(event) => {
                event.stopPropagation();
                setZoomScale((value) => Math.min(2, Math.round((value + 0.25) * 100) / 100));
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M12 6v12M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
