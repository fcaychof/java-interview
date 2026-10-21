# Java interview guide

A study desk for a Java backend interview. Each section opens with the theory, in Portuguese and English, and the questions come after. The cream column is how to say the answer in Portuguese. The green column is the same answer in English, at interview length.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run build` builds the static app, `npm run start` serves that build, and `npm run lint` runs ESLint.

Progress stays in the browser: reviewed questions, the PT/EN chrome, and study mode. Study mode hides the model answer until you reveal it. The theory stays visible.

## What is on the page

The path is String, concurrency, JVM, Java 8, 17, 21, and 25, SOLID, GoF patterns, software design, Spring Boot, transactions, money, Kafka, microservices, security, production, code quality and AWS, then system design.

GoF is the full catalog of 23 patterns, grouped as creational, structural, and behavioral, with one question for each pattern. A definition links to its question, and a question links back to the definition.

## Add a section

Content lives in `src/content`. A section is an `InterviewSection`: titles, a summary, `theory`, then `questions`. Theory groups and concepts are built with `theoryGroup` and `concept`. Questions use `locale`, `paragraph`, and `code`.

Put the theory in `src/content/theory/` and the section in `src/content/sections/`. Register the section in `src/content/catalog.ts`, in study order. Question ids and concept ids must be unique. A question can point at its concept with `conceptId`. The catalog throws on startup if an id is duplicated or a `conceptId` does not exist.
