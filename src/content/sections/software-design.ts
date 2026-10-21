import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { softwareDesignTheory } from "../theory/software-design";

export const softwareDesign: InterviewSection = {
  id: "software-design",
  order: 7,
  titles: {
    pt: "Desenho de software",
    en: "Software design",
  },
  summaries: {
    pt: "Acoplamento, coesão, composição, o modelo que protege a regra, e como eu corto um caso de uso na entrevista.",
    en: "Coupling, cohesion, composition, the model that protects the rule, and how to cut a use case in the interview.",
  },
  theory: softwareDesignTheory,
  questions: [
    {
      id: "what-software-design-is",
      conceptId: "def-software-design",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que você chama de desenho de software?",
        en: "What do you mean by software design?",
      },
      covers: ["How do you judge whether a design is good?"],
      pt: locale(
        "Defina pelo efeito da mudança. Nomeie o que você protege e feche com o limite: CRUD simples não ganha arquitetura.",
        [
          paragraph("Desenho de software é a forma do código para uma mudança cair num lugar só. Eu não começo pelo diagrama. Eu nomeio a mudança que estou protegendo: a regra de preço, o provedor de pagamento, o contrato HTTP. O tipo dono dessa mudança é o desenho."),
          paragraph("SOLID e os padrões GoF são ferramentas, não o desenho. O critério da entrevista é o limite do caso de uso, o invariante, e o que eu me recuso a acoplar. Um CRUD que só espelha a tabela não ganha porta, adaptador e um domínio rico. Eu aplico o que já dói."),
        ],
        [
          "Mudança num lugar só",
          "A mudança protegida tem um dono",
          "CRUD simples não ganha camada extra",
        ],
        "Não recite os cinco princípios SOLID. Não diga que bom desenho é ter interface em toda classe.",
      ),
      en: locale(
        "Define it by the effect of a change. Name what you protect and close with the limit: a simple CRUD does not earn an architecture.",
        [
          paragraph("Software design is the shape of the code so a change lands in one place. I do not start from the diagram. I name the change I am protecting: the price rule, the payment provider, the HTTP contract. The type that owns that change is the design."),
          paragraph("SOLID and the GoF patterns are tools, not the design. The interview criterion is the use-case boundary, the invariant, and what I refuse to couple. A CRUD that only mirrors the table does not earn a port, an adapter, and a rich domain. I apply what already hurts."),
        ],
        [
          "A change lands in one place",
          "The protected change has an owner",
          "A simple CRUD does not earn an extra layer",
        ],
        "Do not recite the five SOLID principles. Do not say good design means an interface on every class.",
      ),
    },
    {
      id: "coupling-and-cohesion",
      conceptId: "def-coupling-cohesion",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que são acoplamento e coesão?",
        en: "What are coupling and cohesion?",
      },
      covers: ["What is the Law of Demeter?"],
      pt: locale(
        "Defina os dois com o OrderService inchado. Diga o que o caso de uso pode conhecer. Feche com a cadeia de getter.",
        [
          paragraph("Acoplamento é o quanto um tipo precisa saber de outro para mudar. Coesão é se o interior muda pelo mesmo motivo. Um `OrderService` que valida HTTP, calcula preço, chama a Stripe e monta e-mail muda por quatro donos. Coesão baixa, acoplamento alto."),
          paragraph("Eu deixo o caso de uso coordenar. Preço, a porta do gateway e o e-mail ficam fora. Acoplamento baixo não é zero: o caso conhece a porta. Ele não conhece o SDK. `order.getCustomer().getAddress().getCity()` é o mesmo erro na chamada. Eu peço à ordem a cidade, ou recebo o valor já resolvido."),
        ],
        [
          "Acoplamento é conhecimento exigido para mudar",
          "Coesão é um motivo só dentro do tipo",
          "A porta sim, o SDK não",
          "Cadeia de getter atravessa objeto alheio",
        ],
        "Não diga que acoplamento zero é o objetivo. Não proponha uma classe por linha.",
      ),
      en: locale(
        "Define both with the bloated OrderService. Say what the use case may know. Close with the getter chain.",
        [
          paragraph("Coupling is how much one type must know about another in order to change. Cohesion is whether the inside changes for the same reason. An OrderService that validates HTTP, calculates price, calls Stripe, and builds the email changes for four owners. Low cohesion, high coupling."),
          paragraph("I let the use case coordinate. Pricing, the gateway port, and the email stay outside. Low coupling is not zero: the case knows the port. It does not know the SDK. order.getCustomer().getAddress().getCity() is the same mistake on a call. I ask the order for the city, or I receive the value already resolved."),
        ],
        [
          "Coupling is knowledge required in order to change",
          "Cohesion is one reason inside the type",
          "The port yes, the SDK no",
          "A getter chain walks someone else's object",
        ],
        "Do not say zero coupling is the goal. Do not propose a class per line.",
      ),
    },
    {
      id: "composition-over-inheritance",
      conceptId: "def-composition-over-inheritance",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Quando você compõe em vez de herdar?",
        en: "When do you compose instead of inheriting?",
      },
      covers: ["Why not extend a base service to reuse code?"],
      pt: locale(
        "Separe é-um de tem-um. Herança só com contrato cumprido. O exemplo é o serviço que não estende o CRUD genérico.",
        [
          paragraph("Composição é guardar outro objeto e delegar. Herança é ser um subtipo. Eu herdo quando o filho cumpre o contrato da base, o que a pergunta de Liskov já exige. Eu componho quando quero reusar comportamento sem herdar ciclo de vida."),
          paragraph("O serviço de cobrança tem um `PaymentGateway` e um ledger. Ele não estende `AbstractCrudService` para reusar três linhas. Essa herança acopla o teste à base e obriga o filho a carregar método que não usa. Três linhas iguais, com o mesmo motivo de mudança, podem continuar duplicadas até doer."),
        ],
        [
          "Composição delega, herança é subtipo",
          "Herança só com o contrato da base",
          "Serviço não estende CRUD genérico para reusar linha",
        ],
        "Não diga que herança é sempre errada. Não reabra os cinco princípios SOLID.",
      ),
      en: locale(
        "Separate is-a from has-a. Inheritance only when the contract holds. The example is the service that does not extend the generic CRUD.",
        [
          paragraph("Composition is holding another object and delegating. Inheritance is being a subtype. I inherit when the child honors the base contract, which the Liskov question already requires. I compose when I want to reuse behavior without inheriting a lifecycle."),
          paragraph("The charge service has a PaymentGateway and a ledger. It does not extend AbstractCrudService to reuse three lines. That inheritance couples the test to the base and forces the child to carry a method it does not use. Three identical lines, with the same reason to change, can stay duplicated until they hurt."),
        ],
        [
          "Composition delegates, inheritance is a subtype",
          "Inheritance only when the base contract holds",
          "A service does not extend generic CRUD to reuse a line",
        ],
        "Do not say inheritance is always wrong. Do not reopen the five SOLID principles.",
      ),
    },
    {
      id: "dry-kiss-yagni",
      conceptId: "def-dry-kiss-yagni",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "Como você usa DRY, KISS e YAGNI?",
        en: "How do you use DRY, KISS, and YAGNI?",
      },
      covers: ["When is extracting a shared method the wrong move?"],
      pt: locale(
        "DRY com a armadilha da flag. KISS como leitura. YAGNI com o segundo caso pagando a abstração.",
        [
          paragraph("DRY é uma regra num lugar só. Duas linhas parecidas que mudam por motivos diferentes não são duplicação. Extrair as duas num helper e depois enfiar uma flag é DRY falso. A próxima mudança quebra os dois chamadores."),
          paragraph("KISS é o código que um colega lê às duas da manhã, sem motor genérico para um `if`. YAGNI é não abrir interface de provedor, ponto de plugin ou framework interno antes do segundo caso. A segunda variação paga a abstração. O primeiro `if` fica no serviço."),
        ],
        [
          "DRY é a regra, não a linha parecida",
          "Helper com flag é DRY falso",
          "A segunda variação paga a abstração",
        ],
        "Não diga que duplicação é sempre um defeito. Não prometa um design genérico no primeiro caso.",
      ),
      en: locale(
        "DRY with the flag trap. KISS as readability. YAGNI with the second case paying for the abstraction.",
        [
          paragraph("DRY is one rule in one place. Two similar lines that change for different reasons are not duplication. Extracting both into a helper and then pushing a flag in is false DRY. The next change breaks both callers."),
          paragraph("KISS is the code a teammate reads at two in the morning, without a generic engine for one if. YAGNI is not opening a provider interface, a plugin point, or an internal framework before the second case. The second variation pays for the abstraction. The first if stays in the service."),
        ],
        [
          "DRY is the rule, not the similar line",
          "A helper with a flag is false DRY",
          "The second variation pays for the abstraction",
        ],
        "Do not say duplication is always a defect. Do not promise a generic design on the first case.",
      ),
    },
    {
      id: "anemic-versus-rich",
      conceptId: "def-rich-domain",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "Qual a diferença entre modelo anêmico e modelo rico?",
        en: "What is the difference between an anemic and a rich model?",
      },
      covers: ["Where should a balance invariant live?"],
      pt: locale(
        "Contraste o saco de campos com o tipo que recusa o saldo negativo. Diga quando o transaction script é honesto.",
        [
          paragraph("No modelo anêmico a entidade é um saco de campos e o serviço guarda toda regra. No modelo rico o tipo protege o invariante. `Account.debit` recusa saldo negativo. O serviço não precisa lembrar da checagem, e o teste do invariante não sobe o Spring."),
          paragraph("JPA continua mapeando a entidade. Eu não ponho anotação de web nem cliente HTTP no domínio. Regra que precisa de três repositórios fica no caso de uso, não num método que finge ser puro. CRUD de uma tabela, sem invariante, pode ser transaction script. Eu só empurro a regra para a entidade quando o invariante é o produto, como saldo e status do pedido."),
        ],
        [
          "Anêmico: regra no serviço, entidade oca",
          "Rico: o tipo recusa o estado inválido",
          "CRUD sem invariante pode ficar no serviço",
          "Domínio não importa Spring",
        ],
        "Não diga que toda entidade JPA tem de ser rica. Não mova orquestração de três repositórios para dentro da entidade.",
      ),
      en: locale(
        "Contrast the bag of fields with the type that refuses a negative balance. Say when a transaction script is honest.",
        [
          paragraph("In an anemic model the entity is a bag of fields and the service holds every rule. In a rich model the type protects the invariant. Account.debit refuses a negative balance. The service does not have to remember the check, and the invariant test does not boot Spring."),
          paragraph("JPA still maps the entity. I do not put a web annotation or an HTTP client on the domain. A rule that needs three repositories stays in the use case, not in a method pretending to be pure. A one-table CRUD with no invariant can be a transaction script. I push the rule onto the entity only when the invariant is the product, such as balance and order status."),
        ],
        [
          "Anemic: the rule is in the service, the entity is hollow",
          "Rich: the type refuses the invalid state",
          "A CRUD with no invariant can stay in the service",
          "The domain does not import Spring",
        ],
        "Do not say every JPA entity must be rich. Do not move orchestration of three repositories into the entity.",
      ),
    },
    {
      id: "value-object",
      conceptId: "def-value-object",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é um value object?",
        en: "What is a value object?",
      },
      covers: ["Why not pass a BigDecimal and a currency string?"],
      pt: locale(
        "Defina por valor, imutabilidade e igualdade. O exemplo é Money. Feche com o que continua sendo entidade.",
        [
          paragraph("Value object é definido pelo valor, não por um id. É imutável e a igualdade é pelo conteúdo. Dez reais é dez reais. E-mail, id de conta e um intervalo de datas entram aqui. Dois values iguais são intercambiáveis."),
          paragraph("Eu não deixo `BigDecimal` e uma string de moeda soltos no serviço. A escala e a moeda moram em `Money`, e uma operação devolve outro `Money`. Sem identidade, não há repositório. Se o objeto precisa ser acompanhado no tempo, como o pedido ou a conta, ele é entidade. Value object não ganha setter."),
        ],
        [
          "Igualdade pelo valor, sem id",
          "Imutável, operação devolve outro valor",
          "Money segura escala e moeda",
          "Pedido e conta continuam entidade",
        ],
        "Não diga que value object é qualquer classe pequena. Não dê a ele um id e um repositório.",
      ),
      en: locale(
        "Define it by value, immutability, and equality. The example is Money. Close with what stays an entity.",
        [
          paragraph("A value object is defined by its value, not by an id. It is immutable and equality is by content. Ten reais is ten reais. An email, an account id, and a date range belong here. Two equal values are interchangeable."),
          paragraph("I do not leave a BigDecimal and a currency string loose in the service. Scale and currency live in Money, and an operation returns another Money. With no identity, there is no repository. If the object must be followed over time, like the order or the account, it is an entity. A value object does not get a setter."),
        ],
        [
          "Equality by value, no id",
          "Immutable, an operation returns another value",
          "Money holds scale and currency",
          "Order and account stay entities",
        ],
        "Do not say a value object is any small class. Do not give it an id and a repository.",
      ),
    },
    {
      id: "dto-entity-domain",
      conceptId: "def-model-boundaries",
      difficulty: "pleno",
      speakSeconds: 75,
      titles: {
        pt: "Por que separar DTO, entidade e domínio?",
        en: "Why separate the DTO, the entity, and the domain?",
      },
      covers: ["Why not return the JPA entity from the controller?"],
      pt: locale(
        "Dê um trabalho a cada objeto. Diga o vazamento de devolver a entidade. Feche com o CRUD em que a terceira classe é cerimônia.",
        [
          paragraph("O DTO é o contrato HTTP. A entidade JPA é a tabela. O domínio é a regra. Devolver a entidade no controller vaza relação lazy, o nome da coluna e um caminho de escrita. O cliente passa a depender da tabela. Uma mudança de persistência vira mudança de API."),
          paragraph("Mapear custa. Num CRUD de uma tabela, sem regra, um DTO alinhado à entidade basta. A terceira classe começa quando o JSON e a tabela divergem, ou quando a regra não pode ver `@Column`. Eu não crio domínio rico só para ter mais arquivo."),
        ],
        [
          "DTO é contrato, entidade é tabela, domínio é regra",
          "Entidade no controller vaza lazy e coluna",
          "CRUD de uma tabela não ganha o terceiro tipo",
        ],
        "Não diga que sempre existem três classes. Não devolva a entidade e chame isso de simplicidade quando há lazy e contrato público.",
      ),
      en: locale(
        "Give each object one job. Say what leaks when you return the entity. Close with the CRUD where the third class is ceremony.",
        [
          paragraph("The DTO is the HTTP contract. The JPA entity is the table. The domain is the rule. Returning the entity from the controller leaks a lazy relation, the column name, and a write path. The client starts depending on the table. A persistence change becomes an API change."),
          paragraph("Mapping costs. In a one-table CRUD with no rule, a DTO aligned with the entity is enough. The third class starts when the JSON and the table diverge, or when the rule must not see @Column. I do not create a rich domain just to have another file."),
        ],
        [
          "DTO is the contract, entity is the table, domain is the rule",
          "An entity in the controller leaks lazy loading and columns",
          "A one-table CRUD does not earn the third type",
        ],
        "Do not say there are always three classes. Do not return the entity and call it simplicity when there is lazy loading and a public contract.",
      ),
    },
    {
      id: "layers-versus-ports",
      conceptId: "def-layers-and-ports",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "Quando três camadas bastam e quando você abre uma porta?",
        en: "When are three layers enough, and when do you open a port?",
      },
      covers: ["What is a port and adapter in a Spring service?"],
      pt: locale(
        "Comece pelas três camadas. Abra a porta só com segundo caso ou teste sem rede. Recuse hexagonal de CRUD.",
        [
          paragraph("Controller traduz HTTP, serviço segura o caso, repositório segura a tabela. Isso basta quando o caso é a tabela. Eu não desenho hexagonal para um cadastro que ninguém vai variar."),
          paragraph("Porta e adaptador entram quando o caso não pode conhecer o SDK. `ChargeOrder` depende de `PaymentGateway`. O adaptador implementa a porta, traduz o erro e guarda o cliente. Eu abro a interface quando há uma segunda implementação ou um teste que não pode subir a rede. Uma implementação só, sem dublê, não paga a interface. O caso de uso não importa `RestTemplate`."),
        ],
        [
          "Três camadas quando o caso é a tabela",
          "A porta esconde o SDK",
          "Interface com um segundo caso ou um teste sem rede",
          "Hexagonal de CRUD é passeio de pasta",
        ],
        "Não desenhe porta para cada classe. Não diga que hexagonal e Spring MVC são a mesma coisa.",
      ),
      en: locale(
        "Start from the three layers. Open a port only with a second case or a test that avoids the network. Refuse hexagonal CRUD.",
        [
          paragraph("The controller translates HTTP, the service holds the case, the repository holds the table. That is enough when the case is the table. I do not draw a hexagonal layout for a record nobody will vary."),
          paragraph("Port and adapter arrive when the case must not know the SDK. ChargeOrder depends on PaymentGateway. The adapter implements the port, translates the error, and holds the client. I open the interface when there is a second implementation or a test that must not boot the network. One implementation and no double does not earn the interface. The use case does not import RestTemplate."),
        ],
        [
          "Three layers when the case is the table",
          "The port hides the SDK",
          "An interface with a second case or a test off the network",
          "Hexagonal CRUD is a folder tour",
        ],
        "Do not draw a port for every class. Do not say hexagonal and Spring MVC are the same thing.",
      ),
    },
    {
      id: "package-by-feature",
      conceptId: "def-package-by-feature",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Você organiza pacote por camada ou por feature?",
        en: "Do you package by layer or by feature?",
      },
      covers: ["How do you structure packages in a Spring service?"],
      pt: locale(
        "Diga o que cada corte otimiza. Feature no topo quando a mudança é o caso. Camada numa aplicação pequena.",
        [
          paragraph("Por camada eu junto controller com controller e repositório com repositório. Uma mudança de pedido atravessa três pastas. Por feature, o pacote `order` tem o controller, o caso de uso, a porta e a persistência daquele pedido. A mudança fica junta."),
          paragraph("Camada ganha quando a aplicação é pequena e o time já acha as pastas. Feature ganha quando há vários casos e pagamento não deveria passar por cada pasta técnica. Eu corto o topo por feature e deixo o detalhe técnico dentro dela. Misturar os dois sem regra só cria um terceiro lugar para procurar."),
        ],
        [
          "Camada agrupa o papel técnico",
          "Feature agrupa a mudança",
          "Topo por feature, detalhe técnico dentro",
        ],
        "Não diga que um dos dois é sempre o certo. Não proponha um pacote novo por classe.",
      ),
      en: locale(
        "Say what each cut optimizes. Feature at the top when the change is the case. Layers on a small application.",
        [
          paragraph("By layer I group controller with controller and repository with repository. An order change walks three folders. By feature, the order package holds the controller, the use case, the port, and the persistence of that order. The change stays together."),
          paragraph("Layers win when the application is small and the team already finds the folders. Features win when there are several cases and payment should not pass through every technical folder. I cut the top by feature and leave the technical detail inside it. Mixing both without a rule only creates a third place to look."),
        ],
        [
          "Layers group the technical role",
          "Features group the change",
          "Top by feature, technical detail inside",
        ],
        "Do not say one of the two is always right. Do not propose a new package per class.",
      ),
    },
    {
      id: "design-a-use-case",
      conceptId: "def-use-case-shape",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Como você desenha a cobrança de um pedido?",
        en: "How do you design charging an order?",
      },
      covers: ["Walk a use case on the whiteboard."],
      pt: locale(
        "Comece pelo invariante. Depois os colaboradores e o que fica de fora. Feche com o que você ainda não abstrai.",
        [
          paragraph("Eu começo pelo invariante, não pela classe. O pedido existe, ainda não foi cobrado, o valor é positivo, e a cobrança acontece uma vez ou falha sem débito duplicado. `Money` é value object. A ordem de cobrança é entidade e recusa cobrar de novo."),
          paragraph("O caso de uso orquestra: carrega a ordem, chama a porta `PaymentGateway`, grava o resultado. O adaptador conhece o SDK e traduz o erro. O repositório fica fora do domínio. Com um provedor só eu não abro interface ainda. O segundo provedor, ou o teste que não pode subir a rede, paga a porta. Idempotência da cobrança é chave do pedido, não um retry cego."),
        ],
        [
          "Invariante antes da classe",
          "Money é valor, a ordem é entidade",
          "Gateway é porta, SDK fica no adaptador",
          "Uma implementação só não ganha interface",
          "Cobrança repetida não debita de novo",
        ],
        "Não desenhe fila, saga e banco antes de dizer o invariante. Não abstraia o único provedor no primeiro minuto.",
      ),
      en: locale(
        "Start from the invariant. Then the collaborators and what stays outside. Close with what you do not abstract yet.",
        [
          paragraph("I start from the invariant, not from the class. The order exists, it has not been charged, the amount is positive, and the charge happens once or fails without a duplicate debit. Money is a value object. The charge order is an entity and refuses to charge again."),
          paragraph("The use case orchestrates: it loads the order, calls the PaymentGateway port, and stores the result. The adapter knows the SDK and translates the error. The repository stays outside the domain. With one provider I do not open an interface yet. The second provider, or the test that must not boot the network, pays for the port. Charge idempotency is the order key, not a blind retry."),
        ],
        [
          "The invariant comes before the class",
          "Money is a value, the order is an entity",
          "The gateway is a port, the SDK stays in the adapter",
          "A single implementation does not earn an interface",
          "A repeated charge does not debit again",
        ],
        "Do not draw a queue, a saga, and a database before stating the invariant. Do not abstract the only provider in the first minute.",
      ),
    },
  ],
};
