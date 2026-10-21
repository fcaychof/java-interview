import type { InterviewSection } from "./interview-model";
import { concurrency } from "./sections/concurrency";
import { gof } from "./sections/gof";
import { javaVersions } from "./sections/java-versions";
import { jvmMemory } from "./sections/jvm-memory";
import { kafka } from "./sections/kafka";
import { microservices } from "./sections/microservices";
import { money } from "./sections/money";
import { production } from "./sections/production";
import { qualityAndAws } from "./sections/quality-and-aws";
import { securityAndApis } from "./sections/security-and-apis";
import { softwareDesign } from "./sections/software-design";
import { solid } from "./sections/solid";
import { spring } from "./sections/spring";
import { stringAndCollections } from "./sections/string-and-collections";
import { systemDesign } from "./sections/system-design";
import { transactions } from "./sections/transactions";

const orderedSections: readonly InterviewSection[] = [
  stringAndCollections,
  concurrency,
  jvmMemory,
  javaVersions,
  solid,
  gof,
  softwareDesign,
  spring,
  transactions,
  money,
  kafka,
  microservices,
  securityAndApis,
  production,
  qualityAndAws,
  systemDesign,
];

function assertUniqueIds(
  sections: readonly InterviewSection[],
): readonly InterviewSection[] {
  const questionIds = new Set<string>();
  const conceptIds = new Set<string>();
  sections.forEach((section) => {
    const inSection = new Set<string>();
    section.theory.forEach((group) => {
      group.concepts.forEach((item) => {
        if (conceptIds.has(item.id)) {
          throw new Error(`Duplicate concept id: ${item.id}`);
        }
        conceptIds.add(item.id);
        inSection.add(item.id);
      });
    });
    section.questions.forEach((question) => {
      if (questionIds.has(question.id)) {
        throw new Error(`Duplicate question id: ${question.id}`);
      }
      questionIds.add(question.id);
      if (question.conceptId !== undefined && !inSection.has(question.conceptId)) {
        throw new Error(`Question ${question.id} points at missing concept ${question.conceptId}`);
      }
    });
  });
  return sections;
}

export const sections: readonly InterviewSection[] = assertUniqueIds(orderedSections);

export function countQuestions(source: readonly InterviewSection[]): number {
  return source.reduce(
    (total, section) => total + section.questions.length,
    0,
  );
}

export function countConcepts(source: readonly InterviewSection[]): number {
  return source.reduce(
    (total, section) =>
      total + section.theory.reduce((sum, group) => sum + group.concepts.length, 0),
    0,
  );
}
