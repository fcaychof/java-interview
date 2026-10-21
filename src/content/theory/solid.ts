import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const solidTheory: readonly TheoryGroup[] = [
  theoryGroup("solid-theory", "Os cinco princípios", "The five principles", [
    concept(
      "def-solid",
      "SOLID",
      "SOLID",
      [
        paragraph("SOLID é um conjunto de cinco princípios para código orientado a objeto que muda num ponto só. Não é framework e não é licença para criar uma interface em toda classe. O alvo prático é alterar uma regra sem quebrar o controller, o repositório e as outras regras."),
        paragraph("S é um motivo para mudar. O é estender comportamento sem reescrever o que já funciona. L é o subtipo cumprir o contrato do tipo base. I é o cliente não depender de método que não chama. D é o alto nível depender da abstração, com o detalhe concreto entrando por fora. Num serviço Spring eu aplico o que já dói. Interface de uma implementação só, sem teste que precise de fake, é exagero."),
      ],
      [
        paragraph("SOLID is five principles for object-oriented code that changes in one place. It is not a framework and it is not a license to put an interface on every class. The practical target is to change one rule without breaking the controller, the repository, and the other rules."),
        paragraph("S is one reason to change. O is extending behavior without rewriting what already works. L is the subtype honoring the base contract. I is the client not depending on a method it does not call. D is the high level depending on an abstraction, with the concrete detail supplied from outside. In a Spring service I apply what already hurts. An interface with one implementation, and no test that needs a fake, is too much."),
      ],
    ),
    concept(
      "def-srp",
      "Single Responsibility",
      "Single Responsibility",
      [
        paragraph("Uma classe tem um motivo para mudar. Motivo é um ator ou uma regra, não um método. Se produto muda o frete e operações muda o e-mail, as duas mudanças não podem cair no mesmo OrderService. Quando caem, o teste de uma quebra a outra."),
        paragraph("O serviço de pedido orquestra o caso de uso. Cálculo, notificação e auditoria vão para tipos próprios quando os donos divergiram. Extrair uma classe por linha não é o princípio. Se as três linhas só mudam juntas, elas moram juntas."),
      ],
      [
        paragraph("A class has one reason to change. A reason is an actor or a rule, not a method. If product changes shipping and operations changes the email, those two changes must not land in the same OrderService. When they do, the test of one breaks the other."),
        paragraph("The order service orchestrates the use case. Pricing, notification, and audit move into their own types when the owners have diverged. Extracting a class per line is not the principle. If the three lines only change together, they live together."),
      ],
    ),
    concept(
      "def-ocp",
      "Open/Closed",
      "Open/Closed",
      [
        paragraph("Aberto para um comportamento novo, fechado para editar o que já foi testado. O switch de desconto que cresce a cada campanha edita a classe e arrisca as campanhas antigas. Uma abstração Discount, com uma implementação por regra, deixa a campanha nova ser uma classe nova."),
        paragraph("Dois ramos estáveis num switch são mais claros do que uma hierarquia. O princípio entra quando a variação já se repetiu e o próximo tipo é previsível. Correção de bug continua sendo edição. O princípio não proíbe abrir a classe."),
      ],
      [
        paragraph("Open to a new behavior, closed to editing what was already tested. A discount switch that grows with every campaign edits the class and risks the old campaigns. A Discount abstraction, with one implementation per rule, lets the new campaign be a new class."),
        paragraph("Two stable branches in a switch are clearer than a hierarchy. The principle earns its place when the variation has already repeated and the next type is predictable. A bug fix is still an edit. The principle does not forbid opening the class."),
      ],
    ),
    concept(
      "def-lsp",
      "Liskov",
      "Liskov",
      [
        paragraph("Se um método aceita o tipo base, qualquer subtipo entra no lugar sem o chamador mudar e sem o programa quebrar. Herança que compila não basta. O contrato é o que o método promete devolver, o que recusa, e quais exceções fazem parte da regra."),
        paragraph("Square que estende Rectangle e muda a altura dentro de setWidth mente a área. PaymentGateway que lança UnsupportedOperationException no boleto mente para quem programou contra a interface. Pré-condição do subtipo não aperta. Pós-condição não afrouxa. Se o comportamento não cabe, eu não uso herança."),
      ],
      [
        paragraph("If a method accepts the base type, any subtype takes its place without the caller changing and without the program breaking. Inheritance that compiles is not enough. The contract is what the method promises to return, what it refuses, and which exceptions are part of the rule."),
        paragraph("A Square that extends Rectangle and changes the height inside setWidth lies about the area. A PaymentGateway that throws UnsupportedOperationException for boleto lies to whoever programmed against the interface. A subtype precondition does not get tighter. A postcondition does not get weaker. If the behavior does not fit, I do not use inheritance."),
      ],
    ),
    concept(
      "def-isp",
      "Interface Segregation",
      "Interface Segregation",
      [
        paragraph("Nenhum cliente deve depender de método que não usa. A interface gorda empurra implementação vazia, UnsupportedOperationException, ou um mock de doze métodos num teste que só queria salvar."),
        paragraph("UserRepository que declara save, find, sendWelcomeEmail e exportPdf mistura persistência com efeito. Eu quebro pelo chamador: escrita, leitura se o ritmo for outro, e o e-mail num notifier. O corte segue quem chama. Uma interface por método, sem cliente distinto, só aumenta a navegação. SRP olha o motivo de mudança da classe. ISP olha o que cada chamador precisa ver."),
      ],
      [
        paragraph("No client should depend on a method it does not use. A fat interface pushes an empty implementation, an UnsupportedOperationException, or a twelve-method mock in a test that only wanted to save."),
        paragraph("A UserRepository that declares save, find, sendWelcomeEmail, and exportPdf mixes persistence with an effect. I split by the caller: writing, reading if the rhythm is different, and the email on a notifier. The cut follows who calls. One interface per method, with no distinct client, only adds navigation. SRP looks at the class's reason to change. ISP looks at what each caller needs to see."),
      ],
    ),
    concept(
      "def-dip",
      "Dependency Inversion",
      "Dependency Inversion",
      [
        paragraph("O módulo de alto nível não depende do módulo de baixo nível. Os dois dependem de uma abstração. O caso de uso de cobrança conhece PaymentGateway, não RestTemplate nem o SDK. A abstração mora perto do caso de uso. O adaptador concreto implementa e fica do lado de fora."),
        paragraph("Injeção pelo construtor é o mecanismo, não o princípio. Sem o contrato, injetar a classe concreta só esconde o new. O teste passa um fake sem rede. Field injection quebra isso: o teste precisa do container, e a dependência deixa de ser obrigatória no construtor. @Autowired não é o princípio."),
      ],
      [
        paragraph("The high-level module does not depend on the low-level module. Both depend on an abstraction. The charge use case knows PaymentGateway, not RestTemplate or the SDK. The abstraction lives next to the use case. The concrete adapter implements it and stays outside."),
        paragraph("Constructor injection is the mechanism, not the principle. Without the contract, injecting the concrete class only hides the new. The test passes a fake with no network. Field injection breaks this: the test needs the container, and the dependency is no longer required by the constructor. @Autowired is not the principle."),
      ],
    ),
  ]),
];
