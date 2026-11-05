"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const assets = {
  avatar: "/figma/avatar.png",
  heart: "/figma/Icons/heart.svg",
  phone1: "/figma/Case_1/Section_1/softphone-home.png",
  phone2: "/figma/Case_1/Section_1/softphone-success.png",
  vpbxCanvas: "/figma/Case_2/Section_1/vpbx-canvas.png",
  appState: "/figma/Case_3/Section_1/app-state-v2.png",
  appGoals: "/figma/Case_3/Section_1/app-goals-v2.png",
  arrowForward: "/figma/Icons/arrow_forward.svg"
};

const thirdProject = {
  title: "Camomile",
  description: "Разработала в Codex приложение для отслеживания баланса сфер жизни, личных целей и сохранения важных моментов.",
  href: "https://t.me/cam0mile_bot"
};

const footerLinks = [
  {
    label: "CV",
    href: "https://drive.google.com/file/d/1jXFLR65AUPIRSsSU4JpdDGOdRiS_aMF4/view?usp=sharing"
  },
  { label: "Telegram", href: "https://t.me/him9li9" }
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
              href="https://drive.google.com/file/d/1jXFLR65AUPIRSsSU4JpdDGOdRiS_aMF4/view?usp=sharing"
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
        className="mx-auto flex w-full max-w-[800px] flex-col gap-[100px] px-space-4 pt-[140px] sm:px-0"
      >
        <motion.section variants={item} className="mx-auto flex w-full flex-col items-start gap-space-3 sm:items-center">
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
            <h1 className="text-left text-[28px] font-semibold leading-normal sm:text-center">
              Привет, я Настя Ермошина
            </h1>
          </div>
          <p className="w-full text-left text-body-16 text-primary sm:w-[480px] sm:text-center sm:whitespace-nowrap">
            Продуктовый дизайнер с 4+ годами опыта в мобильных<br className="hidden sm:block" />{" "}
            и B2B-продуктах. Разбираюсь в сложных сценариях и довожу<br className="hidden sm:block" />{" "}
            решения до релиза. Использую AI для быстрых экспериментов,<br className="hidden sm:block" />{" "}
            прототипирования и работы с кодом.
          </p>
          <nav aria-label="Ссылки" className="flex items-center gap-space-4 text-body-16 text-primary">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-space-1"
              >
                <span>{link.label}</span>
                <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
              </a>
            ))}
          </nav>
        </motion.section>

        <motion.section variants={item} className="mx-auto flex w-full flex-col items-start gap-space-6 sm:items-center">
          <h2 className="w-full text-left text-h4 sm:text-center">Рабочие проекты</h2>
          <div className="flex w-full flex-col items-start gap-[100px] sm:items-center">
            <article className="flex w-full flex-col items-start gap-space-6 sm:items-center">
              <Link href="/app" prefetch={false} aria-label="Открыть кейс MCN Softphone" className="group block w-full">
                <div
                  ref={softphonePreviewRef}
                  className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto bg-[#1c1c1c] px-space-4 py-space-6 sm:flex sm:w-full sm:items-center sm:justify-center sm:gap-space-8 sm:overflow-visible sm:rounded-[12px] sm:px-space-10 sm:py-space-8"
                >
                  <div className="flex w-max items-center justify-center gap-space-4 sm:w-auto sm:gap-space-8">
                    <Image
                      alt="Главный экран MCN Softphone"
                      src={assets.phone1}
                      width={732}
                      height={1500}
                      priority
                      sizes="(max-width: 639px) 176px, 280px"
                      className="h-[360px] w-auto shrink-0 sm:h-[572px]"
                      quality={100}
                    />
                    <Image
                      ref={softphoneCenterPhoneRef}
                      alt="Подтверждение регистрации MCN Softphone"
                      src={assets.phone2}
                      width={735}
                      height={1500}
                      priority
                      sizes="(max-width: 639px) 176px, 280px"
                      className="h-[360px] w-auto shrink-0 sm:h-[572px]"
                      quality={100}
                    />
                  </div>
                </div>
              </Link>
              <div className="flex w-full flex-col items-start gap-space-1">
                <div className="flex w-full flex-col items-start gap-space-1 sm:flex-row sm:items-center sm:gap-space-3">
                  <h3 className="text-[24px] font-semibold leading-normal sm:text-[28px]">MCN Softphone</h3>
                  <Link href="/app" prefetch={false} aria-label="Смотреть кейс MCN Softphone" className="link-underline inline-flex shrink-0 items-center gap-space-1 text-body-16">
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex w-full max-w-[520px] flex-col gap-space-3 text-body-16">
                  <p className="sm:hidden">Сократила путь до первого звонка с 8 до 3 шагов и количество обращений по подключению и тарификации в 2 раза.</p>
                  <p className="hidden sm:block">Переработала регистрацию и активацию номера в приложении интернет-телефонии, сократив путь до первого звонка с 8 до 3 шагов и количество обращений по подключению и тарификации в 2 раза.</p>
                  <div className="text-[#a0a0a0]">
                    <p className="text-caption-14 sm:hidden">B2C · Mobile app · 2024 — н.в.</p>
                    <div className="hidden sm:block">
                      <p>Продуктовый дизайнер · 2024 — н.в.</p>
                      <p>B2C · Mobile app</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="flex w-full flex-col items-start gap-space-6 sm:items-center">
              <Link href="/work" prefetch={false} aria-label="Открыть кейс KOMPaaS" className="group block w-full">
                <div className="relative w-full overflow-hidden rounded-[8px] sm:left-1/2 sm:w-full sm:-translate-x-1/2">
                  <Image
                    alt="Конструктор сценариев звонков KOMPaaS"
                    src={assets.vpbxCanvas}
                    width={2400}
                    height={1500}
                    sizes="(max-width: 639px) calc(100vw - 32px), 800px"
                    className="h-auto w-full"
                    quality={100}
                  />
                </div>
              </Link>
              <div className="flex w-full flex-col items-start gap-space-1">
                <div className="flex w-full flex-col items-start gap-space-1 sm:flex-row sm:items-center sm:gap-space-3">
                  <h3 className="text-[24px] font-semibold leading-normal sm:text-[28px]">KOMPaaS</h3>
                  <Link href="/work" prefetch={false} aria-label="Смотреть кейс KOMPaaS" className="link-underline inline-flex shrink-0 items-center gap-space-1 text-body-16">
                    <span>Смотреть кейс</span>
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex w-full max-w-[520px] flex-col gap-space-3 text-body-16">
                  <p className="sm:hidden">Спроектировала редактор сценариев звонков, снизив количество ошибок в 2,5 раза.</p>
                  <p className="hidden sm:block">Спроектировала редактор для самостоятельной работы менеджеров со сценариями звонков, снизив количество ошибок на продакшене в 2,5 раза за первые 3 месяца после изменений.</p>
                  <div className="text-[#a0a0a0]">
                    <p className="text-caption-14 sm:hidden">B2B · Self-service · 2023 — 2025</p>
                    <div className="hidden sm:block">
                      <p>Продуктовый дизайнер · 2023 — 2025</p>
                      <p>B2B · Self-service</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </motion.section>

        <motion.section variants={item} className="mx-auto flex w-full flex-col items-start gap-space-6 sm:items-center">
          <h2 className="w-full text-left text-h4 sm:text-center">Личные проекты</h2>
          <article className="flex w-full flex-col items-start gap-space-6 sm:items-center">
            <a
              href={thirdProject.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти в Camomile"
              className="group block w-full"
            >
              <div className="relative left-1/2 flex w-screen -translate-x-1/2 items-center justify-center gap-space-4 bg-[#1c1c1c] px-space-4 py-space-6 sm:w-full sm:gap-space-8 sm:rounded-[12px] sm:px-space-10 sm:py-space-8">
                <Image
                  alt="Экран оценки сфер жизни Camomile"
                  src={assets.appState}
                  width={900}
                  height={1840}
                  sizes="(max-width: 639px) calc((100vw - 48px) / 2), 280px"
                  className="h-auto w-[calc((100%-16px)/2)] max-w-[280px] shrink-0 sm:w-[280px]"
                  quality={100}
                />
                <Image
                  alt="Экран целей Camomile"
                  src={assets.appGoals}
                  width={900}
                  height={1840}
                  sizes="(max-width: 639px) calc((100vw - 48px) / 2), 280px"
                  className="h-auto w-[calc((100%-16px)/2)] max-w-[280px] shrink-0 sm:w-[280px]"
                  quality={100}
                />
              </div>
            </a>
            <div className="flex w-full flex-col items-start gap-space-1">
              <div className="flex w-full items-center gap-space-3">
                <h3 className="text-[24px] font-semibold leading-normal sm:text-[28px]">{thirdProject.title}</h3>
                <a href={thirdProject.href} target="_blank" rel="noopener noreferrer" aria-label="Перейти в Camomile" className="link-underline inline-flex shrink-0 items-center gap-space-1 text-body-16">
                  <span className="hidden sm:inline">Перейти в приложение</span>
                  <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
                </a>
              </div>
              <div className="flex w-full max-w-[520px] flex-col gap-space-3 text-body-16">
                <p className="sm:hidden">Разработала в Codex приложение для баланса сфер жизни, целей и важных моментов.</p>
                <p className="hidden sm:block">Разработала в Codex приложение для отслеживания баланса сфер жизни, личных целей и сохранения важных моментов.</p>
                <div className="text-[#a0a0a0]">
                  <p className="text-caption-14 sm:hidden">AI-first · Telegram mini app · 2026</p>
                  <div className="hidden sm:block">
                    <p>Продуктовый дизайнер · 2026</p>
                    <p>AI-first · Telegram mini app</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </motion.section>
      </motion.div>

      <footer className="mx-auto mt-[100px] flex w-full max-w-[800px] flex-col gap-space-2 px-space-4 pb-[70px] sm:px-0">
        <h2 className="text-h4">Связаться со мной</h2>
        <div className="h-px w-full bg-border-elevated" />
        <div className="flex w-full flex-col gap-space-6 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-space-2">
          <nav aria-label="Контакты" className="flex flex-wrap items-center gap-space-4 text-body-16 text-primary">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-space-1">
                <span>{link.label}</span>
                <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4" />
              </a>
            ))}
          </nav>
          <p className="text-body-16 text-secondary min-[900px]:ml-auto">Nastya Ermoshina © 2026</p>
        </div>
      </footer>
    </main>
  );
}
