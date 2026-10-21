import {
  concept,
  locale,
  paragraph,
  theoryGroup,
  type InterviewSection,
} from "../interview-model";
import { gofBehavioral } from "./gof-behavioral";
import { gofCreational } from "./gof-creational";
import { gofStructural } from "./gof-structural";

export const gof: InterviewSection = {
  id: "gof",
  order: 6,
  titles: {
    pt: "Padrões GoF",
    en: "GoF patterns",
  },
  summaries: {
    pt: "Os vinte e três padrões para ler, família por família. As perguntas vêm depois, uma para cada padrão.",
    en: "The twenty-three patterns to read, family by family. The questions come after, one for each pattern.",
  },
  theory: [
    theoryGroup("gof-catalog", "O catálogo", "The catalog", [
      concept(
        "def-gof-catalog",
        "O que é um padrão GoF",
        "What a GoF pattern is",
        [
          paragraph("Os padrões GoF são as vinte e três soluções nomeadas no livro Design Patterns para problemas que voltam em código orientado a objeto. O nome existe para duas pessoas falarem do mesmo compromisso sem desenhar a estrutura do zero. Não é um framework, e não é uma meta implementar a lista."),
          paragraph("A divisão segue a intenção. Criação decide quem monta o objeto: Singleton, Factory Method, Abstract Factory, Builder e Prototype. Estrutura decide como os tipos se encaixam: Adapter, Bridge, Composite, Decorator, Facade, Flyweight e Proxy. Comportamento decide a colaboração na hora de executar: os onze restantes, de Chain of Responsibility a Visitor."),
          paragraph("Num backend Java eu uso o nome quando a mesma variação já voltou e a revisão fica mais curta com ele. O primeiro if não ganha classe nova. Vários desses padrões o Spring já entrega. Reconhecer no framework vale mais do que desenhar de novo dentro do serviço."),
        ],
        [
          paragraph("The GoF patterns are the twenty-three named solutions in the Design Patterns book for problems that keep coming back in object-oriented code. The name exists so two people can talk about the same tradeoff without drawing the structure from scratch. It is not a framework, and it is not a goal to implement the list."),
          paragraph("The split follows intent. Creational patterns decide who builds the object: Singleton, Factory Method, Abstract Factory, Builder, and Prototype. Structural patterns decide how types fit together: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, and Proxy. Behavioral patterns decide the collaboration at runtime: the remaining eleven, from Chain of Responsibility to Visitor."),
          paragraph("In a Java backend I use the name when the same variation has already come back and the review gets shorter with it. The first if does not earn a new class. Spring already provides several of these patterns. Recognizing one in the framework is worth more than drawing it again inside the service."),
        ],
      ),
      concept(
        "def-gof-spring",
        "O que o Spring já entrega",
        "What Spring already provides",
        [
          paragraph("O escopo singleton é uma instância do bean, injetada pelo construtor, não um getInstance. @Transactional e o Spring Data passam por proxy. FactoryBean concentra uma criação que não cabe num new. JdbcTemplate é o esqueleto do Template Method com um callback. A cadeia de filtros é Chain of Responsibility. ApplicationEvent é Observer."),
          paragraph("Reimplementar isso no serviço duplica o que o container já faz. Os outros padrões continuam no catálogo e só saem da estante com o problema na mesa: Prototype, Flyweight, Memento, Interpreter, Visitor, Mediator, Bridge, Composite e Command. A classe nova aparece na segunda variação."),
        ],
        [
          paragraph("The singleton scope is one bean instance, injected through the constructor, not a getInstance. @Transactional and Spring Data go through a proxy. FactoryBean holds a creation that does not fit in a new. JdbcTemplate is the Template Method skeleton with a callback. The filter chain is Chain of Responsibility. ApplicationEvent is Observer."),
          paragraph("Rebuilding that in the service duplicates what the container already does. The other patterns stay in the catalog and only come off the shelf with the problem on the table: Prototype, Flyweight, Memento, Interpreter, Visitor, Mediator, Bridge, Composite, and Command. The new class shows up at the second variation."),
        ],
      ),
    ]),
    gofCreational.group,
    gofStructural.group,
    gofBehavioral.group,
  ],
  questions: [
    {
      id: "gof-overview",
      conceptId: "def-gof-catalog",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que são os padrões GoF e como eles se dividem?",
        en: "What are the GoF patterns, and how are they grouped?",
      },
      covers: [
        "What are design patterns?",
        "What are the Gang of Four patterns?",
        "What is the difference between creational, structural, and behavioral patterns?",
      ],
      pt: locale(
        "Diga o que o nome resolve. Três famílias, um exemplo de cada. Não recite os vinte e três.",
        [
          paragraph("São as soluções nomeadas no livro Design Patterns para problemas que se repetem. O nome deixa duas pessoas falarem do mesmo compromisso. Não é framework e não é meta usar os vinte e três."),
          paragraph("Criação monta o objeto: Singleton, Factory Method, Builder. Estrutura encaixa os tipos: Adapter, Decorator, Proxy. Comportamento combina a execução: Strategy, Observer, State. Eu uso o nome quando a variação já voltou. O primeiro if não ganha classe nova."),
        ],
        [
          "Um nome para um problema que já se repete",
          "Três famílias: criação, estrutura, comportamento",
          "O primeiro if não justifica o padrão",
        ],
        "Não recite os vinte e três. Também não diga que usar padrão é sinônimo de código bom.",
      ),
      en: locale(
        "Say what the name is for. Three families, one example each. Do not recite all twenty-three.",
        [
          paragraph("They are the named solutions in the Design Patterns book for problems that repeat. The name lets two people talk about the same tradeoff. It is not a framework and it is not a goal to use all twenty-three."),
          paragraph("Creational patterns build the object: Singleton, Factory Method, Builder. Structural patterns fit the types together: Adapter, Decorator, Proxy. Behavioral patterns combine the runtime: Strategy, Observer, State. I use the name when the variation has already come back. The first if does not earn a new class."),
        ],
        [
          "A name for a problem that already repeats",
          "Three families: creational, structural, behavioral",
          "The first if does not justify the pattern",
        ],
        "Do not recite all twenty-three. Do not say that using a pattern means the code is good.",
      ),
    },
    ...gofCreational.questions,
    ...gofStructural.questions,
    ...gofBehavioral.questions,
    {
      id: "gof-in-spring",
      conceptId: "def-gof-spring",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "Quais padrões GoF o Spring já entrega, e quais eu não instalo?",
        en: "Which GoF patterns does Spring already provide, and which ones do you leave out?",
      },
      covers: ["Which GoF patterns does Spring use?", "When should you avoid a design pattern?"],
      pt: locale(
        "Aponte os que você reconhece, cada um com o lugar. Agrupe o resto pelo problema que os tiraria da estante. A classe nova só aparece na segunda variação.",
        [
          paragraph("Escopo singleton é o bean injetado, não um getInstance. Transactional e Spring Data são proxy. FactoryBean concentra a criação. JdbcTemplate é Template Method com callback. Filtro é Chain of Responsibility. ApplicationEvent é Observer."),
          paragraph("Prototype, Flyweight e Memento tratam de clonar, compartilhar e guardar snapshot. Interpreter e Visitor servem a uma estrutura cuja operação muda mais do que a forma. Mediator, Bridge e Composite entram se a conversa, as duas hierarquias ou a árvore já doem. Command a fila já carrega. Antes da segunda variação, o if claro ganha da hierarquia."),
        ],
        [
          "Singleton, proxy, factory, template, cadeia e evento, no lugar certo",
          "O resto só sai da estante com o problema na mesa",
          "A segunda variação justifica a classe nova",
        ],
        "Não responda que o Spring usa todos. Não proponha Visitor para um CRUD.",
      ),
      en: locale(
        "Point at the ones you recognize, each with its place. Group the rest by the problem that would take them off the shelf. The new class shows up at the second variation.",
        [
          paragraph("The singleton scope is the injected bean, not a getInstance. Transactional and Spring Data are proxies. FactoryBean holds the creation. JdbcTemplate is Template Method with a callback. A filter is Chain of Responsibility. ApplicationEvent is Observer."),
          paragraph("Prototype, Flyweight, and Memento deal with cloning, sharing, and keeping a snapshot. Interpreter and Visitor serve a structure whose operation changes more than its shape. Mediator, Bridge, and Composite come in if the conversation, the two hierarchies, or the tree already hurt. A queue already carries Command. Before the second variation, the clear if beats the hierarchy."),
        ],
        [
          "Singleton, proxy, factory, template, chain, and event, in the right place",
          "The rest stays on the shelf until the problem is on the table",
          "The second variation justifies the new class",
        ],
        "Do not answer that Spring uses all of them. Do not propose Visitor for a CRUD.",
      ),
    },
  ],
};
