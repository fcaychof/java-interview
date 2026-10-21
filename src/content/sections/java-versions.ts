import {
  code,
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { javaVersionsTheory } from "../theory/java-versions";

export const javaVersions: InterviewSection = {
  id: "java-versions",
  order: 4,
  titles: {
    pt: "Java 8 e Java 17",
    en: "Java 8 and Java 17",
  },
  summaries: {
    pt: "O que o Java 8 ensinou a API a expressar, e por que o salto para o 17 vale mesmo sem usar record.",
    en: "What Java 8 taught APIs to express, and why the move to 17 pays off even without records.",
  },
  theory: javaVersionsTheory,
  questions: [
    {
      id: "java8-features",
      conceptId: "def-java8",
      difficulty: "junior",
      speakSeconds: 80,
      titles: {
        pt: "Quais foram as principais novidades do Java 8?",
        en: "What are the major features introduced in Java 8?",
      },
      covers: ["What are the major features introduced in Java 8?"],
      pt: locale(
        "Não recite o release notes. Agrupe: estilo de programar, tempo, concorrência e a JVM. Cite lambda, Stream, Optional, java.time, default method e Metaspace. Diga uma consequência de cada, não só o nome.",
        [
          paragraph("No jeito de programar, o Java 8 trouxe lambda, method reference, métodos default e estáticos em interface, a Stream API e `Optional`. Isso permitiu expressar transformação de coleção sem o boilerplate do anonymous class, e permitiu evoluir interfaces como `Collection` sem quebrar quem já implementava."),
          paragraph("`java.time` substituiu o `Date` e o `Calendar` mutáveis por tipos imutáveis, com fuso explícito. `CompletableFuture` deu composição assíncrona. No mapa, colisão longa passou a virar árvore."),
          paragraph("Na memória, a PermGen saiu e entrou o Metaspace. Eu menciono isso porque muito incidente de produção daquela época era classe demais na PermGen, e o nome da área mudou junto com o comportamento."),
        ],
        [
          "Lambda, method reference, Stream, Optional, default method",
          "java.time e CompletableFuture",
          "PermGen substituída por Metaspace",
        ],
        "Não liste Nashorn como motivo para ficar no 8. Ele foi removido depois. Também não atribua virtual threads ao Java 8 nem ao 17.",
      ),
      en: locale(
        "Do not recite the release notes. Group them: programming style, time, concurrency, and the JVM. Name lambdas, Stream, Optional, java.time, default methods, and Metaspace, with one consequence each.",
        [
          paragraph("For programming style, Java 8 added lambdas, method references, default and static interface methods, the Stream API, and Optional. That let collection code say the transformation instead of an anonymous class, and let interfaces such as Collection grow without breaking implementors."),
          paragraph("java.time replaced mutable Date and Calendar with immutable types and an explicit zone. CompletableFuture added async composition. Long hash collisions became trees."),
          paragraph("PermGen was removed and Metaspace replaced it. I mention that because the production failure of that era changed name and behavior together."),
        ],
        [
          "Lambdas, method references, Stream, Optional, default methods",
          "java.time and CompletableFuture",
          "PermGen replaced by Metaspace",
        ],
        "Do not sell Nashorn as a reason to stay on 8. It was removed. Do not attribute virtual threads to Java 8 or 17.",
      ),
    },
    {
      id: "default-and-static-methods",
      conceptId: "def-default-methods",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Por que existem default method e static method em interface?",
        en: "Why do interfaces have default methods and static methods?",
      },
      covers: [
        "What is a default method in an interface? Why was it introduced?",
        "What is a static method in Java, and why is it useful?",
      ],
      pt: locale(
        "Separe os dois. Default method existe para evoluir a interface. Static method existe para função que pertence ao tipo mas não à instância. Diga o conflito do diamante em uma frase e não transforme interface em classe abstrata com estado.",
        [
          paragraph("Default method é implementação na interface. Ele foi introduzido para o Java 8 poder adicionar `stream()` e `sort()` em interfaces que já tinham milhares de implementações. Quem não sobrescreve herda o comportamento. Quem precisa, sobrescreve."),
          paragraph("Se duas interfaces dão default para o mesmo método, a classe é obrigada a resolver. A regra é a implementação mais específica. Eu não uso default method para carregar estado ou regra de negócio grande: interface não tem campo de instância. Isso continua sendo classe, de preferência composição."),
          paragraph("Método estático pertence ao tipo, não ao objeto. Não é herdado do mesmo jeito e não participa de override. Numa interface, ele guarda fábrica ou função relacionada, como `Comparator.comparing` e `List.of`, sem uma classe utilitária solta. Estático em classe continua útil para função pura que não lê instância, com a ressalva de que estático demais esconde dependência e atrapalha teste."),
        ],
        [
          "Default method evolui interface sem quebrar implementadores",
          "Conflito entre dois defaults tem de ser resolvido na classe",
          "Estático é função do tipo, sem override e sem estado de instância",
        ],
        "Não diga que default method existe para herança múltipla de estado. Não há estado de instância na interface.",
      ),
      en: locale(
        "Separate them. A default method evolves the interface. A static method is a function of the type, not of an instance. Mention the diamond conflict in one sentence. Do not turn an interface into a stateful abstract class.",
        [
          paragraph("A default method is an implementation on the interface. Java 8 needed it to add stream() and sort() to interfaces with thousands of existing implementors. You inherit the behavior or override it."),
          paragraph("If two interfaces provide a default for the same method, the class must resolve it. The most specific implementation wins. I do not put state or large business rules in a default method: an interface has no instance fields. That belongs in a class, usually by composition."),
          paragraph("A static method belongs to the type. It is not overridden. On an interface it holds a related factory or function, such as Comparator.comparing or List.of, without a stray utility class. A static method on a class is fine for a pure function, with the caveat that too many statics hide dependencies and hurt tests."),
        ],
        [
          "Default methods evolve an interface without breaking implementors",
          "Two defaults for one method must be resolved by the class",
          "Static is a function of the type, with no override and no instance state",
        ],
        "Do not say default methods exist for multiple inheritance of state.",
      ),
    },
    {
      id: "stream-api",
      conceptId: "def-stream",
      difficulty: "junior",
      speakSeconds: 70,
      titles: {
        pt: "O que é a Stream API?",
        en: "What is the Stream API?",
      },
      covers: ["What is the Stream API?"],
      pt: locale(
        "Defina como um pipeline preguiçoso sobre uma fonte, não como uma coleção nova. Separe operação intermediária de terminal. Avise que a stream se consome uma vez e que parallel não é o default.",
        [
          paragraph("Stream é uma visão de uma fonte, lista, arquivo ou generator, pela qual passam operações. Ela não guarda os elementos. Operação intermediária, como `filter` e `map`, devolve outra stream e não executa nada ainda. A operação terminal, como `collect`, `reduce`, `findFirst` ou `count`, dispara o pipeline. Por isso o processamento é preguiçoso: um `findFirst` pode parar cedo."),
          paragraph("A stream se consome uma vez. Ela não é estrutura para guardar e reutilizar. Também não se deve alterar a fonte durante o pipeline."),
          paragraph("`parallel()` divide o trabalho no common pool. Eu só uso com fonte grande, operação de CPU, sem I/O bloqueante e com ganho medido. No código de serviço, sequencial é o default."),
        ],
        [
          "Pipeline preguiçoso, não uma nova coleção",
          "Intermediária monta; terminal executa",
          "Uso único, e parallel só com medida",
        ],
        "Não diga que stream sempre é mais rápida que o for. Muitas vezes ela aloca mais e só fica mais legível.",
      ),
      en: locale(
        "Define it as a lazy pipeline over a source, not as a new collection. Separate intermediate from terminal. Say a stream is consumed once and that parallel is not the default.",
        [
          paragraph("A stream is a view over a source: a list, a file, or a generator. It does not store the elements. An intermediate operation such as filter or map returns another stream and does nothing yet. A terminal operation such as collect, reduce, findFirst, or count runs the pipeline. That laziness is why findFirst can stop early."),
          paragraph("A stream is consumed once. It is not a structure you keep and reuse. Do not modify the source during the pipeline."),
          paragraph("parallel() splits work on the common pool. I use it only for a large CPU-bound source, with no blocking I/O, and a measured gain. In service code, sequential is the default."),
        ],
        [
          "A lazy pipeline, not a new collection",
          "Intermediate builds; terminal runs",
          "Single use, and parallel only when measured",
        ],
        "Do not say a stream is always faster than a for loop. It often allocates more and is only more readable.",
      ),
    },
    {
      id: "method-reference",
      conceptId: "def-method-reference",
      difficulty: "junior",
      speakSeconds: 50,
      titles: {
        pt: "O que é method reference?",
        en: "What is a method reference?",
      },
      covers: ["What is a method reference?"],
      pt: locale(
        "Diga que é uma lambda que só chama um método que já existe. Mostre os quatro formatos com um exemplo curto e pare. Não invente regra de performance.",
        [
          paragraph("Method reference é um jeito curto de escrever uma lambda que apenas encaminha para um método existente. O tipo continua sendo a interface funcional do contexto, como `Function` ou `Consumer`."),
          code(
            "people.stream().map(Person::getName)\nlist.forEach(System.out::println)\nSupplier<List<String>> factory = ArrayList::new\nmap.forEach(OrderService::save)",
          ),
          paragraph("Os formatos são método de instância de um objeto, método de instância de um tipo, estático e construtor. Eu uso quando o nome do método diz tudo. Se a lambda ganha condição ou mais de uma chamada, method reference fica opaco e eu volto para a lambda."),
        ],
        [
          "É uma lambda que só delega",
          "Estático, instância, tipo e construtor",
          "Prefira a lambda quando houver lógica em volta",
        ],
        "Não diga que method reference é mais rápido que a lambda equivalente. O bytecode final é da mesma família.",
      ),
      en: locale(
        "Say it is a lambda that only calls an existing method. Show the four forms with a short example and stop. Do not invent a performance rule.",
        [
          paragraph("A method reference is a short way to write a lambda that only forwards to an existing method. Its type is still the functional interface expected by the context."),
          code(
            "people.stream().map(Person::getName)\nlist.forEach(System.out::println)\nSupplier<List<String>> factory = ArrayList::new",
          ),
          paragraph("The forms are a bound instance method, an unbound instance method, a static method, and a constructor. I use one when the method name says everything. If there is a condition or more than one call, I keep the lambda."),
        ],
        [
          "It is a lambda that only delegates",
          "Static, instance, unbound, and constructor",
          "Prefer a lambda when there is logic around the call",
        ],
        "Do not say a method reference is faster than the equivalent lambda.",
      ),
    },
    {
      id: "map-vs-flatmap",
      conceptId: "def-flatmap",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Qual é a diferença entre map() e flatMap()?",
        en: "What is the difference between map() and flatMap()?",
      },
      covers: ["What is the difference between map() and flatMap()?"],
      pt: locale(
        "Uma frase: map transforma um em um; flatMap transforma um em vários e achata. Use pedido e itens, não uma definição abstrata. Mencione Optional só se sobrar fôlego.",
        [
          paragraph("`map` aplica uma função a cada elemento e o resultado ocupa o lugar daquele elemento. De uma stream de pedidos eu tiro uma stream de clientes: um pedido, um cliente."),
          paragraph("`flatMap` entra quando a função devolve ela mesma uma stream, uma lista ou um optional. Sem achatar, o resultado seria stream de listas. `flatMap` concatena essas streams internas numa stream só. O exemplo que eu uso é pedido para itens: cada pedido tem vários itens, e eu quero uma stream de itens, não uma stream de listas de itens."),
          code(
            "orders.stream()\n    .flatMap(order -> order.items().stream())\n    .map(Item::sku)\n    .toList();",
          ),
          paragraph("Em `Optional`, `map` embrulha de novo e pode gerar optional de optional. `flatMap` serve quando a função já devolve `Optional`, por exemplo achar o pedido e, se existir, achar o pagamento."),
        ],
        [
          "map é um para um",
          "flatMap é um para muitos e achata",
          "Pedido para itens é o exemplo; Optional é o segundo uso",
        ],
        "Não diga que flatMap é um map mais rápido. A diferença é a forma do resultado, não a velocidade.",
      ),
      en: locale(
        "One sentence: map turns one into one; flatMap turns one into many and flattens. Use orders and line items. Mention Optional only if you have time.",
        [
          paragraph("map applies a function to each element and puts that result in its place. From a stream of orders I can get a stream of customers: one order, one customer."),
          paragraph("flatMap is for a function that itself returns a stream, a list, or an optional. Without flattening, the result would be a stream of lists. flatMap concatenates the inner streams. My example is orders to line items: each order has many items, and I want a stream of items."),
          code(
            "orders.stream()\n    .flatMap(order -> order.items().stream())\n    .map(Item::sku)\n    .toList();",
          ),
          paragraph("On Optional, map wraps again and can produce an optional of an optional. flatMap is what you want when the next lookup already returns an Optional."),
        ],
        [
          "map is one to one",
          "flatMap is one to many and flattens",
          "Orders to items is the example",
        ],
        "Do not say flatMap is a faster map. The difference is the shape of the result.",
      ),
    },
    {
      id: "sort-by-age",
      conceptId: "def-stream",
      difficulty: "junior",
      speakSeconds: 50,
      titles: {
        pt: "Como ordenar pessoas por idade com Java 8?",
        en: "How do you sort a list of Person by age using Java 8?",
      },
      covers: [
        "Given a list of Person objects containing name and age, sort by age in ascending order using Java 8.",
      ],
      pt: locale(
        "Escreva o pipeline na hora. Use comparingInt para não fazer boxing à toa. Diga se você devolve uma lista nova ou ordena a existente. Mencione empate por nome se o entrevistador perguntar estabilidade de negócio, não de algoritmo.",
        [
          paragraph("Se a lista pode ser substituída por uma nova, eu não altero a original:"),
          code(
            "List<Person> byAge = people.stream()\n    .sorted(Comparator.comparingInt(Person::getAge))\n    .toList();",
          ),
          paragraph("`comparingInt` compara o primitivo e evita o `Comparator.comparing(Person::getAge)`, que boxeia o int. Se a ordem for in-place, `people.sort(Comparator.comparingInt(Person::getAge))`. Para desempate, encadeio `thenComparing(Person::getName)`. Lista com null exige `nullsLast`; eu não deixo isso implícito."),
          paragraph("`toList()` devolve lista imutável a partir do Java 16. No Java 8 estrito, o terminal é `collect(Collectors.toList())`. Eu falo a versão do projeto em vez de misturar as duas."),
        ],
        [
          "sorted com Comparator.comparingInt",
          "Stream devolve outra lista; List.sort altera a mesma",
          "thenComparing para empate, e a versão do toList",
        ],
        "Não escreva um Comparator anônimo de dez linhas se o método de referência resolve. Também não ordene com parallel.",
      ),
      en: locale(
        "Write the pipeline. Use comparingInt to avoid boxing. Say whether you return a new list or sort in place. Mention a name tie-break only as a business follow-up.",
        [
          paragraph("If a new list is acceptable, I leave the original alone:"),
          code(
            "List<Person> byAge = people.stream()\n    .sorted(Comparator.comparingInt(Person::getAge))\n    .toList();",
          ),
          paragraph("comparingInt uses the primitive and avoids the boxing of Comparator.comparing. For an in-place order, people.sort(Comparator.comparingInt(Person::getAge)). A tie-break is thenComparing(Person::getName). A null age needs nullsLast."),
          paragraph("toList() returns an unmodifiable list from Java 16. On strict Java 8 the terminal is collect(Collectors.toList()). I name the project's version instead of mixing them."),
        ],
        [
          "sorted with Comparator.comparingInt",
          "The stream returns a new list; List.sort mutates",
          "thenComparing for ties, and know which toList you have",
        ],
        "Do not write a ten-line anonymous Comparator, and do not sort with parallel.",
      ),
    },
    {
      id: "optional",
      conceptId: "def-optional",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Quando uso Optional, e quando evito?",
        en: "When would you use Optional, and when should you avoid it?",
      },
      covers: [
        "When would you use Optional, and when should you avoid it?",
      ],
      pt: locale(
        "A regra que o entrevistador quer: Optional é tipo de retorno para ausência legítima. Não é campo, não é parâmetro e não é substituto de exceção. Mostre orElseThrow em vez de get.",
        [
          paragraph("Eu devolvo `Optional` num método que pode legitimamente não achar o valor, como `findById`. Quem chama é obrigado a decidir: `orElse`, `orElseGet`, `orElseThrow`, `map` ou `ifPresent`. Isso é melhor do que null espalhado, desde que o time inteiro respeite."),
          paragraph("Eu não uso `Optional` como campo de entidade, porque atrapalha serialização e persistência e sugere ausência no estado interno. Não uso como parâmetro: overload ou um tipo de domínio deixa a API mais clara. Não coloco `Optional` em coleção; coleção vazia já expressa ausência de elementos. E não uso para controle de fluxo no lugar de uma exceção de falha real. Não achar usuário pode ser Optional; falha de banco continua exceção."),
          paragraph("`Optional.get()` reintroduz a falha que o tipo queria evitar. Se o valor é obrigatório naquele ponto, `orElseThrow` com a exceção de negócio. Se há default barato, `orElse`. Se o default é caro, `orElseGet`, porque o argumento de `orElse` é calculado sempre."),
        ],
        [
          "Bom como retorno de busca que pode não achar",
          "Evitar em campo, parâmetro e coleção",
          "get é o método a não usar; orElseThrow deixa a decisão explícita",
        ],
        "Não diga que Optional substitui toda verificação de null, nem que ele deixa o código livre de NullPointerException.",
      ),
      en: locale(
        "The rule they want: Optional is a return type for a legitimate absence. It is not a field, not a parameter, and not a substitute for an exception. Show orElseThrow instead of get.",
        [
          paragraph("I return Optional from a method that may honestly find nothing, such as findById. The caller must choose orElse, orElseGet, orElseThrow, map, or ifPresent. That is better than scattered nulls if the team actually honors it."),
          paragraph("I do not use Optional as an entity field: it fights serialization and persistence. I do not use it as a parameter: an overload or a domain type is clearer. I do not put Optional inside a collection; an empty collection already means no elements. And I do not use it for a real failure. A missing user can be Optional; a database outage is still an exception."),
          paragraph("Optional.get() brings back the failure the type was meant to avoid. If the value is required at that point, orElseThrow with the business exception. If the default is expensive, orElseGet, because orElse always evaluates its argument."),
        ],
        [
          "Good as the return of a lookup that may miss",
          "Avoid it as a field, a parameter, and a collection element",
          "Do not call get; orElseThrow makes the decision explicit",
        ],
        "Do not say Optional replaces every null check or makes NullPointerException impossible.",
      ),
    },
    {
      id: "streams-vs-loops",
      conceptId: "def-stream",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Stream ou loop: quando prefiro um?",
        en: "Streams vs traditional loops: when would you prefer one?",
      },
      covers: [
        "Streams vs traditional loops — when would you prefer one over the other?",
      ],
      pt: locale(
        "Critério: a operação é uma transformação que se lê de cima a baixo? Stream. Há break com estado complicado, exceção checada ou índice? Loop. Performance só entra se você mediu.",
        [
          paragraph("Eu prefiro stream quando o código é filtrar, transformar e reduzir, e a leitura fica um pipeline. O loop some o que é o objetivo no meio do índice e do acumulador. Para achar o primeiro pedido em aberto de um cliente, stream com `filter` e `findFirst` diz exatamente isso."),
          paragraph("Eu prefiro o for quando preciso do índice, quando o break depende de estado que não cabe num predicado, quando há exceção checada no meio, ou quando o corpo tem efeito colateral que a stream esconderia. Também prefiro o loop num trecho quente, medido, em que a alocação do pipeline aparece no profiler."),
          paragraph("Não reescrevo loop claro só por estilo, e não paralelizo stream que faz I/O. Clareza primeiro; a medida decide o resto."),
        ],
        [
          "Stream para transformação que se lê como pipeline",
          "Loop para índice, exceção checada, estado e efeito colateral",
          "Trocar por performance só com profiler",
        ],
        "Não transforme todo for do sistema em stream numa revisão. Também não use stream para uma soma de dois números.",
      ),
      en: locale(
        "The test: is it a transformation you can read top to bottom? Use a stream. Do you need a complicated break, a checked exception, or an index? Use a loop. Performance enters only after you measure.",
        [
          paragraph("I prefer a stream when the work is filter, map, and reduce and the pipeline reads as the intent. A loop hides that intent in an index and an accumulator. Finding a customer's first open order is filter plus findFirst."),
          paragraph("I prefer a for loop when I need the index, when the stop condition does not fit a predicate, when a checked exception sits in the middle, or when the body has a side effect a stream would hide. I also prefer the loop on a hot path where a profiler shows the pipeline allocating."),
          paragraph("I do not rewrite a clear loop for style, and I do not parallelize a stream that does I/O."),
        ],
        [
          "Stream for a pipeline you can read as the intent",
          "Loop for index, checked exceptions, state, and side effects",
          "Switch for performance only with a profiler",
        ],
        "Do not turn every for into a stream in review, and do not use a stream to add two numbers.",
      ),
    },
    {
      id: "java17-upgrade",
      conceptId: "def-java17",
      difficulty: "senior",
      speakSeconds: 120,
      titles: {
        pt: "O que o Java 17 traz, e por que sair do 8 mesmo sem usar record?",
        en: "What does Java 17 add, and why leave Java 8 even without records?",
      },
      covers: [
        "What are the important features introduced in Java 17?",
        "Why upgrade from Java 8 to Java 17, even if we don't use features like Records or Sealed Classes?",
        "What are the advantages of Java 17 over Java 8?",
        "From a performance and security perspective, why are applications moving from Java 8 to Java 17?",
      ],
      pt: locale(
        "Separe linguagem de plataforma. O entrevistador quer ouvir que o motivo de migrar é JVM suportada, segurança, GC e container, não record. Cite duas features de linguagem para mostrar que você viu o release, e diga que virtual thread é 21, não 17.",
        [
          paragraph("Em linguagem, o caminho até o 17 inclui text blocks, switch expression, pattern matching para `instanceof`, records e sealed classes. Records servem para dado imutável com equals e hashCode corretos. Sealed classes fecham a hierarquia e deixam o switch exaustivo. Nenhuma dessas é obrigatória para a migração valer."),
          paragraph("O motivo de produção é a plataforma. O Java 8 público da Oracle ficou sem update livre, e anos de CVE em TLS, deserialização e bibliotecas do JDK ficam sem correção num 8 parado. O 17 é LTS, com uma JVM que o time ainda consegue patchar. A encapsulação forte dos internals do JDK impede código que refletia em classe interna e que quebraria mais tarde, de forma pior."),
          paragraph("Em performance, o ganho não vem de escrever record. Vem do G1 melhor, de ZGC e Shenandoah disponíveis para pausa curta, de melhorias de intrinsics e do respeito ao limite de memória do container. Um Java 8 antigo ignorava cgroup e podia pedir heap maior que o pod; o 17 enxerga o limite. NullPointerException com mensagem diz qual referência era null, e isso encurta incidente."),
          paragraph("Eu não prometo virtual threads nessa migração: elas chegaram no Java 21. Se o entrevistador perguntar por que não 21, eu digo que 17 é a base corporativa estável e que 21 é o passo seguinte, com virtual threads e pattern matching mais maduro, depois que a suíte e as bibliotecas passam no 17."),
        ],
        [
          "Linguagem: records, sealed, text blocks, switch, instanceof",
          "Migrar por patch, encapsulação, GC e cgroup, não por sintaxe",
          "Virtual threads são Java 21",
        ],
        "Não atribua ao Java 17 uma feature do 21, nem diga que sem record a migração não muda nada.",
      ),
      en: locale(
        "Separate language from platform. They want to hear that the reason to move is a supported JVM, security, GC, and containers, not records. Name two language features, and say virtual threads are 21, not 17.",
        [
          paragraph("On the language side, the road to 17 includes text blocks, switch expressions, pattern matching for instanceof, records, and sealed classes. Records carry immutable data with correct equals and hashCode. Sealed classes close a hierarchy. None of that is required for the upgrade to pay off."),
          paragraph("The production reason is the platform. Public Oracle Java 8 stopped receiving free updates, so years of TLS, deserialization, and JDK CVEs stay unpatched on a frozen 8. Java 17 is an LTS you can still patch. Strong encapsulation stops code that reflects into JDK internals and would break later, in a worse way."),
          paragraph("The performance gain is not records. It is a better G1, ZGC and Shenandoah for short pauses, better intrinsics, and respect for the container memory limit. An old Java 8 ignored cgroups and could size a heap larger than the pod. Java 17 sees the limit. Helpful NullPointerExceptions shorten incidents."),
          paragraph("I do not promise virtual threads in this migration: they arrived in Java 21. If asked why not 21, I say 17 is the stable enterprise base and 21 is the next step, once the suite and the libraries pass on 17."),
        ],
        [
          "Language: records, sealed classes, text blocks, switch, instanceof",
          "Move for patches, encapsulation, GC, and cgroup awareness",
          "Virtual threads are Java 21",
        ],
        "Do not attribute a Java 21 feature to 17, and do not say that without records the upgrade changes nothing.",
      ),
    },
  ],
};
