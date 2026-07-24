"use client";

import { cubicBezier, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/heart.svg",
  hero: "/figma/Case_2/vpbx-canvas.png",
  arrowForward: "/figma/Main/arrow_forward.svg",
  oldCanvas: "/figma/Case_2/old-canvas.png",
  addFlow: "/figma/Case_2/add-flow.png?v=2",
  table: "/figma/Case_2/table.png?v=2",
  oldSidebar: "/figma/Case_2/old-sidebar.png",
  newSidebar: "/figma/Case_2/new-sidebar.png",
  library: "/figma/Case_2/library.png",
  element: "/figma/Case_2/element.png",
  dialog: "/figma/Case_2/dialog.png",
  map: "/figma/Case_2/map.png",
  publish: "/figma/Case_2/public.png"
};

const workStages = ["Discovery", "Hypotheses", "Design approach", "Testing", "Developer handoff"];

export function WorkCasePage() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

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
    <main className="bg-primary text-primary">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={hideTopbar ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
        className="sticky top-0 z-10 h-[74px] w-full bg-primary/60 backdrop-blur-[4px] [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
      >
        <div className="flex h-full w-full items-center justify-between px-space-4 py-space-3 sm:px-space-8">
          <Link href="/" className="font-oldenburg flex items-center gap-space-1 text-body-18">
            <span>nastya</span>
            <span>with</span>
            <img alt="" src={assets.heart} className="h-6 w-6" />
          </Link>
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
        className="flex w-full flex-col gap-[120px] px-space-4 pb-space-16 pt-space-16 sm:mx-auto sm:max-w-[800px] sm:px-0 sm:pb-space-16"
      >
        <motion.section
          id="overview"
          data-section-anchor="overview"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-3 text-primary">
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
          </div>

          <Image
            alt="KOMPaaS canvas"
            src={assets.hero}
            width={800}
            height={500}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full rounded-[8px] object-contain"
            priority
          quality={100}
          />
        </motion.section>

        <motion.section
          id="about"
          data-section-anchor="about"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">About the project</h2>
            <p className="text-body-18">
              One of the platform&apos;s products is a call flow builder for configuring voice menus,
              surveys, and quality assessments. Clients called it a “black box” because the logic
              of interacting with blocks and transitions was unclear. For this project, I designed
              a new approach to flow management that was clearer and safer for business users.
            </p>
          </div>

          <div className="h-px w-full bg-border-elevated" />

          <div className="flex flex-col gap-space-2">
            <h3 className="text-h3">Problem</h3>
            <p className="text-body-18">
              Any change to a call flow required developer involvement, took hours or days,
              and increased the risk of production errors. This directly affected the business:
            </p>
            <ul className="list-disc space-y-0 pl-space-6 text-body-18">
              <li>
                <span className="text-body-18-semibold">Longer time-to-change</span>
                {` — flows became outdated faster than they could be implemented.`}
              </li>
              <li>
                <span className="text-body-18-semibold">Higher operating costs</span>
                {` — every update required development resources.`}
              </li>
              <li>
                <span className="text-body-18-semibold">Risk of losing customer loyalty</span>
                {` — major clients could not respond quickly to changes in their processes.`}
              </li>
            </ul>
            <p className="text-body-18">
              This created a risk of breaching SLAs, where response speed and availability are critical.
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
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

          <div className="flex flex-col gap-space-3">
            <h3 className="text-h3">Project stages</h3>
            <div className="flex flex-wrap items-center gap-space-1">
              {workStages.map((stage, index) => (
                <div key={stage} className="flex items-center gap-space-1">
                  <span className="rounded-full bg-elevated px-space-3 py-space-1 text-body-16 text-secondary-elevated">
                    {stage}
                  </span>
                  {index < workStages.length - 1 ? (
                    <Image alt="" src={assets.arrowForward} width={16} height={16} className="h-4 w-4 brightness-0 invert-[51%]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="discovery"
          data-section-anchor="discovery"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">Discovery</h2>
            <div className="text-body-18">
              <p>During discovery, I studied how users worked with flows in the current product:</p>
              <ul className="list-disc space-y-0 pl-space-6">
                <li>analyzed real-world flows and screen logic</li>
                <li>reviewed support requests, errors, and common questions</li>
                <li>compared approaches used by workflow builders</li>
                <li>discussed the problems with support and development</li>
              </ul>
            </div>
          </div>

          <div className="h-px w-full bg-border-elevated" />

          <div className="flex flex-col gap-space-4">
            <h3 className="text-h3">Current version analysis</h3>
            <p className="text-body-18">
              Before proposing changes, I analyzed how users worked with flows. Together with the
              support team, I gathered feedback and identified the key problem areas:
            </p>
          </div>

          <div className="h-[490px] bg-elevated px-space-6 pt-space-10 pb-space-8">
            <div className="mx-auto flex h-full max-w-[700px] flex-col justify-between">
              <Image
                alt="Current version of the flow editor"
                src={assets.oldCanvas}
                width={700}
                height={396}
                sizes="(max-width: 800px) calc(100vw - 80px), 700px"
                className="h-auto w-full rounded-[8px] object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="text-center text-caption-14 text-secondary-elevated">
                1 — flows, 2 — settings, 3 — elements, 4 — canvas with blocks and transitions
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">1. Flow management was cumbersome</p>
            <p className="text-body-18">
              The flow list in the sidebar had limited height and lacked search and grouping.
            </p>
            <p className="text-body-18-italic">
              → Users spent too long finding the right flow and could not tell which ones were
              safe to edit and which were already in use.
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">2–3. Disconnect between the diagram and settings</p>
            <ul className="list-disc space-y-0 pl-space-6 text-body-18">
              <li>creating, configuring, and adding an element to the diagram were split across screens.</li>
              <li>list elements were not grouped, and their names did not always reflect their behavior.</li>
            </ul>
            <p className="text-body-18-italic">
              → Users could not determine which block they needed and often added unnecessary
              blocks that went unused and cluttered the diagram.
            </p>
          </div>

          <Image
            alt="Flow for adding an element"
            src={assets.addFlow}
            width={800}
            height={505}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full object-contain"
            loading="lazy"
          quality={100}
          />

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">4. Flows became difficult to read</p>
            <ul className="list-disc space-y-0 pl-space-6 text-body-18">
              <li>lines crossed and overlapped</li>
              <li>the main flow was difficult to distinguish from secondary branches</li>
            </ul>
            <p className="text-body-18-italic">
              → Users did not perceive the flow as a unified system or understand how local changes
              affected the overall logic.
            </p>
          </div>

          <div className="flex flex-col gap-space-2">
            <p className="text-body-18-semibold">5. Production errors</p>
            <p className="text-body-18">
              During interviews, managers often said they were afraid to change flows because they
              did not understand how changes would affect the live flow. Changes could not be safely
              tested before publishing, so errors were discovered only in production.
            </p>
            <p className="text-body-18-italic">
              → As a result, users preferred not to edit flows without developer involvement.
            </p>
          </div>

          <p className="text-body-18">
            As flows grew, the editor became difficult to understand and manage. Users struggled
            to navigate the structure and control changes, increasing both errors and dependence
            on support and development.
          </p>

          <div className="flex flex-col gap-space-4">
            <h3 className="text-h3">Competitor analysis</h3>
            <p className="text-body-18">
              To determine how the builder should evolve, I studied direct competitors (Quo and
              Twilio) and adjacent solutions (Intercom and n8n). I compared approaches to flow
              visualization, editing, logic, and testing. The results are shown in the table:
            </p>
          </div>

          <Image
            alt="Competitor analysis table"
            src={assets.table}
            width={800}
            height={457}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full object-contain"
            loading="lazy"
          quality={100}
          />

          <p className="text-body-18">
            During the research, I noticed that workflow builders were moving away from separate
            settings toward managing the process as a unified system, because users need to see
            connections between blocks and understand how the entire flow works.
          </p>

          <div className="h-px w-full bg-border-elevated" />

          <div className="flex w-full max-w-[800px] flex-col gap-space-6">
            <div className="flex flex-col gap-space-4">
              <h3 className="text-h3">Hypotheses</h3>
              <p className="text-body-18">
                Based on the analysis, I formulated hypotheses tied to the product&apos;s key metrics.
              </p>
            </div>
            <div className="flex flex-col gap-space-2 sm:flex-row sm:flex-wrap">
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:h-[240px] sm:w-[261px]">
                <p className="text-body-16-semibold">1. Flow organization</p>
                <p className="text-body-16 text-secondary-elevated">
                  Search, grouping, and statuses should help users find the right flows faster
                  and switch between them.
                </p>
                <p className="text-body-16">
                  <span className="text-caption-14-semibold">Metric: </span>time-to-change
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[262px]">
                <p className="text-body-16-semibold">2. Unified context</p>
                <p className="text-body-16 text-secondary-elevated">
                  If the diagram and settings share one workspace, users will lose less context
                  and make fewer mistakes when changing flows.
                </p>
                <p className="text-body-16">
                  <span className="text-caption-14-semibold">Metric: </span>errors after publishing
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[261px]">
                <p className="text-body-16-semibold">3. Clear entities</p>
                <p className="text-body-16 text-secondary-elevated">
                  Describing elements by their behavior should help users understand which block
                  they need and how it will affect the flow.
                </p>
                <p className="text-body-16">
                  <span className="text-caption-14-semibold">Metric: </span>time-to-change, support requests
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[395px]">
                <p className="text-body-16-semibold">4. Readability</p>
                <p className="text-body-16 text-secondary-elevated">
                  Visual hierarchy, zooming, and a minimap should help users understand a flow&apos;s
                  structure even as the diagram grows.
                </p>
                <p className="text-body-16">
                  <span className="text-caption-14-semibold">Metric: </span>time-to-change
                </p>
              </div>
              <div className="flex w-full flex-col gap-space-2 rounded-[20px] bg-elevated px-space-6 pb-space-6 pt-space-5 sm:w-[395px]">
                <p className="text-body-16-semibold">5. Safe changes</p>
                <p className="text-body-16 text-secondary-elevated">
                  Statuses, validation, and publishing should reduce the fear of breaking a live
                  flow and enable more frequent changes without developer involvement.
                </p>
                <p className="text-body-16">
                  <span className="text-caption-14-semibold">Metric: </span>self-service rate, number of errors
                </p>
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
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">Design approach</h2>
            <p className="text-body-18">
              The design was built around three key principles:
            </p>
          </div>

          <div className="flex flex-col gap-space-2 md:grid md:grid-cols-3 md:gap-space-2">
            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-space-4 rounded-[20px] bg-elevated py-space-6 pl-space-6 pr-space-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-space-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated-accent text-body-18-semibold text-primary">
                  1
                </div>
                <div className="flex min-w-0 flex-col gap-space-0-5">
                  <p className="text-body-16-semibold text-primary">Understand</p>
                  <p className="text-caption-14 text-secondary-elevated">Understand the flow</p>
                </div>
              </div>
              <p className="text-caption-14 text-primary">
                Users should quickly grasp the flow&apos;s structure and understand how it works.
              </p>
              <div className="flex h-[118px] flex-col gap-space-1 text-caption-14 text-primary">
                <p>• Visual hierarchy</p>
                <p>• Grouping and clear block names</p>
                <p>• Creating or selecting ready-made diagram elements</p>
              </div>
            </div>

            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-space-4 rounded-[20px] bg-elevated py-space-6 pl-space-6 pr-space-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-space-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated-accent text-body-18-semibold text-primary">
                  2
                </div>
                <div className="flex min-w-0 flex-col gap-space-0-5">
                  <p className="text-body-16-semibold text-primary">Edit</p>
                  <p className="text-caption-14 text-secondary-elevated">Make changes</p>
                </div>
              </div>
              <p className="text-caption-14 text-primary">
                Changes should be made directly in the flow, without unnecessary navigation or
                loss of context.
              </p>
              <div className="flex h-[118px] flex-col gap-space-1 text-caption-14 text-primary">
                <p>• Inline block editing</p>
                <p>• Unified context for the diagram and settings</p>
                <p>• Bulk operations with blocks and transitions</p>
              </div>
            </div>

            <div className="grid h-[300px] grid-rows-[38px_66px_118px] content-start gap-space-4 rounded-[20px] bg-elevated py-space-6 pl-space-6 pr-space-5 md:w-full md:min-w-0">
              <div className="flex items-center gap-space-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated-accent text-body-18-semibold text-primary">
                  3
                </div>
                <div className="flex min-w-0 flex-col gap-space-0-5">
                  <p className="text-body-16-semibold text-primary">Validate</p>
                  <p className="text-caption-14 text-secondary-elevated">Validate</p>
                </div>
              </div>
              <p className="text-caption-14 text-primary">
                Users should be able to confirm that changes work without errors.
              </p>
              <div className="flex h-[118px] flex-col gap-space-1 text-caption-14 text-primary">
                <p>• Flow statuses (draft / published)</p>
                <p>• Testing before publishing</p>
                <p>• Version history with rollback</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <p className="text-body-18">
              <span className="text-body-18-semibold">Users no longer lose context</span>
              {` — creating, configuring, and testing a flow all happen on one screen. This addressed comprehension issues and the fear of errors, enabling managers to work independently.`}
            </p>

            <div className="flex flex-col gap-space-1">
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

            <div className="flex flex-col gap-space-1">
              <h3 className="text-h3">After</h3>
              <p className="text-body-18">
                Creates a flow → Adds an element to the diagram → Configures it → Tests it
              </p>
              <p className="text-body-18-italic">
                Work happens in one context, while publishing becomes a separate, deliberate action.
              </p>
            </div>

            <p className="text-body-18">
              The final solution needed to make it clear when a flow was published and which
              changes were already affecting real calls.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="solution"
          data-section-anchor="solution"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-8"
        >
          <div className="flex flex-col gap-space-4">
            <h2 className="text-h2">Solution</h2>
            <p className="text-body-18">
              I developed the editor iteratively, testing flows with managers and real client
              cases and discussing the results with development. This allowed us to refine the
              solutions gradually and adapt them to real-world use.
            </p>
          </div>

          <Image
            alt="KOMPaaS solution overview"
            src={assets.hero}
            width={800}
            height={500}
            sizes="(max-width: 800px) calc(100vw - 32px), 800px"
            className="h-auto w-full object-contain"
            loading="lazy"
          quality={100}
          />

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">1. Organize flows</p>
              <p>
                I kept the familiar system simple, adding only flow grouping and search and
                consolidating flow actions in a context menu.
              </p>
              <p className="italic">
                → This simplified navigation and made working with flows more predictable.
              </p>
            </div>

            <div className="bg-elevated px-space-6 py-space-8">
              <div className="grid gap-space-8 sm:grid-cols-2">
                <div className="flex flex-col gap-space-3">
                  <Image
                    alt="Old sidebar"
                    src={assets.oldSidebar}
                    width={330}
                    height={236}
                    sizes="(max-width: 640px) calc(100vw - 80px), 330px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  quality={100}
                  />
                  <p className="text-center text-caption-14 text-secondary-elevated">Before</p>
                </div>
                <div className="flex flex-col gap-space-3">
                  <Image
                    alt="New sidebar"
                    src={assets.newSidebar}
                    width={330}
                    height={236}
                    sizes="(max-width: 640px) calc(100vw - 80px), 330px"
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  quality={100}
                  />
                  <p className="text-center text-caption-14 text-secondary-elevated">After</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">2. Make elements clearer</p>
              <p>
                During testing, users often selected elements by name and did not always understand
                the difference between them. To separate them by use case, I conducted a card sort,
                then grouped the elements and added clearer descriptions based on the results.
              </p>
              <p className="italic">
                → Users found the right elements faster, reducing trial-and-error actions while
                building flows as well as support requests.
              </p>
            </div>

            <Image
              alt="Element library"
              src={assets.library}
              width={800}
              height={521}
              sizes="(max-width: 800px) calc(100vw - 32px), 800px"
              className="h-auto w-full object-contain"
              loading="lazy"
            quality={100}
            />
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">3. Restore user context</p>
              <p>
                I moved block creation and configuration directly onto the canvas so users could
                add elements to the diagram, edit them, and immediately see their changes.
              </p>
              <p className="italic">
                → This reduced navigation between screens and simplified basic actions.
              </p>
            </div>

            <div className="bg-elevated px-space-6 py-space-8">
              <Image
                alt="Flow for adding an element to the diagram and editing it inline"
                src={assets.element}
                width={595}
                height={347}
                sizes="(max-width: 800px) calc(100vw - 80px), 595px"
                className="mx-auto h-auto w-full max-w-[595px] object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="mt-space-2 text-center text-caption-14 text-secondary-elevated">
                Flow for adding an element to the diagram and editing it inline
              </p>
            </div>

            <p className="text-body-18">
              I retained modal windows for complex settings so the canvas would not become
              overloaded with details, while users could quickly edit common blocks directly on
              the diagram. This balanced editing speed with the need for precise configuration.
            </p>

            <Image
              alt="Element configuration dialog"
              src={assets.dialog}
              width={800}
              height={500}
              sizes="(max-width: 800px) calc(100vw - 32px), 800px"
              className="h-auto w-full object-contain"
              loading="lazy"
            quality={100}
            />
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">4. Make large flows readable</p>
              <p>To improve the readability of large flows, I redesigned their visual hierarchy:</p>
              <ul className="list-disc space-y-0 pl-space-6">
                <li>simplified branches outside the main flow</li>
                <li>highlighted connections between blocks when an element is selected</li>
                <li>added smart zoom with larger icons and a minimap for navigation</li>
              </ul>
              <p className="italic">
                → It became easier to navigate the flow structure and understand how changes affected
                the overall logic. Even when a diagram grows to 20+ blocks, a manager can quickly
                move between different areas.
              </p>
            </div>

            <div className="bg-elevated px-space-6 py-space-8">
              <Image
                alt="Smart zoom and minimap"
                src={assets.map}
                width={595}
                height={300}
                sizes="(max-width: 800px) calc(100vw - 80px), 595px"
                className="mx-auto h-auto w-full max-w-[595px] object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="mt-space-2 text-center text-caption-14 text-secondary-elevated">
                At high zoom levels, users navigate with smart zoom and the minimap
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-space-4">
            <div className="flex flex-col gap-space-2 text-body-18">
              <p className="text-body-18-semibold">5. Reduce the fear of errors</p>
              <p>
                In the first iteration, I focused on making changes more deliberate:
              </p>
              <ul className="list-disc space-y-0 pl-space-6">
                <li>added a clear flow status (draft / published)</li>
                <li>made publishing a separate step</li>
              </ul>
              <p className="italic">
                → Users could more easily understand the flow&apos;s current state and when changes
                would go live. This separated draft changes from the live flow and made publishing
                a deliberate action.
              </p>
            </div>

            <div className="bg-elevated px-0 pt-0 pb-0">
              <Image
                alt="Flow status and publishing"
                src={assets.publish}
                width={800}
                height={97}
                sizes="(max-width: 800px) calc(100vw - 32px), 800px"
                className="h-auto w-full object-contain"
                loading="lazy"
              quality={100}
              />
              <p className="mt-space-2 text-center text-caption-14 text-secondary-elevated">
                1 — current status, 2 — publishing the flow
              </p>
            </div>

            <p className="text-body-18">
              Full testing and version history were moved to the next stage, after validating the
              editor&apos;s core use cases.
            </p>
          </div>

          <div className="h-px w-full bg-border-elevated" />

          <p className="text-body-18">
            After several iterations with client cases, I prepared the final designs and
            specifications for developer handoff.
          </p>
        </motion.section>

        <motion.section
          id="results"
          data-section-anchor="results"
          variants={item}
          className="scroll-mt-space-16 flex flex-col gap-space-4"
        >
          <h2 className="text-h2">Results</h2>
          <div className="flex flex-col gap-space-5">
            <p className="text-body-18">
              The new editor made flow management more self-sufficient: users made changes without
              developers more often, built new flows faster, and made fewer publishing errors.
              The support team received fewer basic questions.
            </p>

            <div className="grid grid-cols-1 gap-space-3 min-[440px]:grid-cols-2 lg:grid-cols-[repeat(4,184px)]">
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">+</span>
                  <span className="inline-flex h-10 items-center text-h2">28</span>
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  self-service rate
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <div className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-center text-h2">33</span>
                  <span className="inline-flex h-10 items-center">
                    <Image alt="" src={assets.arrowForward} width={20} height={20} className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-10 items-center text-h2">19</span>
                </div>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  minutes, time-to-change
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">-</span>
                  <span className="inline-flex h-10 items-center text-h2">21</span>
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  errors in flows
                </p>
              </div>
              <div className="flex min-h-[94px] flex-col items-start gap-space-2 rounded-[12px] bg-elevated px-space-3 py-space-3 lg:w-[184px]">
                <p className="flex h-10 items-start gap-space-1 whitespace-nowrap text-primary">
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">-</span>
                  <span className="inline-flex h-10 items-center text-h2">16</span>
                  <span className="inline-flex h-10 items-end pb-space-1 text-body-18-semibold">%</span>
                </p>
                <p className="whitespace-nowrap text-caption-14 text-secondary-elevated">
                  support requests
                </p>
              </div>
            </div>

            <p className="text-body-18">
              This project showed me that even complex flows can be manageable when users remain
              in context and understand the consequences of their actions at every stage.
            </p>
          </div>
        </motion.section>

        <motion.nav
          variants={item}
          aria-label="Page navigation"
          className="flex w-full items-start justify-between border-t border-border-elevated pt-space-4 text-body-18"
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
          { id: "overview", label: "Introduction" },
          { id: "about", label: "About the project" },
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
            <span className="pointer-events-none max-w-[160px] rounded-full bg-elevated-hover px-space-3 py-space-1 text-caption-14 text-secondary-elevated opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
    </main>
  );
}
