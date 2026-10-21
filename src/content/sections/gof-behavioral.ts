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

export const gofBehavioral: PatternSlice = {
  group: theoryGroup("gof-behavioral", "Comportamento", "Behavioral", [
    concept(
      "def-chain",
      "Chain of Responsibility",
      "Chain of Responsibility",
      [
        paragraph("Chain of Responsibility coloca uma fila de elos diante do mesmo pedido. Cada elo trata e encerra, ou repassa ao próximo. O remetente não sabe qual elo resolveu. A ordem faz parte da regra."),
        paragraph("O filtro do servlet e a cadeia do Spring Security são o exemplo pronto. Um autentica, outro autoriza, e qualquer um pode cortar a requisição. No domínio, fraude, limite e saldo podem recusar um pagamento antes do débito. O primeiro que recusa encerra."),
        paragraph("Se todos os passos rodam sempre, um bloco direto é mais honesto do que uma cadeia. O bug clássico é o elo que engole o pedido e não deixa o motivo. Sem log e sem resposta, o cliente vê timeout e ninguém sabe quem cortou."),
      ],
      [
        paragraph("Chain of Responsibility puts a line of links in front of the same request. Each link handles and stops, or forwards to the next. The sender does not know which link resolved it. Order is part of the rule."),
        paragraph("The servlet filter and the Spring Security chain are the ready-made example. One authenticates, another authorizes, and any of them can cut the request off. In the domain, fraud, limit, and balance can refuse a payment before the debit. The first one that refuses stops the chain."),
        paragraph("If every step always runs, a straight block is more honest than a chain. The classic bug is the link that swallows the request and leaves no reason. With no log and no answer, the client sees a timeout and nobody knows who stopped it."),
      ],
    ),
    concept(
      "def-command",
      "Command",
      "Command",
      [
        paragraph("Command empacota um pedido como objeto. O objeto tem o que fazer e, se precisar, como desfazer. Quem dispara, o invocador, não conhece o destinatário. Dá para enfileirar, registrar, repetir ou agendar o mesmo pedido."),
        paragraph("Numa API, a mensagem da fila já é um comando: o payload diz a operação, o consumer é quem executa. Um botão de desfazer num editor guarda a pilha de comandos. O execute mudou o documento, o undo volta o estado anterior."),
        paragraph("Eu não crio uma classe de comando para cada endpoint que só chama um serviço e devolve. O objeto extra paga quando o pedido precisa viver fora da chamada: fila, retry, auditoria do que foi pedido, ou desfazer."),
      ],
      [
        paragraph("Command packages a request as an object. The object has what to do and, when needed, how to undo it. The invoker that fires it does not know the receiver. You can queue, log, retry, or schedule the same request."),
        paragraph("In an API, the queue message is already a command: the payload says the operation, the consumer is who runs it. An undo button in an editor keeps the stack of commands. execute changed the document, undo restores the previous state."),
        paragraph("I do not create a command class for every endpoint that only calls a service and returns. The extra object pays off when the request must live outside the call: a queue, a retry, an audit of what was asked, or an undo."),
      ],
    ),
    concept(
      "def-interpreter",
      "Interpreter",
      "Interpreter",
      [
        paragraph("Interpreter representa uma gramática pequena e calcula uma sentença dela. Cada regra vira uma classe. Terminal é a folha, um número ou um campo. Não terminal combina filhos, um AND ou uma soma. Um contexto carrega o que a sentença precisa ler."),
        paragraph("Cabe numa regra de desconto que o negócio escreve: valor acima de cem e categoria livros. Cada nó sabe se avaliar. A árvore é a expressão. Eu não escrevo um compilador. Para uma linguagem de verdade, um parser pronto ganha de uma classe por produção da gramática."),
        paragraph("Três ifs fixos no código não são uma gramática. Interpreter entra quando a frase muda sem deploy de classe nova, ou quando a combinação de regras já não cabe num switch. Fora isso, a hierarquia de expressões é cerimônia."),
      ],
      [
        paragraph("Interpreter represents a small grammar and evaluates a sentence of it. Each rule becomes a class. A terminal is the leaf, a number or a field. A nonterminal combines children, an AND or a sum. A context carries what the sentence needs to read."),
        paragraph("It fits a discount rule the business writes: amount above one hundred and category books. Each node knows how to evaluate itself. The tree is the expression. I do not write a compiler. For a real language, an existing parser beats one class per grammar production."),
        paragraph("Three fixed ifs in code are not a grammar. Interpreter earns its place when the sentence changes without a new class deploy, or when the combination of rules no longer fits a switch. Outside that, the expression hierarchy is ceremony."),
      ],
    ),
    concept(
      "def-iterator",
      "Iterator",
      "Iterator",
      [
        paragraph("Iterator percorre os elementos sem expor como eles estão guardados. O cliente pede o próximo e pergunta se acabou. A coleção pode ser array, árvore ou o resultado de uma consulta. O laço não sabe."),
        paragraph("A JDK já entregou isso. Iterable e Iterator sustentam o for-each. O iterador fail-fast de uma ArrayList guarda o modCount e lança ConcurrentModificationException se a lista muda no meio da volta, fora do remove do próprio iterador. Isso é proteção, não um bug da linguagem."),
        paragraph("Eu não escrevo um iterator para uma lista que já é Iterable. Escrevo quando a estrutura é minha, um grafo ou um cursor de página, e quero esconder o miolo. Expor o array interno para o cliente iterar quebra o encapsulamento no dia em que a estrutura muda."),
      ],
      [
        paragraph("Iterator walks the elements without exposing how they are stored. The client asks for the next one and asks whether it is finished. The collection can be an array, a tree, or the result of a query. The loop does not know."),
        paragraph("The JDK already shipped this. Iterable and Iterator power for-each. An ArrayList's fail-fast iterator stores modCount and throws ConcurrentModificationException if the list changes during the walk, other than through the iterator's own remove. That is protection, not a language bug."),
        paragraph("I do not write an iterator for a list that is already Iterable. I write one when the structure is mine, a graph or a page cursor, and I want to hide the inside. Exposing the internal array so the client can iterate breaks encapsulation the day the structure changes."),
      ],
    ),
    concept(
      "def-mediator",
      "Mediator",
      "Mediator",
      [
        paragraph("Mediator tira a conversa direta entre vários colegas e coloca um objeto no meio. Estoque não chama pagamento. Pagamento não chama frete. Os três falam com o mediador, e só ele conhece a sequência do checkout."),
        paragraph("O ganho é localizar a interação. Um colega novo entra sem os outros ganharem uma dependência. O custo é o mediador virar o objeto que sabe tudo. Se a regra de preço, a de estoque e a de fraude moram nele, ele deixou de mediar e virou o serviço deus."),
        paragraph("Um caso de uso que orquestra três portas já é um mediador modesto. Eu não crio a classe extra se dois objetos se chamam uma vez. Evento do Spring parece mediador, mas é Observer: quem publica não coordena a resposta."),
      ],
      [
        paragraph("Mediator removes the direct conversation among several colleagues and puts one object in the middle. Stock does not call payment. Payment does not call shipping. The three talk to the mediator, and only it knows the checkout sequence."),
        paragraph("The gain is locating the interaction. A new colleague joins without the others gaining a dependency. The cost is the mediator becoming the object that knows everything. If the price rule, the stock rule, and the fraud rule live in it, it stopped mediating and became the god service."),
        paragraph("A use case that orchestrates three ports is already a modest mediator. I do not create the extra class if two objects call each other once. A Spring event looks like a mediator, but it is Observer: the publisher does not coordinate the response."),
      ],
    ),
    concept(
      "def-memento",
      "Memento",
      "Memento",
      [
        paragraph("Memento guarda um snapshot do estado para restaurar depois, sem abrir os campos internos de quem originou. O originador cria o memento e sabe ler o que está dentro. O caretaker só armazena e devolve. Ele não edita o snapshot."),
        paragraph("O caso clássico é desfazer. Cada comando guarda o memento de antes. O undo pede ao originador para restaurar. Num serviço, o equivalente honesto muitas vezes é uma linha de histórico: o status anterior do pedido, gravado de propósito, não um blob opaco do objeto inteiro."),
        paragraph("Snapshot de tudo, a cada mudança, pesa e ainda vaza se o caretaker consegue ler o miolo. Se eu só preciso do status anterior, uma coluna ou uma tabela de auditoria chega lá sem o padrão inteiro."),
      ],
      [
        paragraph("Memento keeps a snapshot of state so it can be restored later, without opening the internal fields of whoever originated it. The originator creates the memento and knows how to read what is inside. The caretaker only stores it and hands it back. It does not edit the snapshot."),
        paragraph("The classic case is undo. Each command keeps the memento from before. Undo asks the originator to restore. In a service, the honest equivalent is often a history row: the order's previous status, written on purpose, not an opaque blob of the whole object."),
        paragraph("A snapshot of everything, on every change, is heavy and still leaks if the caretaker can read the inside. If I only need the previous status, a column or an audit table gets there without the whole pattern."),
      ],
    ),
    concept(
      "def-observer",
      "Observer",
      "Observer",
      [
        paragraph("Observer separa quem mudou de quem reage. O sujeito publica um fato e não conhece os ouvintes. Cada ouvinte decide o que fazer. Um efeito novo entra sem um if no meio de quem publicou."),
        paragraph("No Spring, ApplicationEventPublisher publica, e um método com EventListener escuta. TransactionalEventListener espera o commit quando o efeito só faz sentido com o dado confirmado. O evento leva o id e o valor. java.util.Observable está obsoleto desde o Java 9 e ainda empurra herança."),
        paragraph("Ouvinte síncrono corre na mesma thread, com a transação ainda aberta. Rede nesse ponto prende conexão, e falha no e-mail pode reverter o pagamento. Efeito que não pode sumir é inserido na mesma transação, numa tabela de outbox, e publicado dali. A regra principal do caso de uso continua chamada direta."),
      ],
      [
        paragraph("Observer separates whoever changed from whoever reacts. The subject publishes a fact and does not know the listeners. Each listener decides what to do. A new effect arrives without an if in the middle of the publisher."),
        paragraph("In Spring, ApplicationEventPublisher publishes, and a method with EventListener listens. TransactionalEventListener waits for commit when the effect only makes sense once the data is confirmed. The event carries the id and the amount. java.util.Observable has been deprecated since Java 9 and still pushes inheritance."),
        paragraph("A synchronous listener runs on the same thread, with the transaction still open. A network call there holds a connection, and a failure in the email can roll the payment back. An effect that must not disappear is inserted in the same transaction, in an outbox table, and published from there. The main rule of the use case stays a direct call."),
      ],
    ),
    concept(
      "def-state",
      "State",
      "State",
      [
        paragraph("State troca o comportamento do objeto quando o estado interno muda. Cada estado é um tipo que sabe o que aquela fase permite e qual é a próxima. O contexto delega e substitui o estado atual pelo que a operação devolveu."),
        paragraph("Pedido cabe quando a transição é a regra que já quebrou. Pago estorna. Enviado não volta para rascunho. Cancelado recusa cobrança nova. O serviço deixa de concentrar um switch que esquece um ramo. A diferença para Strategy: na Strategy alguém de fora escolhe o algoritmo e ele permanece. No State o próprio objeto transita."),
        paragraph("Três status com transições óbvias ficam mais claros num enum, com a regra num lugar só. State entra quando cada fase tem comportamento de verdade e o switch já mentiu em produção."),
      ],
      [
        paragraph("State changes the object's behavior when its internal state changes. Each state is a type that knows what that phase allows and what comes next. The context delegates and replaces the current state with what the operation returned."),
        paragraph("An order fits when the transition is the rule that already broke. Paid can refund. Shipped does not go back to draft. Canceled refuses a new charge. The service stops holding a switch that forgets a branch. The difference from Strategy: in Strategy someone outside chooses the algorithm and it stays. In State the object itself transitions."),
        paragraph("Three statuses with obvious transitions stay clearer as an enum, with the rule in one place. State earns its place when each phase has real behavior and the switch has already lied in production."),
      ],
    ),
    concept(
      "def-strategy",
      "Strategy",
      "Strategy",
      [
        paragraph("Strategy guarda uma família de algoritmos atrás de uma interface e deixa o cliente escolher um. O objeto que usa a estratégia não sabe se o frete sai do peso, do CEP ou do contrato da transportadora. Trocar a política não edita o checkout."),
        paragraph("Em Java, quando a conta cabe numa expressão, a interface funcional substitui a classe. O sinal para extrair é o switch que ganha um ramo a cada contrato novo. Dois ramos estáveis podem ficar no switch. A escolha vem de fora e não muda sozinha no meio da chamada. Se o próprio pedido troca de comportamento conforme o status, isso é State."),
        paragraph("Strategy é o aberto/fechado aplicado a um algoritmo. Uma estratégia por variação que aconteceu uma vez só aumenta a navegação."),
      ],
      [
        paragraph("Strategy keeps a family of algorithms behind an interface and lets the client choose one. The object that uses the strategy does not know whether shipping comes from weight, from the postal code, or from the carrier contract. Swapping the policy does not edit checkout."),
        paragraph("In Java, when the calculation fits in an expression, a functional interface replaces the class. The signal to extract is the switch that gains a branch with every new contract. Two stable branches can stay in the switch. The choice comes from outside and does not change on its own in the middle of the call. If the order itself changes behavior as the status changes, that is State."),
        paragraph("Strategy is open/closed applied to an algorithm. One strategy per variation that happened once only adds navigation."),
      ],
    ),
    concept(
      "def-template-method",
      "Template Method",
      "Template Method",
      [
        paragraph("Template Method fixa o esqueleto numa classe base. O chamador dispara o método público. A subclasse preenche os passos que variam, os ganchos. A ordem dos passos não muda. O que muda é o miolo de um deles."),
        paragraph("JdbcTemplate segue essa ideia com uma diferença que vale citar: o esqueleto abre a conexão, executa, traduz a SQLException e fecha. O passo variável não é uma subclasse do meu serviço. Entra como callback, em geral um RowMapper. O framework ficou com o esqueleto."),
        paragraph("No caso de uso, herdar só para trocar um passo amarra o teste à base. Se o que varia é o algoritmo inteiro, Strategy resolve sem a hierarquia. Template Method paga no framework, onde o esqueleto é estável e mil chamadores dependem dele."),
      ],
      [
        paragraph("Template Method fixes the skeleton in a base class. The caller fires the public method. The subclass fills in the steps that vary, the hooks. The order of the steps does not change. What changes is the inside of one of them."),
        paragraph("JdbcTemplate follows that idea with a difference worth citing: the skeleton opens the connection, executes, translates the SQLException, and closes. The varying step is not a subclass of my service. It comes in as a callback, usually a RowMapper. The framework kept the skeleton."),
        paragraph("In a use case, inheriting only to swap one step ties the test to the base. If what varies is the whole algorithm, Strategy gets there without the hierarchy. Template Method pays off in a framework, where the skeleton is stable and a thousand callers depend on it."),
      ],
    ),
    concept(
      "def-visitor",
      "Visitor",
      "Visitor",
      [
        paragraph("Visitor acrescenta uma operação nova numa estrutura de tipos sem editar esses tipos a cada operação. Cada elemento aceita um visitante e chama de volta o método visit com o próprio tipo. Isso é despacho duplo: o elemento escolhe o visitante, e o visitante escolhe o método pelo tipo concreto."),
        paragraph("Cabe quando a árvore é estável e as operações mudam. Um pedido, uma linha e um imposto podem ser visitados por um cálculo de total, por uma exportação e por uma auditoria. A operação nova é um visitante novo. Os elementos não ganham um método novo."),
        paragraph("O preço aparece quando nasce um tipo novo: todo visitante precisa de um método para ele. Se os tipos mudam mais do que as operações, Visitor inverte o problema. Para um total só, um método na interface é mais direto."),
      ],
      [
        paragraph("Visitor adds a new operation on a structure of types without editing those types for every operation. Each element accepts a visitor and calls back the visit method with its own type. That is double dispatch: the element chooses the visitor, and the visitor chooses the method by the concrete type."),
        paragraph("It fits when the tree is stable and the operations change. An order, a line, and a tax can be visited by a total calculation, by an export, and by an audit. The new operation is a new visitor. The elements do not gain a new method."),
        paragraph("The price shows up when a new type is born: every visitor needs a method for it. If the types change more than the operations, Visitor flips the problem. For a single total, a method on the interface is more direct."),
      ],
    ),
  ]),
  questions: [
    {
      id: "ask-chain",
      conceptId: "def-chain",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "O que é Chain of Responsibility?",
        en: "What is Chain of Responsibility?",
      },
      covers: ["Explain the Chain of Responsibility pattern."],
      pt: locale(
        "Cada elo trata, repassa ou corta. Cite o filtro e a validação que pode recusar sozinha. Recuse a cadeia para passos que sempre rodam.",
        [
          paragraph("Uma fila de elos recebe o mesmo pedido. Cada um encerra ou passa adiante. A ordem é a regra. O filtro do servlet e a cadeia do Spring Security funcionam assim: autenticar, autorizar, e qualquer um pode cortar."),
          paragraph("No pagamento, fraude, limite ou saldo recusam e o resto nem roda. Se todos os passos rodam sempre, um bloco direto é mais honesto. O bug é o elo que engole o pedido e não deixa o motivo."),
        ],
        [
          "Elo trata, repassa ou corta",
          "Filtro e validação que recusa sozinha",
          "Sequência fixa não é cadeia",
        ],
        "Não monte uma cadeia para uma lista de ifs que sempre executam.",
      ),
      en: locale(
        "Each link handles, forwards, or stops. Cite the filter and the check that can refuse on its own. Refuse the chain for steps that always run.",
        [
          paragraph("A line of links receives the same request. Each one stops or passes it on. Order is the rule. The servlet filter and the Spring Security chain work this way: authenticate, authorize, and any of them can cut the request off."),
          paragraph("On a payment, fraud, limit, or balance refuse and the rest does not run. If every step always runs, a straight block is more honest. The bug is the link that swallows the request and leaves no reason."),
        ],
        [
          "A link handles, forwards, or stops",
          "A filter and a check that can refuse alone",
          "A fixed sequence is not a chain",
        ],
        "Do not build a chain for a list of ifs that always run.",
      ),
    },
    {
      id: "ask-command",
      conceptId: "def-command",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Command?",
        en: "What is the Command?",
      },
      covers: ["Explain the Command pattern."],
      pt: locale(
        "O pedido vira objeto. Diga o que isso libera: fila, retry, auditoria, desfazer. Feche com o endpoint que não precisa da classe.",
        [
          paragraph("Command empacota a operação. O invocador dispara sem conhecer o destinatário. Dá para guardar, repetir e, se o comando souber, desfazer. A mensagem da fila já é isso: o payload diz o que fazer, o consumer executa."),
          paragraph("Uma classe por endpoint que só delega ao serviço não compra nada. O objeto vale quando o pedido vive fora da chamada, na fila, no retry ou numa pilha de undo."),
        ],
        [
          "Pedido como objeto",
          "Fila, retry e undo são o motivo",
          "Endpoint trivial não ganha a classe",
        ],
        "Não crie um comando para cada método do controller.",
      ),
      en: locale(
        "The request becomes an object. Say what that unlocks: a queue, a retry, an audit, an undo. Close with the endpoint that does not need the class.",
        [
          paragraph("Command packages the operation. The invoker fires it without knowing the receiver. You can store it, retry it, and, if the command knows how, undo it. The queue message is already that: the payload says what to do, the consumer runs it."),
          paragraph("One class per endpoint that only delegates to the service buys nothing. The object is worth it when the request lives outside the call, on a queue, in a retry, or on an undo stack."),
        ],
        [
          "A request as an object",
          "Queue, retry, and undo are the reason",
          "A trivial endpoint does not earn the class",
        ],
        "Do not create a command for every controller method.",
      ),
    },
    {
      id: "ask-interpreter",
      conceptId: "def-interpreter",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Interpreter?",
        en: "What is the Interpreter?",
      },
      covers: ["Explain the Interpreter pattern."],
      pt: locale(
        "Gramática pequena, uma classe por regra. Dê a regra de desconto que o negócio escreve. Recuse compilador e recuse três ifs.",
        [
          paragraph("Interpreter avalia uma sentença. Cada regra da gramática é uma classe. A folha é um número ou um campo. O nó combina filhos, um AND, uma comparação. O contexto traz o pedido que a regra lê."),
          paragraph("Cabe numa expressão de desconto que muda sem uma classe nova de serviço. Três ifs fixos não são gramática. Uma linguagem de verdade pede um parser, não uma hierarquia caseira."),
        ],
        [
          "Uma classe por regra de uma gramática pequena",
          "A árvore é a expressão",
          "Ifs fixos e linguagem grande ficam de fora",
        ],
        "Não proponha Interpreter para um CRUD nem para um compilador.",
      ),
      en: locale(
        "A small grammar, one class per rule. Give the discount rule the business writes. Refuse a compiler and refuse three ifs.",
        [
          paragraph("Interpreter evaluates a sentence. Each grammar rule is a class. The leaf is a number or a field. The node combines children, an AND, a comparison. The context brings the order the rule reads."),
          paragraph("It fits a discount expression that changes without a new service class. Three fixed ifs are not a grammar. A real language needs a parser, not a homegrown hierarchy."),
        ],
        [
          "One class per rule of a small grammar",
          "The tree is the expression",
          "Fixed ifs and a large language stay out",
        ],
        "Do not propose Interpreter for a CRUD or for a compiler.",
      ),
    },
    {
      id: "ask-iterator",
      conceptId: "def-iterator",
      difficulty: "junior",
      speakSeconds: 65,
      titles: {
        pt: "O que é o Iterator?",
        en: "What is the Iterator?",
      },
      covers: ["Explain the Iterator pattern.", "Why does modifying a collection during iteration fail?"],
      pt: locale(
        "Percorrer sem expor a estrutura. Diga que a JDK já entregou, e explique o fail-fast numa frase. Feche com o caso em que você escreveria o seu.",
        [
          paragraph("Iterator entrega o próximo elemento e esconde se por baixo há array, árvore ou página. O for-each usa Iterable. O cliente não ganha o array interno, que mudaria no dia em que a coleção trocasse de miolo."),
          paragraph("O iterador da ArrayList é fail-fast: se a lista muda no meio, fora do remove do próprio iterador, vem ConcurrentModificationException. Eu só escrevo um iterator quando a estrutura é minha, um grafo ou um cursor."),
        ],
        [
          "Percorrer sem expor a representação",
          "A JDK já tem Iterable e for-each",
          "Fail-fast não é acidente",
        ],
        "Não reimplemente iterator para uma List comum.",
      ),
      en: locale(
        "Walk without exposing the structure. Say the JDK already shipped it, and explain fail-fast in one sentence. Close with the case where you would write your own.",
        [
          paragraph("Iterator hands over the next element and hides whether the storage is an array, a tree, or a page. for-each uses Iterable. The client does not receive the internal array, which would change the day the collection swapped its inside."),
          paragraph("ArrayList's iterator is fail-fast: if the list changes in the middle, other than through the iterator's own remove, you get ConcurrentModificationException. I only write an iterator when the structure is mine, a graph or a cursor."),
        ],
        [
          "Walk without exposing the representation",
          "The JDK already has Iterable and for-each",
          "Fail-fast is not an accident",
        ],
        "Do not reimplement iterator for an ordinary List.",
      ),
    },
    {
      id: "ask-mediator",
      conceptId: "def-mediator",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Mediator?",
        en: "What is the Mediator?",
      },
      covers: ["Explain the Mediator pattern."],
      pt: locale(
        "Os colegas não se chamam. Um objeto concentra a conversa. Mostre o checkout. Avise que ele vira o serviço deus se absorver todas as regras.",
        [
          paragraph("Estoque, pagamento e frete falam com o mediador, não uns com os outros. A sequência do checkout mora num lugar. Um colega novo não adiciona dependência nos antigos."),
          paragraph("O custo é o mediador que passa a guardar preço, estoque e fraude. Aí ele deixou de mediar. Dois objetos que se chamam uma vez não precisam da classe. Evento do Spring é Observer, não mediador: quem publica não coordena a resposta."),
        ],
        [
          "A interação fica num objeto só",
          "O risco é o objeto que sabe tudo",
          "Evento não é mediador",
        ],
        "Não apresente o mediador como licença para um serviço deus.",
      ),
      en: locale(
        "The colleagues do not call each other. One object holds the conversation. Show checkout. Warn that it becomes the god service if it absorbs every rule.",
        [
          paragraph("Stock, payment, and shipping talk to the mediator, not to each other. The checkout sequence lives in one place. A new colleague does not add a dependency on the old ones."),
          paragraph("The cost is the mediator that starts holding price, stock, and fraud. Then it stopped mediating. Two objects that call each other once do not need the class. A Spring event is Observer, not a mediator: the publisher does not coordinate the response."),
        ],
        [
          "The interaction lives in one object",
          "The risk is the object that knows everything",
          "An event is not a mediator",
        ],
        "Do not present the mediator as a license for a god service.",
      ),
    },
    {
      id: "ask-memento",
      conceptId: "def-memento",
      difficulty: "senior",
      speakSeconds: 65,
      titles: {
        pt: "O que é o Memento?",
        en: "What is the Memento?",
      },
      covers: ["Explain the Memento pattern."],
      pt: locale(
        "Snapshot para restaurar, sem abrir o miolo. Separe originador de caretaker. No serviço, diga quando uma linha de histórico basta.",
        [
          paragraph("O originador cria o memento e é o único que sabe ler o estado. O caretaker guarda e devolve, sem editar. O undo restaura o snapshot de antes da operação."),
          paragraph("Num pedido, o status anterior numa tabela de auditoria chega no mesmo lugar sem blob opaco. Snapshot de tudo a cada mudança pesa, e vaza se o caretaker lê os campos."),
        ],
        [
          "Snapshot opaco para quem só guarda",
          "Originador restaura, caretaker não edita",
          "Histórico explícito muitas vezes basta",
        ],
        "Não guarde o objeto inteiro serializado para lembrar um status.",
      ),
      en: locale(
        "A snapshot to restore, without opening the inside. Separate originator from caretaker. In a service, say when a history row is enough.",
        [
          paragraph("The originator creates the memento and is the only one that knows how to read the state. The caretaker stores it and hands it back, without editing. Undo restores the snapshot from before the operation."),
          paragraph("On an order, the previous status in an audit table gets to the same place without an opaque blob. A snapshot of everything on every change is heavy, and it leaks if the caretaker reads the fields."),
        ],
        [
          "A snapshot that is opaque to whoever only stores it",
          "The originator restores, the caretaker does not edit",
          "An explicit history is often enough",
        ],
        "Do not store the whole serialized object to remember one status.",
      ),
    },
    {
      id: "ask-observer",
      conceptId: "def-observer",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Como o Observer aparece num serviço, e onde ele quebra?",
        en: "How does Observer show up in a service, and where does it break?",
      },
      covers: ["Explain the Observer pattern.", "How do Spring events relate to the Observer pattern?"],
      pt: locale(
        "Quem mudou não conhece quem reage. Use o pedido pago. Aponte o evento do Spring e feche com transação e outbox.",
        [
          paragraph("O caso de uso publica que o pedido foi pago. E-mail, estoque e auditoria escutam. O efeito novo não entra como if na cobrança. No Spring isso é ApplicationEventPublisher e EventListener. Efeito que só vale depois do commit usa TransactionalEventListener. Observable da JDK está obsoleto."),
          paragraph("Ouvinte síncrono corre com a transação aberta: rede prende conexão, e falha no e-mail pode reverter o pagamento. O que não pode sumir vai para uma outbox na mesma transação. A regra principal continua chamada direta."),
        ],
        [
          "O sujeito não conhece os ouvintes",
          "Evento do Spring, não Observable",
          "Depois do commit, ou outbox",
        ],
        "Não publique evento para esconder o fluxo obrigatório do caso de uso.",
      ),
      en: locale(
        "Whoever changed does not know who reacts. Use the paid order. Point at Spring's event and close with the transaction and the outbox.",
        [
          paragraph("The use case publishes that the order was paid. Mail, stock, and audit listen. The new effect does not arrive as an if in the charge. In Spring that is ApplicationEventPublisher and EventListener. An effect that only counts after commit uses TransactionalEventListener. The JDK Observable is deprecated."),
          paragraph("A synchronous listener runs with the transaction open: a network call holds a connection, and an email failure can roll the payment back. What must not disappear goes to an outbox in the same transaction. The main rule stays a direct call."),
        ],
        [
          "The subject does not know the listeners",
          "A Spring event, not Observable",
          "After commit, or an outbox",
        ],
        "Do not publish an event to hide the required flow of the use case.",
      ),
    },
    {
      id: "ask-state",
      conceptId: "def-state",
      difficulty: "senior",
      speakSeconds: 75,
      titles: {
        pt: "O que é o State, e como ele difere de Strategy?",
        en: "What is State, and how does it differ from Strategy?",
      },
      covers: ["Explain the State pattern.", "What is the difference between Strategy and State?"],
      pt: locale(
        "O objeto transita e o comportamento muda. Dê o pedido. A diferença: Strategy é escolhida de fora e fica. Enum curto não vira hierarquia.",
        [
          paragraph("Cada status é um tipo que sabe o que aquela fase permite e qual vem depois. Pago estorna. Enviado não volta para rascunho. Cancelado recusa cobrança. O serviço substitui o estado atual pelo que a operação devolveu."),
          paragraph("Na Strategy o cliente escolhe o algoritmo e ele permanece. No State a troca é interna. Três status óbvios ficam num enum. A hierarquia entra quando o switch já esqueceu um ramo."),
        ],
        [
          "O comportamento muda com a transição",
          "Strategy é escolhida de fora e fica",
          "Enum curto não vira classe por status",
        ],
        "Não diga que State e Strategy são o mesmo nome.",
      ),
      en: locale(
        "The object transitions and the behavior changes. Give the order. The difference: Strategy is chosen from outside and stays. A short enum does not become a hierarchy.",
        [
          paragraph("Each status is a type that knows what that phase allows and what comes next. Paid can refund. Shipped does not go back to draft. Canceled refuses a charge. The service replaces the current state with what the operation returned."),
          paragraph("In Strategy the client chooses the algorithm and it stays. In State the swap is internal. Three obvious statuses stay in an enum. The hierarchy earns its place when the switch has already forgotten a branch."),
        ],
        [
          "Behavior changes with the transition",
          "Strategy is chosen from outside and stays",
          "A short enum does not become a class per status",
        ],
        "Do not say State and Strategy are the same name.",
      ),
    },
    {
      id: "ask-strategy",
      conceptId: "def-strategy",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "O que é o Strategy?",
        en: "What is the Strategy?",
      },
      covers: ["Explain the Strategy pattern."],
      pt: locale(
        "Família de algoritmos, escolha de fora. Use o frete. Diga que interface funcional conta, e que dois ramos estáveis ficam no switch.",
        [
          paragraph("O checkout depende de ShippingQuote e não sabe se o preço sai do peso, do CEP ou da transportadora. Cada regra é um tipo, ou uma interface funcional quando a conta cabe numa expressão. Trocar a política não edita o checkout."),
          paragraph("O sinal para extrair é o switch que cresce a cada contrato. Dois ramos estáveis podem ficar. Se o pedido muda sozinho conforme o status, isso é State, não Strategy."),
        ],
        [
          "Algoritmo atrás de uma interface, escolhido de fora",
          "Lambda conta quando cabe",
          "Dois casos estáveis não viram hierarquia",
        ],
        "Não extraia uma estratégia para uma variação que aconteceu uma vez.",
      ),
      en: locale(
        "A family of algorithms, chosen from outside. Use shipping. Say a functional interface counts, and that two stable branches stay in the switch.",
        [
          paragraph("Checkout depends on ShippingQuote and does not know whether the price comes from weight, from the postal code, or from the carrier. Each rule is a type, or a functional interface when the calculation fits in an expression. Swapping the policy does not edit checkout."),
          paragraph("The signal to extract is the switch that grows with every contract. Two stable branches can stay. If the order changes on its own as the status changes, that is State, not Strategy."),
        ],
        [
          "An algorithm behind an interface, chosen from outside",
          "A lambda counts when it fits",
          "Two stable cases do not become a hierarchy",
        ],
        "Do not extract a strategy for a variation that happened once.",
      ),
    },
    {
      id: "ask-template-method",
      conceptId: "def-template-method",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "O que é o Template Method?",
        en: "What is the Template Method?",
      },
      covers: ["Explain the Template Method pattern."],
      pt: locale(
        "Esqueleto na classe base, gancho na subclasse. JdbcTemplate na sequência, com o callback no lugar da subclasse sua. Não herde no caso de uso para trocar um passo.",
        [
          paragraph("O método público fixa a ordem. A subclasse preenche o passo que varia. JdbcTemplate abre conexão, executa, traduz SQLException e fecha. O que varia entra como RowMapper, não como subclasse do meu serviço."),
          paragraph("No framework o esqueleto estável paga a herança. No caso de uso, herdar para trocar um passo amarra o teste à base. Se o algoritmo inteiro varia, Strategy é o caminho."),
        ],
        [
          "Ordem fixa, gancho variável",
          "No JdbcTemplate o gancho é um callback",
          "Serviço não herda para variar um passo",
        ],
        "Não diga que JdbcTemplate exige uma subclasse sua.",
      ),
      en: locale(
        "Skeleton in the base class, hook in the subclass. JdbcTemplate next, with the callback in place of a subclass of yours. Do not inherit in the use case to swap one step.",
        [
          paragraph("The public method fixes the order. The subclass fills in the step that varies. JdbcTemplate opens the connection, executes, translates the SQLException, and closes. What varies comes in as a RowMapper, not as a subclass of my service."),
          paragraph("In a framework the stable skeleton pays for the inheritance. In a use case, inheriting to swap one step ties the test to the base. If the whole algorithm varies, Strategy is the path."),
        ],
        [
          "Fixed order, variable hook",
          "In JdbcTemplate the hook is a callback",
          "A service does not inherit to vary one step",
        ],
        "Do not say JdbcTemplate requires a subclass of yours.",
      ),
    },
    {
      id: "ask-visitor",
      conceptId: "def-visitor",
      difficulty: "senior",
      speakSeconds: 75,
      titles: {
        pt: "O que é o Visitor?",
        en: "What is the Visitor?",
      },
      covers: ["Explain the Visitor pattern."],
      pt: locale(
        "Operação nova sem editar os tipos, desde que a estrutura esteja estável. Explique o accept que chama visit de volta. Diga o preço: tipo novo mexe em todo visitante.",
        [
          paragraph("Cada elemento aceita um visitante e devolve a chamada com o próprio tipo. Total, exportação e auditoria são visitantes. O pedido, a linha e o imposto não ganham um método a cada operação. Isso é despacho duplo."),
          paragraph("Funciona quando a árvore não muda e as operações sim. Um tipo novo obriga método novo em todo visitante. Para um total só, um método na interface é mais direto. Eu não uso Visitor num CRUD."),
        ],
        [
          "Operação fora da estrutura",
          "accept devolve para o visit certo",
          "Tipo novo custa caro; operação nova é barata",
        ],
        "Não proponha Visitor quando os tipos mudam mais do que as operações.",
      ),
      en: locale(
        "A new operation without editing the types, as long as the structure is stable. Explain accept calling visit back. Say the price: a new type touches every visitor.",
        [
          paragraph("Each element accepts a visitor and calls back with its own type. Total, export, and audit are visitors. The order, the line, and the tax do not gain a method for every operation. That is double dispatch."),
          paragraph("It works when the tree does not change and the operations do. A new type forces a new method on every visitor. For a single total, a method on the interface is more direct. I do not use Visitor on a CRUD."),
        ],
        [
          "The operation lives outside the structure",
          "accept calls back the right visit",
          "A new type is expensive; a new operation is cheap",
        ],
        "Do not propose Visitor when the types change more than the operations.",
      ),
    },
  ],
};
