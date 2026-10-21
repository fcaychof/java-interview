import type { ReactNode } from "react";
import type { TextBlock } from "@/content/interview-model";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

type RichTextProps = {
  readonly blocks: readonly TextBlock[];
};

function renderInline(text: string): ReactNode[] {
  return text.split(TOKEN).filter((part) => part.length > 0).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-ink/5 px-1 py-0.5 font-mono text-[0.92em] text-ember"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function RichText({ blocks }: RichTextProps): ReactNode {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) =>
        block.type === "code" ? (
          <pre
            key={index}
            className="overflow-x-auto rounded-md border border-line bg-ink px-4 py-3 font-mono text-[13px] leading-6 text-paper"
          >
            <code>{block.text}</code>
          </pre>
        ) : (
          <p key={index} className="text-[15.5px] leading-7">
            {renderInline(block.text)}
          </p>
        ),
      )}
    </div>
  );
}
