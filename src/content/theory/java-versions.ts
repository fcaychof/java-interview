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
        paragraph("The production reason is the platform. A frozen Java 8 stops receiving TLS and JDK patches. 17 is an LTS. The GC moved forward, a better G1 and ZGC for short pauses, and the JVM starts respecting the container memory limit. An old Java 8 ignored cgroups. Virtual threads are Java 21, not 17."),
      ],
    ),
  ]),
];
