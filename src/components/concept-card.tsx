import type { ReactNode } from "react";
import type { InterviewQuestion, TheoryConcept } from "@/content/interview-model";
import { RichText } from "@/components/rich-text";

type Chrome = "pt" | "en";

type ConceptCardProps = {
  readonly index: number;
  readonly concept: TheoryConcept;
  readonly groupLabel: string;
  readonly chrome: Chrome;
  readonly questions: readonly InterviewQuestion[];
};

export function ConceptCard({
  index,
  concept,
  groupLabel,
  chrome,
  questions,
}: ConceptCardProps): ReactNode {
  const number = String(index).padStart(2, "0");
  return (
    <article id={concept.id} className="scroll-mt-24 rounded-xl border border-line bg-card">
      <header className="border-b border-line px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
          <span className="font-mono text-ember">{number}</span>
          <span>{groupLabel}</span>
          <span className="rounded-full bg-ember-soft px-2 py-0.5 text-[11px] font-semibold tracking-normal text-ember normal-case">
            {chrome === "pt" ? "Definição" : "Definition"}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
          {concept.titles.pt}
        </h3>
        <p className="mt-1 text-base text-muted">{concept.titles.en}</p>
      </header>
      <div className="grid gap-0 lg:grid-cols-2">
        <section lang="pt" className="border-b border-line px-5 py-5 sm:px-6 lg:border-r lg:border-b-0">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ember">
            Português · teoria
          </p>
          <RichText blocks={concept.pt.blocks} />
        </section>
        <section lang="en" className="bg-moss/60 px-5 py-5 sm:px-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-pine">
            English · theory
          </p>
          <RichText blocks={concept.en.blocks} />
        </section>
      </div>
      {questions.length > 0 ? (
        <footer className="flex flex-wrap gap-2 border-t border-line px-5 py-3 sm:px-6">
          {questions.map((question, questionIndex) => (
            <a
              key={question.id}
              href={`#${question.id}`}
              className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ember"
            >
              {questions.length === 1
                ? chrome === "pt"
                  ? "Ir para a pergunta"
                  : "Go to the question"
                : chrome === "pt"
                  ? `Pergunta ${questionIndex + 1}`
                  : `Question ${questionIndex + 1}`}
            </a>
          ))}
        </footer>
      ) : null}
    </article>
  );
}
