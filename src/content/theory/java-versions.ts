import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const javaVersionsTheory: readonly TheoryGroup[] = [
  theoryGroup("java-theory", "Java 8 e Java 17", "Java 8 and Java 17", [
    concept(
      "def-java8",
      "O que o Java 8 mudou",
      "What Java 8 changed",
      [
        paragraph("Java 8 trouxe lambda, method reference, a Stream API, Optional, e métodos default e static em interface. O java.time substitui Date e Calendar. São formas de expressar transformação de dado e tempo sem o ruído do tipo anônimo e do calendário mutável."),
        paragraph("Lambda é uma implementação de interface funcional, um método só. O compilador faz o alvo. Não é um ponteiro solto e não fecha sobre variável que muda. A novidade que a entrevista pede em seguida é a que o código usa todo dia: stream, Optional, e o default method que permitiu evoluir a JDK sem quebrar quem já implementava List."),
      ],
      [
        paragraph("Java 8 brought lambdas, method references, the Stream API, Optional, and default and static methods on interfaces. java.time replaces Date and Calendar. They are ways to express data transformation and time without the noise of the anonymous type and the mutable calendar."),
        paragraph("A lambda is an implementation of a functional interface, one method. The compiler picks the target. It is not a loose pointer and it does not close over a variable that changes. The follow-up the interview wants is the one the code uses every day: streams, Optional, and the default method that let the JDK evolve without breaking whoever already implemented List."),
      ],
    ),
    concept(
      "def-default-methods",
      "Default e static em interface",
      "Default and static interface methods",
      [
        paragraph("Default method dá um corpo na interface. Quem já implementava continua compilando, e ganha o método. Foi o que permitiu List.sort e Collection.stream sem recompilar o mundo. Static method na interface é função ligada ao tipo, como Comparator.comparing, sem classe utilitária ao lado."),
        paragraph("Default não é herança múltipla de estado. Interface não tem campo de instância. Se duas interfaces trazem o mesmo default, a classe escolhe com NomeDaInterface.super.metodo(). Eu não escondo regra de negócio num default só porque a interface aceita. Default é evolução de contrato ou comportamento óbvio em termos dos outros métodos."),
      ],
      [
        paragraph("A default method gives the interface a body. Whoever already implemented it still compiles, and gains the method. That is what allowed List.sort and Collection.stream without recompiling the world. A static method on the interface is a function tied to the type, like Comparator.comparing, without a utility class beside it."),
        paragraph("A default is not multiple inheritance of state. An interface has no instance field. If two interfaces bring the same default, the class chooses with InterfaceName.super.method(). I do not hide a business rule in a default just because the interface accepts one. A default is contract evolution or obvious behavior in terms of the other methods."),
      ],
    ),
    concept(
      "def-stream",
      "Stream",
      "Stream",
      [
        paragraph("Stream é um pipeline sobre uma fonte. Não guarda os elementos. As operações intermediárias, filter e map, são preguiçosas. A terminal, collect, count, forEach, dispara o passe. A fonte pode ser uma lista, um arquivo ou um gerador. Ordenar pessoas por idade é sorted(Comparator.comparingInt(Person::getAge))."),
        paragraph("Stream não substitui todo loop. Loop ganha quando há efeito no meio, break cedo com lógica que não cabe em findFirst, ou quando o índice importa. Stream ganha quando a frase é filtrar, transformar e juntar. Stream paralelo não é mais rápido por padrão: a fonte precisa ser grande, a operação pesada, e a fonte segura para dividir. Lista pequena com JDBC dentro do map só piora."),
      ],
      [
        paragraph("A stream is a pipeline over a source. It does not store the elements. Intermediate operations, filter and map, are lazy. The terminal one, collect, count, forEach, fires the pass. The source can be a list, a file, or a generator. Sorting people by age is sorted(Comparator.comparingInt(Person::getAge))."),
        paragraph("A stream does not replace every loop. A loop wins when there is an effect in the middle, an early break with logic that does not fit findFirst, or when the index matters. A stream wins when the sentence is filter, transform, and join. A parallel stream is not faster by default: the source needs to be large, the operation heavy, and the source safe to split. A small list with JDBC inside map only gets worse."),
      ],
    ),
    concept(
      "def-method-reference",
      "Method reference",
      "Method reference",
      [
        paragraph("Method reference é uma lambda que só chama um método que já existe. Person::getAge é o mesmo que person -> person.getAge(). Há referência a método de instância, a método estático, a construtor (ArrayList::new) e a método de um objeto já existente."),
        paragraph("Eu uso quando o método já tem o nome certo e a lambda não acrescentaria nada. Se a lambda tem um if, um null ou duas chamadas, a referência fica forçada e o código mente. A referência não é um ponteiro de função solto: o compilador ainda precisa de um alvo funcional."),
      ],
      [
        paragraph("A method reference is a lambda that only calls a method that already exists. Person::getAge is the same as person -> person.getAge(). There is a reference to an instance method, to a static method, to a constructor (ArrayList::new), and to a method of an object that already exists."),
        paragraph("I use it when the method already has the right name and the lambda would add nothing. If the lambda has an if, a null, or two calls, the reference is forced and the code lies. The reference is not a loose function pointer: the compiler still needs a functional target."),
      ],
    ),
    concept(
      "def-flatmap",
      "map e flatMap",
      "map and flatMap",
      [
        paragraph("map transforma cada elemento em um valor. A stream de pedidos vira stream de clientes, um para um. flatMap transforma cada elemento numa stream, ou num Optional, e achata. A stream de pedidos, cada um com uma lista de itens, vira uma stream de itens, não uma stream de listas."),
        paragraph("O sinal de que era flatMap: o tipo ficou Stream<List<Item>> ou Stream<Optional<Item>> e o passo seguinte sofre para entrar. map devolveu o embrulho. flatMap tira o embrulho. Usar flatMap para um para um só esconde um map."),
      ],
      [
        paragraph("map turns each element into one value. A stream of orders becomes a stream of customers, one for one. flatMap turns each element into a stream, or an Optional, and flattens. A stream of orders, each with a list of items, becomes a stream of items, not a stream of lists."),
        paragraph("The signal that it was flatMap: the type became Stream<List<Item>> or Stream<Optional<Item>> and the next step suffers to get in. map returned the wrapper. flatMap removes the wrapper. Using flatMap for one-to-one only hides a map."),
      ],
    ),
    concept(
      "def-optional",
      "Optional",
      "Optional",
      [
        paragraph("Optional torna a ausência explícita no tipo de retorno. Quem chama é obrigado a decidir: orElse, orElseThrow, map, ou ifPresent. Isso substitui o null que volta de uma busca e estoura lá na frente."),
        paragraph("Não é um campo de entidade, não é parâmetro de método, e não é um substituto de toda checagem. Optional de propósito para um DTO ou para uma coluna só adiciona caixa. Eu devolvo Optional da borda de uma busca. Dentro do fluxo, extraio cedo. orElse(chamadaCara()) avalia a chamada sempre. orElseGet adia."),
      ],
      [
        paragraph("Optional makes absence explicit in the return type. The caller has to decide: orElse, orElseThrow, map, or ifPresent. That replaces the null that comes back from a lookup and blows up later."),
        paragraph("It is not an entity field, not a method parameter, and not a replacement for every check. An Optional on purpose for a DTO or a column only adds a box. I return Optional from the edge of a lookup. Inside the flow, I unwrap early. orElse(expensiveCall()) evaluates the call every time. orElseGet delays it."),
      ],
    ),
    concept(
      "def-java17",
      "Por que sair do Java 8",
      "Why leave Java 8",
      [
        paragraph("Até o 17 a linguagem ganhou text blocks, switch expression, pattern matching de instanceof, records e sealed classes. Records carregam dado imutável com equals e hashCode. Sealed fecha a hierarquia. Nenhuma dessas é o motivo obrigatório da migração."),
        paragraph("O motivo de produção é a plataforma. Um Java 8 parado fica sem patch de TLS e do próprio JDK. O 17 é LTS. O GC evoluiu, G1 melhor e ZGC para pausa curta, e a JVM passa a respeitar o limite de memória do container. Java 8 antigo ignorava cgroup. Virtual threads são Java 21, não 17."),
      ],
      [
        paragraph("By 17 the language had gained text blocks, switch expressions, instanceof pattern matching, records, and sealed classes. Records carry immutable data with equals and hashCode. Sealed closes the hierarchy. None of that is the required reason for the migration."),
        paragraph("The production reason is the platform. A frozen Java 8 stops receiving TLS and JDK patches. 17 is an LTS. The GC moved forward, a better G1 and ZGC for short pauses, and the JVM starts respecting the container memory limit. An old Java 8 ignored cgroups. Virtual threads are Java 21, not 17. The LTS after 21 is 25."),
      ],
    ),
  ]),
  theoryGroup("java21-theory", "Java 21", "Java 21", [
    concept(
      "def-java21",
      "O que o Java 21 firmou",
      "What Java 21 made final",
      [
        paragraph("Java 21 é o LTS seguinte ao 17. O que ficou definitivo, e o que a entrevista pode cobrar como recurso de verdade, é virtual thread, sequenced collections, record pattern e pattern matching no switch. O ZGC geracional também chegou aqui. UTF-8 já era o charset padrão desde o 18."),
        paragraph("Eu não cito como feature que uso o que em 21 ainda era preview. String templates foram preview e depois saíram da linguagem. Scoped values só ficaram definitivos no 25. Structured concurrency continua preview no 25. Dizer que o 21 tem string template é errar o release."),
      ],
      [
        paragraph("Java 21 is the LTS after 17. What became final, and what the interview can treat as a real feature, is virtual threads, sequenced collections, record patterns, and pattern matching for switch. Generational ZGC arrived here too. UTF-8 has been the default charset since 18."),
        paragraph("I do not cite, as a feature I use, what was still preview in 21. String templates were a preview and were later withdrawn. Scoped values became final only in 25. Structured concurrency is still preview in 25. Saying that 21 has string templates misstates the release."),
      ],
    ),
    concept(
      "def-virtual-threads",
      "Virtual threads",
      "Virtual threads",
      [
        paragraph("Virtual thread é uma `Thread` agendada pela JVM, não um thread do sistema operacional para cada uma. Enquanto executa, ela monta num carrier, que é uma platform thread. Quando bloqueia numa operação da JDK que faz park, leitura de socket, `sleep`, fila bloqueante, ela desmonta e o carrier segue com outra. Eu crio com `Thread.ofVirtual().start(task)` ou com `Executors.newVirtualThreadPerTaskExecutor()`. Não coloco virtual thread num pool: o pool devolve o limite que ela tirou."),
        paragraph("Serve para muita tarefa bloqueante ao mesmo tempo: um request por thread, JDBC ou cliente HTTP que bloqueia. Não serve para trabalho de CPU. Enquanto calcula, o carrier continua ocupado. Para CPU eu uso um pool de platform threads do tamanho dos núcleos."),
        paragraph("No Java 21, dentro de `synchronized` a virtual thread não desmonta. Um `synchronized` longo com JDBC prende o carrier, e muitos desses esgotam o escalonador. `ReentrantLock` não prende. Código nativo também prende. A partir do Java 24, `synchronized` deixou de prender. Nativo continua prendendo. `ThreadLocal` funciona, mas uma cópia gorda por virtual thread vira custo de memória. Contexto imutável do request, no 25, é scoped value."),
      ],
      [
        paragraph("A virtual thread is a Thread scheduled by the JVM, not one operating-system thread each. While it runs, it mounts on a carrier, which is a platform thread. When it blocks in a JDK call that parks, a socket read, sleep, a blocking queue, it unmounts and the carrier continues with another. I create one with Thread.ofVirtual().start(task) or with Executors.newVirtualThreadPerTaskExecutor(). I do not put virtual threads in a pool: the pool puts back the limit they removed."),
        paragraph("They fit many blocking tasks at once: one request per thread, JDBC, or an HTTP client that blocks. They do not fit CPU work. While the code computes, the carrier stays busy. For CPU I use a platform pool sized to the cores."),
        paragraph("On Java 21, inside synchronized a virtual thread cannot unmount. A long synchronized block that does JDBC pins the carrier, and enough of those exhaust the scheduler. ReentrantLock does not pin. Native code also pins. From Java 24, synchronized no longer pins. Native code still pins. ThreadLocal works, but a fat copy per virtual thread becomes a memory cost. Immutable request context, on 25, is a scoped value."),
      ],
    ),
    concept(
      "def-pattern-switch",
      "Pattern matching no switch",
      "Pattern matching for switch",
      [
        paragraph("No Java 21 o switch ficou definitivo com padrões de tipo, não só com constantes. `case Circle c when c.radius() > 10` escolhe o tipo e a condição. `case null` trata ausência sem um `if` antes. Numa hierarquia sealed o switch pode ser exaustivo: se falta um tipo permitido, não compila, e o `default` deixa de ser obrigatório."),
        paragraph("A ordem importa. Um padrão que cobre outro tem de vir depois do mais específico. Eu uso isso para um resultado fechado, como evento de pagamento. Não uso para uma cadeia de strings soltas que não formam um conjunto fechado."),
      ],
      [
        paragraph("In Java 21, switch became final with type patterns, not only constants. case Circle c when c.radius() > 10 selects the type and the condition. case null handles absence without an if in front. On a sealed hierarchy the switch can be exhaustive: if a permitted type is missing, it does not compile, and default stops being required."),
        paragraph("Order matters. A pattern that covers another must come after the more specific one. I use this for a closed result, such as a payment event. I do not use it for a chain of loose strings that are not a closed set."),
      ],
    ),
    concept(
      "def-record-patterns",
      "Record patterns",
      "Record patterns",
      [
        paragraph("Record pattern desmonta o record no `instanceof` e no `switch`. `if (event instanceof PaymentFailed(String id, Money amount))` já entrega os componentes, sem getter em seguida. Dá para aninhar: `case Box(Point(int x, int y))`. O padrão só casa se o valor for aquele record."),
        paragraph("Eu uso quando o record é a mensagem. Quatro níveis num `case` só deixam de ser leitura e viram um quebra-cabeça. Se eu não preciso de um componente, no 22 em diante o lugar dele é `_`."),
      ],
      [
        paragraph("A record pattern takes the record apart in instanceof and in switch. if (event instanceof PaymentFailed(String id, Money amount)) already gives the components, with no getter afterwards. Nesting works: case Box(Point(int x, int y)). The pattern matches only when the value is that record."),
        paragraph("I use it when the record is the message. Four levels in one case stop being readable and become a puzzle. If I do not need a component, from 22 on its place is _."),
      ],
    ),
    concept(
      "def-sequenced-collections",
      "Sequenced collections",
      "Sequenced collections",
      [
        paragraph("Sequenced collection é uma coleção com ordem de encontro definida e acesso nas duas pontas. `List`, `Deque`, `LinkedHashSet`, `LinkedHashMap` e `SortedSet` entram. `getFirst` e `getLast` leem as pontas. `reversed()` devolve uma visão invertida, não uma cópia. `getFirst` numa coleção vazia lança `NoSuchElementException`."),
        paragraph("`HashSet` e `HashMap` não são sequenced: não há ordem para inverter. `addFirst` num conjunto ordenado lança `UnsupportedOperationException`, porque a ordem é a da ordenação, não a da inserção. Eu uso `getFirst` no lugar de `list.get(0)` quando quero esse contrato, e não chamo isso num `HashSet`."),
      ],
      [
        paragraph("A sequenced collection has a defined encounter order and access at both ends. List, Deque, LinkedHashSet, LinkedHashMap, and SortedSet qualify. getFirst and getLast read the ends. reversed() returns a reversed view, not a copy. getFirst on an empty collection throws NoSuchElementException."),
        paragraph("HashSet and HashMap are not sequenced: there is no order to reverse. addFirst on a sorted set throws UnsupportedOperationException, because the order is the sort, not the insertion. I use getFirst instead of list.get(0) when I want that contract, and I do not call it on a HashSet."),
      ],
    ),
  ]),
  theoryGroup("java25-theory", "Java 25", "Java 25", [
    concept(
      "def-java25",
      "O que o Java 25 firmou",
      "What Java 25 made final",
      [
        paragraph("Java 25 é o LTS depois do 21, disponível desde 16 de setembro de 2025. Definitivo aqui, e que eu usaria: scoped values, corpo de construtor flexível, `import module`, arquivo fonte compacto com `main` de instância. No caminho desde o 21 também ficaram definitivos o `_` para variável sem nome (22), a Foreign Function and Memory API (22), os stream gatherers (24) e o fim do pinning de virtual thread em `synchronized` (24)."),
        paragraph("Na plataforma, o cabeçalho compacto de objeto é feature de produto no 25, desligado por padrão: `-XX:+UseCompactObjectHeaders`. Shenandoah geracional ficou pronto. A carga antecipada de classes e o perfil de método, o trabalho do Leyden no 24 e no 25, encurtam a partida, não o pico. O Security Manager foi desligado de vez no 24. `System.setSecurityManager` falha."),
        paragraph("Continua preview, e eu não subo isso em produção: structured concurrency, stable values, padrões com tipo primitivo e PEM encodings. O motivo de sair do 21 é a janela de suporte, o `synchronized` que não prende mais o carrier, e scoped values. Não é o `void main()` de exemplo."),
      ],
      [
        paragraph("Java 25 is the LTS after 21, available since 16 September 2025. Final here, and what I would use: scoped values, flexible constructor bodies, import module, and compact source files with an instance main. On the way from 21, these also became final: _ for an unnamed variable (22), the Foreign Function and Memory API (22), stream gatherers (24), and the end of virtual-thread pinning on synchronized (24)."),
        paragraph("On the platform, compact object headers are a product feature in 25, off by default: -XX:+UseCompactObjectHeaders. Generational Shenandoah became ready. Ahead-of-time class loading and method profiles, the Leyden work in 24 and 25, shorten startup, not the peak. The Security Manager was permanently disabled in 24. System.setSecurityManager fails."),
        paragraph("Still preview, and I do not ship these: structured concurrency, stable values, primitive patterns, and PEM encodings. The reason to leave 21 is the support window, synchronized that no longer pins the carrier, and scoped values. It is not the sample void main()."),
      ],
    ),
    concept(
      "def-scoped-values",
      "Scoped values",
      "Scoped values",
      [
        paragraph("Scoped value é um vínculo imutável para um escopo dinâmico. `ScopedValue.where(CURRENT_USER, user).run(() -> handle())` deixa `CURRENT_USER.get()` visível em `handle` e em quem ele chama, nesta thread. Um `where` interno reencadeia sem alterar o de fora. `get` sem vínculo lança `NoSuchElementException`. `orElse` cobre a ausência."),
        paragraph("`ThreadLocal` é mutável, e herdar copia ou vaza. Scoped value não é service locator e não atravessa sozinho para outra thread: filho criado com `new Thread` não herda o vínculo, porque a vida dele pode passar do escopo. Repartir o valor com tarefas filhas é trabalho de structured concurrency, que no 25 ainda é preview. No request, o usuário da requisição cabe num scoped value. Um cache mutável, não."),
      ],
      [
        paragraph("A scoped value is an immutable binding for a dynamic scope. ScopedValue.where(CURRENT_USER, user).run(() -> handle()) makes CURRENT_USER.get() visible in handle and in what it calls, on this thread. A nested where rebinds without changing the outer one. get with no binding throws NoSuchElementException. orElse covers absence."),
        paragraph("ThreadLocal is mutable, and inheriting it copies or leaks. A scoped value is not a service locator and it does not cross to another thread by itself: a child created with new Thread does not inherit the binding, because its life can outlast the scope. Sharing the value with child tasks is the job of structured concurrency, which is still preview in 25. On a request, the request user belongs in a scoped value. A mutable cache does not."),
      ],
    ),
    concept(
      "def-gatherers",
      "Stream gatherers",
      "Stream gatherers",
      [
        paragraph("Gatherer é uma operação intermediária de stream que o `filter` e o `map` não expressam. Chegou definitivo no 24, então está no 25. Os prontos são `windowFixed`, `windowSliding`, `fold`, `scan` e `mapConcurrent`. `orders.stream().gather(Gatherers.windowFixed(100))` entrega lotes de cem."),
        paragraph("Eu escrevo um gatherer quando o passo é janela ou estado que não cabe num `map`. Não escrevo um para transformar um elemento em outro. `mapConcurrent` limita quantos elementos estão em voo, usando virtual threads. Não é um executor da aplicação inteira, e não é licença para JDBC sem limite dentro de um parallel stream."),
      ],
      [
        paragraph("A gatherer is an intermediate stream operation that filter and map cannot express. It became final in 24, so it is in 25. The built-ins are windowFixed, windowSliding, fold, scan, and mapConcurrent. orders.stream().gather(Gatherers.windowFixed(100)) yields batches of one hundred."),
        paragraph("I write a gatherer when the step is a window or state that does not fit a map. I do not write one to turn one element into another. mapConcurrent caps how many elements are in flight, using virtual threads. It is not an executor for the whole application, and it is not a license for unbounded JDBC inside a parallel stream."),
      ],
    ),
    concept(
      "def-flexible-constructors",
      "Construtor antes do super",
      "Constructors before super",
      [
        paragraph("Até o 21, `super(...)` ou `this(...)` tinha de ser a primeira linha do construtor. No 25 eu posso validar o argumento, calcular um valor, e só então chamar `super`. Também posso atribuir um campo desta classe que não tem inicializador próprio: `this.limit = raw`. Isso importa quando o construtor da superclasse chama um método sobrescrito e, antes, via o campo ainda em zero ou null."),
        paragraph("Antes do `super` eu não leio `this`, não chamo método de instância e não toco campo da superclasse. Campo que já tem inicializador não pode ser atribuído nesse trecho. Continua má prática o construtor chamar método que o filho sobrescreve. A feature evita o zero visível. Ela não torna essa chamada uma boa ideia."),
      ],
      [
        paragraph("Through 21, super(...) or this(...) had to be the first line of the constructor. In 25 I can validate the argument, compute a value, and only then call super. I can also assign a field of this class that has no initializer of its own: this.limit = raw. That matters when the superclass constructor calls an overridden method and, before, saw the field still at zero or null."),
        paragraph("Before super I do not read this, I do not call an instance method, and I do not touch a superclass field. A field that already has an initializer cannot be assigned in that stretch. A constructor calling a method the child overrides is still a bad practice. The feature avoids the visible zero. It does not make that call a good idea."),
      ],
    ),
    concept(
      "def-small-language",
      "O que a linguagem enxugou",
      "What the language trimmed",
      [
        paragraph("Variável sem nome, definitiva no 22, é `_`. `catch (IOException _)` e um componente de record pattern que eu não uso. Não dá para ler `_`. Existe para o nome não usado não virar warning nem mentira."),
        paragraph("`import module java.sql` importa todos os pacotes que o módulo exporta. Não é `import java.sql.*`, que é um pacote só. O arquivo não precisa estar num módulo. Nome que colide tem de ser qualificado. Arquivo fonte compacto, definitivo no 25, permite `void main()` sem declarar a classe, para um script ou um primeiro exemplo. `IO.println` precisa do nome da classe, a menos que seja importado. Serviço Spring continua tendo classe."),
      ],
      [
        paragraph("An unnamed variable, final in 22, is _. catch (IOException _) and a record-pattern component I do not use. You cannot read _. It exists so the unused name does not become a warning or a lie."),
        paragraph("import module java.sql imports every package the module exports. It is not import java.sql.*, which is one package. The file does not have to live in a module. A name that collides must be qualified. A compact source file, final in 25, allows void main() without declaring the class, for a script or a first example. IO.println needs the class name unless it is imported. A Spring service still has a class."),
      ],
    ),
  ]),
];
