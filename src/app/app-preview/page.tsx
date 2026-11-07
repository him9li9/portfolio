"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const assets = {
  heart: "/figma/Icons/heart.svg",
  success: "/figma/Case_1/Section_1/softphone-success.png",
  home: "/figma/Case_1/Section_1/softphone-home.png",
  dialpad: "/figma/Case_1/Section_1/softphone-dialpad.png",
  discovery: "/figma/Case_1/Section_2/case-discovery.png",
  feedback1: "/figma/Case_1/Section_2/case-discovery-feedback-1-figma.png",
  feedback2: "/figma/Case_1/Section_2/case-discovery-feedback-2-figma.png",
  benchmark: "/figma/Case_1/Section_2/case-benchmark-figma.png",
  userflow: "/figma/Case_1/Section_3/case-userflow.png",
  solutionSuccess: "/figma/Case_1/Section_4/case-solution-success.png",
  callFlow: "/figma/Case_1/Section_4/call-flow.mp4",
  solutionError: "/figma/Case_1/Section_4/case-solution-error.png"
};

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
};

function Figure({ src, alt, width, height, caption, priority = false }: FigureProps) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <figure className="w-full">
      <button
        type="button"
        className="group relative block w-full cursor-zoom-in text-left"
        aria-label={"Увеличить: " + alt}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 640px) 100vw, 1000px"
          className="h-auto w-full object-contain"
          quality={100}
        />
      </button>
      {caption && <figcaption className="mt-space-3 text-center text-caption-14 text-secondary">{caption}</figcaption>}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 p-space-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            aria-label="Закрыть изображение"
            className="absolute right-space-4 top-space-4 z-10 rounded-full bg-elevated px-space-4 py-space-2 text-body-16"
            onClick={() => setIsOpen(false)}
          >
            Закрыть
          </button>
          <div className="max-h-[90vh] max-w-[95vw] overflow-auto" onClick={(event) => event.stopPropagation()}>
            <Image src={src} alt={alt} width={width} height={height} className="h-auto max-h-none w-auto max-w-none object-contain" unoptimized />
          </div>
        </div>
      )}
    </figure>
  );
}

