"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/heart.svg",
  hero: "/figma/Case_2/vpbx-canvas.png",
  oldCanvas: "/figma/Case_2/old-canvas.png",
  addFlow: "/figma/Case_2/add-flow.png?v=2",
  table: "/figma/Case_2/table.png?v=2",
  oldSidebar: "/figma/Case_2/old-sidebar.png",
  newSidebar: "/figma/Case_2/new-sidebar.png",
  library: "/figma/Case_2/library.png",
  element: "/figma/Case_2/element.png",
  dialog: "/figma/Case_2/dialog.png",
  map: "/figma/Case_2/map.png",
  publish: "/figma/Case_2/public.png"
};

export function WorkCasePage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

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
          <Link href="/" className="font-oldenburg flex items-center gap-1 text-[18px] leading-[160%]">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[18px] leading-[160%]"
              href="https://drive.google.com/file/d/18tN5uIByWigg_ULyk6VbnGD9G_4Ftf31/view?usp=sharing"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[18px] leading-[160%]"
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
        className="flex w-full flex-col gap-[50px] px-4 pb-[80px] pt-[66px] sm:mx-auto sm:max-w-[800px] sm:gap-[100px] sm:px-0 sm:pb-[100px]"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3 text-white">
            <h1 className="text-[40px] font-semibold leading-[48px]">KOMPaaS</h1>
            <p className="text-[18px] leading-[160%]">
              — B2B-платформа для автоматизации контакт-центров. Используется в банках,
              клиниках, образовательных продуктах и ритейле — везде, где важна скорость обработки
              обращений и уровень клиентского сервиса.
            </p>
          </div>

          <Image
            alt="KOMPaaS canvas"
            src={assets.hero}
            width={800}
            height={500}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full rounded-[8px] object-contain"
            priority
          />
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] font-semibold leading-[40px]">О проекте</h2>
            <p className="text-[18px] leading-[160%]">
              Один из продуктов платформы — конструктор сценариев звонков для настройки голосового
              меню, опросов и оценки качества. Клиенты называли его «чёрным ящиком» из-за
              неочевидной логики взаимодействий с блоками и переходами. В рамках проекта я
              спроектировала новый подход к управлению сценариями, более понятный и безопасный для
              бизнес-пользователей.
            </p>
          </div>

          <div className="h-px w-full bg-[#282828]" />

          <div className="flex flex-col gap-2">
            <h3 className="text-[24px] font-semibold leading-[32px]">Проблема</h3>
            <p className="text-[18px] leading-[160%]">
              Любые изменения в сценариях звонков требовали участия разработки, занимали часы и
              дни, увеличивая риск ошибок в продакшене. Это напрямую влияло на бизнес:
            </p>
            <ul className="list-disc space-y-0 pl-6 text-[18px] leading-[160%]">
              <li>
                <span className="font-semibold">Рост time-to-change</span>
                {` — сценарии устаревали быстрее, чем успевали внедряться.`}
              </li>
              <li>
                <span className="font-semibold">Увеличение операционных затрат</span>
                {` — каждая доработка требовала ресурсов разработки.`}
              </li>
              <li>
                <span className="font-semibold">Риск потери лояльности</span>
                {` — крупные клиенты не могли оперативно реагировать на изменения своих процессов.`}
              </li>
            </ul>
            <p className="text-[18px] leading-[160%]">
              Появились риски нарушения SLA — договоров об уровне обслуживания, где критичны
              скорость ответа и доступность.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[24px] font-semibold leading-[32px]">Задача</h3>
            <p className="text-[18px] leading-[160%]">
              Нужно было устранить зависимость клиентов от разработки и превратить сценарии
              звонков из технической задачи в понятный бизнес-инструмент.
            </p>
            <p className="text-[18px] leading-[160%]">
              <span className="font-semibold">Метрики успеха</span>
              {` — рост доли self-service сценариев, снижение нагрузки на разработку и поддержку, сокращение time-to-change при минимальном количестве ошибок.`}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Что я сделала</h3>
            <ol className="list-decimal space-y-0 pl-6 text-[18px] leading-[160%]">
              <li>Изучила, как клиенты и команда поддержки работают с текущими сценариями.</li>
              <li>Выявила ключевые проблемы, где требовалось вмешательство разработчиков.</li>
              <li>Спроектировала более понятную и управляемую структуру сценариев.</li>
              <li>Проверила варианты решений на реальных кейсах клиентов.</li>
              <li>Подготовила финальный дизайн и спецификации для передачи в разработку.</li>
            </ol>
          </div>
        </motion.section>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] font-semibold leading-[40px]">Дискавери</h2>
            <div className="text-[18px] leading-[160%]">
              <p>В рамках discovery я изучила, как пользователи работают со сценариями в текущей версии продукта:</p>
              <ul className="list-disc space-y-0 pl-6">
                <li>проанализировала реальные сценарии и логику экранов</li>
                <li>разобрала обращения в поддержку (ошибки и частые вопросы)</li>
                <li>сравнила подходы в workflow-конструкторах</li>
                <li>обсудила проблемы с поддержкой и разработкой</li>
              </ul>
            </div>
          </div>

          <div className="h-px w-full bg-[#282828]" />

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Анализ текущей версии</h3>
            <p className="text-[18px] leading-[160%]">
              Прежде чем предлагать изменения, я проанализировала, как пользователи работают со
              сценариями. Вместе с командой поддержки я собрала обратную связь и выделила ключевые
              проблемные зоны:
            </p>
          </div>

          <div className="h-[490px] bg-[#222222] px-6 pt-10 pb-8">
            <div className="mx-auto flex h-full max-w-[700px] flex-col justify-between">
              <Image
                alt="Текущая версия редактора сценариев"
                src={assets.oldCanvas}
                width={700}
                height={396}
                sizes="(max-width: 800px) calc(100vw - 80px), 700px"
                className="h-auto w-full rounded-[8px] object-contain"
                loading="lazy"
              />
              <p className="text-center text-[14px] leading-[160%] text-[#828282]">
                1 - сценарии, 2 - настройки, 3 - элементы, 4 - канвас с блоками и переходами
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[18px] font-semibold leading-[160%]">1. Управлять сценариями неудобно</p>
            <p className="text-[18px] leading-[160%]">
              Список сценариев в сайдбаре ограничен по высоте, отсутствуют поиск и группировка.
            </p>
            <p className="text-[18px] italic leading-[160%]">
              → Пользователям приходилось долго искать нужный сценарий, при этом было непонятно,
              какие можно безопасно редактировать, а какие уже используются.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[18px] font-semibold leading-[160%]">2-3. Разрыв между схемой и настройками</p>
            <ul className="list-disc space-y-0 pl-6 text-[18px] leading-[160%]">
              <li>создание, настройка и добавление элемента на схему были разделены между экранами.</li>
              <li>элементы в списке не были сгруппированы, а их названия не всегда отражали поведение.</li>
            </ul>
            <p className="text-[18px] italic leading-[160%]">
              → Пользователи не могли выбрать, какой именно блок им нужен, и часто добавляли лишние
              блоки, которые потом не использовались и перегружали схему.
            </p>
          </div>

          <Image
            alt="Флоу добавления элемента"
            src={assets.addFlow}
            width={800}
            height={505}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full object-contain"
            loading="lazy"
          />

          <div className="flex flex-col gap-2">
            <p className="text-[18px] font-semibold leading-[160%]">4. Сценарии становились трудно читаемыми</p>
            <ul className="list-disc space-y-0 pl-6 text-[18px] leading-[160%]">
              <li>линии пересекались и накладывались друг на друга</li>
              <li>основной флоу сложно было отличить от второстепенных веток</li>
            </ul>
            <p className="text-[18px] italic leading-[160%]">
              → Пользователь не воспринимал сценарий как единую систему и не понимал, как
              локальные изменения влияют на общую логику.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[18px] font-semibold leading-[160%]">5. Ошибки в продакшене</p>
            <p className="text-[18px] leading-[160%]">
              Во время интервью менеджеры часто говорили, что боятся вносить изменения в
              сценарии, потому что не понимают, как они повлияют на рабочий флоу. Изменения
              нельзя было безопасно проверить до публикации, а ошибки обнаруживались уже в
              продакшене.
            </p>
            <p className="text-[18px] italic leading-[160%]">
              → Из-за этого пользователи предпочитали не редактировать сценарии без участия
              разработчиков.
            </p>
          </div>

          <p className="text-[18px] leading-[160%]">
            По мере роста сценариев редактор становился сложным для восприятия и управления.
            Пользователям было трудно ориентироваться в структуре и управлять изменениями, из-за
            этого возрастало количество ошибок и зависимость от поддержки и разработки.
          </p>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Анализ конкурентов</h3>
            <p className="text-[18px] leading-[160%]">
              Чтобы понять, в какую сторону развивать конструктор, я изучила прямых конкурентов
              (Quo и Twilio) и решения из смежных областей (Intercom и n8n). Сравнивала подходы к
              визуализации сценариев, редактированию, работе с логикой и тестированию. Результат в
              виде таблицы:
            </p>
          </div>

          <Image
            alt="Таблица анализа конкурентов"
            src={assets.table}
            width={800}
            height={457}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full object-contain"
            loading="lazy"
          />

          <p className="text-[18px] leading-[160%]">
            Во время исследования я заметила, что workflow-builder инструменты уходят от отдельных
            настроек к управлению процессом как единой системой, поскольку пользователю важно
            видеть связи между блоками и понимать, как работает сценарий целиком.
          </p>

          <div className="h-px w-full bg-[#282828]" />

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Гипотезы</h3>
            <p className="text-[18px] leading-[160%]">
              На основе анализа я сформулировала гипотезы, связанные с ключевыми метриками
              продукта.
            </p>
            <div className="flex flex-col gap-4 text-[18px] leading-[160%]">
              <div className="flex flex-col gap-2">
                <p className="font-semibold">1. Организация сценариев</p>
                <p>
                  Если сценарии станут более структурированными, сократится время на поиск и
                  редактирование, потому что пользователям будет проще ориентироваться в них.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">2. Единый контекст</p>
                <p>
                  Если пользователь будет работать со сценарием в рамках одного контекста,
                  сократится количество ошибок и нагрузка на поддержку, потому что изменения
                  станут более предсказуемыми.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">3. Понятные сущности</p>
                <p>
                  Если пользователь быстро разберется, зачем нужны элементы, снизится порог входа и
                  сократится time-to-change, потому что сможет оценивать их влияние на сценарий в
                  целом.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">4. Читаемость</p>
                <p>
                  Если пользователь сможет считывать структуру сценария даже при его росте,
                  сократится время на редактирование, потому что сценарий будет восприниматься как
                  единая система.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">5. Безопасные изменения</p>
                <p>
                  Если пользователь будет понимать, что любые изменения можно проконтролировать,
                  уменьшится зависимость от разработки и вырастет self-service rate, потому что
                  исчезнет страх что-то сломать.
                </p>
              </div>
            </div>
            <p className="text-[18px] leading-[160%]">
              Гипотезы помогли определить основные направления работы, но в процессе проверки на
              реальных сценариях они могли уточняться и корректироваться.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="design"
          data-section-anchor="design"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] font-semibold leading-[40px]">Проектирование</h2>
            <p className="text-[18px] leading-[160%]">
              Проектирование строилось вокруг трёх ключевых принципов:
            </p>
          </div>

          <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-2">
            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-4 rounded-[20px] bg-[#262626] py-6 pl-6 pr-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff8566] text-[18px] font-semibold leading-[160%] text-white">
                  1
                </div>
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <p className="text-[16px] font-semibold leading-[19px] text-white">Understand</p>
                  <p className="text-[14px] leading-[17px] text-[#828282]">Понять сценарий</p>
                </div>
              </div>
              <p className="text-[14px] leading-[160%] text-white">
                Пользователь должен быстро считать структуру сценария и понять, как он работает.
              </p>
              <div className="flex h-[118px] flex-col gap-1 text-[14px] leading-[160%] text-white">
                <p>• Визуальная иерархия</p>
                <p>• Группировка и понятные названия блоков</p>
                <p>• Создание или выбор готовых элементов на схеме</p>
              </div>
            </div>

            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-4 rounded-[20px] bg-[#262626] py-6 pl-6 pr-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff8566] text-[18px] font-semibold leading-[160%] text-white">
                  2
                </div>
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <p className="text-[16px] font-semibold leading-[19px] text-white">Edit</p>
                  <p className="text-[14px] leading-[17px] text-[#828282]">Внести изменения</p>
                </div>
              </div>
              <p className="text-[14px] leading-[160%] text-white">
                Изменения должны вноситься прямо в потоке — без лишних переходов и потери
                контекста.
              </p>
              <div className="flex h-[118px] flex-col gap-1 text-[14px] leading-[160%] text-white">
                <p>• Inline-редактирование блоков</p>
                <p>• Единый контекст между схемой и настройками</p>
                <p>• Массовые операции с блоками и переходами</p>
              </div>
            </div>

            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-4 rounded-[20px] bg-[#262626] py-6 pl-6 pr-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff8566] text-[18px] font-semibold leading-[160%] text-white">
                  3
                </div>
                <div className="flex min-w-0 flex-col gap-[2px]">
                  <p className="text-[16px] font-semibold leading-[19px] text-white">Validate</p>
                  <p className="text-[14px] leading-[17px] text-[#828282]">Проверить</p>
                </div>
              </div>
              <p className="text-[14px] leading-[160%] text-white">
                Пользователь должен убедиться, что изменения работают без ошибок.
              </p>
              <div className="flex h-[118px] flex-col gap-1 text-[14px] leading-[160%] text-white">
                <p>• Статусы для сценариев (черновик / опубликовано)</p>
                <p>• Тестирование до публикации</p>
                <p>• История версий с возможностью отката</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[18px] leading-[160%]">
              <span className="font-semibold">Пользователь больше не теряет контекст</span>
              {` — создание, настройка и тестирование сценария происходят на одном экране. Это позволило закрыть проблемы восприятия и страх ошибок, чтобы менеджер мог работать самостоятельно.`}
            </p>

            <div className="flex flex-col gap-1">
              <h3 className="text-[24px] font-semibold leading-[32px]">Было</h3>
              <p className="text-[18px] leading-[160%]">
                Создаёт сценарий →{" "}
                <span className="line-through">Переходит в раздел «Настройки»</span> →{" "}
                <span className="line-through">Создаёт элемент</span> → Настраивает →{" "}
                <span className="line-through">Возвращается на сценарий</span> → Добавляет
                элемент на схему
              </p>
              <p className="text-[18px] italic leading-[160%]">
                Действия разорваны между экранами, а изменения сразу влияют на рабочий сценарий.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[24px] font-semibold leading-[32px]">Стало</h3>
              <p className="text-[18px] leading-[160%]">
                Создаёт сценарий → Добавляет элемент на схему → Настраивает → Тестирует
              </p>
              <p className="text-[18px] italic leading-[160%]">
                Работа происходит в одном контексте, а публикация становится отдельным и более
                осознанным действием.
              </p>
            </div>

            <p className="text-[18px] leading-[160%]">
              В итоговом решении нужно было учесть, что пользователям важно понимать, когда
              сценарий опубликован и какие изменения уже влияют на реальные звонки.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] font-semibold leading-[40px]">Решение</h2>
            <p className="text-[18px] leading-[160%]">
              Работу над редактором я вела итеративно: тестировала сценарии на менеджерах и
              клиентских кейсах, а результаты обсуждала с разработкой. Так мы постепенно уточняли
              решения и адаптировали их под реальное использование.
            </p>
          </div>

          <Image
            alt="KOMPaaS solution overview"
            src={assets.hero}
            width={800}
            height={500}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full object-contain"
            loading="lazy"
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-[18px] leading-[160%]">
              <p className="font-semibold">1. Организовать сценарии</p>
              <p>
                Я не стала усложнять систему, потому что пользователи уже к ней привыкли, только
                добавила группировку по сценариям, поиск и объединила действия со сценарием в
                контекстном меню.
              </p>
              <p className="italic">
                → Это упростило навигацию и сделало работу со сценариями более предсказуемой.
              </p>
            </div>

            <div className="bg-[#222222] px-6 py-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <Image
                    alt="Старый сайдбар"
                    src={assets.oldSidebar}
                    width={330}
                    height={236}
                    sizes="(max-width: 640px) calc(100vw - 80px), 330px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  />
                  <p className="text-center text-[14px] leading-[160%] text-[#afafaf]">Было</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Image
                    alt="Новый сайдбар"
                    src={assets.newSidebar}
                    width={330}
                    height={236}
                    sizes="(max-width: 640px) calc(100vw - 80px), 330px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  />
                  <p className="text-center text-[14px] leading-[160%] text-[#afafaf]">Стало</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-[18px] leading-[160%]">
              <p className="font-semibold">2. Сделать элементы понятнее</p>
              <p>
                Во время тестов пользователи часто выбирали элементы по названию и не всегда
                понимали разницу между ними. Чтобы разделить их по сценариям использования, я
                провела карточную сортировку и по её результатам сгруппировала и добавила более
                понятные описания.
              </p>
              <p className="italic">
                → Пользователи стали быстрее находить нужные элементы, сократилось количество
                действий «методом проб и ошибок» при сборке сценариев и обращений в поддержку.
              </p>
            </div>

            <Image
              alt="Библиотека элементов"
              src={assets.library}
              width={800}
              height={521}
              sizes="(max-width: 800px) calc(100vw - 32px), 800px"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-[18px] leading-[160%]">
              <p className="font-semibold">3. Вернуть пользователю контекст</p>
              <p>
                Перенесла создание и настройку блоков прямо в canvas, чтобы пользователь мог
                добавлять элементы на схему, редактировать их и сразу видеть изменения.
              </p>
              <p className="italic">
                → Сократилось количество переходов между экранами, а базовые действия стали проще.
              </p>
            </div>

            <div className="bg-[#222222] px-6 py-7">
              <Image
                alt="Флоу добавления элемента на схему и inline редактирования"
                src={assets.element}
                width={595}
                height={347}
                sizes="(max-width: 800px) calc(100vw - 80px), 595px"
                className="mx-auto h-auto w-full max-w-[595px] object-contain"
                loading="lazy"
              />
              <p className="mt-2 text-center text-[14px] leading-[160%] text-[#afafaf]">
                Флоу добавления элемента на схему и inline редактирования
              </p>
            </div>

            <p className="text-[18px] leading-[160%]">
              Для сложных настроек я оставила модальные окна, чтобы canvas не перегружался
              деталями, а пользователи могли быстро редактировать частые блоки прямо на схеме. Это
              стало компромиссом между скоростью редактирования и необходимостью более точной
              настройки.
            </p>

            <Image
              alt="Диалог настройки элемента"
              src={assets.dialog}
              width={800}
              height={500}
              sizes="(max-width: 800px) calc(100vw - 32px), 800px"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-[18px] leading-[160%]">
              <p className="font-semibold">4. Сделать большие сценарии читаемыми</p>
              <p>Чтобы улучшить читаемость больших флоу, я переработала визуальную иерархию сценария:</p>
              <ul className="list-disc space-y-0 pl-6">
                <li>упростила ветки, не входящие в основной флоу</li>
                <li>выделила связи между блоками при нажатии на элемент</li>
                <li>добавила smart zoom (крупные иконки) при увеличении масштаба и minimap для навигации</li>
              </ul>
              <p className="italic">
                → Стало проще ориентироваться в структуре сценария и понимать влияние изменений на
                общую логику. Даже когда схема разрастается до 20+ блоков, менеджер может быстро
                переключаться между участками сценария.
              </p>
            </div>

            <div className="bg-[#222222] px-6 py-7">
              <Image
                alt="Smart zoom и minimap"
                src={assets.map}
                width={595}
                height={300}
                sizes="(max-width: 800px) calc(100vw - 80px), 595px"
                className="mx-auto h-auto w-full max-w-[595px] object-contain"
                loading="lazy"
              />
              <p className="mt-2 text-center text-[14px] leading-[160%] text-[#afafaf]">
                На большом масштабе пользователь ориентируется с помощью smart zoom и minimap
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-[18px] leading-[160%]">
              <p className="font-semibold">5. Снизить страх ошибок</p>
              <p>
                В первой итерации я сфокусировалась на том, чтобы сделать изменения более осознанными:
              </p>
              <ul className="list-disc space-y-0 pl-6">
                <li>добавила явный статус сценария (draft / published)</li>
                <li>вынесла публикацию в отдельный этап</li>
              </ul>
              <p className="italic">
                → Пользователям стало проще понимать, в каком состоянии находится сценарий и когда
                изменения попадут в работу. Это отделило черновые изменения от рабочего сценария и
                сделало публикацию осознанным действием.
              </p>
            </div>

            <div className="bg-[#222222] px-0 pt-0 pb-0">
              <Image
                alt="Статус и публикация сценария"
                src={assets.publish}
                width={800}
                height={97}
                sizes="(max-width: 800px) calc(100vw - 32px), 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
              />
              <p className="mt-2 text-center text-[14px] leading-[160%] text-[#afafaf]">
                1 - актуальный статус, 2 - публикация сценария
              </p>
            </div>

            <p className="text-[18px] leading-[160%]">
              Полноценное тестирование и историю версий вынесли в следующий этап — после проверки
              базовых сценариев работы с редактором.
            </p>
          </div>

          <div className="h-px w-full bg-[#282828]" />

          <p className="text-[18px] leading-[160%]">
            После нескольких итераций с клиентскими кейсами я подготовила финальные макеты и
            спецификации для передачи в разработку.
          </p>
        </motion.section>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-[90px] flex flex-col gap-4"
        >
          <h2 className="text-[32px] font-semibold leading-[40px]">Результаты</h2>
          <div className="flex flex-col gap-5">
            <p className="text-[18px] leading-[160%]">
              Новый редактор сделал работу со сценариями самостоятельнее: пользователи стали чаще
              вносить изменения без разработки, быстрее собирали новые сценарии и реже ошибались
              при публикации. Команда поддержки стала меньше подключаться к базовым вопросам.
            </p>

            <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 lg:grid-cols-[repeat(4,184px)]">
              <div className="flex min-h-[94px] flex-col items-start gap-2 rounded-[12px] bg-[#262626] px-4 py-3 lg:w-[184px]">
                <p className="whitespace-nowrap font-semibold text-white">
                  <span className="text-[18px] leading-[160%]">+</span>
                  <span className="text-[32px] leading-[40px]">28</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-[14px] leading-[160%] text-[#c0c0c0]">
                  self-service rate
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-2 rounded-[12px] bg-[#262626] px-4 py-3 lg:w-[184px]">
                <div className="flex items-baseline gap-1 whitespace-nowrap font-semibold text-white">
                  <span className="text-[32px] leading-[40px]">33</span>
                  <span className="text-[18px] leading-[160%]">→</span>
                  <span className="text-[32px] leading-[40px]">19</span>
                  <span className="text-[14px] leading-[160%]">мин</span>
                </div>
                <p className="whitespace-nowrap text-[14px] leading-[160%] text-[#c0c0c0]">
                  time-to-change
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-2 rounded-[12px] bg-[#262626] px-4 py-3 lg:w-[184px]">
                <p className="whitespace-nowrap font-semibold text-white">
                  <span className="text-[18px] leading-[160%]">-</span>
                  <span className="text-[32px] leading-[40px]">21</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-[14px] leading-[160%] text-[#c0c0c0]">
                  ошибок в сценариях
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-2 rounded-[12px] bg-[#262626] px-4 py-3 lg:w-[184px]">
                <p className="whitespace-nowrap font-semibold text-white">
                  <span className="text-[18px] leading-[160%]">-</span>
                  <span className="text-[32px] leading-[40px]">16</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-[14px] leading-[160%] text-[#c0c0c0]">
                  обращений в саппорт
                </p>
              </div>
            </div>

            <p className="text-[18px] leading-[160%]">
              По итогам проекта я поняла, что даже сложные сценарии могут быть управляемыми, если
              пользователь остаётся в контексте и понимает последствия своих действий на каждом
              этапе.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Навигация между страницами"
          className="flex w-full items-start justify-between border-t border-[#282828] pt-4 text-[18px] font-normal leading-[160%]"
        >
          <Link href="/" className="group shrink-0">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
              ← На главную
            </span>
          </Link>
          <Link href="/app" className="group shrink-0">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
              Кейс MCN Softphone →
            </span>
          </Link>
        </motion.nav>
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
    </main>
  );
}
