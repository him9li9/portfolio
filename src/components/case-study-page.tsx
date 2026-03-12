"use client";

import { cubicBezier, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  userflow: "/figma/case-userflow.png"
};

export function CaseStudyPage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [isUserflowOpen, setIsUserflowOpen] = useState(false);
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isUserflowOpen]);

  return (
    <main className="bg-[#171717] text-white">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="sticky top-0 z-10 h-[74px] w-full backdrop-blur-[4px]"
      >
        <div className="flex h-full w-full items-center justify-between px-4 py-[13px] sm:px-8">
          <Link href="/" className="font-oldenburg flex items-center gap-1 text-[18px] leading-[1.4]">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[16px] leading-[1.4] sm:text-[18px]"
              href="https://drive.google.com/file/d/18tN5uIByWigg_ULyk6VbnGD9G_4Ftf31/view?usp=sharing"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[16px] leading-[1.4] sm:text-[18px]"
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
        className="flex w-full flex-col gap-[50px] px-4 pb-[120px] pt-[66px] sm:mx-auto sm:max-w-[800px] sm:gap-[93px] sm:px-6 sm:pt-[66px] sm:pb-[140px]"
      >
        <motion.section variants={item} className="flex flex-col gap-6 sm:gap-6">
          <div className="flex flex-col gap-3 text-white">
            <h1 className="text-[40px] font-semibold leading-[48px]">MCN Softphone</h1>
            <p className="text-[18px] leading-[1.4]">
              — мобильное приложение для звонков через интернет и управление личным кабинетом. Аудитория —
              путешественники, которым нужна дешёвая и надёжная связь за границей.
            </p>
          </div>
            <div className="bg-[#222] py-6">
            <div className="mx-auto w-full max-w-[417px]">
              <img alt="" src={assets.hero} className="h-auto w-full object-contain" />
            </div>
          </div>
        </motion.section>

        <motion.section variants={item} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-[32px] font-semibold leading-[40px]">О проекте</h2>
            <p className="text-[18px] leading-[1.4]">
              Когда я пришла в команду, продукт уже находился на стадии MVP около 9 месяцев.
              Пользователи скачивали приложение, но звонков было мало и результаты для бизнеса были
              ниже ожидаемых. Нужно было разобраться, что конкретно не работает и исправить это.
            </p>
            <div className="h-px w-full bg-[#282828]" />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Проблема</h3>
            <p className="text-[18px] leading-[1.4]">
              Первичный анализ выявил системную проблему — пользователь остается в неведении на
              критических этапах: после регистрации, во время звонка, при технических сбоях. Это
              напрямую повлияло на ключевые метрики:
            </p>
            <ul className="list-disc space-y-4 pl-6 text-[18px] leading-[1.4]">
              <li>
                <span className="font-semibold">Низкая конверсия в первый звонок</span>
                {` — только 1/3 пользователей доходит до звонка, потому что большинство не понимает, когда номер уже активен.`}
              </li>
            </ul>
            <div className="mx-auto w-full max-w-[323px]">
              <img alt="" src={assets.chartSmall} className="h-auto w-full object-contain" />
            </div>
            <ul className="list-disc space-y-4 pl-6 text-[18px] leading-[1.4]">
              <li>
                <span className="font-semibold">Низкий Retention</span>
                {` — люди скачивали приложение, пробовали разобраться, но из 2.1К новых пользователей возвращалась лишь половина. По данным аналитики Retention падает до 15% к четвёртой неделе.`}
              </li>
            </ul>
            <div className="mx-auto w-full max-w-[527px]">
              <img alt="" src={assets.chartBig} className="h-auto w-full object-contain" />
            </div>
            <ul className="list-disc space-y-4 pl-6 text-[18px] leading-[1.4]">
              <li>
                <span className="font-semibold">Растущие затраты на поддержку</span>
                {` — 40% NST (обращений) — вопросы про статус аккаунта и списания, которые можно было бы закрыть сразу в приложении`}
              </li>
            </ul>
            <p className="text-[18px] leading-[1.4]">
              Главная причина снижения метрик — потеря коммуникации между системой и пользователем.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Задача</h3>
            <p className="text-[18px] leading-[1.4]">
              Основная задача проекта состояла в том, чтобы внедрить в продукт систему коммуникации
              из четких шагов, подсказок и с полной прозрачностью расходов. Это позволит вернуть
              пользователю ощущение контроля и уверенности, сократив отток и нагрузку на поддержку.
            </p>
            <p className="text-[18px] leading-[1.4]">
              <span className="font-semibold">Метрики успеха</span>
              {` — рост количества звонков из приложения, снижение повторных обращений в поддержку.`}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Что я сделала</h3>
            <ol className="list-decimal space-y-2 pl-6 text-[18px] leading-[1.4]">
              <li>Проанализировала MVP и обратную связь от пользователей.</li>
              <li>Определила проблемы и сформулировала гипотезы (вместе с командой).</li>
              <li>Спроектировала и упростила ключевые сценарии.</li>
              <li>Проверила решения на быстрых прототипах с пользователями.</li>
              <li>Подготовила дизайн и компоненты для передачи в разработку + материалы для релиза.</li>
            </ol>
          </div>
        </motion.section>

        <motion.section variants={item} className="flex flex-col gap-8">
          <h2 className="text-[32px] font-semibold leading-[40px]">Дискавери</h2>

          <div className="text-[18px] leading-[1.4]">
            <p>В рамках discovery я опиралась на:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>анализ текущих пользовательских сценариев и логики экранов.</li>
              <li>обращения пользователей в поддержку (частые вопросы и типовые ошибки).</li>
              <li>обзор аналогичных softphone- и коммуникационных решений.</li>
              <li>обсуждения с командой поддержки и разработки.</li>
            </ul>
          </div>

          <div className="h-px w-full bg-[#282828]" />

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Анализ текущей версии</h3>
            <p className="text-[18px] leading-[1.4]">
              Цель этапа — понять, где именно пользователи теряются, совершают ошибки или тратят
              лишнее время, и какие из этих проблем особенно критичны для MVP перед релизом. Поэтому
              я начала с анализа текущего пользовательского пути и точек неопределённости:
            </p>
          </div>

          <div className="flex flex-col gap-2 text-[18px] leading-[1.4]">
            <p className="font-semibold">1. Сценарий активации разорван между вебом и приложением</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Регистрация вынесена в веб-кабинет и требует ручной верификации менеджером.</li>
              <li>После отправки заявки нет объяснения со статусом и следующими действиями.</li>
            </ul>
            <p>
              Пользователи откладывают покупку номера и первый звонок →{" "}
              <span className="text-[#ff6060]">отток на этапе регистрации</span>
            </p>
          </div>

          <div className="mx-auto w-full max-w-[760px]">
            <img alt="" src={assets.discoveryActivation} className="h-auto w-full object-contain" />
          </div>

          <div className="flex flex-col gap-2 text-[18px] leading-[1.4]">
            <p className="font-semibold">2. Стоимость и списания не прозрачны в момент звонка</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Информацию о стоимости звонков в роуминге нужно было искать на сайте.</li>
              <li>После завершения звонка списания выглядят неожиданными.</li>
            </ul>
            <p>
              Пользователи не понимают, сколько и за что они платят →{" "}
              <span className="text-[#ff6060]">рост обращений в поддержку</span>
            </p>
          </div>

          <div className="bg-[#222] py-6">
            <div className="mx-auto w-full max-w-[427px]">
              <img alt="" src={assets.discoveryCost} className="h-auto w-full object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-[18px] leading-[1.4]">
            <p className="font-semibold">3. Некачественная обратная связь</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>В приложении нет понятной точки входа в поддержку.</li>
              <li>Пользователи ищут ответы в разных каналах и повторяют вопросы.</li>
            </ul>
            <p>
              Пользователи не знают, где искать помощь →{" "}
              <span className="text-[#ff6060]">повторные обращения в разных каналах</span>
            </p>
          </div>

          <div className="bg-[#222] py-6">
            <div className="mx-auto flex w-full max-w-[427px] flex-col gap-4">
              <img alt="" src={assets.discoveryFeedback1} className="h-auto w-full object-contain" />
              <img alt="" src={assets.discoveryFeedback2} className="h-auto w-full object-contain" />
            </div>
          </div>

          <p className="text-[18px] leading-[1.4]">
            Анализ обращений в поддержку показал, что основная причина проблем пользователей —
            непонимание текущего состояния аккаунта и баланса. Это особенно критично в путешествиях,
            где важна немедленная доступность связи и интернета.
          </p>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Анализ конкурентов</h3>
            <p className="text-[18px] leading-[1.4]">
              В ходе discovery я также изучила аналогичные продукты, в которых есть звонки.
              Например, после опыта работы с мессенджерами у пользователей формируется ожидание
              мгновенной готовности к коммуникации (и звонкам в том числе) сразу после регистрации.
            </p>
          </div>

          <div className="bg-[#222] py-6">
            <div className="mx-auto w-full max-w-[600px]">
              <img alt="" src={assets.competitorWhatsapp} className="h-auto w-full object-contain" />
            </div>
            <p className="mt-4 text-center text-[14px] leading-[1.4] text-[#afafaf]">
              WhatsApp (регистрация – выбор контакта – звонок)
            </p>
          </div>

          <p className="text-[18px] leading-[1.4]">
            В softphone-приложениях, где есть обязательные шаги (выбор номера, верификация,
            тарификация), путь к первому звонку объективно сложнее. Поэтому в таком сценарии
            пользователю необходима понятная и непрерывная обратная связь о его прогрессе и статусе.
          </p>

          <div className="bg-[#222] py-6">
            <div className="mx-auto w-full max-w-[704px]">
              <img alt="" src={assets.competitorOpenphone} className="h-auto w-full object-contain" />
            </div>
            <p className="mt-4 text-center text-[14px] leading-[1.4] text-[#afafaf]">
              Open Phone (выбор номера – регистрация – покупка – звонок)
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[24px] font-semibold leading-[32px]">Гипотезы</h3>
            <p className="text-[18px] leading-[1.4]">На основе анализа и инсайтов я составила список основных гипотез:</p>
            <div className="flex flex-col gap-4 text-[18px] leading-[1.4]">
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
        </motion.section>

        <motion.section variants={item} className="flex flex-col gap-6">
          <h2 className="text-[32px] font-semibold leading-[40px]">Проектирование</h2>
          <p className="text-[18px] leading-[1.4]">
            Цель этапа — определить, как система будет вести себя в диалоге с пользователем, чтобы
            он не терялся в случае если что-то пойдёт не так. Основные решения касались логики
            сценариев, проработки состояний и корнер-кейсов.
          </p>
          <div className="h-px w-full bg-[#282828]" />
          <p className="text-[18px] leading-[1.4]">
            Когда я проектировала новый путь, главным было убрать неопределённость. Пользователь не
            должен гадать: «А номер уже мой? А сколько это стоит? А что делать, если что-то пошло не
            так?». Вот что получилось:
          </p>

          <div className="bg-[#222] py-6">
            <div className="mx-auto w-full max-w-[750px] px-4 sm:px-6">
              <img
                alt=""
                src={assets.userflow}
                className="h-auto w-full cursor-zoom-in object-contain"
                onClick={() => setIsUserflowOpen(true)}
              />
            </div>
            <p className="mt-4 text-center text-[14px] leading-[1.4] text-[#9e9e9e]">
              UserFlow сценария звонка (чтобы увеличить нажмите на картинку).
            </p>
          </div>

          <ul className="list-disc space-y-2 pl-6 text-[18px] leading-[1.4]">
            <li>от первого запуска приложения до звонка — 4–5 шагов (вместо 8-10).</li>
            <li>
              стали показывать стоимость звонка ещё до вызова, а после ключевых шагов success screen
              (на схеме — ✅), чтобы убрать тревогу и неопределенность.
            </li>
            <li>ошибки не оставляют в тупике, а предлагают решение и возвращают на сценарий.</li>
            <li>
              поддержка всегда доступна, но не как основной, а как дополнительный шаг в решении
              проблемы.
            </li>
          </ul>
        </motion.section>
      </motion.div>

      {isUserflowOpen ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center px-6"
          onClick={() => setIsUserflowOpen(false)}
          role="presentation"
        >
          <div className="lightbox-backdrop absolute inset-0" />
          <div className="relative h-[80vh] w-[80vw] p-4">
            <img
              alt=""
              src={assets.userflow}
              className="h-full w-full cursor-zoom-out object-contain"
              onClick={() => setIsUserflowOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
