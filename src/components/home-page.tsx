"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  avatar: "/figma/avatar.png",
  heart: "/figma/heart.svg",
  phone1: "/figma/Main/phone%201.png",
  phone2: "/figma/Main/phone%202.png",
  phone3: "/figma/Main/phone%203.png",
  vpbxCanvas: "/figma/Case_2/vpbx-canvas.png"
};

export function HomePage() {
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
          <div className="font-oldenburg flex items-center gap-1 text-[18px] leading-[160%]">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[16px] leading-[160%]"
              href="https://drive.google.com/file/d/18tN5uIByWigg_ULyk6VbnGD9G_4Ftf31/view?usp=sharing"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[16px] leading-[160%]"
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
        className="mx-auto flex w-full max-w-[1124px] flex-col gap-[72px] px-4 pb-[120px] pt-[66px] sm:gap-[100px] sm:px-8 sm:pb-[140px] lg:px-0"
      >
        <motion.section variants={item} className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-4">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative h-[100px] w-[120px] overflow-hidden rounded-[100px]">
              <Image
                alt=""
                src={assets.avatar}
                width={120}
                height={100}
                priority
                sizes="120px"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-center text-[32px] font-semibold leading-[40px]">
              Привет, я Настя Ермошина
            </h1>
          </div>
          <p className="max-w-[720px] text-center text-[18px] leading-[160%] text-white">
            Продуктовый дизайнер с опытом 3+ года в телекоме,
            <br className="hidden sm:block" />
            B2B-сервисах и стартапах. Умею разбираться в сложной
            <br className="hidden sm:block" />
            доменной логике и превращать её в понятные,
            <br className="hidden sm:block" />
            работающие решения вместе с командой.
          </p>
        </motion.section>

        <motion.section variants={item} className="flex flex-col items-center gap-6">
          <h2 className="text-center text-[24px] font-semibold leading-[32px]">
            Избранные проекты
          </h2>

          <div className="flex w-full flex-col items-center gap-[72px] sm:gap-[100px]">
            <article className="flex w-full flex-col items-center gap-6">
              <Link
                href="/app"
                prefetch={false}
                aria-label="Открыть кейс MCN Softphone"
                className="group block w-full"
              >
                <div className="flex w-full items-center justify-center gap-4 rounded-[12px] bg-[#222222] px-4 py-8 sm:gap-8 sm:px-12 sm:py-10 lg:h-[580px] lg:gap-10 lg:px-[119px]">
                  <div className="relative h-auto w-[31%] max-w-[245px]">
                    <Image
                      alt="Экран регистрации MCN Softphone"
                      src={assets.phone1}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 28vw, 245px"
                      className="h-auto w-full"
                    />
                  </div>
                  <div className="relative h-auto w-[31%] max-w-[244px]">
                    <Image
                      alt="Экран тарифа MCN Softphone"
                      src={assets.phone2}
                      width={732}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 28vw, 244px"
                      className="h-auto w-full"
                    />
                  </div>
                  <div className="relative h-auto w-[31%] max-w-[245px]">
                    <Image
                      alt="Экран звонка MCN Softphone"
                      src={assets.phone3}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 28vw, 245px"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </Link>

              <div className="flex w-full max-w-[800px] flex-col items-start gap-3">
                <div className="flex w-full items-end justify-between gap-4 text-white">
                  <h3 className="text-[32px] font-semibold leading-[40px]">MCN Softphone</h3>
                  <Link
                    href="/app"
                    prefetch={false}
                    className="mb-[3px] shrink-0 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat text-[16px] font-semibold leading-[160%] text-white transition-[background-size] duration-300 ease-out hover:bg-[length:100%_1px]"
                  >
                    Смотреть кейс →
                  </Link>
                </div>
                <div className="h-px w-full bg-[#262626]" />
                <p className="max-w-[500px] text-[18px] leading-[160%] text-white">
                  Мобильное приложение для звонков за границей. Упростила путь до первого звонка и
                  сделала стоимость связи прозрачнее до начала вызова.
                </p>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[16px] leading-[160%] text-[#c0c0c0] shadow-[0px_4px_100px_0px_rgba(0,0,0,0.25)]">
                    8 → 3 шагов до звонка
                  </span>
                  <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[16px] leading-[160%] text-[#c0c0c0] shadow-[0px_4px_100px_0px_rgba(0,0,0,0.25)]">
                    +23% CR в 1-й звонок
                  </span>
                </div>
              </div>
            </article>

            <article className="flex w-full flex-col items-center gap-6">
              <Link
                href="/work"
                prefetch={false}
                aria-label="Открыть кейс KOMPaaS"
                className="group block w-full"
              >
                <div className="flex w-full items-center justify-center rounded-[12px] bg-[#222222] px-4 py-8 sm:px-12 sm:py-10 lg:h-[580px] lg:px-[119px]">
                  <div className="relative w-full max-w-[800px] overflow-hidden rounded-[8px]">
                    <Image
                      alt="KOMPaaS canvas preview"
                      src={assets.vpbxCanvas}
                      width={2400}
                      height={1500}
                      sizes="(max-width: 640px) calc(100vw - 32px), 800px"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </Link>

              <div className="flex w-full max-w-[800px] flex-col items-start gap-3">
                <div className="flex w-full items-end justify-between gap-4 text-white">
                  <h3 className="text-[32px] font-semibold leading-[40px]">KOMPaaS</h3>
                  <Link
                    href="/work"
                    prefetch={false}
                    className="mb-[3px] shrink-0 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat text-[16px] font-semibold leading-[160%] text-white transition-[background-size] duration-300 ease-out hover:bg-[length:100%_1px]"
                  >
                    Смотреть кейс →
                  </Link>
                </div>
                <div className="h-px w-full bg-[#262626]" />
                <p className="max-w-[500px] text-[18px] leading-[160%] text-white">
                  Конструктор сценариев звонков для B2B-клиентов. Снизила зависимость клиентов от
                  разработки в управлении сценариями звонков.
                </p>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[16px] leading-[160%] text-[#c0c0c0] shadow-[0px_4px_100px_0px_rgba(0,0,0,0.25)]">
                    +28% self-service rate
                  </span>
                  <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-3 py-1 text-[16px] leading-[160%] text-[#c0c0c0] shadow-[0px_4px_100px_0px_rgba(0,0,0,0.25)]">
                    -21% ошибок после публикации
                  </span>
                </div>
              </div>
            </article>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
