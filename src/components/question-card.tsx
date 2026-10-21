import type { ReactNode } from "react";
import type { InterviewQuestion } from "@/content/interview-model";
import { RichText } from "@/components/rich-text";

type Chrome = "pt" | "en";

type QuestionCardProps = {
  readonly index: number;
  readonly question: InterviewQuestion;
  readonly sectionLabel: string;
  readonly chrome: Chrome;
  readonly isReviewed: boolean;
  readonly isRevealed: boolean;
  readonly studyMode: boolean;
  readonly onToggleReviewed: (id: string) => void;
  readonly onReveal: (id: string) => void;
};

const difficultyLabel: Record<
  InterviewQuestion["difficulty"],
  Record<Chrome, string>
> = {
  junior: { pt: "Júnior", en: "Junior" },
  pleno: { pt: "Pleno", en: "Mid-level" },
  senior: { pt: "Sênior", en: "Senior" },
};

function PointList({ points }: { readonly points: readonly string[] }): ReactNode {
  return (
    <ul className="space-y-1.5">
      {points.map((point) => (
        <li key={point} className="flex gap-2 text-[15px] leading-6">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function QuestionCard({
  index,
  question,
  sectionLabel,
  chrome,
  isReviewed,
  isRevealed,
  studyMode,
  onToggleReviewed,
  onReveal,
}: QuestionCardProps): ReactNode {
  const showModel = !studyMode || isRevealed;
  const number = String(index).padStart(2, "0");
  return (
    <article id={question.id} className="scroll-mt-24 rounded-xl border border-line bg-card shadow-[0_1px_0_rgba(36,28,21,0.04)]">
      <header className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
          <span className="font-mono text-ember">{number}</span>
          <span>{sectionLabel}</span>
          <span className="rounded-full bg-ember-soft px-2 py-0.5 text-[11px] font-semibold tracking-normal text-ember normal-case">
            {difficultyLabel[question.difficulty][chrome]}
          </span>
          <span className="normal-case tracking-normal">
            {chrome === "pt"
              ? `cerca de ${question.speakSeconds}s`
              : `about ${question.speakSeconds}s`}
          </span>
        </div>
        <div>
          <h3 className="font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
            {question.titles.pt}
          </h3>
          <p className="mt-1 text-base text-muted">{question.titles.en}</p>
          {question.conceptId ? (
            <a href={`#${question.conceptId}`} className="mt-2 inline-block text-sm font-semibold text-ember">
              {chrome === "pt" ? "Ver a definição" : "Read the definition"}
            </a>
          ) : null}
        </div>
        {question.covers.length > 1 ? (
          <p className="text-sm leading-6 text-muted">
            <span className="font-semibold text-ink">
              {chrome === "pt" ? "Unifica: " : "Merges: "}
            </span>
            {question.covers.join(" · ")}
          </p>
        ) : null}
      </header>
      <div className="grid gap-0 lg:grid-cols-2">
        <section lang="pt" className="border-b border-line px-5 py-5 sm:px-6 lg:border-r lg:border-b-0">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ember">
            Português · como responder
          </p>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink">
            Roteiro
          </h4>
          <p className="mb-5 text-[15.5px] leading-7">{question.pt.howToAnswer}</p>
          {showModel ? (
            <>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink">
                Resposta modelo
              </h4>
              <RichText blocks={question.pt.blocks} />
            </>
          ) : (
            <p className="text-sm text-muted">
              A resposta modelo está escondida. Fale o roteiro em voz alta e depois revele.
            </p>
          )}
          <h4 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-ink">
            Não pode faltar
          </h4>
          <PointList points={question.pt.expectedPoints} />
          <p className="mt-4 rounded-md bg-ember-soft px-3 py-2 text-sm leading-6 text-ink">
            <span className="font-semibold">Evite. </span>
            {question.pt.avoid}
          </p>
        </section>
        <section lang="en" className="bg-moss/60 px-5 py-5 sm:px-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-pine">
            English · model answer
          </p>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-pine">
            How to deliver it
          </h4>
          <p className="mb-5 text-[15.5px] leading-7">{question.en.howToAnswer}</p>
          {showModel ? (
            <>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-pine">
                Model answer
              </h4>
              <RichText blocks={question.en.blocks} />
            </>
          ) : (
            <p className="text-sm text-pine/80">
              The model answer is hidden. Say the outline aloud, then reveal it.
            </p>
          )}
          <h4 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-pine">
            Must land
          </h4>
          <PointList points={question.en.expectedPoints} />
          <p className="mt-4 rounded-md bg-white/70 px-3 py-2 text-sm leading-6 text-pine">
            <span className="font-semibold">Avoid. </span>
            {question.en.avoid}
          </p>
        </section>
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3 sm:px-6">
        {studyMode && !isRevealed ? (
          <button
            type="button"
            onClick={() => onReveal(question.id)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
          >
            {chrome === "pt" ? "Revelar resposta" : "Reveal answer"}
          </button>
        ) : null}
        <button
          type="button"
          aria-pressed={isReviewed}
          onClick={() => onToggleReviewed(question.id)}
          className={
            isReviewed
              ? "rounded-full border border-pine bg-pine px-4 py-2 text-sm font-semibold text-paper"
              : "rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink"
          }
        >
          {isReviewed
            ? chrome === "pt"
              ? "Revisada"
              : "Reviewed"
            : chrome === "pt"
              ? "Marcar como revisada"
              : "Mark as reviewed"}
        </button>
      </footer>
    </article>
  );
}