function WideFigure({ panel = false, ...props }: FigureProps & { panel?: boolean }) {
  return (
    <div className={`relative left-1/2 w-[calc(100vw-32px)] max-w-[1040px] -translate-x-1/2 ${panel ? "rounded-[12px] bg-secondary px-space-4 py-space-8 sm:px-space-8 sm:py-space-10" : ""}`}>
      <Figure {...props} />
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-h2">{children}</h2>;
}

export default function SoftphonePreviewPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-primary text-primary">
      <header className="sticky top-0 z-20 h-[74px] bg-primary/60 backdrop-blur-[4px]">
        <div className="mx-auto flex h-full max-w-[1220px] items-center justify-between px-space-4 sm:px-space-8">
          <Link href="/" className="font-oldenburg flex items-center gap-space-1 text-body-18">
            <span>nastya</span><span>with</span>
            <img src={assets.heart} alt="" width={24} height={24} />
          </Link>
          <Link href="/app" className="group text-body-16 text-secondary">
            <span className="link-underline">Текущая версия кейса ↗</span>
          </Link>
        </div>
      </header>

      <article className="mx-auto flex w-full max-w-[900px] flex-col gap-[120px] px-space-4 pb-space-16 pt-space-12 sm:px-space-8 sm:pt-[88px] lg:px-0">
        <section id="overview" className="flex flex-col gap-space-8 scroll-mt-[96px]">
          <div className="flex max-w-[740px] flex-col gap-space-4">
            <div className="flex flex-col gap-space-1">
              <h1 className="text-h1">MCN Softphone</h1>
              <p className="text-body-16 text-secondary">Продуктовый дизайнер · 2024 — н.в.</p>
            </div>
            <p className="max-w-[680px] text-body-18">
              Мобильное приложение для звонков через интернет и управления личным кабинетом.
              Аудитория — путешественники, которым нужна доступная связь за границей без сложной настройки SIM и роуминга.
            </p>
          </div>

          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto sm:w-full sm:overflow-visible">
            <div className="mx-auto flex w-max items-center justify-center gap-space-4 px-space-4 sm:w-full sm:px-0">
              <Image alt="Экран после регистрации" src={assets.success} width={900} height={1840} priority sizes="(max-width: 640px) 210px, 240px" className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-[240px]" />
              <Image alt="Главный экран с тарифом" src={assets.home} width={900} height={1840} priority sizes="(max-width: 640px) 294px, 280px" className="h-[600px] w-auto shrink-0 sm:h-auto sm:w-[280px]" />
              <Image alt="Экран звонка" src={assets.dialpad} width={900} height={1840} priority sizes="(max-width: 640px) 210px, 240px" className="h-[430px] w-auto shrink-0 sm:h-auto sm:w-[240px]" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-space-10 gap-y-space-3">
            <p className="text-body-18"><strong className="font-semibold">8 → 3 шага</strong><span className="text-secondary"> до первого звонка</span></p>
            <p className="text-body-18"><strong className="font-semibold">в 2× меньше</strong><span className="text-secondary"> обращений в поддержку</span></p>
          </div>
          <p className="max-w-[680px] text-body-18">
            Я присоединилась к проекту на стадии MVP за несколько месяцев до планируемого релиза.
            Отвечала за путь от регистрации до первого звонка, подключение номера, тарификацию и поддержку.
          </p>
        </section>

        <section id="discovery" className="flex flex-col gap-space-8 scroll-mt-[96px]">
          <div className="max-w-[720px] space-y-space-4">
            <SectionHeading>Анализ текущей версии</SectionHeading>
            <p className="text-body-18">
              Во время аудита текущего MVP я выявила 3 основных барьера на пути к первому звонку.
            </p>
          </div>

          <WideFigure
            src={assets.discovery}
            alt="Ключевые экраны текущей версии MCN Softphone"
            width={2550}
            height={1206}
            caption="Ключевые экраны текущей версии MCN Softphone"
            panel
          />
          <div className="grid gap-space-8 pt-space-2 md:grid-cols-3 md:gap-space-6">
            <div className="flex flex-col gap-space-3">
              <h3 className="text-[20px] font-semibold leading-[1.35]">Сценарий активации разорван</h3>
              <p className="text-body-16 text-secondary">Регистрация и подключение номера проходят в веб-кабинете, а в приложении нет статуса заявки и следующего шага.</p>
            </div>
            <div className="flex flex-col gap-space-3">
              <h3 className="text-[20px] font-semibold leading-[1.35]">Стоимость и списания непрозрачны</h3>
              <p className="text-body-16 text-secondary">До звонка нельзя узнать стоимость, а после завершения нет понятной детализации.</p>
            </div>
            <div className="flex flex-col gap-space-3">
              <h3 className="text-[20px] font-semibold leading-[1.35]">Помощь трудно получить</h3>
              <p className="text-body-16 text-secondary">Пользователям приходится искать ответы по настройке и звонкам в других каналах связи.</p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[600px] flex-col gap-space-6 py-space-2">
            <Figure src={assets.feedback1} alt="Обращение пользователя о статусе аккаунта" width={1044} height={332} />
            <Figure src={assets.feedback2} alt="Обращение пользователя о списании средств" width={2116} height={512} />
          </div>
          <p className="max-w-[680px] text-body-18">
            Анализ обращений показал, что пользователи не понимали текущее состояние аккаунта:
            подключён ли номер, доступны ли звонки и почему изменился баланс.
          </p>
        </section>

        <section id="design" className="flex flex-col gap-space-8 scroll-mt-[96px]">
          <div className="max-w-[720px] space-y-space-4">
            <SectionHeading>Проектирование</SectionHeading>
            <p className="text-body-18">
              Я сравнила пользовательский путь в похожих приложениях и обсудила ограничения с поддержкой и разработкой.
              У конкурентов ключевой путь не требовал перехода в веб-кабинет:
              пользователь оставался в приложении, видел состояние подключения и понимал, когда может совершить звонок.
            </p>
          </div>
          <WideFigure
            src={assets.benchmark}
            alt="Сравнение пути до первого звонка в приложениях конкурентов"
            width={2700}
            height={990}
            caption="Последовательный путь до первого звонка в приложениях конкурентов"
            panel
          />
          <p className="max-w-[680px] text-body-18">
            Главное решение — сохранять сценарий внутри приложения, показывать статус подключения
            и явно вести пользователя к следующему действию.
          </p>
          <WideFigure
            src={assets.userflow}
            alt="Новый userflow первого звонка"
            width={4096}
            height={1690}
            caption="Новый userflow 1-го звонка · нажми, чтобы увеличить"
            panel
          />
          <p className="max-w-[680px] text-body-18">
            Продумала состояния и корнер-кейсы, чтобы пользователь всегда понимал,
            что происходит, сколько стоит звонок и как продолжить действие при ошибке.
          </p>
        </section>

        <section id="solution" className="flex flex-col gap-[104px] scroll-mt-[96px]">
          <div className="max-w-[720px] space-y-space-4">
            <SectionHeading>Решение и тесты</SectionHeading>
            <p className="text-body-18">
              Первые тесты показали: даже там, где логика казалась очевидной, пользователи ошибались.
              Я собрала обратную связь, переработала несколько сценариев и перепроверила их.
            </p>
          </div>
          <div className="flex flex-col gap-space-6">
            <div className="max-w-[720px] space-y-space-3">
              <h3 className="text-h3">Экран успеха после регистрации</h3>
              <p className="text-body-18">
                На тестах пользователи зависали на отдельном экране успеха с галочкой и кнопкой «Продолжить».
                Объединила его с оформлением заказа: после регистрации пользователь сразу видит номер и условия тарифа.
              </p>
            </div>
            <WideFigure src={assets.solutionSuccess} alt="Экраны регистрации и успешного оформления заказа" width={2400} height={1584} />
          </div>
          <div className="grid items-center gap-space-8 sm:grid-cols-[1fr_360px] sm:gap-space-12">
            <div className="flex flex-col gap-space-3">
              <h3 className="text-h3">Узнать стоимость звонка</h3>
              <p className="text-body-18">
                В первой версии цену можно было узнать только после начала ввода номера.
                Добавила кнопку «Выбрать контакт» на экран набора:
                при выборе контакта стоимость отображается сразу, как и при ручном вводе.
              </p>
            </div>
            <figure className="flex flex-col items-center gap-space-3">
              <video
                src={assets.callFlow}
                className="h-[580px] w-full max-w-[339px] object-contain"
                autoPlay muted loop playsInline preload="metadata"
                aria-label="Стоимость звонка видна при выборе контакта"
              />
              <figcaption className="text-center text-caption-14 text-secondary">Стоимость за минуту звонка видна сразу</figcaption>
            </figure>
          </div>
          <div className="flex flex-col gap-space-8">
            <div className="max-w-[720px] space-y-space-3">
              <h3 className="text-h3">Помощь и подсказки</h3>
              <p className="text-body-18">
                Раньше экран ошибки сообщал причину, но не объяснял следующий шаг.
                Добавила контекстные действия — «Вернуться в Госуслуги», «Пополнить баланс»
                и «Написать в поддержку», чтобы не оставлять пользователя в тупике.
              </p>
            </div>
            <WideFigure
              src={assets.solutionError}
              alt="Экраны ошибок с контекстными действиями"
              width={2850}
              height={1440}
              caption="Возвращаем на сценарий, но оставляем возможность написать в поддержку"
            />
          </div>
        </section>

        <section id="results" className="flex flex-col gap-space-8 scroll-mt-[96px]">
          <SectionHeading>Результаты</SectionHeading>
          <div className="grid gap-space-8 border-t border-border-elevated pt-space-8 sm:grid-cols-3 sm:gap-space-6">
            <div className="space-y-space-3">
              <p className="text-[32px] font-semibold leading-[1.2]">8 → 3 шага</p>
              <p className="text-body-16">Сократила путь от регистрации до первого звонка, объединив ключевые действия внутри приложения.</p>
            </div>
            <div className="space-y-space-3">
              <p className="text-[32px] font-semibold leading-[1.2]">в 2× меньше</p>
              <p className="text-body-16">Помогла снизить количество вопросов в поддержку по подключению, стоимости и списаниям.</p>
            </div>
            <div className="space-y-space-3">
              <p className="text-[32px] font-semibold leading-[1.2]">15+ сценариев</p>
              <p className="text-body-16">Спроектировала сценарии от регистрации и первого звонка до оплаты, роуминга, eSIM и AI-поддержки.</p>
            </div>
          </div>
          <p className="max-w-[720px] text-body-18">
            После релиза развитие софтфона продолжилось через обратную связь от пользователей:
            добавление избранных контактов, повтор звонка из истории и push-уведомления о низком балансе.
          </p>
        </section>

        <nav aria-label="Навигация между страницами" className="flex items-start justify-between gap-space-4 border-t border-border-elevated pt-space-4 text-body-18">
          <Link href="/" className="link-underline">← На главную</Link>
          <Link href="/app" className="link-underline">Текущий кейс →</Link>
        </nav>
      </article>
    </main>
  );
}
