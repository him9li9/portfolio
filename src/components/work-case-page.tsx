"use client";

import { cubicBezier, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/heart.svg"
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
              KOMPaaS — B2B-платформа для автоматизации контакт-центров. Используется в банках,
              клиниках, образовательных продуктах и ритейле — везде, где важна скорость обработки
              обращений и уровень клиентского сервиса.
            </p>
          </div>

          <div className="bg-[#222222] px-6 py-6">
            <div className="flex h-[391px] w-full items-center justify-center bg-[#262626] text-center text-[14px] leading-[160%] text-[#828282] sm:mx-auto sm:max-w-[626px]">
              Изображение первой секции будет добавлено отдельно.
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
      </motion.div>
    </main>
  );
}
