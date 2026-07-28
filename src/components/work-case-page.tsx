"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/Icons/heart.svg",
  hero: "/figma/Case_2/Section_1/vpbx-canvas.png",
  arrowForward: "/figma/Icons/arrow_forward.svg",
  oldCanvas: "/figma/Case_2/Section_2/old-canvas.png",
  addFlow: "/figma/Case_2/Section_2/flow.png?v=20260714c",
  table: "/figma/Case_2/Section_2/table.png",
  leftSidebar: "/figma/Case_2/Section_4/left_sidebar.png",
  rightSidebar: "/figma/Case_2/Section_4/right_sidebar.png",
  canvasMotion: "/figma/Case_2/Section_4/canvas.mp4",
  minimap: "/figma/Case_2/Section_4/minimap.png",
  publishMotion: "/figma/Case_2/Section_4/publish_motion.mp4"
};

const zoomImages = {
  hero: {
    alt: "KOMPaaS canvas",
    src: assets.hero,
    mediaType: "image",
    width: 2400,
    height: 1500,
    hasPanel: false
  },
  oldCanvas: {
    alt: "Current version of the flow editor",
    src: assets.oldCanvas,
    mediaType: "image",
    width: 2100,
    height: 1188,
    hasPanel: false
  },
  addFlow: {
    alt: "Element workflow",
    src: assets.addFlow,
    mediaType: "image",
    width: 2700,
    height: 1749,
    hasPanel: true
  },
  table: {
    alt: "Competitor analysis table",
    src: assets.table,
    mediaType: "image",
    width: 2400,
    height: 1371,
    hasPanel: false
  },
  leftSidebar: {
    alt: "Flow navigation and quick actions",
    src: assets.leftSidebar,
    mediaType: "image",
    width: 2400,
    height: 1200,
    hasPanel: false
  },
  rightSidebar: {
    alt: "Element library and right-panel settings",
    src: assets.rightSidebar,
    mediaType: "image",
    width: 2400,
    height: 1800,
    hasPanel: false
  },
  canvasMotion: {
    alt: "A user adds and configures a block while staying in context",
    src: assets.canvasMotion,
    mediaType: "video",
    hasPanel: false
  },
  minimap: {
    alt: "Minimap and navigation through a large diagram",
    src: assets.minimap,
    mediaType: "image",
    width: 2400,
    height: 1539,
    hasPanel: false
  },
  publishMotion: {
    alt: "After publishing, the status updates and the button becomes inactive",
    src: assets.publishMotion,
    mediaType: "video",
    hasPanel: false
  }
} as const;

