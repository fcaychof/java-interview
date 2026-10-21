"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { countConcepts, countQuestions, sections } from "@/content/catalog";
import type { Difficulty, InterviewQuestion, InterviewSection, TheoryConcept, TheoryGroup } from "@/content/interview-model";
import { ConceptCard } from "@/components/concept-card";
import { QuestionCard } from "@/components/question-card";

type Chrome = "pt" | "en";
type StatusFilter = "all" | "open" | "done";
type DifficultyFilter = "all" | Difficulty;

const REVIEWED_KEY = "java-interview-guide.reviewed";
const CHROME_KEY = "java-interview-guide.chrome";
const STUDY_KEY = "java-interview-guide.study";
const TOTAL = countQuestions(sections);
const CONCEPT_TOTAL = countConcepts(sections);

const copy = {
  pt: {
    kicker: "Caderno de entrevista",
    title: "Java para a vaga de backend",
    lede: "Cada seção começa pela teoria, para ler com calma. As perguntas vêm depois: o bloco creme é como falar em português, o verde é a mesma resposta em inglês.",
    method: "Leia a definição. Depois fale noventa segundos: a frase direta, o mecanismo, um exemplo de produção e o limite.",
    search: "Buscar teoria ou pergunta",
    theory: "Teoria",
    theoryHint: "Leia a definição. As perguntas desta seção vêm em seguida.",
    questions: "Perguntas",
    allSections: "Todas as seções",
    allLevels: "Todos os níveis",
    allStatus: "Todas",
    openStatus: "Por revisar",
    doneStatus: "Revisadas",
    study: "Modo estudo",
    studyHint: "Esconde a resposta até você tentar",
    empty: "Nada com esse filtro.",
    reviewed: "revisadas",
    print: "Imprimir",
  },
  en: {
    kicker: "Interview brief",
    title: "Java for a backend interview",
    lede: "Each section opens with the theory, so you can read it first. The questions come after: the cream column is how to say it in Portuguese, the green column is the same answer in English.",
    method: "Read the definition. Then speak for ninety seconds: the direct sentence, the mechanism, a production example, and the limit.",
    search: "Search theory or questions",
    theory: "Theory",
    theoryHint: "Read the definition. The questions for this section come after.",
    questions: "Questions",
    allSections: "All sections",
    allLevels: "All levels",
    allStatus: "All",
    openStatus: "Still open",
    doneStatus: "Reviewed",
    study: "Study mode",
    studyHint: "Hides the answer until you try",
    empty: "Nothing matches this filter.",
    reviewed: "reviewed",
    print: "Print",
  },
} as const;

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function haystackOf(question: InterviewQuestion): string {
  const blockText = [...question.pt.blocks, ...question.en.blocks].map((block) => block.text);
  return normalize(
    [
      question.titles.pt,
      question.titles.en,
      question.pt.howToAnswer,
      question.en.howToAnswer,
      question.pt.avoid,
      question.en.avoid,
      ...question.pt.expectedPoints,
      ...question.en.expectedPoints,
      ...question.covers,
      ...blockText,
    ].join(" "),
  );
}

const haystacks = new Map<string, string>(
  sections.flatMap((section) =>
    section.questions.map((question) => [question.id, haystackOf(question)] as const),
  ),
);

function conceptHaystackOf(item: TheoryConcept): string {
  const blockText = [...item.pt.blocks, ...item.en.blocks].map((block) => block.text);
  return normalize([item.titles.pt, item.titles.en, ...blockText].join(" "));
}

const conceptHaystacks = new Map<string, string>(
  sections.flatMap((section) =>
    section.theory.flatMap((group) =>
      group.concepts.map((item) => [item.id, conceptHaystackOf(item)] as const),
    ),
  ),
);

