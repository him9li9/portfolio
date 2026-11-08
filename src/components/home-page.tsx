"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  avatar: "/figma/avatar.png",
  heart: "/figma/Icons/heart.svg",
  arrowOutward: "/figma/Icons/arrow_outward.svg",
  softphoneHome: "/figma/Case_1/Section_1/softphone-home.png",
  callFlowVideo: "/figma/Case_1/Section_4/call-flow.mp4",
  vpbxCanvas: "/figma/Case_2/Section_1/vpbx-canvas.png",
  appState: "/figma/Case_3/Section_1/app-state-v2.png",
  appGoals: "/figma/Case_3/Section_1/app-goals-v2.png"
};

const cvUrl = "https://drive.google.com/file/d/1jXFLR65AUPIRSsSU4JpdDGOdRiS_aMF4/view?usp=sharing";
const telegramUrl = "https://t.me/him9li9";
const camomileUrl = "https://t.me/cam0mile_bot";

const links = [
  { label: "CV", href: cvUrl },
  { label: "Telegram", href: telegramUrl }
];

type ProjectDetailsProps = {
  title: string;
  href: string;
  meta: string;
  description: string;
  note?: string;
  external?: boolean;
};

function ProjectDetails({ title, href, meta, description, note, external = false }: ProjectDetailsProps) {
  return (
    <div className="grid w-full gap-space-3 sm:grid-cols-2 sm:gap-0">
      <div className="flex min-w-0 flex-col items-start gap-[4px]">
        <Link
          href={href}
          prefetch={false}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={external ? "Открыть приложение Camomile" : "Открыть кейс " + title}
          className="group link-underline link-underline-arrow-24 inline-flex max-w-full items-end gap-[2px] focus-visible:outline-offset-4"
        >
          <h3 className="text-[28px] font-medium leading-[40px]">
            {title}
          </h3>
          <Image src={assets.arrowOutward} alt="" width={24} height={24} className="mb-[5px] h-6 w-6 shrink-0" />
        </Link>
        <p className="text-[16px] leading-[1.4] text-[#a0a0a0]">
          {meta.split(" · ").map((part, index) => (
            <span key={index}>
              {index > 0 ? <>{" "}<span className="text-[#d2d2d2]">·</span>{" "}</> : null}
              {part}
            </span>
          ))}
        </p>
      </div>
      <p className="text-[16px] leading-[1.4] text-primary">{description}{note ? <> <span className="text-[#a0a0a0]">{note}</span></> : null}</p>
    </div>
  );
}

function InlineLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group link-underline link-underline-arrow-16 inline-flex items-end gap-[2px] text-[16px] leading-[1.4]"
    >
      {children}
      <Image src={assets.arrowOutward} alt="" width={16} height={16} className="mb-[1px] h-4 w-4 shrink-0" />
    </a>
  );
}

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
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              CV
            </motion.a>
            <motion.a
              whileHover={canHover ? { backgroundColor: "var(--color-bg-elevated-hover)", scale: 1.05 } : undefined}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex items-center justify-center rounded-full bg-elevated px-space-4 py-space-2 text-body-16 text-primary"
              href={telegramUrl}
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
        className="mx-auto flex w-full max-w-[800px] flex-col gap-[140px] px-space-4 pt-[140px] sm:px-space-8 lg:px-0"
      >
        <motion.section
          variants={item}
          className="mx-auto flex w-full flex-col items-center gap-space-3 text-center"
        >
          <div className="flex flex-col items-center gap-space-8">
            <div className="relative h-[100px] w-[120px] overflow-hidden rounded-[100px]">
              <Image
                alt=""
                src={assets.avatar}
                width={120}
                height={100}
                sizes="120px"
                priority
                className="h-full w-full object-cover"
                quality={100}
              />
            </div>
            <h1 className="text-[40px] font-medium leading-[48px]">
              Настя Ермошина
            </h1>
          </div>
          <p className="w-full max-w-[480px] text-[16px] leading-[1.4] md:w-max md:max-w-none">
            <span className="md:block md:whitespace-nowrap">Продуктовый дизайнер с 4+ годами опыта в мобильных</span>{" "}
            <span className="md:block md:whitespace-nowrap">и B2B-продуктах. Разбираюсь в сложных сценариях и довожу</span>{" "}
            <span className="md:block md:whitespace-nowrap">решения до релиза. Использую AI для быстрых экспериментов,</span>{" "}
            <span className="md:block md:whitespace-nowrap">прототипирования и работы с кодом.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-space-4">
            <InlineLink href={cvUrl}>CV</InlineLink>
            <InlineLink href={telegramUrl}>Telegram</InlineLink>
          </div>
        </motion.section>

        <motion.section variants={{ hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }} className="flex w-full flex-col items-center gap-space-6">
          <h2 className="text-center text-[20px] font-medium leading-[28px]">Мои проекты</h2>
          <article className="flex w-full flex-col gap-space-6">
            <Link
              href="/app"
              prefetch={false}
              aria-label="Открыть кейс MCN Softphone"
              className="block w-full"
            >
              <div className="flex w-full items-center justify-center gap-space-4 overflow-hidden rounded-[12px] bg-[#1c1c1c] px-space-4 py-space-6 sm:h-[550px] sm:gap-space-8 sm:px-space-10 sm:py-space-8">
                <Image
                  alt="Экран тарифа и расходов MCN Softphone"
                  src={assets.softphoneHome}
                  width={900}
                  height={1840}
                  sizes="(max-width: 639px) calc((100vw - 64px) / 2), 238px"
                  className="h-auto w-[calc((100vw-64px)/2)] max-w-[238px] shrink-0 sm:w-[238px]"
                  priority
                  quality={100}
                />
                <video
                  src={assets.callFlowVideo}
                  aria-label="Анимация звонка и отображения стоимости в MCN Softphone"
                  className="aspect-[900/1840] w-[calc((100vw-64px)/2)] max-w-[238px] shrink-0 object-contain sm:w-[238px]"
                  style={{
                    clipPath: "inset(2% 4% 1.4% 4% round 17% 17% 25% 25% / 7% 7% 7% 7%)",
                    transform: "scale(1.03)"
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </Link>
            <ProjectDetails
              title="MCN Softphone"
              href="/app"
              meta="B2C · Mobile app · 2024 — н.в."
              description="Переработала регистрацию и активацию номера в приложении интернет-телефонии, сократив путь до первого звонка с 8 до 3 шагов и количество обращений в 2 раза."
            />
          </article>
        </motion.section>

        <motion.section variants={item} className="flex w-full flex-col gap-space-6">
          <article className="flex w-full flex-col gap-space-6">
            <Link
              href="/work"
              prefetch={false}
              aria-label="Открыть кейс KOMPaaS"
              className="block w-full"
            >
              <Image
                alt="Редактор сценариев KOMPaaS"
                src={assets.vpbxCanvas}
                width={2400}
                height={1500}
                sizes="(max-width: 831px) calc(100vw - 32px), 800px"
                className="h-auto w-full rounded-[8px] object-contain"
                quality={100}
              />
            </Link>
            <ProjectDetails
              title="KOMPaaS"
              href="/work"
              meta="B2B · Web service · 2023 — 2025"
              description="Спроектировала редактор для самостоятельной работы менеджеров со сценариями звонков, снизив количество ошибок на продакшене в 2,5 раза за первые 3 месяца после изменений."
            />
          </article>
        </motion.section>

        <motion.section variants={item} className="flex w-full flex-col items-center gap-space-6">
          <article className="flex w-full flex-col gap-space-6">
            <a
              href={camomileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть приложение Camomile"
              className="block w-full"
            >
              <div className="flex w-full items-center justify-center gap-space-4 overflow-hidden rounded-[12px] bg-[#1c1c1c] px-space-4 py-space-6 sm:h-[550px] sm:gap-space-8 sm:px-space-10 sm:py-space-8">
                <Image
                  alt="Экран баланса сфер жизни Camomile"
                  src={assets.appState}
                  width={900}
                  height={1840}
                  sizes="(max-width: 639px) calc((100vw - 64px) / 2), 238px"
                  className="h-auto w-[calc((100vw-64px)/2)] max-w-[238px] shrink-0 sm:w-[238px]"
                  quality={100}
                />
                <Image
                  alt="Экран целей Camomile"
                  src={assets.appGoals}
                  width={900}
                  height={1840}
                  sizes="(max-width: 639px) calc((100vw - 64px) / 2), 238px"
                  className="h-auto w-[calc((100vw-64px)/2)] max-w-[238px] shrink-0 sm:w-[238px]"
                  quality={100}
                />
              </div>
            </a>
            <ProjectDetails
              title="Camomile"
              href={camomileUrl}
              external
              meta="Pet-project · AI-first · 2026"
              description="Сделала Telegram mini app для отслеживания баланса сфер жизни, личных целей и сохранения важных моментов."
              note="[Кейс пока в разработке]"
            />
          </article>
        </motion.section>
      </motion.div>

      <footer className="mx-auto mt-[140px] flex w-full max-w-[800px] flex-col gap-space-2 px-space-4 pb-[70px] sm:px-space-8 lg:px-0">
        <h2 className="text-[20px] font-medium leading-[28px]">Связаться со мной</h2>
        <div className="h-px w-full bg-border-elevated" />
        <div className="flex w-full flex-col gap-space-4 sm:flex-row sm:items-start sm:justify-between">
          <nav aria-label="Контакты" className="flex flex-wrap items-center gap-space-4">
            {links.map((link) => (
              <InlineLink href={link.href} key={link.label}>{link.label}</InlineLink>
            ))}
          </nav>
          <p className="text-[16px] leading-[1.4] text-[#a0a0a0]">Nastya Ermoshina © 2026</p>
        </div>
      </footer>
    </main>
  );
}
