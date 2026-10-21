import {
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

export const gofStructural: PatternSlice = {
  group: theoryGroup("gof-structural", "Estrutura", "Structural", [
    concept(
      "def-adapter",
      "Adapter",
      "Adapter",
      [
        paragraph("Adapter faz um tipo que eu não controlo caber numa porta que o caso de uso já usa. Em Java isso é composição: o adaptador guarda o cliente do SDK e implementa PaymentGateway. Ele traduz a chamada e traduz o erro. A regra de cobrança não importa o SDK."),
        paragraph("A herança, o class adapter dos livros em C++, quase não aparece em Java porque a classe só estende um tipo. O que eu escrevo é object adapter. O formato do dinheiro, o nome do status e a exceção do fornecedor morrem no adaptador."),
        paragraph("Adapter não acrescenta regra de negócio e não esconde um subsistema inteiro. Se a interface já é a minha, não há o que traduzir. Se eu só quero medir latência em volta da mesma porta, isso é Decorator."),
      ],
      [
        paragraph("Adapter fits a type I do not control into a port the use case already uses. In Java that is composition: the adapter holds the SDK client and implements PaymentGateway. It translates the call and translates the error. The charge rule does not import the SDK."),
        paragraph("Inheritance, the class adapter from the C++ books, barely shows up in Java because a class extends one type. What I write is an object adapter. The money format, the status name, and the supplier's exception die in the adapter."),
        paragraph("Adapter does not add a business rule and does not hide a whole subsystem. If the interface is already mine, there is nothing to translate. If I only want to measure latency around the same port, that is a Decorator."),
      ],
    ),
    concept(
      "def-bridge",
      "Bridge",
      "Bridge",
      [
        paragraph("Bridge separa duas hierarquias que variam ao mesmo tempo, para eu não multiplicar as combinações numa classe só. De um lado fica a abstração, o que o cliente chama. Do outro fica a implementação, o como. A abstração guarda a implementação e delega."),
        paragraph("Sem a ponte, alerta e resumo, cada um em e-mail e SMS, viram quatro classes: AlertaEmail, AlertaSms, ResumoEmail, ResumoSms. Com a ponte, Notificacao tem as variantes de mensagem, Canal tem e-mail e SMS, e cada mensagem recebe um canal. Uma mensagem nova não cria um par por canal."),
        paragraph("Eu só abro isso quando as duas variações já existem e vão continuar crescendo. Uma variação só é Strategy ou um adaptador. Bridge antecipada, com um lado que nunca muda, é uma interface no meio sem motivo."),
      ],
      [
        paragraph("Bridge separates two hierarchies that vary at the same time, so I do not multiply the combinations into one class each. One side is the abstraction, what the client calls. The other is the implementation, the how. The abstraction holds the implementation and delegates."),
        paragraph("Without the bridge, an alert and a digest, each over email and SMS, become four classes: AlertEmail, AlertSms, DigestEmail, DigestSms. With the bridge, Notification has the message variants, Channel has email and SMS, and each message receives a channel. A new message does not create a pair per channel."),
        paragraph("I open this only when both variations already exist and will keep growing. One variation is a Strategy or an adapter. A bridge opened early, with a side that never changes, is an interface in the middle with no reason."),
      ],
    ),
    concept(
      "def-composite",
      "Composite",
      "Composite",
      [
        paragraph("Composite trata peça e conjunto com a mesma operação. O cliente chama preco() num item e não pergunta se aquilo é um produto ou um pacote. O pacote guarda filhos e responde com a soma. A folha responde com o próprio valor."),
        paragraph("A árvore do pedido cabe aqui: uma linha é um produto, ou um kit que contém linhas. Frete, imposto e total percorrem a mesma interface. O cliente não escreve um if para descer o kit."),
        paragraph("O limite é a operação que não faz sentido na folha e no conjunto ao mesmo tempo. Se o chamador precisa saber o tipo o tempo todo, a interface comum está mentindo. Uma lista plana de itens, sem árvore, não ganha composite."),
      ],
      [
        paragraph("Composite treats a part and a group with the same operation. The client calls price() on an item and does not ask whether that thing is a product or a bundle. The bundle holds children and answers with the sum. The leaf answers with its own value."),
        paragraph("An order tree fits here: a line is a product, or a kit that contains lines. Shipping, tax, and total walk the same interface. The client does not write an if to descend into the kit."),
        paragraph("The limit is an operation that does not make sense on the leaf and the group at the same time. If the caller must know the type all the time, the shared interface is lying. A flat list of items, with no tree, does not earn a composite."),
      ],
    ),
    concept(
      "def-decorator",
      "Decorator",
      "Decorator",
      [
        paragraph("Decorator envolve o mesmo contrato e soma uma responsabilidade, delegando o resto. O chamador continua vendo PaymentGateway. MeteredGateway mede a latência e chama o gateway real. Um decorator de retentativa empilha por cima sem o checkout mudar."),
        paragraph("A JDK usa isso o tempo todo: BufferedInputStream sobre outro InputStream. Dá para acrescentar buffer, compressão ou contagem sem uma subclasse nova para cada combinação. A diferença para o Proxy é a intenção. Decorator soma comportamento. Proxy controla o acesso."),
        paragraph("A pilha infinita também é um defeito. Três wrappers para logar uma chamada deixam o fluxo opaco. Se a variação é um algoritmo escolhido de fora, Strategy é mais direta do que embrulhar o objeto em si mesmo."),
      ],
      [
        paragraph("Decorator wraps the same contract and adds one responsibility, delegating the rest. The caller still sees PaymentGateway. MeteredGateway measures latency and calls the real gateway. A retry decorator stacks on top without checkout changing."),
        paragraph("The JDK uses this all the time: BufferedInputStream over another InputStream. You can add buffering, compression, or counting without a new subclass for every combination. The difference from Proxy is intent. Decorator adds behavior. Proxy controls access."),
        paragraph("An endless stack is also a defect. Three wrappers to log one call make the flow opaque. If the variation is an algorithm chosen from outside, Strategy is more direct than wrapping the object around itself."),
      ],
    ),
    concept(
      "def-facade",
      "Facade",
      "Facade",
      [
        paragraph("Facade oferece uma operação grossa no lugar de um subsistema. Quem está de fora pede o checkout e não orquestra estoque, preço e pagamento. A fachada conhece a ordem das chamadas. O cliente deixa de depender de dez tipos."),
        paragraph("Ela não precisa implementar a interface de cada peça. O valor é reduzir a superfície. Num monolito, o caso de uso já é essa fachada: o controller chama um método e o serviço fala com repositório e gateway."),
        paragraph("A fachada que só repassa um método de cada serviço vira o novo ponto onde todo mundo acopla, sem esconder complexidade nenhuma. Sem um subsistema para esconder, eu não crio a classe. Adapter traduz uma interface. Facade simplifica várias."),
      ],
      [
        paragraph("Facade offers one coarse operation in place of a subsystem. The outsider asks for checkout and does not orchestrate stock, price, and payment. The facade knows the order of the calls. The client stops depending on ten types."),
        paragraph("It does not have to implement each piece's interface. The value is a smaller surface. In a monolith, the use case is already that facade: the controller calls one method and the service talks to the repository and the gateway."),
        paragraph("A facade that only forwards one method from each service becomes the new place everyone couples to, without hiding any complexity. With no subsystem to hide, I do not create the class. Adapter translates one interface. Facade simplifies many."),
      ],
    ),
    concept(
      "def-flyweight",
      "Flyweight",
      "Flyweight",
      [
        paragraph("Flyweight compartilha o estado que é igual entre milhares de objetos, e deixa de fora o estado que muda em cada uso. A parte compartilhada é intrínseca e imutável. A parte de cada uso é extrínseca e o cliente passa na hora da operação."),
        paragraph("O exemplo clássico é o glifo de um editor: a letra A existe uma vez, e cada ocorrência leva posição e estilo. Num backend, a moeda, o país ou o tipo de produto podem ser um objeto só, referenciado por milhões de lançamentos. O valor e a data ficam no lançamento, não copiados dentro de um objeto novo a cada linha."),
        paragraph("Eu não crio uma fábrica de flyweight para um catálogo de cem itens. O ganho aparece quando a cópia repetida pesa na memória. Se o objeto compartilhado for mutável, uma escrita vaza para todo mundo que o usa."),
      ],
      [
        paragraph("Flyweight shares the state that is the same across thousands of objects, and leaves out the state that changes on each use. The shared part is intrinsic and immutable. The per-use part is extrinsic, and the client passes it at the moment of the operation."),
        paragraph("The classic example is a glyph in an editor: the letter A exists once, and each occurrence carries position and style. In a backend, a currency, a country, or a product type can be one object, referenced by millions of postings. The amount and the date stay on the posting, not copied into a new object on every line."),
        paragraph("I do not build a flyweight factory for a catalog of a hundred items. The gain shows up when the repeated copy weighs on memory. If the shared object is mutable, one write leaks to everyone who uses it."),
      ],
    ),
    concept(
      "def-proxy",
      "Proxy",
      "Proxy",
      [
        paragraph("Proxy implementa a mesma interface do objeto real e controla o acesso a ele. Pode criar sob demanda, checar permissão, falar com outro processo, ou abrir uma transação. O chamador acredita que está falando com o objeto."),
        paragraph("O @Transactional do Spring é esse proxy. A chamada pela interface passa por ele: abre a transação, invoca o bean, confirma ou reverte. this.charge() não passa pelo proxy, então a anotação no método interno não dispara. Proxy remoto é o stub de um cliente. Proxy virtual atrasa uma criação cara até alguém usar."),
        paragraph("A forma parece a do Decorator. A intenção é outra: controlar acesso, não somar regra de negócio. Se eu preciso contar latência como comportamento da aplicação, isso é decorator. Se o container precisa envolver o bean sem o serviço saber, isso é proxy."),
      ],
      [
        paragraph("Proxy implements the same interface as the real object and controls access to it. It can create on demand, check a permission, talk to another process, or open a transaction. The caller believes it is talking to the object."),
        paragraph("Spring's @Transactional is this proxy. A call through the interface goes through it: it opens the transaction, invokes the bean, and commits or rolls back. this.charge() does not go through the proxy, so the annotation on the internal method does not fire. A remote proxy is a client stub. A virtual proxy delays an expensive creation until someone uses it."),
        paragraph("The shape looks like Decorator. The intent is different: control access, do not add a business rule. If I need to count latency as application behavior, that is a decorator. If the container must wrap the bean without the service knowing, that is a proxy."),
      ],
    ),
  ]),
  questions: [
    {
      id: "ask-adapter",
      conceptId: "def-adapter",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Adapter?",
        en: "What is the Adapter?",
      },
      covers: ["Explain the Adapter pattern."],
      pt: locale(
        "Diga que ele traduz uma interface que não é sua. O exemplo é o SDK do banco atrás de PaymentGateway. Feche separando de Decorator e de Facade.",
        [
          paragraph("Adapter encaixa um tipo que eu não controlo numa porta que o caso de uso já usa. O adaptador guarda o cliente do SDK, implementa PaymentGateway e traduz chamada e erro. A regra não importa o SDK. Em Java eu faço por composição."),
          paragraph("Ele não soma comportamento em volta da mesma interface: isso é Decorator. Não resume um subsistema inteiro: isso é Facade. Se a interface já é a minha, não há tradução."),
        ],
        [
          "Traduz uma interface alheia para uma porta minha",
          "Composição: guarda o SDK e implementa a porta",
          "Não é decorator nem fachada",
        ],
        "Não diga que qualquer classe no meio de duas chamadas é um adapter.",
      ),
      en: locale(
        "Say it translates an interface you do not own. The example is the bank SDK behind PaymentGateway. Close by separating it from Decorator and Facade.",
        [
          paragraph("Adapter fits a type I do not control into a port the use case already uses. The adapter holds the SDK client, implements PaymentGateway, and translates the call and the error. The rule does not import the SDK. In Java I do it by composition."),
          paragraph("It does not add behavior around the same interface: that is Decorator. It does not summarize a whole subsystem: that is Facade. If the interface is already mine, there is no translation."),
        ],
        [
          "Translates a foreign interface into a port of mine",
          "Composition: it holds the SDK and implements the port",
          "It is not a decorator or a facade",
        ],
        "Do not say any class between two calls is an adapter.",
      ),
    },
    {
      id: "ask-bridge",
      conceptId: "def-bridge",
      difficulty: "senior",
      speakSeconds: 75,
      titles: {
        pt: "O que é o Bridge?",
        en: "What is the Bridge?",
      },
      covers: ["Explain the Bridge pattern."],
      pt: locale(
        "Mostre a explosão de classes que ele evita. Duas hierarquias, mensagem e canal, em vez de uma classe por combinação. Diga que uma variação só não abre a ponte.",
        [
          paragraph("Bridge separa a abstração da implementação quando as duas mudam. Alerta e resumo, cada um em e-mail e SMS, virariam quatro classes. Com a ponte, a mensagem guarda um canal e delega o envio. Mensagem nova não duplica os canais."),
          paragraph("Eu espero as duas variações existirem. Um lado só é Strategy ou Adapter. Ponte com um implementador eterno é interface sem motivo."),
        ],
        [
          "Duas hierarquias que variam juntas",
          "Evita uma classe por combinação",
          "Uma variação só não justifica a ponte",
        ],
        "Não descreva Bridge como sinônimo de interface.",
      ),
      en: locale(
        "Show the class explosion it avoids. Two hierarchies, message and channel, instead of one class per combination. Say that a single variation does not open the bridge.",
        [
          paragraph("Bridge separates abstraction from implementation when both change. An alert and a digest, each over email and SMS, would become four classes. With the bridge, the message holds a channel and delegates the send. A new message does not duplicate the channels."),
          paragraph("I wait until both variations exist. One side is a Strategy or an Adapter. A bridge with one eternal implementor is an interface with no reason."),
        ],
        [
          "Two hierarchies that vary together",
          "Avoids one class per combination",
          "A single variation does not justify the bridge",
        ],
        "Do not describe Bridge as a synonym for interface.",
      ),
    },
    {
      id: "ask-composite",
      conceptId: "def-composite",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Composite?",
        en: "What is the Composite?",
      },
      covers: ["Explain the Composite pattern."],
      pt: locale(
        "A frase é peça e conjunto na mesma operação. Use um kit dentro do pedido. Feche com o caso da lista plana, que não precisa de árvore.",
        [
          paragraph("Composite deixa o cliente chamar preco() sem saber se o item é um produto ou um pacote. O pacote soma os filhos. A folha devolve o próprio valor. Frete e total descem a árvore pela mesma interface."),
          paragraph("Isso vale quando existe árvore de verdade, kit dentro de kit. Uma lista plana de itens não ganha composite. Se o chamador precisa do tipo o tempo todo, a interface comum está mentindo."),
        ],
        [
          "Folha e composto respondem à mesma operação",
          "O composto delega aos filhos",
          "Lista plana não vira árvore",
        ],
        "Não use composite para qualquer coleção.",
      ),
      en: locale(
        "The sentence is part and group behind the same operation. Use a kit inside the order. Close with the flat list, which does not need a tree.",
        [
          paragraph("Composite lets the client call price() without knowing whether the item is a product or a bundle. The bundle sums the children. The leaf returns its own value. Shipping and total walk the tree through the same interface."),
          paragraph("This earns its place when there is a real tree, a kit inside a kit. A flat list of items does not get a composite. If the caller must know the type all the time, the shared interface is lying."),
        ],
        [
          "Leaf and composite answer the same operation",
          "The composite delegates to the children",
          "A flat list does not become a tree",
        ],
        "Do not use composite for any collection.",
      ),
    },
    {
      id: "ask-decorator",
      conceptId: "def-decorator",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Decorator?",
        en: "What is the Decorator?",
      },
      covers: ["Explain the Decorator pattern."],
      pt: locale(
        "Diga que ele soma uma responsabilidade e mantém a interface. Empilhe métrica e retentativa. Separe do Proxy pela intenção, e cite BufferedInputStream.",
        [
          paragraph("Decorator envolve o mesmo contrato. MeteredGateway mede a latência e delega ao gateway real. Outro wrapper, de retentativa, empilha por cima. O checkout não muda. BufferedInputStream sobre um InputStream é o caso da JDK."),
          paragraph("Proxy tem a mesma forma e outra intenção: controlar acesso, como o proxy do @Transactional. Strategy troca o algoritmo inteiro em vez de embrulhar. Três wrappers para uma chamada só deixam o fluxo opaco."),
        ],
        [
          "Mesma interface, uma responsabilidade a mais",
          "Dá para empilhar",
          "Proxy controla acesso; decorator soma comportamento",
        ],
        "Não chame o proxy transacional de decorator.",
      ),
      en: locale(
        "Say it adds one responsibility and keeps the interface. Stack metrics and retry. Separate it from Proxy by intent, and cite BufferedInputStream.",
        [
          paragraph("Decorator wraps the same contract. MeteredGateway measures latency and delegates to the real gateway. Another wrapper, for retry, stacks on top. Checkout does not change. BufferedInputStream over an InputStream is the JDK case."),
          paragraph("Proxy has the same shape and another intent: controlling access, like the @Transactional proxy. Strategy swaps the whole algorithm instead of wrapping. Three wrappers for a single call make the flow opaque."),
        ],
        [
          "Same interface, one added responsibility",
          "You can stack them",
          "Proxy controls access; decorator adds behavior",
        ],
        "Do not call the transactional proxy a decorator.",
      ),
    },
    {
      id: "ask-facade",
      conceptId: "def-facade",
      difficulty: "pleno",
      speakSeconds: 65,
      titles: {
        pt: "O que é a Facade?",
        en: "What is the Facade?",
      },
      covers: ["Explain the Facade pattern."],
      pt: locale(
        "Uma operação grossa no lugar de um subsistema. Checkout que esconde estoque, preço e pagamento. Recuse a fachada que só repassa método.",
        [
          paragraph("Facade reduz a superfície. Quem está de fora pede o checkout e não orquestra as peças. A fachada conhece a ordem. O cliente deixa de depender de dez tipos. O caso de uso de um monolito já faz esse papel."),
          paragraph("A classe que só encaminha um método de cada serviço não esconde nada e vira o novo acoplamento. Sem subsistema, eu não crio a fachada. Adapter traduz uma interface. Facade simplifica várias."),
        ],
        [
          "Uma operação no lugar de várias peças",
          "O valor é esconder a orquestração",
          "Repasse puro não é fachada",
        ],
        "Não crie uma fachada para um único método.",
      ),
      en: locale(
        "One coarse operation in place of a subsystem. Checkout that hides stock, price, and payment. Refuse the facade that only forwards methods.",
        [
          paragraph("Facade shrinks the surface. The outsider asks for checkout and does not orchestrate the pieces. The facade knows the order. The client stops depending on ten types. A monolith use case already plays this role."),
          paragraph("A class that only forwards one method from each service hides nothing and becomes the new coupling. With no subsystem, I do not create the facade. Adapter translates one interface. Facade simplifies many."),
        ],
        [
          "One operation in place of several pieces",
          "The value is hiding the orchestration",
          "Pure forwarding is not a facade",
        ],
        "Do not create a facade for a single method.",
      ),
    },
    {
      id: "ask-flyweight",
      conceptId: "def-flyweight",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Flyweight?",
        en: "What is the Flyweight?",
      },
      covers: ["Explain the Flyweight pattern."],
      pt: locale(
        "Separe estado compartilhado de estado de cada uso. Dê a moeda referenciada por milhões de lançamentos. Feche com o objeto mutável, que vaza a escrita.",
        [
          paragraph("Flyweight guarda uma vez a parte que se repete e deixa o cliente passar a parte que muda. A moeda, com código e nome, é um objeto só. Cada lançamento guarda valor e data e aponta para essa moeda. A letra A num editor é o mesmo exemplo: o glifo é compartilhado, a posição não."),
          paragraph("O ganho é memória, quando a cópia se repete aos milhões. Um catálogo de cem itens não precisa da fábrica. O compartilhado tem de ser imutável, senão uma escrita aparece em todo mundo."),
        ],
        [
          "Intrínseco compartilhado, extrínseco passado na chamada",
          "Serve quando a cópia pesa",
          "Estado compartilhado mutável vaza",
        ],
        "Não proponha flyweight para economizar meia dúzia de objetos.",
      ),
      en: locale(
        "Separate shared state from per-use state. Give the currency referenced by millions of postings. Close with the mutable object, which leaks the write.",
        [
          paragraph("Flyweight stores once the part that repeats and lets the client pass the part that changes. A currency, with code and name, is one object. Each posting keeps amount and date and points at that currency. The letter A in an editor is the same example: the glyph is shared, the position is not."),
          paragraph("The gain is memory, when the copy repeats in the millions. A catalog of a hundred items does not need the factory. The shared part has to be immutable, otherwise one write shows up for everyone."),
        ],
        [
          "Intrinsic state is shared, extrinsic state is passed on the call",
          "It earns its place when the copy is heavy",
          "Mutable shared state leaks",
        ],
        "Do not propose flyweight to save half a dozen objects.",
      ),
    },
    {
      id: "ask-proxy",
      conceptId: "def-proxy",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "O que é o Proxy, e onde ele aparece no Spring?",
        en: "What is the Proxy, and where does it show up in Spring?",
      },
      covers: ["Explain the Proxy pattern.", "Why does an internal call skip @Transactional?"],
      pt: locale(
        "Intenção primeiro: controlar acesso, não somar regra. O exemplo é o proxy do @Transactional. Não esqueça a chamada interna.",
        [
          paragraph("Proxy implementa a mesma interface e fica no caminho. Pode atrasar a criação, checar permissão ou abrir transação. O @Transactional do Spring é isso: a chamada pela interface abre a transação, invoca o bean e confirma ou reverte."),
          paragraph("this.charge() não passa pelo proxy, então a anotação no método interno não dispara. Decorator tem a forma parecida e outra intenção, somar comportamento. O serviço não deve saber que o proxy existe."),
        ],
        [
          "Mesma interface, controle de acesso",
          "Transactional é um proxy",
          "Chamada interna não passa por ele",
        ],
        "Não prometa que método interno anotado abre transação.",
      ),
      en: locale(
        "Intent first: control access, do not add a rule. The example is the @Transactional proxy. Do not forget the internal call.",
        [
          paragraph("Proxy implements the same interface and stands in the way. It can delay creation, check a permission, or open a transaction. Spring's @Transactional is that: a call through the interface opens the transaction, invokes the bean, and commits or rolls back."),
          paragraph("this.charge() does not go through the proxy, so the annotation on the internal method does not fire. Decorator has a similar shape and another intent, adding behavior. The service should not know the proxy exists."),
        ],
        [
          "Same interface, access control",
          "Transactional is a proxy",
          "An internal call does not go through it",
        ],
        "Do not promise that an annotated internal method opens a transaction.",
      ),
    },
  ],
};
