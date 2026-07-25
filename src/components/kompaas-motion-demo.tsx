"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type DemoStatus = "saved" | "draft" | "published";
type IconName =
  | "accountTree"
  | "add"
  | "callEnd"
  | "chevronLeft"
  | "chevronRight"
  | "clock"
  | "delete"
  | "folder"
  | "graphicEq"
  | "groups"
  | "help"
  | "integration"
  | "keyboardVoice"
  | "more"
  | "notifications"
  | "operator"
  | "play"
  | "question"
  | "redo"
  | "search"
  | "settings"
  | "shoppingCart"
  | "undo"
  | "voicemail";

type PointerPosition = {
  x: number;
  y: number;
};

const statusText: Record<DemoStatus, string> = {
  saved: "Saved",
  draft: "Draft",
  published: "Published"
};

const scenarioItems = [
  { label: "All flows", icon: "groups" as IconName },
  { label: "B2C sales", icon: "folder" as IconName },
  { label: "Lead calls", child: true, active: true },
  { label: "Promotional offers", child: true },
  { label: "B2B sales", icon: "folder" as IconName },
  { label: "Templates", icon: "folder" as IconName },
  { label: "Trash", icon: "delete" as IconName }
];

const libraryItems = [
  {
    title: "Queue",
    description: "Distribute calls in a queue",
    icon: "operator" as IconName
  },
  {
    title: "Greeting",
    description: "Message for an incoming call",
    icon: "keyboardVoice" as IconName
  },
  {
    title: "Text to speech",
    description: "Convert text to speech",
    icon: "graphicEq" as IconName
  },
  {
    title: "Question and answer",
    description: "Answer caller questions",
    icon: "help" as IconName,
    draggable: true
  },
  {
    title: "Voice menu",
    description: "Navigate by keypad or voice",
    icon: "question" as IconName
  }
];

const smoothEase = [0.16, 1, 0.3, 1] as const;

