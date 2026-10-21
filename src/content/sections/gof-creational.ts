import {
  code,
  concept,
  locale,
  paragraph,
  theoryGroup,
  type InterviewQuestion,
  type TheoryGroup,
} from "../interview-model";

type PatternSlice = {
  readonly group: TheoryGroup;
  readonly questions: readonly InterviewQuestion[];
};

export const gofCreational: PatternSlice = {
  group: theoryGroup("gof-creational", "Criação", "Creational", [
    concept(
      "def-singleton",
      "Singleton",
      "Singleton",
      [
        paragraph("Singleton garante uma única instância e um ponto global para alcançá-la. O caso clássico é um recurso caro, um pool ou uma configuração, que não deveria existir duas vezes. O acesso é estático: o chamador pede a instância sem receber o objeto pelo construtor."),
        paragraph("A versão com if e new perde sob concorrência, porque duas threads passam pelo nulo e cada uma cria a sua. Sincronizar o método resolve e faz toda chamada esperar. Double-checked locking só é correto com o campo volatile, senão a outra thread observa o objeto antes do construtor acabar. Em Java, a forma segura é um enum de uma constante: a JVM publica essa instância uma vez, e reflexão ou serialização não criam outra."),
        code("enum AppClock {\n    INSTANCE;\n\n    public Instant now() {\n        return Instant.now();\n    }\n}"),
        paragraph("O custo é o estado global. O teste não troca o relógio sem carregar um objeto que vive o processo inteiro. O escopo singleton do Spring é outro contrato: o container guarda o bean e injeta a mesma instância em quem a declarou no construtor. A unicidade fica com o container, e o teste passa um fake."),
      ],
      [
        paragraph("Singleton guarantees a single instance and a global point to reach it. The classic case is an expensive resource, a pool or a configuration, that should not exist twice. Access is static: the caller asks for the instance instead of receiving the object through a constructor."),
        paragraph("The version with an if and a new loses under concurrency, because two threads both see null and each creates its own. Synchronizing the method removes the race and makes every call wait. Double-checked locking is correct only with a volatile field, otherwise the other thread can observe the object before the constructor finishes. In Java the safe form is an enum with one constant: the JVM publishes that instance once, and reflection or serialization does not create another."),
        code("enum AppClock {\n    INSTANCE;\n\n    public Instant now() {\n        return Instant.now();\n    }\n}"),
        paragraph("The cost is global state. A test cannot swap the clock without dragging an object that lives for the whole process. Spring's singleton scope is a different contract: the container holds the bean and injects the same instance into whoever declared it in the constructor. Uniqueness stays with the container, and the test passes a fake."),
      ],
    ),
    concept(
      "def-factory-method",
      "Factory Method",
      "Factory Method",
      [
        paragraph("Factory Method deixa a subclasse decidir qual produto criar. A classe base chama um método de criação e trabalha com o tipo abstrato. Quem estende devolve a classe concreta. O chamador do caso de uso não dá new no detalhe."),
        paragraph("Não confunda com a fábrica simples, que não está no livro. PaymentClients.of(\"pix\") é um método que esconde o new e concentra um switch. Factory Method é a herança: o provedor daquele banco sobrescreve o método e devolve o gateway dele. A variação mora na subclasse."),
        paragraph("Abstract Factory é o degrau seguinte: cria uma família que precisa nascer coerente, autorização e estorno do mesmo fornecedor, não um produto só. Um Map injetado pelo Spring cobre a fábrica simples. A hierarquia do Factory Method vale quando os passos da criação mudam de verdade entre as subclasses."),
      ],
      [
        paragraph("Factory Method lets the subclass decide which product to create. The base class calls a creation method and works with the abstract type. The extender returns the concrete class. The use case caller does not new the detail."),
        paragraph("Do not confuse it with a simple factory, which is not in the book. PaymentClients.of(\"pix\") is a method that hides new and concentrates a switch. Factory Method is the inheritance: the provider for that bank overrides the method and returns its gateway. The variation lives in the subclass."),
        paragraph("Abstract Factory is the next step: it creates a family that must be born coherent, authorization and refund from the same supplier, not a single product. A Map injected by Spring covers the simple factory. The Factory Method hierarchy earns its place when the creation steps truly change between subclasses."),
      ],
    ),
    concept(
      "def-abstract-factory",
      "Abstract Factory",
      "Abstract Factory",
      [
        paragraph("Abstract Factory cria uma família de objetos que precisam combinar, sem o chamador citar as classes concretas. A interface declara os produtos. Cada fábrica concreta devolve a família de um fornecedor só."),
        paragraph("O furo que ela impede: autorizar na Stripe e estornar em outro adquirente. StripeKit devolve o cliente de autorização e o de estorno juntos. Outro fornecedor é outra fábrica. O caso de uso pede a família e não escolhe as peças soltas."),
        paragraph("Se os objetos não precisam nascer juntos, a fábrica abstrata é peso. Um produto só, escolhido por uma chave, é fábrica simples ou um Map. Factory Method varia um produto por subclasse. Abstract Factory varia a família inteira."),
      ],
      [
        paragraph("Abstract Factory creates a family of objects that must match, without the caller naming the concrete classes. The interface declares the products. Each concrete factory returns one supplier's family."),
        paragraph("The hole it prevents: authorize on Stripe and refund on another acquirer. StripeKit returns the authorization client and the refund client together. Another supplier is another factory. The use case asks for the family and does not pick the pieces apart."),
        paragraph("If the objects do not need to be born together, the abstract factory is dead weight. One product chosen by a key is a simple factory or a Map. Factory Method varies one product per subclass. Abstract Factory varies the whole family."),
      ],
    ),
    concept(
      "def-builder",
      "Builder",
      "Builder",
      [
        paragraph("O Builder do GoF separa o roteiro de montagem da representação final. Um diretor executa os mesmos passos, e cada builder concreto produz um resultado diferente. O mesmo relatório vira PDF num builder e CSV em outro, sem o diretor saber o formato."),
        paragraph("A entrevista Java quase sempre pede o outro builder, o do Effective Java. Ele existe para matar o construtor telescópico: a chamada nomeia cada parte, o build recusa o que é obrigatório, e os campos saem final. Quem recebe o objeto não desfaz a regra com um setter."),
        code("Order order = Order.builder()\n    .id(id)\n    .customer(customer)\n    .address(address)\n    .build();"),
        paragraph("Três campos obrigatórios continuam num construtor. Um builder que não valida nada só alonga a chamada. Se a pergunta disser Gang of Four, a resposta é o diretor e as representações. Se disser Java, a resposta é o objeto imutável."),
      ],
      [
        paragraph("The GoF Builder separates the assembly script from the final representation. A director runs the same steps, and each concrete builder produces a different result. The same report becomes PDF in one builder and CSV in another, without the director knowing the format."),
        paragraph("A Java interview almost always wants the other builder, the one from Effective Java. It exists to kill the telescoping constructor: the call names each part, build rejects what is required and missing, and the fields come out final. Whoever receives the object does not undo the rule with a setter."),
        code("Order order = Order.builder()\n    .id(id)\n    .customer(customer)\n    .address(address)\n    .build();"),
        paragraph("Three required fields stay on a constructor. A builder that validates nothing only lengthens the call. If the question says Gang of Four, the answer is the director and the representations. If it says Java, the answer is the immutable object."),
      ],
    ),
    concept(
      "def-prototype",
      "Prototype",
      "Prototype",
      [
        paragraph("Prototype cria um objeto novo copiando um que já existe, em vez de chamar um construtor do zero. Serve quando montar a instância é caro ou quando a classe concreta só é conhecida em tempo de execução. O cliente pede uma cópia e não sabe qual classe está clonando."),
        paragraph("Em Java, Cloneable é uma armadilha: a interface não declara clone, o método de Object é protected, e a cópia padrão é rasa. Um grafo com lista compartilhada faz as duas instâncias alterarem o mesmo miolo. A forma honesta é um construtor de cópia, ou um método copy, que decide o que é fundo e o que é compartilhado."),
        paragraph("Eu uso quando o modelo é um template carregado uma vez, um pedido padrão ou uma regra pronta, e cada uso precisa da própria cópia. Se o new é barato e explícito, clonar só esconde a origem dos dados."),
      ],
      [
        paragraph("Prototype creates a new object by copying one that already exists, instead of calling a constructor from scratch. It earns its place when building the instance is expensive, or when the concrete class is only known at runtime. The client asks for a copy and does not know which class it is cloning."),
        paragraph("In Java, Cloneable is a trap: the interface does not declare clone, Object's method is protected, and the default copy is shallow. A graph with a shared list makes both instances mutate the same inside. The honest form is a copy constructor, or a copy method, that decides what is deep and what is shared."),
        paragraph("I use it when the model is a template loaded once, a default order or a ready-made rule, and each use needs its own copy. If new is cheap and explicit, cloning only hides where the data came from."),
      ],
    ),
  ]),
  questions: [
    {
      id: "ask-singleton",
      conceptId: "def-singleton",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que é o Singleton, e por que eu quase não escrevo um?",
        en: "What is the Singleton, and why do you almost never write one?",
      },
      covers: [
        "Explain the Singleton pattern.",
        "How do you write a thread-safe Singleton in Java?",
        "What is the difference between a GoF Singleton and a Spring singleton bean?",
      ],
      pt: locale(
        "Uma frase: uma instância e um acesso global. Feche a corrida com o enum. Depois troque o problema para o estado global, e separe o bean do Spring.",
        [
          paragraph("Singleton garante uma única instância e um ponto global para alcançá-la. O if com new cria duas instâncias se duas threads passam juntas pelo nulo. O enum de uma constante é a forma que eu defendo: a JVM publica uma vez, e reflexão ou serialização não criam outra. Double-checked locking só entra se o campo for volatile."),
          paragraph("Eu quase não escrevo isso. O acesso global esconde a dependência e suja o teste. O escopo singleton do Spring injeta a mesma instância pelo construtor. O teste passa um fake. Unicidade, quando importa, fica com o container."),
        ],
        [
          "Uma instância e um acesso global",
          "Enum, ou volatile no double-checked locking",
          "Bean do Spring não é getInstance",
        ],
        "Não apresente getInstance como prática atual.",
      ),
      en: locale(
        "One sentence: one instance and a global access point. Close the race with an enum. Then change the problem to global state, and separate the Spring bean.",
        [
          paragraph("Singleton guarantees a single instance and a global point to reach it. An if plus new creates two instances if two threads pass the null together. An enum with one constant is the form I defend: the JVM publishes it once, and reflection or serialization does not create another. Double-checked locking only counts if the field is volatile."),
          paragraph("I almost never write this. Global access hides the dependency and dirties the test. Spring's singleton scope injects the same instance through the constructor. The test passes a fake. When uniqueness matters, the container holds it."),
        ],
        [
          "One instance and a global access point",
          "An enum, or volatile on double-checked locking",
          "A Spring bean is not getInstance",
        ],
        "Do not present getInstance as current practice.",
      ),
    },
    {
      id: "ask-factory-method",
      conceptId: "def-factory-method",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "O que é o Factory Method?",
        en: "What is the Factory Method?",
      },
      covers: ["Explain the Factory Method pattern."],
      pt: locale(
        "Diga que a subclasse escolhe o produto. Separe da fábrica simples, que é só um método escondendo o new. Feche com o caso em que um Map do Spring basta.",
        [
          paragraph("A classe base depende de um método de criação. A subclasse concreta decide qual classe devolver. O caso de uso de cobrança não instancia o cliente HTTP. O provedor daquele banco devolve o gateway. A variação fica na subclasse, não num switch de quem chama."),
          paragraph("PaymentClients.of(\"pix\") não é esse padrão. É uma fábrica simples. Um Map injetado pelo Spring cobre esse caso. Eu abro o Factory Method quando os passos da criação mudam entre as subclasses, não para evitar três linhas."),
        ],
        [
          "A subclasse decide o produto",
          "Fábrica simples só esconde o new",
          "Map do Spring cobre a escolha por chave",
        ],
        "Não chame todo método estático de Factory Method.",
      ),
      en: locale(
        "Say the subclass chooses the product. Separate it from a simple factory, which is only a method hiding new. Close with the case where a Spring Map is enough.",
        [
          paragraph("The base class depends on a creation method. The concrete subclass decides which class to return. The charge use case does not instantiate the HTTP client. The provider for that bank returns the gateway. The variation stays in the subclass, not in a switch on the caller."),
          paragraph("PaymentClients.of(\"pix\") is not this pattern. It is a simple factory. A Map injected by Spring covers that case. I open Factory Method when the creation steps change between subclasses, not to avoid three lines."),
        ],
        [
          "The subclass decides the product",
          "A simple factory only hides new",
          "A Spring Map covers a choice by key",
        ],
        "Do not call every static method a Factory Method.",
      ),
    },
    {
      id: "ask-abstract-factory",
      conceptId: "def-abstract-factory",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "O que é Abstract Factory, e quando ela passa de Factory Method?",
        en: "What is Abstract Factory, and when does it go beyond Factory Method?",
      },
      covers: [
        "Explain the Abstract Factory pattern.",
        "What is the difference between Factory Method and Abstract Factory?",
      ],
      pt: locale(
        "A frase é família coerente. Dê autorização e estorno do mesmo fornecedor. Diga que um produto só não justifica a fábrica.",
        [
          paragraph("Abstract Factory entrega um conjunto de produtos que precisam combinar. O adaptador de um fornecedor devolve juntos o cliente de autorização e o de estorno. Misturar o estorno de um com a autorização de outro é o bug que a fábrica impede. O caso de uso não cita a classe concreta."),
          paragraph("Factory Method varia um produto. Abstract Factory varia a família. Se eu só escolho um gateway por chave, um Map chega no mesmo lugar com menos tipo. A fábrica entra quando nascer separado já é o defeito."),
        ],
        [
          "Família de produtos que precisam combinar",
          "Factory Method varia um produto só",
          "Um objeto solto não justifica a fábrica",
        ],
        "Não use o nome para qualquer classe com um método create.",
      ),
      en: locale(
        "The sentence is a coherent family. Give authorization and refund from the same supplier. Say that a single product does not justify the factory.",
        [
          paragraph("Abstract Factory delivers a set of products that must match. One supplier's adapter returns both the authorization client and the refund client. Mixing one supplier's refund with another's authorization is the bug the factory prevents. The use case does not name the concrete class."),
          paragraph("Factory Method varies one product. Abstract Factory varies the family. If I only choose a gateway by key, a Map gets there with fewer types. The factory earns its place when being born apart is already the defect."),
        ],
        [
          "A family of products that must match",
          "Factory Method varies a single product",
          "One loose object does not justify the factory",
        ],
        "Do not use the name for any class with a create method.",
      ),
    },
    {
      id: "ask-builder",
      conceptId: "def-builder",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Quando o Builder vale a pena, e qual Builder a entrevista pede?",
        en: "When is the Builder worth it, and which Builder is the interview asking about?",
      },
      covers: [
        "Explain the Builder pattern.",
        "What is the difference between the GoF Builder and the Java builder?",
      ],
      pt: locale(
        "Separe os dois na primeira frase. GoF é diretor e representações. Java é objeto imutável no lugar do construtor telescópico. Diga quando o construtor ganha.",
        [
          paragraph("O Builder do GoF tem um diretor que executa os mesmos passos, e cada builder concreto produz uma representação. O mesmo roteiro de relatório vira PDF ou CSV. Eu quase não preciso dele num serviço."),
          paragraph("O builder que eu escrevo em Java nomeia os campos, valida no build e devolve um objeto com campos final. Ele substitui new Order com uma fila de nulos. Três campos obrigatórios continuam no construtor. Um builder sem validação só alonga a chamada."),
        ],
        [
          "GoF: diretor e representações diferentes",
          "Java: montagem nomeada, imutável, validada no build",
          "Três campos não justificam a cerimônia",
        ],
        "Não responda um builder no lugar do outro.",
      ),
      en: locale(
        "Separate the two in the first sentence. GoF is a director and representations. Java is an immutable object in place of a telescoping constructor. Say when the constructor wins.",
        [
          paragraph("The GoF Builder has a director that runs the same steps, and each concrete builder produces a representation. The same report script becomes PDF or CSV. I almost never need it in a service."),
          paragraph("The builder I write in Java names the fields, validates in build, and returns an object with final fields. It replaces new Order with a row of nulls. Three required fields stay on the constructor. A builder without validation only lengthens the call."),
        ],
        [
          "GoF: a director and different representations",
          "Java: named, immutable assembly, validated in build",
          "Three fields do not justify the ceremony",
        ],
        "Do not answer one builder in place of the other.",
      ),
    },
    {
      id: "ask-prototype",
      conceptId: "def-prototype",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Prototype, e por que Cloneable não é a resposta?",
        en: "What is Prototype, and why is Cloneable not the answer?",
      },
      covers: ["Explain the Prototype pattern.", "Why is Cloneable a poor way to copy objects in Java?"],
      pt: locale(
        "Defina como cópia de um exemplar, não como new. Em seguida desmonte Cloneable: interface vazia e cópia rasa. Feche com construtor de cópia e com o caso em que clonar não vale.",
        [
          paragraph("Prototype cria um objeto copiando outro que já está montado. O cliente não conhece a classe concreta. Serve para um template caro, um pedido padrão, uma regra pronta, em que cada uso precisa da própria cópia."),
          paragraph("Cloneable não declara clone, e a cópia de Object é rasa. Lista interna fica compartilhada e uma instância altera a outra. Eu escrevo um construtor de cópia que deixa explícito o que é fundo. Se o new é barato, clonar só esconde a origem."),
        ],
        [
          "Criar copiando um exemplar",
          "Cloneable é rasa e a interface não declara o método",
          "Construtor de cópia quando o miolo não pode ser compartilhado",
        ],
        "Não diga que implementar Cloneable é o padrão pronto.",
      ),
      en: locale(
        "Define it as copying an exemplar, not as new. Then take Cloneable apart: an empty interface and a shallow copy. Close with a copy constructor and with the case where cloning is not worth it.",
        [
          paragraph("Prototype creates an object by copying another that is already assembled. The client does not know the concrete class. It serves an expensive template, a default order, a ready-made rule, where each use needs its own copy."),
          paragraph("Cloneable does not declare clone, and Object's copy is shallow. An internal list stays shared and one instance changes the other. I write a copy constructor that makes the deep parts explicit. If new is cheap, cloning only hides the origin."),
        ],
        [
          "Create by copying an exemplar",
          "Cloneable is shallow and the interface does not declare the method",
          "A copy constructor when the inside must not be shared",
        ],
        "Do not say implementing Cloneable is the finished pattern.",
      ),
    },
  ],
};
