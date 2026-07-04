"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/heart.svg",
  hero: "/figma/Case_2/vpbx-canvas.png",
  arrowForward: "/figma/Main/arrow_forward.svg",
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

const workStages = ["Дискавери", "Гипотезы", "Проектирование", "Тестирование", "Передача в разработку"];

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
        className="flex w-full flex-col gap-[120px] px-space-4 pb-space-16 pt-space-16 sm:mx-auto sm:max-w-[800px] sm:px-0 sm:pb-space-16"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-3 text-primary">
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

          <Image
            alt="KOMPaaS canvas"
            src={assets.hero}
            width={800}
            height={500}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full rounded-[8px] object-contain"
            priority
          quality={100}
          />
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">О проекте</h2>
            <p className="text-body-18">
              Один из продуктов KOMPaaS — конструктор сценариев звонков из элементов: голосового
              меню, опросов и оценки качества. В старой версии менеджеры не понимали связи между
              блоками и боялись вносить изменения без разработки. Я спроектировала редактор, где
              сценарий можно собрать, изменить и подготовить к публикации в одном рабочем контексте.
            </p>
          </div>

          <div className="h-px w-full bg-border-elevated" />

          <div className="flex flex-col gap-space-2">
            <h3 className="text-h3">Проблема</h3>
            <p className="text-body-18">
              Любые изменения в сценариях требовали участия разработки и занимали часы или дни. Из-за
              этого сценарии не успевали адаптироваться под изменения процессов, росли операционные
              затраты и риск ошибок в продакшене. Для клиентов с SLA это было особенно критично:
              задержки и ошибки могли напрямую влиять на качество обслуживания.
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
            <h3 className="text-h3">Задача</h3>
            <p className="text-body-18">
              Нужно было устранить зависимость клиентов от разработки и превратить сценарии звонков
              из технической задачи в понятный бизнес-инструмент.
            </p>
            <p className="text-body-18">
              <span className="text-body-18-semibold">Метрики успеха</span>
              {` — рост доли self-service сценариев, снижение нагрузки на разработку и поддержку, сокращение time-to-change при минимальном количестве ошибок.`}
            </p>
          </div>

          <div className="flex flex-col gap-space-3">
            <h3 className="text-h3">Этапы работы</h3>
            <div className="flex flex-wrap items-center gap-space-1">
              {workStages.map((stage, index) => (
                <div key={stage} className="flex items-center gap-space-1">
                  <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                    {stage}
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
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">Дискавери</h2>
            <div className="text-body-18">
              <p>В рамках discovery я изучила, как пользователи работают со сценариями в текущей версии продукта:</p>
              <ul className="list-disc space-y-0 pl-space-6">
                <li>проанализировала реальные сценарии и логику экранов</li>
                <li>разобрала обращения в поддержку (ошибки и частые вопросы)</li>
                <li>сравнила подходы в workflow-конструкторах</li>
                <li>обсудила проблемы с поддержкой и разработкой</li>
              </ul>
            </div>
          </div>

          <div className="h-px w-full bg-border-elevated" />

          <div className="flex flex-col gap-space-4">
            <h3 className="text-h3">Анализ текущей версии</h3>
            <p className="text-body-18">
              Прежде чем предлагать изменения, я собрала обратную связь от поддержки, о том как
              пользователи работают со сценариями сейчас и выделила несколько проблемных зон:
            </p>
          </div>

          <div className="h-[490px] bg-elevated px-space-6 pt-space-10 pb-space-8">
            <div className="mx-auto flex h-full max-w-[700px] flex-col justify-between">
              <Image
                alt="Текущая версия редактора сценариев"
                src={assets.oldCanvas}
                width={700}
                height={396}
                sizes="(max-width: 800px) calc(100vw - 80px), 700px"
                className="h-auto w-full rounded-[8px] object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="text-center text-caption-14 text-secondary-elevated">
                Текущий редактор: сценарии, настройка, элементы, канвас
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">1. Сценариями неудобно управлять</p>
            <p className="text-body-18">
              Список сценариев в сайдбаре ограничен по высоте, отсутствовал поиск и группировка.
            </p>
            <p className="text-body-18-italic">
              → Приходилось долго искать нужный сценарий, при этом было непонятно, какие можно
              безопасно редактировать, а какие уже используются.
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">2. Настройка разделена между экранами</p>
            <p className="text-body-18">
              Создание элемента, его настройка и добавление на canvas происходили в разных местах.
            </p>
            <p className="text-body-18-italic">
              → Из-за этого терялся контекст и не всегда было понятно, как отдельный блок влияет на
              сценарий целиком.
            </p>
          </div>

          <div className="flex flex-col gap-space-3">
            <Image
              alt="Флоу добавления элемента"
              src={assets.addFlow}
              width={800}
              height={505}
              sizes="(max-width: 800px) calc(100vw - 32px), 800px"
              className="h-auto w-full object-contain"
              loading="lazy"
            quality={100}
            />
            <p className="text-center text-caption-14 text-secondary-background">
              Флоу элемента: создаём в настройках (в модальном окне), настраиваем в футере под
              таблицей, возвращаемся на сценарий и добавляем на схему
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">3. Сложности с библиотекой элементов</p>
            <p className="text-body-18">
              Элементы не были сгруппированы по сценариям использования, а названия не всегда
              отражали их поведение.
            </p>
            <p className="text-body-18-italic">
              → Пользователи выбирали элементы методом проб и ошибок, часто добавляя лишние, которые
              потом не использовались и перегружали схему.
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">Сценарии не масштабируются</p>
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

          <div className="flex flex-col gap-space-4">
            <h3 className="text-h3">Анализ конкурентов</h3>
            <p className="text-body-18">
              Чтобы понять, как упростить работу с конструктором, я изучила прямых конкурентов и
              решения из смежных областей. Сравнивала подходы к визуализации сценариев,
              редактированию, работе со сложной логикой и публикацией сценариев.
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
          quality={100}
          />

          <p className="text-body-18">
            Вывод: workflow-builder инструменты уходят от отдельных настроек к управлению процессом
            как единой системой, поскольку пользователю важно понимать состояние сценария и
            контролировать изменения до того, как они попадут в работу.
          </p>

          <div className="h-px w-full bg-border-elevated" />

          <div className="flex w-full max-w-[800px] flex-col gap-space-6">
            <div className="flex flex-col gap-space-4">
              <h3 className="text-h3">Гипотезы</h3>
              <p className="text-body-18">
                На основе анализа я выделила направления, которые могли повлиять на ключевые метрики:
              </p>
            </div>
            <div className="flex flex-col gap-space-2 sm:flex-row sm:flex-wrap">
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:h-[240px] sm:w-[261px]">
                <p className="text-body-16-semibold">1. Организация сценариев</p>
                <p className="text-body-16 text-secondary-elevated">
                  Если сценарии станут более структурированными, пользователям будет проще находить
                  нужный сценарий и быстрее вносить изменения.
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[262px]">
                <p className="text-body-16-semibold">2. Единый контекст</p>
                <p className="text-body-16 text-secondary-elevated">
                  Если работа со сценарием будет происходить в одном контексте, снизится количество
                  ошибок и нагрузка на поддержку, так как изменения станут более предсказуемыми.
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[261px]">
                <p className="text-body-16-semibold">3. Понятные сущности</p>
                <p className="text-body-16 text-secondary-elevated">
                  Если элементы будут названы и сгруппированы по задачам пользователя, снизится
                  порог входа и сократится time-to-change.
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[395px]">
                <p className="text-body-16-semibold">4. Читаемость</p>
                <p className="text-body-16 text-secondary-elevated">
                  Если структура сценария останется понятной даже при росте, пользователям будет
                  проще воспринимать сценарий как единую систему и быстрее его редактировать.
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[395px]">
                <p className="text-body-16-semibold">5. Безопасные изменения</p>
                <p className="text-body-16 text-secondary-elevated">
                  Если пользователь будет понимать, что изменения можно проверить до публикации,
                  снизится зависимость от разработки и вырастет self-service rate.
                </p>
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
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">Проектирование</h2>
            <p className="text-body-18">
              Проектирование строилось вокруг трёх ключевых принципов:
            </p>
          </div>

          <div className="flex flex-col gap-space-2 md:grid md:grid-cols-3 md:gap-space-2">
            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-space-4 rounded-[20px] bg-elevated py-space-6 pl-space-6 pr-space-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-space-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated-accent text-body-18-semibold text-primary">
                  1
                </div>
                <div className="flex min-w-0 flex-col gap-space-0-5">
                  <p className="text-body-16-semibold text-primary">Understand</p>
                  <p className="text-caption-14 text-secondary-elevated">Понять сценарий</p>
                </div>
              </div>
              <p className="text-caption-14 text-primary">
                Быстро считать структуру сценария и понять, как он работает.
              </p>
              <div className="flex h-[118px] flex-col gap-space-1 text-caption-14 text-primary">
                <p>• Группировка</p>
                <p>• Понятные названия элементов</p>
              </div>
            </div>

            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-space-4 rounded-[20px] bg-elevated py-space-6 pl-space-6 pr-space-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-space-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated-accent text-body-18-semibold text-primary">
                  2
                </div>
                <div className="flex min-w-0 flex-col gap-space-0-5">
                  <p className="text-body-16-semibold text-primary">Edit</p>
                  <p className="text-caption-14 text-secondary-elevated">Внести изменения</p>
                </div>
              </div>
              <p className="text-caption-14 text-primary">
                Внести изменения без лишних переходов и потери контекста.
              </p>
              <div className="flex h-[118px] flex-col gap-space-1 text-caption-14 text-primary">
                <p>• Создание и настройка элементов на схеме</p>
                <p>• Inline-редактирование</p>
              </div>
            </div>

            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-space-4 rounded-[20px] bg-elevated py-space-6 pl-space-6 pr-space-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-space-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated-accent text-body-18-semibold text-primary">
                  3
                </div>
                <div className="flex min-w-0 flex-col gap-space-0-5">
                  <p className="text-body-16-semibold text-primary">Validate</p>
                  <p className="text-caption-14 text-secondary-elevated">Проверить</p>
                </div>
              </div>
              <p className="text-caption-14 text-primary">
                Убедиться, что изменения работают без ошибок.
              </p>
              <div className="flex h-[118px] flex-col gap-space-1 text-caption-14 text-primary">
                <p>• Статусы для сценариев (черновик / опубликовано)</p>
                <p>• Тестирование до публикации</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <p className="text-body-18">
              В итоговом решении нужно было учесть, что пользователям важно понимать, когда сценарий
              опубликован и какие изменения уже влияют на реальные звонки.
            </p>

            <div className="flex flex-col gap-space-1">
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

            <div className="flex flex-col gap-space-1">
              <h3 className="text-h3">Стало</h3>
              <p className="text-body-18">
                Создаёт сценарий → Добавляет элемент на схему → Настраивает → Тестирует
              </p>
              <p className="text-body-18-italic">
                Работа происходит в одном контексте, а публикация становится отдельным и более
                осознанным действием.
              </p>
            </div>

            <p className="text-body-18">
              <span className="text-body-18-semibold">Пользователь больше не теряет контекст</span>
              {` — создание, настройка и тестирование сценария происходят на одном экране. Это позволило системно закрыть как проблемы восприятия, так и страх ошибок, чтобы менеджер мог работать самостоятельно.`}
            </p>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">Решение</h2>
            <p className="text-body-18">
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
          quality={100}
          />

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">1. Организовать сценарии</p>
              <p>
                Я не стала усложнять систему, потому что пользователи уже к ней привыкли, только
                добавила группировку по сценариям, поиск и объединила действия со сценарием в
                контекстном меню.
              </p>
              <p className="italic">
                → Это упростило навигацию и сделало работу со сценариями более предсказуемой.
              </p>
            </div>

            <div className="bg-elevated px-space-6 py-space-8">
              <div className="grid gap-space-8 sm:grid-cols-2">
                <div className="flex flex-col gap-space-3">
                  <Image
                    alt="Старый сайдбар"
                    src={assets.oldSidebar}
                    width={330}
                    height={236}
                    sizes="(max-width: 640px) calc(100vw - 80px), 330px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  quality={100}
                  />
                  <p className="text-center text-caption-14 text-secondary-elevated">Было</p>
                </div>
                <div className="flex flex-col gap-space-3">
                  <Image
                    alt="Новый сайдбар"
                    src={assets.newSidebar}
                    width={330}
                    height={236}
                    sizes="(max-width: 640px) calc(100vw - 80px), 330px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  quality={100}
                  />
                  <p className="text-center text-caption-14 text-secondary-elevated">Стало</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">2. Сделать элементы понятнее</p>
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
            quality={100}
            />
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">3. Вернуть пользователю контекст</p>
              <p>
                Перенесла создание и настройку блоков прямо в canvas, чтобы пользователь мог
                добавлять элементы на схему, редактировать их и сразу видеть изменения.
              </p>
              <p className="italic">
                → Сократилось количество переходов между экранами, а базовые действия стали проще.
              </p>
            </div>

            <div className="bg-elevated px-space-6 py-space-8">
              <Image
                alt="Флоу добавления элемента на схему и inline редактирования"
                src={assets.element}
                width={595}
                height={347}
                sizes="(max-width: 800px) calc(100vw - 80px), 595px"
                className="mx-auto h-auto w-full max-w-[595px] object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="mt-space-2 text-center text-caption-14 text-secondary-elevated">
                Флоу добавления элемента на схему и inline редактирования
              </p>
            </div>

            <p className="text-body-18">
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
            quality={100}
            />
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">4. Сделать большие сценарии читаемыми</p>
              <p>Чтобы улучшить читаемость больших флоу, я переработала визуальную иерархию сценария:</p>
              <ul className="list-disc space-y-0 pl-space-6">
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

            <div className="bg-elevated px-space-6 py-space-8">
              <Image
                alt="Smart zoom и minimap"
                src={assets.map}
                width={595}
                height={300}
                sizes="(max-width: 800px) calc(100vw - 80px), 595px"
                className="mx-auto h-auto w-full max-w-[595px] object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="mt-space-2 text-center text-caption-14 text-secondary-elevated">
                На большом масштабе пользователь ориентируется с помощью smart zoom и minimap
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">5. Снизить страх ошибок</p>
              <p>
                В первой итерации я сфокусировалась на том, чтобы сделать изменения более осознанными:
              </p>
              <ul className="list-disc space-y-0 pl-space-6">
                <li>добавила явный статус сценария (draft / published)</li>
                <li>вынесла публикацию в отдельный этап</li>
              </ul>
              <p className="italic">
                → Пользователям стало проще понимать, в каком состоянии находится сценарий и когда
                изменения попадут в работу. Это отделило черновые изменения от рабочего сценария и
                сделало публикацию осознанным действием.
              </p>
            </div>

            <div className="bg-elevated px-0 pt-0 pb-0">
              <Image
                alt="Статус и публикация сценария"
                src={assets.publish}
                width={800}
                height={97}
                sizes="(max-width: 800px) calc(100vw - 32px), 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="mt-space-2 text-center text-caption-14 text-secondary-elevated">
                1 - актуальный статус, 2 - публикация сценария
              </p>
            </div>

            <p className="text-body-18">
              Полноценное тестирование и историю версий вынесли в следующий этап — после проверки
              базовых сценариев работы с редактором.
            </p>
          </div>

          <div className="h-px w-full bg-border-elevated" />

          <p className="text-body-18">
            После нескольких итераций с клиентскими кейсами я подготовила финальные макеты и
            спецификации для передачи в разработку.
          </p>
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
              Новый редактор сделал работу со сценариями самостоятельнее: пользователи стали чаще
              вносить изменения без разработки, быстрее собирали новые сценарии и реже ошибались
              при публикации. Команда поддержки стала меньше подключаться к базовым вопросам.
            </p>

            <div className="grid grid-cols-1 gap-space-3 min-[440px]:grid-cols-2 lg:grid-cols-[repeat(4,184px)]">
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">+</span>
                  <span className="inline-flex h-10 items-center text-h2">28</span>
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  self-service rate
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <div className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-center text-h2">33</span>
                  <span className="inline-flex h-10 items-center">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-10 items-center text-h2">19</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  минут, time-to-change
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">-</span>
                  <span className="inline-flex h-10 items-center text-h2">21</span>
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  ошибок в сценариях
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">-</span>
                  <span className="inline-flex h-10 items-center text-h2">16</span>
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  обращений в саппорт
                </p>
              </div>
            </div>

            <p className="text-body-18">
              По итогам проекта я поняла, что даже сложные сценарии могут быть управляемыми, если
              пользователь остаётся в контексте и понимает последствия своих действий на каждом
              этапе.
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
          <Link href="/app" className="group shrink-0">
            <span className="link-underline">
              Кейс MCN Softphone →
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
    </main>
  );
}