function ZoomIcon({ floating = true }: { floating?: boolean }) {
  return (
    <span className={`${floating ? "pointer-events-none absolute bottom-space-3 right-space-3" : ""} flex h-10 w-10 items-center justify-center rounded-full bg-elevated-hover text-primary`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
    </span>
  );
}

function ZoomImageShade({ rounded = true }: { rounded?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 bg-primary/0 transition-colors duration-200 group-hover:bg-primary/20 ${
        rounded ? "rounded-[8px]" : ""
      }`}
    />
  );
}

export function WorkCasePage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [openImage, setOpenImage] = useState<keyof typeof zoomImages | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const activeZoomImage = openImage ? zoomImages[openImage] : null;

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

  useEffect(() => {
    if (!activeZoomImage) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenImage(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeZoomImage]);

  useEffect(() => {
    setZoomScale(1);
  }, [openImage]);

  const handleZoomOpen = (
    image: keyof typeof zoomImages,
    desktopEnabled = true
  ) => {
    if (!desktopEnabled && window.matchMedia("(min-width: 640px)").matches) {
      return;
    }
    setOpenImage(image);
  };

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
    <main className="overflow-x-hidden bg-primary text-primary">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="fixed top-0 z-10 h-[74px] w-full bg-primary/60 backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
      >
        <div className="flex h-full w-full items-center justify-between px-space-4 py-space-3 sm:px-space-8">
          <motion.div
            whileHover={canHover ? { scale: 1.05 } : undefined}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link href="/" className="font-oldenburg flex items-center gap-space-1 text-body-18">
              <span>nastya</span>
              <span>with</span>
              <img alt="" src={assets.heart} className="h-6 w-6" />
            </Link>
          </motion.div>
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
        className="flex w-full flex-col gap-[140px] px-space-4 pb-[40px] pt-[140px] sm:mx-auto sm:max-w-[800px] sm:px-0"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-6"
        >
          <div className="flex flex-col gap-space-5 text-primary">
            <div className="flex flex-col gap-space-1">
              <h1 className="text-h1">KOMPaaS</h1>
              <p className="text-body-16 text-secondary">
                Product Designer · 2023 — 2024
              </p>
            </div>
            <p className="text-body-18">
              A B2B platform for contact center automation. It is used by banks, clinics,
              educational products, and retailers—anywhere response speed and the quality of
              customer service are critical.
            </p>
            <p className="text-body-18">
              One of KOMPaaS&apos;s products is a block-based call flow builder for voice menus,
              surveys, and quality assessment. In the old version, managers did not understand the
              connections between blocks and were afraid to make changes without developers. I
              designed an editor where a flow can be built, changed, and prepared for publishing
              within a single workspace.
            </p>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
            <button
              type="button"
              className="group relative block w-full cursor-zoom-in"
              onClick={() => setOpenImage("hero")}
              aria-label="Enlarge the KOMPaaS canvas diagram"
            >
              <Image
                alt="KOMPaaS canvas"
                src={assets.hero}
                width={800}
                height={500}
                sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                className="h-auto w-full rounded-[8px] object-contain"
                priority
                quality={100}
              />
              <span className="sm:hidden">
                <ZoomImageShade />
              </span>
              <span className="sm:hidden">
                <ZoomIcon />
              </span>
            </button>
          </div>
        </motion.section>

        <motion.section
          variants={item}
          className="-mt-space-14 scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h3-stack">
            <h3 className="text-h3">Problem</h3>
            <p className="text-body-18">
              Any change to a flow required developer involvement and took hours or days. As a
              result, flows could not keep pace with process changes, while operating costs and
              the risk of production errors increased. This was especially critical for clients
              with SLAs, where delays and errors could directly affect service quality.
            </p>
          </div>

          <div className="case-h3-stack">
            <h3 className="text-h3">Objective</h3>
            <p className="text-body-18">
              The goal was to remove clients&apos; dependence on developers and turn call flow
              management from a technical task into an accessible business tool.
            </p>
            <p className="text-body-18">
              <span className="text-body-18-semibold">Success metrics</span>
              {` — a higher share of self-service flows, reduced development and support workloads, and a shorter time-to-change with minimal errors.`}
            </p>
          </div>
        </motion.section>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Discovery</h2>
            <div className="case-text-list-stack text-body-18">
              <p>During discovery, I studied how users worked with flows in the current product:</p>
              <ul className="list-disc space-y-0 pl-space-6">
                <li>analyzed real-world flows and screen logic</li>
                <li>reviewed support requests, errors, and common questions</li>
                <li>compared approaches used by workflow builders</li>
                <li>discussed the problems with support and development</li>
              </ul>
            </div>
          </div>

          <div className="case-h3-stack">
            <h3 className="text-h3">Current version analysis</h3>
            <p className="text-body-18">
              Before proposing changes, I gathered support-team feedback on how users worked
              with&nbsp;flows and identified several problem areas:
            </p>
          </div>

          <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
            <div className="mx-auto w-full max-w-[800px]">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in"
                onClick={() => setOpenImage("oldCanvas")}
                aria-label="Enlarge the current version of the flow editor"
              >
                <Image
                  alt="Current version of the flow editor"
                  src={assets.oldCanvas}
                  width={800}
                  height={453}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full rounded-[8px] object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade />
                </span>
                <span className="absolute bottom-space-3 right-space-3 sm:hidden">
                  <ZoomIcon floating={false} />
                </span>
              </button>
            </div>
            <p className="w-full text-center text-caption-14 text-secondary">
              Current editor: 1.&nbsp;flows&nbsp; 2.&nbsp;settings&nbsp; 3.&nbsp;elements&nbsp; 4.&nbsp;canvas
            </p>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">1.&nbsp;Flow management was cumbersome</p>
            <p className="text-body-18">
              The flow list in the sidebar had limited height and lacked search and grouping.
            </p>
            <p className="text-body-18-italic">
              → Users spent too long finding the right flow and could not tell which ones were
              safe to edit and which were already in use.
            </p>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">2.&nbsp;Configuration was split across screens</p>
            <p className="text-body-18">
              Creating, configuring, and adding an element to the canvas happened in different places.
            </p>
            <p className="text-body-18-italic">
              → This caused users to lose context and made it unclear how an individual block
              affected the flow as a whole.
            </p>
          </div>

          <div className="relative left-1/2 flex w-screen max-w-[1000px] -translate-x-1/2 flex-col items-center bg-secondary p-space-4 sm:w-[calc(100vw-32px)] sm:rounded-[12px] sm:p-space-6">
            <div className="mx-auto w-full max-w-[800px]">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in"
                onClick={() => setOpenImage("addFlow")}
                aria-label="Enlarge the element workflow"
              >
                <Image
                  alt="Element workflow"
                  src={assets.addFlow}
                  width={2700}
                  height={1749}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <ZoomImageShade rounded={false} />
              </button>
            </div>
            <button
              type="button"
              className="group absolute bottom-space-6 right-space-6 cursor-zoom-in"
              onClick={() => setOpenImage("addFlow")}
              aria-label="Enlarge the element workflow"
            >
              <ZoomIcon floating={false} />
            </button>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">3.&nbsp;Problems with the element library</p>
            <p className="text-body-18">
              Elements were not grouped by use case, and their names did not always reflect their behavior.
            </p>
            <p className="text-body-18-italic">
              → Users selected elements through trial and error, often adding unnecessary ones
              that went unused and cluttered the diagram.
            </p>
          </div>

          <div className="case-point-stack">
            <p className="text-body-18-semibold">4.&nbsp;Flows did not scale</p>
            <p className="text-body-18">
              As diagrams grew, connections crossed, branches overlapped, and the main flow became
              difficult to distinguish from secondary ones.
            </p>
            <p className="text-body-18-italic">
              → It was difficult to grasp the logic quickly or make changes without risking the structure.
            </p>
          </div>

          <p className="text-body-18">
            As a result, users did not perceive the flow as a unified system and avoided making
            changes independently: without testing and explicit publishing, it was unclear when
            edits would affect real calls.
          </p>

          <div className="case-h3-stack">
            <h3 className="text-h3">Competitor analysis</h3>
            <p className="text-body-18">
              To understand how to simplify the builder, I studied direct competitors and adjacent
              solutions. I compared approaches to flow visualization, editing, complex logic,
              and publishing.
            </p>
          </div>

          <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
            <button
              type="button"
              className="group relative block w-full cursor-zoom-in sm:cursor-default"
              onClick={() => handleZoomOpen("table", false)}
              aria-label="Enlarge the competitor analysis table"
            >
              <Image
                alt="Competitor analysis table"
                src={assets.table}
                width={800}
                height={457}
                sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
                quality={100}
              />
              <span className="sm:hidden">
                <ZoomImageShade rounded={false} />
              </span>
              <span className="sm:hidden">
                <ZoomIcon />
              </span>
            </button>
          </div>

          <p className="text-body-18">
            Conclusion: workflow builders are moving away from separate settings toward managing
            the process as a unified system, because users need to understand a flow&apos;s status
            and control changes before they go live.
          </p>

          <div className="case-media-stack w-full max-w-[800px]">
            <div className="case-text-stack">
              <div className="case-h3-stack">
                <h3 className="text-h3">Hypotheses</h3>
                <p className="text-body-18">
                  Based on the analysis, I identified areas that could affect the key metrics:
                </p>
              </div>
              <div className="flex flex-col gap-space-6 text-body-18">
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">1.&nbsp;Flow organization</p>
                <p>
                  If flows become more structured, users will find the right one more easily
                  and make changes faster.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">2.&nbsp;Unified context</p>
                <p>
                  If flow management happens in one context, errors and the support workload will
                  decrease because changes will become more predictable.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">3.&nbsp;Clear entities</p>
                <p>
                  If elements are named and grouped by user task, the learning curve and
                  time-to-change will decrease.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">4.&nbsp;Readability</p>
                <p>
                  If a flow remains clear as it grows, users will find it easier to perceive it
                  as a unified system and edit it faster.
                </p>
              </div>
              <div className="flex flex-col gap-space-2">
                <p className="text-body-18-semibold">5.&nbsp;Safe changes</p>
                <p>
                  If users understand that changes can be checked before publishing, dependence
                  on developers will decrease and the self-service rate will grow.
                </p>
              </div>
              </div>
            </div>
            <p className="text-body-18">
              The hypotheses helped define the main areas of work, but they could be refined and
              adjusted as we tested them against real-world scenarios.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="design"
          data-section-anchor="design"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Design approach</h2>
            <p className="text-body-18">
              The design was built around three key principles:
            </p>
          </div>

          <div className="flex flex-col gap-space-3 md:grid md:grid-cols-3">
            <div className="flex flex-col items-start gap-space-4 rounded-[20px] bg-card p-space-6 md:min-w-0">
              <div className="flex h-[38px] w-full items-center gap-space-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated-accent text-h4 text-primary">
                  1
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <p className="text-body-18-semibold text-primary">Understand</p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#828282]">Understand the flow</p>
                </div>
              </div>
              <p className="w-full text-[14px] leading-[160%] text-primary">
                Quickly grasp the flow&apos;s structure and understand how it works.
              </p>
              <div className="flex w-full flex-col gap-space-1 text-[14px] leading-[160%] text-primary">
                <p>• Elements grouping</p>
                <p>• Clear names</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-space-4 rounded-[20px] bg-card p-space-6 md:min-w-0">
              <div className="flex h-[38px] w-full items-center gap-space-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated-accent text-h4 text-primary">
                  2
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <p className="text-body-18-semibold text-primary">Edit</p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#828282]">Make changes</p>
                </div>
              </div>
              <p className="w-full text-[14px] leading-[160%] text-primary">
                Make changes without unnecessary navigation or loss of context.
              </p>
              <div className="flex w-full flex-col gap-space-1 text-[14px] leading-[160%] text-primary">
                <p>• Elements creation and setup</p>
                <p>• Inline editing</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-space-4 rounded-[20px] bg-card p-space-6 md:min-w-0">
              <div className="flex h-[38px] w-full items-center gap-space-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-elevated-accent text-h4 text-primary">
                  3
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0">
                  <p className="text-body-18-semibold text-primary">Publish</p>
                  <p className="text-[14px] font-normal leading-[17px] text-[#828282]">Publish</p>
                </div>
              </div>
              <p className="w-full text-[14px] leading-[160%] text-primary">
                Understand which changes are already affecting calls.
              </p>
              <div className="flex w-full flex-col gap-space-1 text-[14px] leading-[160%] text-primary">
                <div>
                  <p>• Flow statuses</p>
                  <p>(draft / published)</p>
                </div>
                <p>• Publishing changes</p>
              </div>
            </div>
          </div>

          <div className="case-content-stack">
            <p className="text-body-18">
              The final solution needed to make it clear when a flow was published and which
              changes were already affecting real calls.
            </p>

            <div className="case-h3-stack">
              <h3 className="text-h3">Before</h3>
              <p className="text-body-18">
                Creates a flow →{" "}
                <span className="line-through">Opens Settings</span> →{" "}
                <span className="line-through">Creates an element</span> → Configures it →{" "}
                <span className="line-through">Returns to the flow</span> → Adds the
                element to the diagram
              </p>
              <p className="text-body-18-italic">
                Actions are split across screens, and changes immediately affect the live flow.
              </p>
            </div>

            <div className="case-h3-stack">
              <h3 className="text-h3">After</h3>
              <div>
                <p className="text-body-18">
                  Creates a flow → Adds and configures elements on the diagram → Publishes changes
                </p>
              </div>
              <p className="text-body-18-italic">
                Work happens in one context, while publishing becomes a separate, deliberate action.
              </p>
            </div>

            <p className="text-body-18">
              <span className="text-body-18-semibold">Users no longer lose context</span>
              {` — creating, configuring, and publishing a flow all happen on one screen. This systematically addressed both comprehension issues and the fear of errors, enabling managers to work independently.`}
            </p>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-space-16 case-section-stack"
        >
          <div className="case-h2-stack">
            <h2 className="text-h2">Solution</h2>
            <p className="text-body-18">
              While working on the editor, I tested how well managers understood the flow structure,
              whether they could make changes independently, and whether they felt confident
              publishing updates. After each iteration, I discussed ambiguous areas with the team
              to keep the solution clear and feasible.
            </p>
          </div>

          <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
            <div className="mx-auto w-full max-w-[800px]">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in"
                onClick={() => setOpenImage("hero")}
                aria-label="Enlarge the unified workspace diagram"
              >
                <Image
                  alt="KOMPaaS solution overview"
                  src={assets.hero}
                  width={800}
                  height={500}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full rounded-[8px] object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
            <p className="text-center text-caption-14 text-secondary">
              Flows, canvas, elements, and publishing in&nbsp;one workspace
            </p>
          </div>

          <div className="case-numbered-points">
          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">1.&nbsp;Organize flows</p>
              <p>
                I retained the familiar list model and improved flow navigation by adding
                project grouping, search, statuses, and quick actions.
              </p>
              <p className="italic">
                → Users find the right flow faster and understand its current status.
              </p>
            </div>

            <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("leftSidebar", false)}
                aria-label="Enlarge flow navigation and quick actions"
              >
                <Image
                  alt="Flow navigation and quick actions"
                  src={assets.leftSidebar}
                  width={800}
                  height={400}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade rounded={false} />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
          </div>

          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">2.&nbsp;Make elements clearer</p>
              <p>
                During testing, users often selected elements by name and did not always understand
                the difference between them. To address this, I conducted a card sort, grouped
                elements by use case, and added descriptions explaining each block&apos;s behavior.
              </p>
              <p className="italic">
                → Users found it easier to select the right element and add it to the diagram.
              </p>
            </div>

            <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("rightSidebar", false)}
                aria-label="Enlarge the element library and right-panel settings"
              >
                <Image
                  alt="Element library and right-panel settings"
                  src={assets.rightSidebar}
                  width={800}
                  height={600}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade rounded={false} />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-space-6">
          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">3.&nbsp;Restore user context</p>
              <p>
                I moved block creation and configuration directly onto the canvas so users could
                add elements to the diagram, edit them, and immediately see how changes affected
                the flow.
              </p>
              <p>
                We retained modal windows for complex settings, balancing editing speed with more
                precise element configuration when it was genuinely needed.
              </p>
              <p className="italic">
                → This reduced navigation between screens and turned element management into a
                unified process.
              </p>
            </div>

            <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
              <div className="mx-auto w-full max-w-[800px]">
                <button
                  type="button"
                  className="group relative block w-full cursor-zoom-in sm:cursor-default"
                  onClick={() => handleZoomOpen("canvasMotion", false)}
                  aria-label="Enlarge the block addition and configuration animation"
                >
                  <video
                    src={assets.canvasMotion}
                    className="h-auto w-full rounded-[8px] object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label="A user adds and configures a block while staying in context"
                  />
                  <span className="sm:hidden">
                    <ZoomImageShade />
                  </span>
                  <span className="sm:hidden">
                    <ZoomIcon />
                  </span>
                </button>
              </div>
              <p className="text-center text-caption-14 text-secondary">
                A user adds and configures a block while staying in context.
              </p>
            </div>
          </div>

          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">4.&nbsp;Make large flows readable</p>
              <p>
                To make large flows easier to read, I simplified secondary branches and added
                connection highlighting, a minimap, and a diagram navigation panel.
              </p>
              <p className="italic">
                → Users could navigate the flow structure more easily, distinguish the main flow
                from secondary branches, and understand which areas a change would affect.
              </p>
            </div>

            <div className="relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("minimap", false)}
                aria-label="Enlarge the minimap and large-diagram navigation"
              >
                <Image
                  alt="Minimap and navigation through a large diagram"
                  src={assets.minimap}
                  width={800}
                  height={513}
                  sizes="(max-width: 932px) calc(100vw - 32px), 800px"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                  quality={100}
                />
                <span className="sm:hidden">
                  <ZoomImageShade rounded={false} />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
            </div>
          </div>
          </div>

          <div className="case-content-stack case-numbered-media-point">
            <div className="case-point-stack text-body-18">
              <p className="text-body-18-semibold">5.&nbsp;Make publishing predictable</p>
              <p>
                Previously, managers did not always understand which changes were already affecting
                real calls and which were still in progress. I therefore added flow statuses
                (draft / published) and made publishing a separate action.
              </p>
              <p className="italic">
                → Users can see whether a flow is a draft or already published and understand when
                changes will go live.
              </p>
            </div>

            <div className="flex flex-col gap-space-6">
            <div className="case-figure-stack relative left-1/2 w-[calc(100vw-32px)] max-w-[800px] -translate-x-1/2 items-center">
              <button
                type="button"
                className="group relative block w-full cursor-zoom-in sm:cursor-default"
                onClick={() => handleZoomOpen("publishMotion", false)}
                aria-label="Enlarge the flow publishing animation"
              >
                <video
                  src={assets.publishMotion}
                  className="aspect-[2278/1068] w-full rounded-[8px] object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="After publishing, the status updates and the button becomes inactive"
                />
                <span className="sm:hidden">
                  <ZoomImageShade />
                </span>
                <span className="sm:hidden">
                  <ZoomIcon />
                </span>
              </button>
              <p className="text-center text-caption-14 text-secondary">
                After publishing, the status updates and the button becomes inactive.
              </p>
            </div>

            <p className="text-body-18">
              Full testing and version history were moved to the next stage. After validating
              editing and publishing with client cases, I prepared the final designs and
              specifications for developer handoff.
            </p>
            </div>
          </div>
          </div>
        </motion.section>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-space-16 case-h2-stack"
        >
          <h2 className="text-h2">Results</h2>
          <div className="case-content-stack">
            <p className="text-body-18">
              The editor made flow management more independent and predictable: managers found the
              right flows faster, made changes without developers, and better understood when edits
              would go live. We assessed the impact through client scenarios, support requests,
              and the time required for typical changes.
            </p>

            <div className="grid grid-cols-1 gap-space-3 min-[440px]:grid-cols-2 lg:grid-cols-[repeat(4,1fr)]">
              <div className="flex min-h-[94px] w-full flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[18px] leading-[160%]">+</span>
                  <span className="text-[32px] leading-10">28</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  self-service rate
                </p>
              </div>
              <div className="flex min-h-[94px] w-full flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3">
                <div className="flex items-center gap-0 whitespace-nowrap text-primary">
                  <span className="text-[32px] font-semibold leading-10">33</span>
                  <span className="inline-flex">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="text-[32px] font-semibold leading-10">19</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  minutes, time-to-change
                </p>
              </div>
              <div className="flex min-h-[94px] w-full flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[18px] leading-[160%]">-</span>
                  <span className="text-[32px] leading-10">21</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  errors in flows
                </p>
              </div>
              <div className="flex min-h-[94px] w-full flex-col items-start gap-space-2 rounded-[12px] bg-card px-space-3 py-space-3">
                <p className="whitespace-nowrap text-[0px] font-semibold leading-none text-primary">
                  <span className="text-[18px] leading-[160%]">-</span>
                  <span className="text-[32px] leading-10">16</span>
                  <span className="text-[18px] leading-[160%]">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary">
                  support requests
                </p>
              </div>
            </div>

            <p className="text-body-18">
              This project showed me that complex flows become manageable when users remain in
              context and understand how their actions affect the live flow.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Page navigation"
          className="-mt-[88px] flex w-full items-start justify-between border-t border-border-elevated pt-space-2 text-body-18 sm:mt-0"
        >
          <Link href="/" className="group shrink-0">
            <span className="link-underline">
              ← Home
            </span>
          </Link>
          <Link href="/app" className="group shrink-0">
            <span className="link-underline">
              MCN Softphone case study →
            </span>
          </Link>
        </motion.nav>
      </motion.div>

      <nav className="pointer-events-none fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-space-3 lg:flex">
        {[
          { id: "overview", label: "About the project" },
          { id: "discovery", label: "Discovery" },
          { id: "design", label: "Design approach" },
          { id: "solution", label: "Solution" },
          { id: "results", label: "Results" },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group pointer-events-auto flex items-center justify-end gap-space-3 text-right"
            onClick={(event) => handleSectionNavClick(event, item.id)}
          >
            <span className="pointer-events-none max-w-[160px] rounded-full bg-elevated-hover px-space-3 py-space-1 text-caption-14 text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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

      {activeZoomImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary px-space-4 py-space-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeZoomImage.alt}
          onClick={() => setOpenImage(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-space-4 top-space-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
            onClick={(event) => {
              event.stopPropagation();
              setOpenImage(null);
            }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div
            className={`relative flex max-h-full w-full max-w-[1100px] items-start justify-start overflow-auto rounded-[12px] sm:items-center sm:justify-center ${
              activeZoomImage.hasPanel ? "bg-secondary p-space-4 sm:p-space-6" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {activeZoomImage.mediaType === "video" ? (
              <video
                src={activeZoomImage.src}
                className="relative h-[var(--zoom-image-height)] w-auto max-w-none object-contain sm:h-auto sm:max-h-[calc(100vh-64px)] sm:w-full"
                style={{
                  "--zoom-image-height": `calc(${zoomScale * 100}vh - ${96 * zoomScale}px)`
                } as React.CSSProperties}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                alt={activeZoomImage.alt}
                src={activeZoomImage.src}
                width={activeZoomImage.width}
                height={activeZoomImage.height}
                sizes="100vw"
                className="relative h-[var(--zoom-image-height)] w-auto max-w-none object-contain sm:h-auto sm:max-h-[calc(100vh-64px)] sm:w-full"
                style={{
                  "--zoom-image-height": `calc(${zoomScale * 100}vh - ${96 * zoomScale}px)`
                } as React.CSSProperties}
                quality={100}
              />
            )}
          </div>
          <div className="absolute bottom-space-4 right-space-4 z-10 flex gap-space-2 sm:hidden">
            <button
              type="button"
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
              onClick={(event) => {
                event.stopPropagation();
                setZoomScale((value) => Math.max(0.3, Math.round((value - 0.25) * 100) / 100));
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-primary transition-colors duration-200 hover:bg-elevated-hover"
              onClick={(event) => {
                event.stopPropagation();
                setZoomScale((value) => Math.min(2, Math.round((value + 0.25) * 100) / 100));
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M12 6v12M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
