export type Difficulty = "junior" | "pleno" | "senior";

export type TextBlock = {
  readonly type: "paragraph" | "code";
  readonly text: string;
};

export type LocaleAnswer = {
  readonly howToAnswer: string;
  readonly blocks: readonly TextBlock[];
  readonly expectedPoints: readonly string[];
  readonly avoid: string;
};

export type TheoryConcept = {
  readonly id: string;
  readonly titles: {
    readonly pt: string;
    readonly en: string;
  };
  readonly pt: {
    readonly blocks: readonly TextBlock[];
  };
  readonly en: {
    readonly blocks: readonly TextBlock[];
  };
};

export type TheoryGroup = {
  readonly id: string;
  readonly titles: {
    readonly pt: string;
    readonly en: string;
  };
  readonly concepts: readonly TheoryConcept[];
};

export type InterviewQuestion = {
  readonly id: string;
  readonly conceptId?: string;
  readonly difficulty: Difficulty;
  readonly speakSeconds: number;
  readonly titles: {
    readonly pt: string;
    readonly en: string;
  };
  readonly covers: readonly string[];
  readonly pt: LocaleAnswer;
  readonly en: LocaleAnswer;
};

export type InterviewSection = {
  readonly id: string;
  readonly order: number;
  readonly titles: {
    readonly pt: string;
    readonly en: string;
  };
  readonly summaries: {
    readonly pt: string;
    readonly en: string;
  };
  readonly theory: readonly TheoryGroup[];
  readonly questions: readonly InterviewQuestion[];
};

export function concept(
  id: string,
  ptTitle: string,
  enTitle: string,
  ptBlocks: readonly TextBlock[],
  enBlocks: readonly TextBlock[],
): TheoryConcept {
  return {
    id,
    titles: { pt: ptTitle, en: enTitle },
    pt: { blocks: ptBlocks },
    en: { blocks: enBlocks },
  };
}

export function theoryGroup(
  id: string,
  ptTitle: string,
  enTitle: string,
  concepts: readonly TheoryConcept[],
): TheoryGroup {
  return { id, titles: { pt: ptTitle, en: enTitle }, concepts };
}

export function paragraph(text: string): TextBlock {
  return { type: "paragraph", text };
}

export function code(text: string): TextBlock {
  return { type: "code", text };
}

export function locale(
  howToAnswer: string,
  blocks: readonly TextBlock[],
  expectedPoints: readonly string[],
  avoid: string,
): LocaleAnswer {
  return { howToAnswer, blocks, expectedPoints, avoid };
}