function readStoredSet(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return new Set();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

function questionMatches(
  question: InterviewQuestion,
  query: string,
  difficulty: DifficultyFilter,
  status: StatusFilter,
  reviewed: ReadonlySet<string>,
): boolean {
  if (difficulty !== "all" && question.difficulty !== difficulty) {
    return false;
  }
  const isReviewed = reviewed.has(question.id);
  if (status === "done" && !isReviewed) {
    return false;
  }
  if (status === "open" && isReviewed) {
    return false;
  }
  if (query.length === 0) {
    return true;
  }
  if (haystacks.get(question.id)?.includes(query)) {
    return true;
  }
  if (question.conceptId === undefined) {
    return false;
  }
  return conceptHaystacks.get(question.conceptId)?.includes(query) ?? false;
}

export function StudyDesk(): ReactNode {
  const [chrome, setChrome] = useState<Chrome>("pt");
  const [query, setQuery] = useState("");
  const [sectionId, setSectionId] = useState("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [studyMode, setStudyMode] = useState(false);
  const [reviewed, setReviewed] = useState<ReadonlySet<string>>(new Set());
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set());
  const [isReady, setIsReady] = useState(false);
  const text = copy[chrome];
  const normalizedQuery = normalize(query.trim());
  useEffect(() => {
    const storedChrome = window.localStorage.getItem(CHROME_KEY);
    if (storedChrome === "en" || storedChrome === "pt") {
      setChrome(storedChrome);
    }
    setStudyMode(window.localStorage.getItem(STUDY_KEY) === "1");
    setReviewed(readStoredSet(REVIEWED_KEY));
    setIsReady(true);
  }, []);
  useEffect(() => {
    if (!isReady) {
      return;
    }
    window.localStorage.setItem(REVIEWED_KEY, JSON.stringify([...reviewed]));
  }, [reviewed, isReady]);
  const visible = useMemo(() => {
    const drillMode = difficulty !== "all" || status !== "all";
    return sections
      .filter((section) => sectionId === "all" || section.id === sectionId)
      .map((section) => {
        const questions = section.questions.filter((question) =>
          questionMatches(question, normalizedQuery, difficulty, status, reviewed),
        );
        const linked = new Set(
          questions.flatMap((question) => (question.conceptId === undefined ? [] : [question.conceptId])),
        );
        const theory = section.theory
          .map((group) => ({
            group,
            concepts: group.concepts.filter((item) => {
              const textHit = normalizedQuery.length === 0 || (conceptHaystacks.get(item.id)?.includes(normalizedQuery) ?? false);
              if (drillMode) {
                return linked.has(item.id);
              }
              return textHit || linked.has(item.id);
            }),
          }))
          .filter((entry) => entry.concepts.length > 0);
        return { section, theory, questions };
      })
      .filter((entry) => entry.theory.length > 0 || entry.questions.length > 0);
  }, [sectionId, normalizedQuery, difficulty, status, reviewed]);
  const shownCount = visible.reduce((total, entry) => total + entry.questions.length, 0);
  let runningIndex = 0;
  sections.forEach((section) => {
    if (sectionId !== "all" && section.id !== sectionId) {
      return;
    }
    runningIndex += section.questions.length;
  });
  const offsetBefore = new Map<string, number>();
  let cursor = 0;
  sections.forEach((section) => {
    offsetBefore.set(section.id, cursor);
    cursor += section.questions.length;
  });
  function toggleReviewed(id: string): void {
    setReviewed((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
  function reveal(id: string): void {
    setRevealed((current) => new Set(current).add(id));
  }
  function changeChrome(next: Chrome): void {
    setChrome(next);
    window.localStorage.setItem(CHROME_KEY, next);
  }
  function changeStudyMode(enabled: boolean): void {
    setStudyMode(enabled);
    window.localStorage.setItem(STUDY_KEY, enabled ? "1" : "0");
  }
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ember-soft">
              {text.kicker}
            </p>
            <div className="no-print flex rounded-full border border-white/15 p-1 text-sm">
              <button
                type="button"
                onClick={() => changeChrome("pt")}
                className={chrome === "pt" ? "rounded-full bg-paper px-3 py-1 font-semibold text-ink" : "px-3 py-1 text-paper/80"}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => changeChrome("en")}
                className={chrome === "en" ? "rounded-full bg-paper px-3 py-1 font-semibold text-ink" : "px-3 py-1 text-paper/80"}
              >
                EN
              </button>
            </div>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{text.title}</h1>
            <p className="mt-4 text-base leading-7 text-paper/80">{text.lede}</p>
            <p className="mt-3 text-base leading-7 text-ember-soft">{text.method}</p>
          </div>
          <p className="font-mono text-sm text-paper/70">
            {CONCEPT_TOTAL} {chrome === "pt" ? "definições" : "definitions"}
            {" · "}
            {TOTAL} {chrome === "pt" ? "perguntas" : "questions"}
            {" · "}
            {sections.length} {chrome === "pt" ? "seções" : "sections"}
            {" · "}
            {isReady ? reviewed.size : "–"} {text.reviewed}
          </p>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="no-print lg:sticky lg:top-4 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            <SectionButton
              active={sectionId === "all"}
              label={text.allSections}
              count={TOTAL}
              onClick={() => setSectionId("all")}
            />
            {sections.map((section) => (
              <SectionButton
                key={section.id}
                active={sectionId === section.id}
                label={section.titles[chrome]}
                count={section.questions.length}
                onClick={() => {
                  setSectionId(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ block: "start" });
                }}
              />
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <div className="no-print sticky top-0 z-10 -mx-5 mb-6 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
            <div className="flex flex-col gap-3">
              <label className="block">
                <span className="sr-only">{text.search}</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={text.search}
                  className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm outline-none ring-ember focus:ring-2"
                />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={difficulty}
                  onChange={(value) => setDifficulty(value as DifficultyFilter)}
                  options={[
                    { value: "all", label: text.allLevels },
                    { value: "junior", label: chrome === "pt" ? "Júnior" : "Junior" },
                    { value: "pleno", label: chrome === "pt" ? "Pleno" : "Mid-level" },
                    { value: "senior", label: chrome === "pt" ? "Sênior" : "Senior" },
                  ]}
                />
                <Select
                  value={status}
                  onChange={(value) => setStatus(value as StatusFilter)}
                  options={[
                    { value: "all", label: text.allStatus },
                    { value: "open", label: text.openStatus },
                    { value: "done", label: text.doneStatus },
                  ]}
                />
                <label className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={studyMode}
                    onChange={(event) => changeStudyMode(event.target.checked)}
                  />
                  <span>
                    {text.study}
                    <span className="hidden text-muted sm:inline"> · {text.studyHint}</span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg border border-line bg-card px-3 py-2 text-sm"
                >
                  {text.print}
                </button>
                <span className="text-sm text-muted">
                  {shownCount}/{runningIndex}
                </span>
              </div>
            </div>
          </div>
          {visible.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line bg-card px-5 py-10 text-center text-muted">
              {text.empty}
            </p>
          ) : (
            <div className="space-y-10">
              {visible.map(({ section, theory, questions }) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  theory={theory}
                  questions={questions}
                  chrome={chrome}
                  startIndex={(offsetBefore.get(section.id) ?? 0) + 1}
                  reviewed={reviewed}
                  revealed={revealed}
                  studyMode={studyMode}
                  onToggleReviewed={toggleReviewed}
                  onReveal={reveal}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SectionButton({
  active,
  label,
  count,
  onClick,
}: {
  readonly active: boolean;
  readonly label: string;
  readonly count: number;
  readonly onClick: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex shrink-0 items-center justify-between gap-3 rounded-lg bg-ink px-3 py-2 text-left text-sm text-paper lg:w-full"
          : "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-card lg:w-full"
      }
    >
      <span>{label}</span>
      <span className="font-mono text-xs opacity-70">{count}</span>
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly { readonly value: string; readonly label: string }[];
}): ReactNode {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-line bg-card px-3 py-2 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function indexInGroup(section: InterviewSection, groupId: string, conceptId: string): number {
  const group = section.theory.find((item) => item.id === groupId);
  if (!group) {
    return 1;
  }
  const found = group.concepts.findIndex((item) => item.id === conceptId);
  return found < 0 ? 1 : found + 1;
}

function SectionBlock({
  section,
  theory,
  questions,
  chrome,
  startIndex,
  reviewed,
  revealed,
  studyMode,
  onToggleReviewed,
  onReveal,
}: {
  readonly section: InterviewSection;
  readonly theory: readonly { readonly group: TheoryGroup; readonly concepts: readonly TheoryConcept[] }[];
  readonly questions: readonly InterviewQuestion[];
  readonly chrome: Chrome;
  readonly startIndex: number;
  readonly reviewed: ReadonlySet<string>;
  readonly revealed: ReadonlySet<string>;
  readonly studyMode: boolean;
  readonly onToggleReviewed: (id: string) => void;
  readonly onReveal: (id: string) => void;
}): ReactNode {
  const text = copy[chrome];
  return (
    <section id={section.id} className="scroll-mt-28">
      <header className="mb-4">
        <h2 className="font-serif text-3xl">{section.titles[chrome]}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
          {section.summaries[chrome]}
        </p>
      </header>
      {theory.length > 0 ? (
        <div id={`${section.id}-theory`} className="mb-10 scroll-mt-28">
          <h3 className="font-serif text-2xl">{text.theory}</h3>
          <p className="mt-1 mb-4 max-w-2xl text-sm leading-6 text-muted">{text.theoryHint}</p>
          <div className="space-y-8">
            {theory.map(({ group, concepts }) => (
              <div key={group.id} className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {group.titles[chrome]}
                </h4>
                {concepts.map((item) => (
                  <ConceptCard
                    key={item.id}
                    index={indexInGroup(section, group.id, item.id)}
                    concept={item}
                    groupLabel={group.titles[chrome]}
                    chrome={chrome}
                    questions={questions.filter((question) => question.conceptId === item.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {questions.length > 0 ? (
        <div id={`${section.id}-questions`} className="scroll-mt-28">
          <h3 className="mb-4 font-serif text-2xl">{text.questions}</h3>
          <div className="space-y-5">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                index={startIndex + section.questions.findIndex((item) => item.id === question.id)}
                question={question}
                sectionLabel={section.titles[chrome]}
                chrome={chrome}
                isReviewed={reviewed.has(question.id)}
                isRevealed={revealed.has(question.id)}
                studyMode={studyMode}
                onToggleReviewed={onToggleReviewed}
                onReveal={onReveal}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
