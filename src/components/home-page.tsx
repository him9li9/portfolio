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
  vpbxCanvas: "/figma/Case_2/vpbx-canvas.png",
  arrowForward: "/figma/Main/arrow_forward.svg"
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
    <main className="bg-primary text-primary">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="sticky top-0 z-10 h-[74px] w-full bg-primary/60 backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
      >
        <div className="flex h-full w-full items-center justify-between px-space-4 py-space-3 sm:px-space-8">
          <div className="font-oldenburg flex items-center gap-space-1 text-body-18">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </div>
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
        className="mx-auto flex w-full max-w-[800px] flex-col gap-[120px] px-space-4 pb-space-16 pt-space-16 sm:px-space-8 sm:pb-space-16 lg:px-0"
      >
        <motion.section variants={item} className="mx-auto flex w-full max-w-[800px] flex-col items-start gap-space-4 sm:items-center">
          <div className="flex flex-col items-start justify-center gap-space-8 sm:items-center">
            <div className="relative h-[100px] w-[120px] overflow-hidden rounded-[100px]">
              <Image
                alt=""
                src={assets.avatar}
                width={120}
                height={100}
                priority
                sizes="120px"
                className="h-full w-full object-cover"
              quality={100}
              />
            </div>
            <h1 className="text-left text-h2 sm:text-center">
              Привет, я Настя Ермошина
            </h1>
          </div>
          <p className="w-full text-left text-body-18 text-primary sm:w-[482px] sm:text-center">
            Продуктовый дизайнер с опытом 3+ года в телекоме,<span className="sm:hidden"> </span><br className="hidden sm:block" />
            <span className="sm:whitespace-nowrap">B2B-сервисах и стартапах. Умею разбираться в сложной</span><span className="sm:hidden"> </span><br className="hidden sm:block" />
            доменной логике и превращать её в понятные,<span className="sm:hidden"> </span><br className="hidden sm:block" />
            работающие решения
            вместе с командой.
          </p>
        </motion.section>

        <motion.section variants={item} className="flex flex-col items-start gap-space-6 sm:items-center">
          <h2 className="text-left text-h3 sm:text-center">
            Избранные проекты
          </h2>

          <div className="flex w-full flex-col items-start gap-[120px] sm:items-center">
            <article className="flex w-full flex-col items-start gap-space-6 sm:items-center">
              <Link
                href="/app"
                prefetch={false}
                aria-label="Открыть кейс MCN Softphone"
                className="group block w-full"
              >
                <div className="mx-auto flex w-full max-w-[800px] items-center justify-center gap-space-4 rounded-[12px] bg-secondary px-space-4 py-space-8 sm:gap-space-6 sm:px-space-10 sm:py-space-10">
                  <div className="relative h-auto w-[27%] max-w-[205px]">
                    <Image
                      alt="Экран регистрации MCN Softphone"
                      src={assets.phone1}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 27vw, 205px"
                      className="h-auto w-full"
                    quality={100}
                    />
                  </div>
                  <div className="relative h-auto w-[34%] max-w-[256px]">
                    <Image
                      alt="Экран тарифа MCN Softphone"
                      src={assets.phone2}
                      width={732}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 28vw, 244px"
                      className="h-auto w-full"
                    quality={100}
                    />
                  </div>
                  <div className="relative h-auto w-[27%] max-w-[205px]">
                    <Image
                      alt="Экран звонка MCN Softphone"
                      src={assets.phone3}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 27vw, 205px"
                      className="h-auto w-full"
                    quality={100}
                    />
                  </div>
                </div>
              </Link>

              <div className="flex w-full max-w-[800px] flex-col items-start gap-space-2">
                <div className="flex w-full flex-col gap-space-2 text-primary sm:flex-row sm:items-end sm:justify-between sm:gap-space-4">
                  <h3 className="text-h2">MCN Softphone</h3>
                  <Link
                    href="/app"
                    prefetch={false}
                    className="hidden shrink-0 items-center gap-space-1 link-underline text-body-16 text-primary  sm:flex"
                  >
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col items-start gap-space-3">
                  <div className="h-px w-full bg-border-elevated sm:w-[800px]" />
                  <p className="max-w-[490px] text-body-18 text-primary">
                    Мобильное приложение для звонков за границей. Упростила путь до первого звонка и
                    сделала стоимость связи прозрачнее до начала вызова.
                  </p>
                  <div className="flex flex-wrap items-start gap-space-2">
                    <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      8 → 3 шага до звонка
                    </span>
                    <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      +23% CR в 1-й звонок
                    </span>
                  </div>
                  <Link
                    href="/app"
                    prefetch={false}
                    className="mt-space-1 flex items-center gap-space-1 text-body-16 text-primary sm:hidden"
                  >
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>

            <article className="flex w-full flex-col items-start gap-space-6 sm:items-center">
              <Link
                href="/work"
                prefetch={false}
                aria-label="Открыть кейс KOMPaaS"
                className="group block w-full"
              >
                <div className="relative w-full overflow-hidden rounded-[8px]">
                  <Image
                    alt="KOMPaaS canvas preview"
                    src={assets.vpbxCanvas}
                    width={2400}
                    height={1500}
                    sizes="(max-width: 640px) calc(100vw - 32px), 800px"
                    className="h-auto w-full"
                  quality={100}
                  />
                </div>
              </Link>

              <div className="flex w-full max-w-[800px] flex-col items-start gap-space-2">
                <div className="flex w-full flex-col gap-space-2 text-primary sm:flex-row sm:items-end sm:justify-between sm:gap-space-4">
                  <h3 className="text-h2">KOMPaaS</h3>
                  <Link
                    href="/work"
                    prefetch={false}
                    className="hidden shrink-0 items-center gap-space-1 link-underline text-body-16 text-primary  sm:flex"
                  >
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col items-start gap-space-3">
                  <div className="h-px w-full bg-border-elevated sm:w-[800px]" />
                  <p className="max-w-[490px] text-body-18 text-primary">
                    B2B-платформа для автоматизации контакт-центров. Снизила зависимость клиентов
                    от разработки в управлении сценариями звонков.
                  </p>
                  <div className="flex flex-wrap items-start gap-space-2">
                    <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      +28% self-service rate
                    </span>
                    <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      -21% ошибок после публикации
                    </span>
                  </div>
                  <Link
                    href="/work"
                    prefetch={false}
                    className="mt-space-1 flex items-center gap-space-1 text-body-16 text-primary sm:hidden"
                  >
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