export function KompaasMotionDemo() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverCanvas, setIsOverCanvas] = useState(false);
  const [dragPoint, setDragPoint] = useState<PointerPosition>({ x: 0, y: 0 });
  const [isDropped, setIsDropped] = useState(false);
  const [status, setStatus] = useState<DemoStatus>("saved");
  const [isPublishing, setIsPublishing] = useState(false);

  const branchActive = isQuestionActive || isDropped;
  const publishEnabled = isDropped && status !== "published";

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      const rect = canvasRef.current?.getBoundingClientRect();
      setDragPoint(point);
      setIsOverCanvas(
        Boolean(
          rect &&
            point.x >= rect.left &&
            point.x <= rect.right &&
            point.y >= rect.top &&
            point.y <= rect.bottom
        )
      );
    };

    const handlePointerUp = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      const rect = canvasRef.current?.getBoundingClientRect();
      const droppedOnCanvas = Boolean(
        rect &&
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y >= rect.top &&
          point.y <= rect.bottom
      );

      setIsDragging(false);
      setIsOverCanvas(false);

      if (droppedOnCanvas) {
        setIsDropped(true);
        setIsQuestionActive(true);
        setStatus("draft");
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragPoint({ x: event.clientX, y: event.clientY });
    setIsDragging(true);
  };

  const handlePublish = () => {
    if (!publishEnabled) {
      return;
    }

    setIsPublishing(true);
    window.setTimeout(() => {
      setIsPublishing(false);
      setStatus("published");
    }, 360);
  };

  return (
    <main className="flex min-h-screen items-start justify-center overflow-hidden bg-[#1a1a1a] text-black">
      <section className="h-[900px] w-[1440px] origin-top scale-[0.8] overflow-hidden bg-[#f6f6f6] font-[var(--font-inter)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] min-[1400px]:scale-100">
        <ProductHeader />
        <ProductNav />

        <div className="grid h-[820px] grid-cols-[300px_minmax(0,1fr)_300px]">
          <LeftSidebar />

          <section ref={canvasRef} className="relative overflow-hidden bg-[#f4f4f4]">
            <CanvasTopbar
              status={status}
              publishEnabled={publishEnabled}
              isPublishing={isPublishing}
              onPublish={handlePublish}
            />

            <Connections branchActive={branchActive} isDropped={isDropped} />

            <StartNode />
            <QuestionNode
              active={isQuestionActive}
              branchActive={branchActive}
              onActiveChange={setIsQuestionActive}
            />
            <ScenarioNode
              className="left-[420px] top-[118px]"
              title="Voicemail"
              subtitle="Voicemail (5)"
              icon="voicemail"
              color="#2a7ba7"
              bg="#e1effa"
            />
            <ScenarioNode
              className="left-[420px] top-[199px]"
              title="Internal extension"
              subtitle="Ivan Ivanov (102)"
              icon="operator"
              color="#2a7ba7"
              bg="#e1effa"
            />
            <EndNode />
            <ScenarioNode
              className="left-[420px] top-[454px]"
              title="Integration event"
              subtitle="PBX: Call ended"
              icon="integration"
              color="#41a75c"
              bg="#def4e5"
            />

            <Note />
            <ToolsPanel />
            <MiniMap />

            <AnimatePresence>
              {isDropped && (
                <>
                  <motion.div
                    className="absolute left-[420px] top-[564px]"
                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.42, ease: smoothEase }}
                  >
                    <ScenarioNode
                      title="Question and answer"
                      subtitle="Answer caller questions"
                      icon="help"
                      color="#f0831f"
                      bg="#f5e5d6"
                    />
                  </motion.div>

                  <motion.div
                    className="absolute left-[250px] top-[536px] w-[206px] rounded-[12px] border border-[#dcecf6] bg-white p-3 shadow-[0_10px_28px_rgba(42,123,167,0.15)]"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14, duration: 0.36, ease: smoothEase }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[13px] font-semibold leading-[1.2]">Block settings</p>
                      <Icon name="more" size={16} className="text-[#828282]" />
                    </div>
                    <InlineField label="Recognition" value="Voice + keypad" />
                    <InlineField label="Branch" value="After integration" active />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isDragging && isOverCanvas && (
                <motion.div
                  className="absolute left-[236px] top-[92px] z-20 rounded-[12px] border border-dashed border-[#2a7ba7] bg-[#f1f9fe] px-4 py-3 text-[13px] font-medium text-[#2a7ba7]"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Drop the block onto the canvas
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <RightSidebar onDragStart={handleDragStart} />
        </div>
      </section>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="pointer-events-none fixed z-50 w-[248px] rounded-[12px] bg-white p-3 text-black shadow-[0_18px_42px_rgba(0,0,0,0.2)]"
            style={{ left: dragPoint.x - 124, top: dragPoint.y - 28 }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.16 }}
          >
            <LibraryRow
              title="Question and answer"
              description="Answer caller questions"
              icon="help"
              dragging
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ProductHeader() {
  return (
    <header className="flex h-8 items-center justify-between bg-[#3f3f3f] px-3 text-[12px] text-white">
      <div className="flex h-full items-center gap-4">
        <span className="font-semibold">Telephony</span>
        <span className="text-white/80">Account No. 116181</span>
        <span className="rounded-[3px] bg-[#36b56f] px-2 py-[2px] font-medium">-200.00</span>
        <span className="text-white/75">(40,000.00)</span>
        <Icon name="shoppingCart" size={18} className="text-white" />
        <Icon name="settings" size={18} className="text-white" />
      </div>
      <div className="flex h-full items-center gap-4 text-white/90">
        <span>12:00 (UTC+3)</span>
        <span className="rounded-full bg-white px-3 py-[2px] text-[11px] font-semibold text-[#1d7b37]">
          Online
        </span>
        <Icon name="notifications" size={18} className="text-white" />
        <span className="text-[18px] font-semibold leading-none">?</span>
      </div>
    </header>
  );
}

