"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const assets = {
  avatar: "/figma/avatar.png",
  heart: "/figma/Icons/heart.svg",
  phone1: "/figma/Case_1/Section_1/softphone-success.png",
  phone2: "/figma/Case_1/Section_1/softphone-home.png",
  phone3: "/figma/Case_1/Section_1/softphone-dialpad.png",
  vpbxCanvas: "/figma/Case_2/Section_1/vpbx-canvas.png",
  arrowForward: "/figma/Icons/arrow_forward.svg"
};

const footerLinks = [
  { label: "Telegram", href: "https://t.me/him9li9" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nastya-ermoshina-781714274" },
  {
    label: "CV",
    href: "https://drive.google.com/file/d/1srTs3sn5jrgr6PlKthMkucNrslEvm0Tp/view?usp=sharing"
  }
];

export function HomePage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const softphonePreviewRef = useRef<HTMLDivElement | null>(null);
  const softphoneCenterPhoneRef = useRef<HTMLImageElement | null>(null);
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
    const centerSoftphonePreview = () => {
      if (!softphonePreviewRef.current || !window.matchMedia("(max-width: 639px)").matches) {
        return;
      }
      const element = softphonePreviewRef.current;
      const centerPhone = softphoneCenterPhoneRef.current;
      if (!centerPhone) {
        return;
      }
      const elementRect = element.getBoundingClientRect();
      const phoneRect = centerPhone.getBoundingClientRect();
      element.scrollLeft += phoneRect.left + phoneRect.width / 2 - elementRect.left - element.clientWidth / 2;
    };
    const raf = requestAnimationFrame(centerSoftphonePreview);
    const observer = new ResizeObserver(centerSoftphonePreview);
    if (softphonePreviewRef.current) {
      observer.observe(softphonePreviewRef.current);
    }
    if (softphoneCenterPhoneRef.current) {
      observer.observe(softphoneCenterPhoneRef.current);
    }
    window.addEventListener("resize", centerSoftphonePreview);
    window.addEventListener("pageshow", centerSoftphonePreview);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", centerSoftphonePreview);
      window.removeEventListener("pageshow", centerSoftphonePreview);
    };
  }, []);

  return (
    <main className="overflow-x-hidden bg-primary text-primary">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="fixed top-0 z-10 h-[74px] w-full bg-primary/60 backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
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
        className="mx-auto flex w-full max-w-[900px] flex-col gap-[140px] px-space-4 pb-0 pt-[140px] sm:px-space-8 lg:px-0"
      >
        <motion.section variants={item} className="mx-auto flex w-full max-w-[900px] flex-col items-start gap-space-3 sm:items-center">
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
            Продуктовый дизайнер с более 4 лет опыта в телекоме,<span className="sm:hidden"> </span><br className="hidden sm:block" />
            <span className="sm:whitespace-nowrap">B2B-сервисах и стартапах. Умею разбираться в сложной</span><span className="sm:hidden"> </span><br className="hidden sm:block" />
            доменной логике и превращать её в понятные,<span className="sm:hidden"> </span><br className="hidden sm:block" />
            работающие решения
            вместе с командой.
          </p>
        </motion.section>

        <motion.section variants={item} className="mx-auto flex w-full max-w-[900px] flex-col items-start gap-space-6 sm:items-center">
          <h3 className="w-full text-left text-h4 sm:text-center">
            Избранные проекты
          </h3>

          <div className="flex w-full flex-col items-start gap-[140px] sm:items-center">
            <article className="flex w-full flex-col items-start gap-space-6 sm:items-center">
              <Link
                href="/app"
                prefetch={false}
                aria-label="Открыть кейс MCN Softphone"
                className="group block w-full"
              >
                <div
                  ref={softphonePreviewRef}
                  className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto bg-secondary px-space-4 py-space-6 sm:flex sm:w-[900px] sm:items-center sm:justify-center sm:gap-space-4 sm:overflow-visible sm:rounded-[12px] sm:px-space-10 sm:py-space-8"
                >
                  <div className="flex w-max items-center justify-center gap-space-6 sm:w-auto sm:gap-space-4">
                    <Image
                      alt="Экран регистрации MCN Softphone"
                      src={assets.phone1}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 190px, 240px"
                      className="h-[388px] w-auto shrink-0 sm:h-auto sm:w-[240px]"
                      quality={100}
                    />
                    <Image
                      ref={softphoneCenterPhoneRef}
                      alt="Экран тарифа MCN Softphone"
                      src={assets.phone2}
                      width={732}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 263px, 280px"
                      className="h-[540px] w-auto shrink-0 sm:h-auto sm:w-[280px]"
                      quality={100}
                    />
                    <Image
                      alt="Экран звонка MCN Softphone"
                      src={assets.phone3}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 640px) 190px, 240px"
                      className="h-[388px] w-auto shrink-0 sm:h-auto sm:w-[240px]"
                      quality={100}
                    />
                  </div>
                </div>
              </Link>

              <div className="flex w-full flex-col items-start gap-space-2 sm:w-[900px]">
                <div className="flex w-full flex-col gap-space-2 text-primary sm:flex-row sm:items-end sm:justify-between sm:gap-space-4">
                  <h3 className="text-h2">MCN Softphone</h3>
                  <Link
                    href="/app"
                    prefetch={false}
                    className="hidden shrink-0 items-center gap-space-1 link-underline text-body-16 text-primary sm:flex"
                  >
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex w-full flex-col items-start gap-space-2">
                  <div className="h-px w-full bg-border-elevated" />
                  <p className="w-full max-w-[500px] text-body-18 text-primary">
                    Мобильное приложение для звонков за границей. Упростила путь до первого звонка и
                    сделала стоимость связи прозрачнее до начала вызова.
                  </p>
                  <div className="flex flex-wrap items-start gap-space-1">
                    <span className="rounded-full bg-chips px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      8 → 3 шага до звонка
                    </span>
                    <span className="rounded-full bg-chips px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      +23% конверсия в 1-й звонок
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
                <div className="relative w-full overflow-hidden rounded-[8px] sm:left-1/2 sm:w-[900px] sm:-translate-x-1/2">
                  <Image
                    alt="KOMPaaS canvas preview"
                    src={assets.vpbxCanvas}
                    width={2400}
                    height={1500}
                    sizes="(max-width: 640px) calc(100vw - 32px), 900px"
                    className="h-auto w-full"
                  quality={100}
                  />
                </div>
              </Link>

              <div className="flex w-full flex-col items-start gap-space-2 sm:w-[900px]">
                <div className="flex w-full flex-col gap-space-2 text-primary sm:flex-row sm:items-end sm:justify-between sm:gap-space-4">
                  <h3 className="text-h2">KOMPaaS</h3>
                  <Link
                    href="/work"
                    prefetch={false}
                    className="hidden shrink-0 items-center gap-space-1 link-underline text-body-16 text-primary sm:flex"
                  >
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex w-full flex-col items-start gap-space-2">
                  <div className="h-px w-full bg-border-elevated" />
                  <p className="w-full max-w-[500px] text-body-18 text-primary">
                    B2B-платформа для автоматизации контакт-центров. Снизила зависимость клиентов
                    от&nbsp;разработки в&nbsp;управлении сценариями звонков.
                  </p>
                  <div className="flex flex-wrap items-start gap-space-1">
                    <span className="rounded-full bg-chips px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                      +28% self-service rate
                    </span>
                    <span className="rounded-full bg-chips px-space-3 py-space-1 text-body-16 text-secondary-elevated">
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
      <footer className="mx-auto mt-[140px] flex w-full max-w-[900px] flex-col gap-space-2 px-space-4 pb-space-6 sm:px-0 sm:pb-[40px]">
        <div className="flex flex-col gap-space-3">
          <h3 className="text-h4">Связаться со мной</h3>
        </div>
        <div className="h-px w-full bg-border-elevated" />
        <div className="flex w-full flex-col gap-space-6 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-space-2">
          <nav aria-label="Footer links" className="flex flex-wrap items-center gap-space-2 text-body-16 text-primary">
            {footerLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-space-2">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  {link.label}
                </a>
                {index < footerLinks.length - 1 ? <span className="text-secondary">·</span> : null}
              </div>
            ))}
          </nav>
          <p className="text-body-16 text-secondary min-[900px]:ml-auto">Nastya Ermoshina © 2026</p>
        </div>
      </footer>
    </main>
  );
}
