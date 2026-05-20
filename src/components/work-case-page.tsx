"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/heart.svg",
  hero: "/figma/Case_2/vpbx-canvas.png",
  oldCanvas: "/figma/Case_2/old-canvas.png",
  addFlow: "/figma/Case_2/add-flow.png",
  table: "/figma/Case_2/table.png"
};

export function WorkCasePage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [canHover, setCanHover] = useState(false);

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
        className="flex w-full flex-col gap-[50px] px-4 pb-[120px] pt-[66px] sm:mx-auto sm:max-w-[800px] sm:gap-[100px] sm:px-0 sm:pb-[140px]"
      >
        <motion.section variants={item} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 text-white">
            <h1 className="text-[40px] font-semibold leading-[48px]">KOMPaaS</h1>
            <p className="text-[18px] leading-[160%]">
              Продукт — B2B-платформа для автоматизации контакт-центров. Используется в банках,
              клиниках, образовательных продуктах и ритейле — везде, где важна скорость обработки
              обращений и уровень клиентского сервиса.
            </p>
          </div>

          <div className="bg-[#222222] px-6 py-6">
            <div className="sm:mx-auto sm:max-w-[626px]">
              <Image
                alt="KOMPaaS canvas"
                src={assets.hero}
                width={626}
                height={391}
                sizes="(max-width: 800px) 100vw, 626px"
                className="h-auto w-full object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
        </motion.section>

        <motion.section variants={item} className="flex flex-col gap-8">
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
                <span className="font-semibold">Потеря лояльности</span>
                {` — начали уходить крупные клиенты.`}
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

        <motion.section variants={item} className="flex flex-col gap-8">
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

          <div className="bg-[#222222] px-6 py-6">
            <div className="mx-auto flex max-w-[700px] flex-col gap-4">
              <Image
                alt="Текущая версия редактора сценариев"
                src={assets.oldCanvas}
                width={700}
                height={396}
                sizes="(max-width: 800px) 100vw, 700px"
                className="h-auto w-full rounded-[8px] object-contain"
                loading="lazy"
                unoptimized
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
              <li>создание, настройка и добавление элемента на схему было разделено между экранами.</li>
              <li>элементы в списке не были сгруппированы, а их названия не всегда отражали поведение.</li>
            </ul>
            <p className="text-[18px] italic leading-[160%]">
              → Пользователи не могли выбрать какой именно блок им нужен и часто добавляли лишние
              блоки, которые потом не использовались и перегружали схему.
            </p>
          </div>

          <div className="bg-[#222222] px-6 py-6">
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-[443px_1fr] sm:grid-rows-[auto_auto]">
                <div className="sm:row-span-2">
                  <Image
                    alt="Флоу добавления элемента"
                    src={assets.addFlow}
                    width={443}
                    height={256}
                    sizes="(max-width: 800px) 100vw, 443px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div className="sm:justify-self-end sm:max-w-[224px]">
                  <Image
                    alt="Таблица настроек элемента"
                    src={assets.table}
                    width={224}
                    height={164}
                    sizes="(max-width: 800px) 100vw, 224px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-[18px] font-semibold leading-[160%]">Флоу добавления элемента</p>
                  <ol className="list-decimal space-y-0 pl-6 text-[14px] leading-[160%] text-white">
                    <li>Создаём элемент в модальном окне</li>
                    <li>Настраиваем в футере под в таблицей</li>
                    <li>Добавляем блок на схему из сайдбара</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

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
            <p className="text-[18px] font-semibold leading-[160%]">5. Отсутствовало безопасное тестирование и бэкапы</p>
            <ul className="list-disc space-y-0 pl-6 text-[18px] leading-[160%]">
              <li>нельзя протестировать сценарий до публикации</li>
              <li>отсутствовали бэкапы и история изменений</li>
            </ul>
            <p className="text-[18px] italic leading-[160%]">
              → Ошибки обнаруживались только в продакшене, из-за этого менеджеры боялись вносить
              изменения без разработчиков.
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

          <div className="bg-[#222222] px-6 py-6">
            <Image
              alt="Таблица анализа конкурентов"
              src={assets.table}
              width={800}
              height={457}
              sizes="(max-width: 800px) 100vw, 800px"
              className="h-auto w-full object-contain"
              loading="lazy"
              unoptimized
            />
          </div>

          <p className="text-[18px] leading-[160%]">
            Во время исследования я заметила, что workflow-builder инструменты уходят от отдельных
            настроек к управлению процессом как единой системой. Поскольку пользователю важно
            видеть связи между блоками и понимать как работает сценарий целиком.
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
      </motion.div>
    </main>
  );
}