function ProductNav() {
  const items = [
    "Call flows",
    "Phone system",
    "PBX",
    "SIP trunks",
    "SIP accounts",
    "Equipment",
    "Analytics",
    "Calls"
  ];

  return (
    <nav className="flex h-10 items-center gap-5 border-b border-[#ececec] bg-white px-4 text-[12px]">
      {items.map((item) => (
        <span
          key={item}
          className={
            item === "Call flows"
              ? "flex h-full items-center border-b-2 border-[#2a7ba7] text-[#2a7ba7]"
              : "text-black"
          }
        >
          {item}
        </span>
      ))}
    </nav>
  );
}

function LeftSidebar() {
  return (
    <aside className="flex flex-col justify-between border-r border-[#f0f0f0] bg-white py-2">
      <div>
        <div className="flex h-8 items-center gap-2 px-3">
          <h1 className="flex-1 text-[18px] font-semibold leading-[1.1]">Flows</h1>
          <button className="grid size-[22px] place-items-center rounded-full text-[#2a7ba7]">
            <Icon name="add" size={16} />
          </button>
          <button className="grid size-[22px] place-items-center rounded-full text-[#2a7ba7]">
            <Icon name="search" size={16} />
          </button>
        </div>

        <div className="mt-1 flex flex-col gap-[2px] px-1 text-[14px] leading-[1.4]">
          {scenarioItems.map((item) => (
            <div
              key={item.label}
              className={`flex h-8 items-center gap-2 rounded-[8px] px-3 ${
                item.active ? "bg-[#f1f9fe]" : "bg-white"
              } ${item.child ? "pl-7" : ""}`}
            >
              {item.icon ? (
                <Icon name={item.icon} size={14} className="shrink-0 text-black" />
              ) : (
                <span
                  className={`size-[7px] shrink-0 rounded-full ${
                    item.active ? "bg-[#36b56f]" : "bg-[#bdbdbd]"
                  }`}
                />
              )}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end px-2">
        <button className="grid size-8 place-items-center rounded-full bg-[#f6f6f6] text-[#bdbdbd]">
          <Icon name="chevronLeft" size={18} />
        </button>
      </div>
    </aside>
  );
}

function RightSidebar({ onDragStart }: { onDragStart: (event: React.PointerEvent<HTMLButtonElement>) => void }) {
  return (
    <aside className="border-l border-[#f0f0f0] bg-white px-3 py-3">
      <div className="mb-3 flex h-8 items-center gap-2 rounded-[4px] bg-[#f6f6f6] px-2 text-[12px] text-[#a6a6a6]">
        <Icon name="search" size={16} />
        <span>Search elements</span>
      </div>

      <LibrarySection title="Subscribers" color="#2a7ba7" collapsed />
      <LibrarySection title="Voice interfaces" color="#f0831f">
        {libraryItems.map((item) => (
          <button
            key={item.title}
            type="button"
            onPointerDown={item.draggable ? onDragStart : undefined}
            className={`w-full rounded-[8px] text-left transition ${
              item.draggable ? "cursor-grab hover:bg-[#f6f6f6] active:cursor-grabbing" : "cursor-default"
            }`}
          >
            <LibraryRow title={item.title} description={item.description} icon={item.icon} />
          </button>
        ))}
      </LibrarySection>
      <LibrarySection title="Call control" color="#ffc008" collapsed />
      <LibrarySection title="Integrations" color="#36b56f" collapsed />
    </aside>
  );
}

function CanvasTopbar({
  status,
  publishEnabled,
  isPublishing,
  onPublish
}: {
  status: DemoStatus;
  publishEnabled: boolean;
  isPublishing: boolean;
  onPublish: () => void;
}) {
  const statusClass =
    status === "published"
      ? "bg-[#e9f8ef] text-[#1d7b37]"
      : status === "draft"
        ? "bg-[#fff5ce] text-[#9b7200]"
        : "bg-[#f6f6f6] text-[#828282]";

  return (
    <div className="absolute left-4 right-4 top-4 z-20 flex h-14 items-center justify-between rounded-[8px] bg-white px-4 shadow-[0_2px_12px_rgba(130,130,130,0.05)]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="size-[7px] rounded-full bg-[#36b56f]" />
          <p className="text-[16px] font-semibold leading-none">Lead calls</p>
          <Icon name="more" size={16} className="text-black" />
        </div>
        <p className="text-[12px] leading-none">+7 (912) 345-67-89⌄</p>
      </div>

      <div className="flex items-center gap-3">
        <motion.span layout className={`rounded-full px-3 py-[6px] text-[12px] font-semibold ${statusClass}`}>
          {statusText[status]}
        </motion.span>
        <Icon name="clock" size={20} className="text-[#2a7ba7]" />
        <button className="h-8 rounded-[8px] bg-[#f1f9fe] px-3 text-[12px] font-semibold text-[#2a7ba7]">
          Test
        </button>
        <motion.button
          type="button"
          disabled={!publishEnabled || isPublishing}
          onClick={onPublish}
          whileTap={publishEnabled ? { scale: 0.96 } : undefined}
          className={`h-8 rounded-[8px] px-3 text-[12px] font-semibold transition ${
            publishEnabled
              ? "bg-[#2a7ba7] text-white shadow-[0_4px_12px_rgba(42,123,167,0.24)]"
              : "bg-[#dfe7eb] text-[#8da3ae]"
          }`}
        >
          {isPublishing ? "Publishing" : "Publish"}
        </motion.button>
      </div>
    </div>
  );
}

function Connections({ branchActive, isDropped }: { branchActive: boolean; isDropped: boolean }) {
  return (
    <svg className="pointer-events-none absolute inset-0 z-0 size-full" viewBox="0 0 840 820" preserveAspectRatio="none">
      <Connection d="M104 253 C145 253 145 253 178 253" />
      <Connection active={branchActive} d="M476 221 C514 221 520 185 580 185" />
      <Connection d="M476 253 C518 253 522 253 580 253" />
      <Connection d="M476 285 C518 285 512 326 536 326" />
      <Connection d="M476 317 C516 317 518 492 580 492" />
      <AnimatePresence>
        {isDropped && (
          <motion.path
            d="M668 493 C722 493 718 628 626 628"
            fill="none"
            stroke="#2a7ba7"
            strokeLinecap="round"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: smoothEase }}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}

function Connection({ d, active = false }: { d: string; active?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? "#2a7ba7" : "#d6d6d6"}
      strokeLinecap="round"
      strokeWidth={active ? 4 : 3}
    />
  );
}

function StartNode() {
  return (
    <div className="absolute left-[28px] top-[217px] z-10 flex h-[72px] w-[120px] items-center gap-2 rounded-full bg-white px-4 shadow-[0_2px_12px_rgba(130,130,130,0.1)]">
      <span className="grid size-9 place-items-center rounded-full bg-[#fff5ce] text-[#ffc008]">
        <Icon name="play" size={24} />
      </span>
      <span className="text-[14px] font-semibold">Start</span>
      <span className="ml-auto size-3 rounded-full bg-[#d8d8d8]" />
    </div>
  );
}

function QuestionNode({
  active,
  branchActive,
  onActiveChange
}: {
  active: boolean;
  branchActive: boolean;
  onActiveChange: (active: boolean) => void;
}) {
  return (
    <motion.div
      className="absolute left-[176px] top-[146px] z-10 w-[300px] rounded-[20px] bg-white p-4 shadow-[0_2px_5px_rgba(130,130,130,0.1)]"
      animate={{
        boxShadow: active
          ? "0 12px 32px rgba(42,123,167,0.16)"
          : "0 2px 5px rgba(130,130,130,0.1)"
      }}
      onPointerEnter={() => onActiveChange(true)}
      onPointerLeave={() => {
        if (!branchActive) {
          onActiveChange(false);
        }
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <IconBox icon="help" color="#f0831f" bg="#f5e5d6" size={48} iconSize={28} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate text-[16px] font-semibold leading-[1.2]">Question and answer</p>
            <Icon name="more" size={16} />
          </div>
          <p className="truncate text-[14px] leading-[1.4]">Question and answer (2)</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {["Yes", "No", "Not recognized", "Interrupted"].map((label, index) => (
          <div key={label} className="relative flex items-center">
            <div
              className={`h-8 flex-1 rounded-[8px] px-3 py-[7px] text-[14px] leading-none transition ${
                branchActive && index === 0 ? "bg-[#f1f9fe] text-[#2a7ba7]" : "bg-[#f6f6f6]"
              }`}
            >
              {label}
            </div>
            <AnimatePresence>
              {(active || branchActive) && index !== 1 && (
                <motion.span
                  className={`absolute -right-[6px] size-3 rounded-full ${
                    branchActive && index === 0 ? "bg-[#2a7ba7]" : "bg-[#d9d9d9]"
                  }`}
                  initial={{ scale: 0.45, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute -right-[14px] top-[118px] flex flex-col gap-2"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.22 }}
          >
            <button className="grid size-7 place-items-center rounded-full bg-[#2a7ba7] text-white shadow-[0_6px_16px_rgba(42,123,167,0.25)]">
              <Icon name="add" size={18} />
            </button>
            <button className="grid size-7 place-items-center rounded-full bg-white text-[#2a7ba7] shadow-[0_6px_16px_rgba(0,0,0,0.1)]">
              <Icon name="settings" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ScenarioNode({
  title,
  subtitle,
  icon,
  color,
  bg,
  className = ""
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
  bg: string;
  className?: string;
}) {
  return (
    <div className={`absolute z-10 w-[216px] rounded-[20px] bg-white p-4 shadow-[0_2px_5px_rgba(130,130,130,0.1)] ${className}`}>
      <div className="flex items-center gap-3">
        <IconBox icon={icon} color={color} bg={bg} size={48} iconSize={28} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-[1.2]">{title}</p>
          <p className="mt-1 truncate text-[12px] leading-[1.4]">{subtitle}</p>
        </div>
        <Icon name="more" size={16} className="shrink-0" />
      </div>
    </div>
  );
}

function EndNode() {
  return (
    <div className="absolute left-[562px] top-[311px] z-10 flex h-[72px] w-[145px] items-center gap-2 rounded-full bg-white px-3 shadow-[0_2px_12px_rgba(130,130,130,0.08)]">
      <IconBox icon="callEnd" color="#d5a100" bg="#fff5ce" size={48} iconSize={27} rounded />
      <span className="flex-1 text-[14px] font-semibold">End</span>
      <Icon name="more" size={16} />
    </div>
  );
}

function Note() {
  return (
    <div className="absolute left-[55px] top-[500px] z-10 h-[142px] w-[214px] rounded-[8px] bg-[#ffe7ad] p-3 text-[12px] leading-[1.35] shadow-[0_2px_5px_rgba(130,130,130,0.07)]">
      <p>Variables used:</p>
      <p>stt_answer=13</p>
      <p>nnp_ndc_type_id=134</p>
      <span className="absolute bottom-2 right-2 size-2 rounded-[2px] bg-[#f2cf82]" />
    </div>
  );
}

function ToolsPanel() {
  const tools: IconName[] = ["accountTree", "operator", "undo", "redo", "question"];

  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex h-12 -translate-x-1/2 items-center gap-2 rounded-[12px] bg-white px-2 shadow-[0_2px_4px_rgba(130,130,130,0.08)]">
      {tools.map((tool, index) => (
        <button
          key={`${tool}-${index}`}
          className={`grid size-8 place-items-center rounded-[8px] ${
            index === 0 ? "bg-[#ecf1f4] text-[#2a7ba7]" : "text-[#2a7ba7]"
          }`}
        >
          <Icon name={tool} size={20} />
        </button>
      ))}
    </div>
  );
}

function MiniMap() {
  const dots = [
    "left-[22px] top-[34px] bg-[#ffc008]",
    "left-[36px] top-[33px] bg-[#f0831f]",
    "left-[50px] top-[19px] bg-[#2a7ba7]",
    "left-[50px] top-[34px] bg-[#2a7ba7]",
    "left-[50px] top-[48px] bg-[#36b56f]",
    "left-[70px] top-[12px] bg-[#c5dff0]",
    "left-[84px] top-[10px] bg-[#c5dff0]"
  ];

  return (
    <div className="absolute bottom-6 right-6 z-10 h-[104px] w-[150px] rounded-[8px] bg-[#eef0f0] p-4 opacity-80">
      <div className="relative mx-auto h-[64px] w-[94px] rounded-[8px] bg-[#e3e3e3]">
        {dots.map((dot) => (
          <span key={dot} className={`absolute size-[5px] rounded-full ${dot}`} />
        ))}
      </div>
    </div>
  );
}

function LibrarySection({
  title,
  color,
  collapsed = false,
  children
}: {
  title: string;
  color: string;
  collapsed?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="border-t border-[#f6f6f6] py-2">
      <div className="flex h-7 items-center gap-2 text-[14px] font-semibold">
        <span className="size-[6px] rounded-full" style={{ backgroundColor: color }} />
        <span className="flex-1 truncate">{title}</span>
        <Icon name={collapsed ? "chevronLeft" : "chevronRight"} size={16} />
      </div>
      {!collapsed && <div className="mt-1 flex flex-col gap-1">{children}</div>}
    </div>
  );
}

function LibraryRow({
  title,
  description,
  icon,
  dragging = false
}: {
  title: string;
  description: string;
  icon: IconName;
  dragging?: boolean;
}) {
  return (
    <span className={`flex h-12 w-full items-center gap-2 px-1 ${dragging ? "p-0" : ""}`}>
      <IconBox icon={icon} color="#f0831f" bg="#f5e5d6" size={32} iconSize={21} boxRadius={6} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-semibold leading-[1.4]">{title}</span>
        <span className="block truncate text-[12px] leading-[1.4] text-[#828282]">{description}</span>
      </span>
      {!dragging && <Icon name="more" size={14} className="shrink-0 text-[#bdbdbd]" />}
    </span>
  );
}

function InlineField({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <label className="mb-2 flex flex-col gap-1 text-[12px]">
      <span className="text-[#828282]">{label}</span>
      <span className={`rounded-[8px] px-3 py-2 ${active ? "bg-[#f1f9fe] text-[#2a7ba7]" : "bg-[#f6f6f6]"}`}>
        {value}
      </span>
    </label>
  );
}

function IconBox({
  icon,
  color,
  bg,
  size,
  iconSize,
  boxRadius = 12,
  rounded = false
}: {
  icon: IconName;
  color: string;
  bg: string;
  size: number;
  iconSize: number;
  boxRadius?: number;
  rounded?: boolean;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center"
      style={{
        width: size,
        height: size,
        color,
        backgroundColor: bg,
        borderRadius: rounded ? 999 : boxRadius
      }}
    >
      <Icon name={icon} size={iconSize} />
    </span>
  );
}

function Icon({ name, size = 24, className = "" }: { name: IconName; size?: number; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    accountTree: (
      <>
        <path d="M4 4h6v6H4V4Zm2 2v2h2V6H6Zm8-2h6v6h-6V4Zm2 2v2h2V6h-2ZM4 14h6v6H4v-6Zm2 2v2h2v-2H6Z" />
        <path d="M11 7h2v2h-2V7Zm1 2h1v7h-2v-5H9V9h3Zm1 6h2v2h-2v-2Z" />
      </>
    ),
    add: <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />,
    callEnd: <path d="M12 9c-2.25 0-4.38.38-6.36 1.13-.7.27-1.14.93-1.14 1.68V15c0 .55.45 1 1 1H9c.55 0 1-.45 1-1v-2h4v2c0 .55.45 1 1 1h3.5c.55 0 1-.45 1-1v-3.19c0-.75-.44-1.41-1.14-1.68A17.9 17.9 0 0 0 12 9Z" />,
    chevronLeft: <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12l4.6-4.6Z" />,
    chevronRight: <path d="M8.6 16.6 13.2 12 8.6 7.4 10 6l6 6-6 6-1.4-1.4Z" />,
    clock: <path d="M12 2a10 10 0 1 0 .01 20.01A10 10 0 0 0 12 2Zm1 10.4 4 2.35-.75 1.23L11.5 13V6H13v6.4Z" />,
    delete: <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 4l1-1h6l1 1h3v2H5V4h3Z" />,
    folder: <path d="M10 4 12 6h8c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2L2.01 6C2.01 4.9 2.9 4 4 4h6Z" />,
    graphicEq: <path d="M7 7h2v10H7V7Zm4-3h2v16h-2V4Zm4 6h2v7h-2v-7ZM3 11h2v4H3v-4Zm16-2h2v6h-2V9Z" />,
    groups: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />,
    help: <path d="M11 18h2v-2h-2v2Zm1-16a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-14a3 3 0 0 0-3 3h2a1 1 0 1 1 1 1c-1.1 0-2 .9-2 2v1h2v-1c1.65 0 3-1.35 3-3s-1.35-3-3-3Z" />,
    integration: <path d="M7 3h10v4h3l-4 4-4-4h3V5H9v14h6v-2h2v4H7V3Zm5 8h-2v3H7l4 4 4-4h-3v-3Z" />,
    keyboardVoice: <path d="M12 14c1.66 0 3-1.34 3-3V5a3 3 0 0 0-6 0v6c0 1.66 1.34 3 3 3Zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-1.7Z" />,
    more: <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a2 2 0 1 0 .01 4.01A2 2 0 0 0 12 10Zm0 6a2 2 0 1 0 .01 4.01A2 2 0 0 0 12 16Z" />,
    notifications: <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z" />,
    operator: <path d="M12 2a7 7 0 0 0-7 7v5a3 3 0 0 0 3 3h1v-8H7a5 5 0 0 1 10 0h-2v8h2v1h-4v2h4a2 2 0 0 0 2-2v-1a3 3 0 0 0 2-2.83V9a7 7 0 0 0-7-7Z" />,
    play: <path d="M8 5v14l11-7L8 5Z" />,
    question: <path d="M13 19h-2v-2h2v2Zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26A2 2 0 1 0 10 9H8a4 4 0 1 1 7.07 2.25Z" />,
    redo: <path d="M18.4 10.6C16.55 8.76 14.02 8 11.6 8.35V5l-5 5 5 5v-3.55c1.86-.37 3.86.15 5.31 1.6 1.04 1.04 1.59 2.37 1.68 3.73h2.01c-.1-1.88-.84-3.74-2.2-5.18Z" />,
    search: <path d="m9.5 3a6.5 6.5 0 0 1 5.16 10.45l4.45 4.44-1.42 1.42-4.44-4.45A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />,
    settings: <path d="m19.43 12.98.04-.98-.04-.98 2.11-1.65-2-3.46-2.49 1a7.4 7.4 0 0 0-1.69-.98L15 3h-4l-.36 2.93c-.6.24-1.17.56-1.69.98l-2.49-1-2 3.46 2.11 1.65-.04.98.04.98-2.11 1.65 2 3.46 2.49-1c.52.4 1.09.73 1.69.98L11 21h4l.36-2.93c.6-.24 1.17-.56 1.69-.98l2.49 1 2-3.46-2.11-1.65ZM13 15.5A3.5 3.5 0 1 1 13 8a3.5 3.5 0 0 1 0 7.5Z" />,
    shoppingCart: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2ZM1 2v2h2l3.6 7.59-1.35 2.45C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21 5H5.21l-.94-2H1Z" />,
    undo: <path d="M5.6 10.6C7.45 8.76 9.98 8 12.4 8.35V5l5 5-5 5v-3.55c-1.86-.37-3.86.15-5.31 1.6a5.3 5.3 0 0 0-1.68 3.73H3.4c.1-1.88.84-3.74 2.2-5.18Z" />,
    voicemail: <path d="M7.5 8A4.5 4.5 0 1 0 12 12.5h0A4.5 4.5 0 1 0 16.5 8h-9Zm0 2A2.5 2.5 0 1 1 5 12.5 2.5 2.5 0 0 1 7.5 10Zm9 0A2.5 2.5 0 1 1 14 12.5a2.5 2.5 0 0 1 2.5-2.5ZM7.5 17h9v2h-9v-2Z" />
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}
