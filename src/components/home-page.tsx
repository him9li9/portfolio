"use client";

import { cubicBezier, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  avatar: "/figma/avatar.png",
  phones: "/figma/phones.png",
  heart: "/figma/heart.svg",
  mcn: "/figma/mcn-softphone.svg"
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
          <div className="font-oldenburg flex items-center gap-1 text-[18px] leading-[1.4]">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[18px] leading-[1.4]"
              href="https://drive.google.com/file/d/18tN5uIByWigg_ULyk6VbnGD9G_4Ftf31/view?usp=sharing"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "#333333", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-[#262626] px-4 py-2 text-[18px] leading-[1.4]"
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
        className="flex w-full flex-col gap-[50px] px-4 pb-[120px] pt-[66px] sm:mx-auto sm:max-w-[800px] sm:gap-[100px] sm:px-0 sm:pt-[66px] sm:pb-[140px]"
      >
        <motion.section variants={item} className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="h-[100px] w-[120px] overflow-hidden rounded-[100px]">
              <img alt="" src={assets.avatar} className="h-full w-full object-cover" />
            </div>
            <h1 className="text-[40px] font-semibold leading-[48px] sm:text-[40px] sm:leading-[48px]">
              Привет!
              <br />
              На связи Настя Ермошина
            </h1>
          </div>
          <p className="text-[18px] leading-[1.4] text-white sm:text-[18px] sm:leading-[1.4]">
            Продуктовый дизайнер с опытом 3+ года в телекоме и стартапах, проектирую b2b- и
            b2c-решения. Умею быстро разбираться в сложных системах и превращать их в удобные,
            интуитивные интерфейсы, создавая ценность для пользователя. В работе мне нравится
            находить точки роста в неочевидных задачах и участвовать в брейнштормах с командой.
          </p>
        </motion.section>

        <motion.div variants={item} className="relative z-50 group/card">
          <div className="pointer-events-none fixed inset-0 z-40 hidden bg-black opacity-0 transition-opacity duration-200 ease-out sm:block sm:group-hover/card:opacity-[0.65]" />
          <Link href="/app" className="block">
            <motion.section
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-50 flex w-full flex-col items-start gap-[33px] overflow-hidden px-4 py-[23px] shadow-[0_-16px_70px_10px_rgba(255,255,255,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-[33px] sm:px-8 sm:py-[23px]"
              style={{
                backgroundImage:
                  "radial-gradient(120% 120% at 55% 70%, rgba(40,40,40,1) 0%, rgba(19,19,19,1) 100%), radial-gradient(120% 120% at 70% 72%, rgba(40,40,40,1) 0%, rgba(19,19,19,1) 100%)"
              }}
            >
              <div className="flex w-full flex-col gap-[108px] sm:max-w-[338px]">
                <div className="w-[252px]">
                  <img alt="MCN Softphone" src={assets.mcn} className="h-auto w-full" />
                </div>
                <p className="text-[18px] leading-[1.4] text-white sm:text-[18px] sm:leading-[1.4]">
                  Как я сократила время активации и увеличила количество звонков из приложения на 23%
                </p>
              </div>
              <div className="aspect-[3504/3354] w-full overflow-hidden sm:h-[330px] sm:w-[334px] sm:aspect-auto">
                <img alt="" src={assets.phones} className="h-full w-full object-contain" />
              </div>
            </motion.section>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
