import {
  code,
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { solidTheory } from "../theory/solid";

export const solid: InterviewSection = {
  id: "solid",
  order: 5,
  titles: {
    pt: "SOLID",
    en: "SOLID",
  },
  summaries: {
    pt: "Os cinco princípios com exemplo de serviço Java, e o ponto em que aplicá-los demais atrapalha.",
    en: "The five principles with a Java service example, and the point where applying them too hard gets in the way.",
  },
  theory: solidTheory,
  questions: [
    {
      id: "solid-overview",
      conceptId: "def-solid",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que é SOLID e por que isso aparece numa entrevista de backend?",
        en: "What is SOLID, and why does it come up in a backend interview?",
      },
      covers: ["What is SOLID?", "Explain the SOLID principles."],
      pt: locale(
        "Diga os cinco nomes na ordem e uma frase de efeito para cada um. Não explique os cinco por completo nessa resposta: o entrevistador vai escolher um. Feche com o motivo prático: mudar uma regra sem quebrar o resto do serviço.",
        [
          paragraph("SOLID é um conjunto de cinco princípios para desenhar código orientado a objeto que muda num ponto só. Não é um framework e não é uma checklist para criar interface em toda classe."),
          paragraph("S é responsabilidade única: a classe tem um motivo para mudar. O é aberto/fechado: estendo o comportamento sem reescrever o que já funciona. L é substituição de Liskov: um subtipo cumpre o contrato do tipo base. I é segregação de interface: ninguém implementa método que não usa. D é inversão de dependência: o serviço depende de uma abstração, e o detalhe concreto entra por fora."),
          paragraph("Numa API Java isso aparece quando o preço, o meio de pagamento ou a regra de frete muda. Se os cinco estão saudáveis, eu altero um ponto e o controller, o repositório e as outras regras continuam de pé. Se não estão, um if novo no meio do OrderService quebra um fluxo que eu nem ia mexer."),
        ],
        [
          "Cinco nomes, uma frase cada, sem ensaiar os cinco por completo",
          "O alvo é localizar a mudança",
          "Não é licença para criar uma interface por classe",
        ],
        "Não recite a sigla e pare. Também não transforme a resposta numa aula de história do Robert Martin.",
      ),
      en: locale(
        "Name the five in order and give each one sentence. Do not fully explain all five in this answer: the interviewer will pick one. Close with the practical reason: change one rule without breaking the rest of the service.",
        [
          paragraph("SOLID is five principles for object-oriented code that changes in one place. It is not a framework, and it is not a checklist that demands an interface on every class."),
          paragraph("S is single responsibility: the class has one reason to change. O is open/closed: I extend behavior without rewriting what already works. L is Liskov substitution: a subtype honors the base contract. I is interface segregation: nobody implements a method they do not use. D is dependency inversion: the service depends on an abstraction, and the concrete detail is supplied from outside."),
          paragraph("In a Java API this shows up when price, payment method, or shipping changes. If the five are healthy, I change one point and the controller, the repository, and the other rules stay standing. If they are not, a new if in the middle of OrderService breaks a flow I was not touching."),
        ],
        [
          "Five names, one sentence each",
          "The goal is to localize change",
          "It is not a license to add an interface to every class",
        ],
        "Do not recite the acronym and stop. Do not turn the answer into a history of Robert Martin.",
      ),
    },
    {
      id: "single-responsibility",
      conceptId: "def-srp",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que é o Single Responsibility Principle?",
        en: "What is the Single Responsibility Principle?",
      },
      covers: ["Explain the Single Responsibility Principle."],
      pt: locale(
        "Corrija a versão fraca logo no início: não é uma classe faz uma coisa só no sentido de um método. É um motivo para mudar. O exemplo bom é um serviço que calcula pedido, manda e-mail e grava auditoria. Separe pelo ator que pede a mudança.",
        [
          paragraph("Uma classe deve ter um único motivo para mudar. Motivo aqui é um ator ou uma regra, não um método. Se produto muda o cálculo do frete e operações muda o formato do e-mail, as duas mudanças não podem cair na mesma classe. Quando caem, o teste de uma quebra a outra."),
          paragraph("O sintoma num backend é o OrderService de mil linhas: valida o DTO, calcula desconto, chama o gateway, monta o HTML do e-mail e escreve a trilha de auditoria. Cada um desses tem dono diferente. Eu deixo o serviço de pedido orquestrar o caso de uso e empurro cálculo, notificação e auditoria para tipos próprios."),
          paragraph("O limite também importa. Extrair uma classe por linha não é SRP. Se só o pedido muda e as três linhas mudam juntas, elas podem morar juntas. Eu separo quando os motivos de mudança já divergiram, ou quando o teste precisa de um double para não subir o gateway."),
        ],
        [
          "Um motivo para mudar, não um método por classe",
          "Atores diferentes: preço, e-mail, auditoria",
          "Não extrair classe sem um motivo de mudança distinto",
        ],
        "Não diga que cada classe só pode ter um método. Isso produz um projeto impossível de navegar.",
      ),
      en: locale(
        "Correct the weak version immediately: it does not mean a class does one thing in the sense of one method. It means one reason to change. The good example is a service that prices an order, sends mail, and writes an audit. Split by the actor who asks for the change.",
        [
          paragraph("A class should have one reason to change. A reason is an actor or a rule, not a method. If product changes the shipping calculation and operations changes the email format, those two changes must not land in the same class. When they do, the test of one breaks the other."),
          paragraph("The backend symptom is the thousand-line OrderService: it validates the DTO, computes the discount, calls the gateway, builds the email HTML, and writes the audit trail. Each of those has a different owner. I let the order service orchestrate the use case and push pricing, notification, and audit into their own types."),
          paragraph("The limit matters too. Extracting a class per line is not SRP. If only the order changes and the three lines change together, they can live together. I split when the reasons to change have already diverged, or when a test needs a double so it does not boot the gateway."),
        ],
        [
          "One reason to change, not one method per class",
          "Different actors: price, email, audit",
          "Do not extract a class without a distinct reason to change",
        ],
        "Do not say each class may have only one method. That produces a project nobody can navigate.",
      ),
    },
    {
      id: "open-closed",
      conceptId: "def-ocp",
      difficulty: "pleno",
      speakSeconds: 85,
      titles: {
        pt: "O que é o Open/Closed Principle?",
        en: "What is the Open/Closed Principle?",
      },
      covers: ["Explain the Open/Closed Principle."],
      pt: locale(
        "Diga a frase clássica e traduza na hora: aberto para um comportamento novo, fechado para edição do código que já está em produção. O exemplo é um switch de tipo de desconto. Mostre a abstração e diga quando o switch ainda é a escolha honesta.",
        [
          paragraph("Um módulo fica aberto para extensão e fechado para modificação. Extensão significa um tipo novo que entra sem eu reabrir a classe que já foi testada. Modificação é o if que cresce toda vez que o negócio inventa uma variante."),
          paragraph("Se o pedido aplica desconto de cupom, de funcionário e de atacado com um switch no meio do serviço, cada campanha nova edita essa classe e arrisca as campanhas antigas. Eu fecho o serviço numa abstração e deixo cada regra ser um tipo:"),
          code(
            "interface Discount {\n    BigDecimal apply(BigDecimal amount);\n}\n\nclass CouponDiscount implements Discount { ... }\nclass EmployeeDiscount implements Discount { ... }",
          ),
          paragraph("O OrderService recebe uma lista de Discount e não sabe quantas campanhas existem. A campanha nova é uma classe nova e um registro no mapa de tipos, não uma edição do cálculo antigo."),
          paragraph("Eu não faço isso para uma variação que aconteceu uma vez. Dois ramos estáveis num switch são mais claros do que uma hierarquia. O princípio entra quando a variação já se repetiu e o próximo tipo é previsível."),
        ],
        [
          "Aberto para comportamento novo, fechado para editar o que já funciona",
          "Switch de desconto vira uma abstração com implementações",
          "Dois casos estáveis não justificam a hierarquia",
        ],
        "Não diga que é proibido editar uma classe existente. Correção de bug é modificação, e ela continua sendo o caminho certo.",
      ),
      en: locale(
        "Say the classic sentence and translate it immediately: open to a new behavior, closed to editing code that is already in production. The example is a discount-type switch. Show the abstraction and say when the switch is still the honest choice.",
        [
          paragraph("A module stays open for extension and closed for modification. Extension means a new type arrives without reopening the class that was already tested. Modification is the if that grows every time the business invents a variant."),
          paragraph("If the order applies a coupon, an employee discount, and a wholesale discount through a switch in the service, every new campaign edits that class and risks the old campaigns. I close the service on an abstraction and let each rule be a type:"),
          code(
            "interface Discount {\n    BigDecimal apply(BigDecimal amount);\n}\n\nclass CouponDiscount implements Discount { ... }\nclass EmployeeDiscount implements Discount { ... }",
          ),
          paragraph("OrderService receives the Discount values and does not know how many campaigns exist. A new campaign is a new class and a registration in the type map, not an edit of the old calculation."),
          paragraph("I do not do this for a variation that happened once. Two stable branches in a switch are clearer than a hierarchy. The principle earns its place when the variation has already repeated and the next type is predictable."),
        ],
        [
          "Open to new behavior, closed to editing what already works",
          "A discount switch becomes an abstraction with implementations",
          "Two stable cases do not justify the hierarchy",
        ],
        "Do not say editing an existing class is forbidden. A bug fix is a modification, and it is still the right path.",
      ),
    },
    {
      id: "liskov-substitution",
      conceptId: "def-lsp",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "O que é o Liskov Substitution Principle?",
        en: "What is the Liskov Substitution Principle?",
      },
      covers: ["Explain the Liskov Substitution Principle."],
      pt: locale(
        "A frase que separa pleno de quem só decorou: o chamador que usa o tipo base não pode precisar saber qual subtipo chegou. Dê um contraexemplo com exceção ou com retorno que muda o significado, não um diagrama de pássaro. Fale de pré-condição e pós-condição se o entrevistador sustentar o olhar.",
        [
          paragraph("Se um método aceita o tipo base, qualquer subtipo tem de poder entrar no lugar sem o chamador mudar e sem o programa quebrar. Herança que compila não basta. O contrato é que importa: o que o método promete devolver, o que ele se recusa a aceitar e quais exceções fazem parte da regra."),
          paragraph("O furo clássico é um Square que estende Rectangle e sobrescreve setWidth para também mudar a altura. Código que recebe Rectangle, define largura 5 e altura 4, e espera área 20, recebe 16. O subtipo mentiu. Outro furo de API é um PaymentGateway cujo método charge, na implementação de boleto, lança UnsupportedOperationException. Quem programou contra a interface não tinha como saber."),
          paragraph("Na prática eu fortaleço o teste com o tipo base e passo cada implementação. Pré-condição do subtipo não pode ser mais estreita: ele não pode exigir o que o base aceitava. Pós-condição não pode ser mais fraca: ele não pode devolver menos do que o base prometeu. Se o comportamento não cabe, eu não uso herança. Uso outra interface, ou composição."),
        ],
        [
          "Subtipo entra onde o tipo base entra, sem o chamador saber",
          "Quadrado que quebra a área, ou charge que lança unsupported",
          "Pré-condição não aperta, pós-condição não afrouxa",
        ],
        "Não explique Liskov como herança de pássaro que não voa. O entrevistador de backend quer o contrato quebrado numa API.",
      ),
      en: locale(
        "The sentence that separates a mid-level answer from a memorized one: the caller using the base type must not need to know which subtype arrived. Give a counterexample with an exception or a return that changes meaning, not a bird diagram. Mention preconditions and postconditions if the interviewer stays with you.",
        [
          paragraph("If a method accepts the base type, any subtype must be able to take its place without the caller changing and without the program breaking. Inheritance that compiles is not enough. The contract is what matters: what the method promises to return, what it refuses to accept, and which exceptions are part of the rule."),
          paragraph("The classic hole is a Square that extends Rectangle and overrides setWidth so it also changes the height. Code that receives a Rectangle, sets width 5 and height 4, and expects area 20, gets 16. The subtype lied. Another API hole is a PaymentGateway whose charge method, in the boleto implementation, throws UnsupportedOperationException. The caller programmed against the interface and had no way to know."),
          paragraph("In practice I strengthen the test against the base type and pass every implementation. A subtype precondition cannot be narrower: it cannot demand what the base accepted. A postcondition cannot be weaker: it cannot return less than the base promised. If the behavior does not fit, I do not use inheritance. I use another interface, or composition."),
        ],
        [
          "A subtype stands in for the base type without the caller knowing",
          "A square that breaks the area, or charge that throws unsupported",
          "Do not tighten preconditions or weaken postconditions",
        ],
        "Do not explain Liskov with a bird that cannot fly. A backend interviewer wants a broken contract on an API.",
      ),
    },
    {
      id: "interface-segregation",
      conceptId: "def-isp",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que é o Interface Segregation Principle?",
        en: "What is the Interface Segregation Principle?",
      },
      covers: ["Explain the Interface Segregation Principle."],
      pt: locale(
        "Aponte a interface gorda e o método vazio. Diga que o cliente só deve depender do que chama. O exemplo de repositório que também manda e-mail, ou de UserService com doze operações, fecha a resposta. Relacione com o SRP sem repetir a definição inteira.",
        [
          paragraph("Nenhum cliente deve ser forçado a depender de métodos que não usa. A interface gorda empurra implementação vazia, UnsupportedOperationException, ou um mock com doze métodos numa teste que só queria salvar."),
          paragraph("Um UserRepository que declara save, find, sendWelcomeEmail e exportPdf mistura persistência com efeitos que o repositório não deveria conhecer. O serviço de cadastro passa a depender de exportação. Eu quebro em interfaces que acompanham o cliente: uma de escrita do usuário, outra de leitura se a leitura tiver outro ritmo, e o e-mail fica num notifier. Quem grava não recompila porque o PDF mudou."),
          paragraph("Isso conversa com o SRP, mas o corte é outro. SRP olha o motivo de mudança da classe. ISP olha o que cada chamador precisa ver. Uma interface por método, sem cliente distinto, só aumenta a navegação."),
        ],
        [
          "O cliente não depende de método que não chama",
          "Interface gorda gera implementação vazia ou mock inútil",
          "O corte segue o chamador, não a vontade de fatiar",
        ],
        "Não proponha uma interface de um método para cada operação do sistema. Segregar sem clientes diferentes não compra nada.",
      ),
      en: locale(
        "Point at the fat interface and the empty method. Say the client should depend only on what it calls. A repository that also sends mail, or a UserService with twelve operations, closes the answer. Relate it to SRP without repeating the whole definition.",
        [
          paragraph("No client should be forced to depend on methods it does not use. A fat interface pushes an empty implementation, an UnsupportedOperationException, or a mock with twelve methods in a test that only wanted to save."),
          paragraph("A UserRepository that declares save, find, sendWelcomeEmail, and exportPdf mixes persistence with effects the repository should not know. The registration service starts depending on export. I split into interfaces that follow the client: one for writing the user, another for reading if reading has a different rhythm, and the email stays on a notifier. The writer does not recompile because the PDF changed."),
          paragraph("This talks to SRP, but the cut is different. SRP looks at the class's reason to change. ISP looks at what each caller needs to see. One interface per method, with no distinct client, only adds navigation."),
        ],
        [
          "The client does not depend on a method it does not call",
          "A fat interface produces an empty implementation or a useless mock",
          "The cut follows the caller, not the urge to slice",
        ],
        "Do not propose a one-method interface for every operation in the system. Segregating without different clients buys nothing.",
      ),
    },
    {
      id: "dependency-inversion",
      conceptId: "def-dip",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "O que é o Dependency Inversion Principle?",
        en: "What is the Dependency Inversion Principle?",
      },
      covers: [
        "Explain the Dependency Inversion Principle.",
        "How does SOLID relate to Spring dependency injection?",
      ],
      pt: locale(
        "Separe inversão de injeção. Inversão é a regra: o alto nível não importa a classe concreta. Injeção é o mecanismo, e no Spring é o construtor. Mostre o serviço dependendo do gateway, não do cliente HTTP. Feche com o teste que passa um fake.",
        [
          paragraph("Módulos de alto nível não dependem de módulos de baixo nível. Os dois dependem de uma abstração. A abstração não depende do detalhe; o detalhe depende da abstração. Em português de serviço: o caso de uso de cobrança não conhece RestTemplate, SDK do banco nem a classe que abre socket. Ele conhece um contrato de cobrança."),
          code(
            "class ChargeService {\n    private final PaymentGateway payments;\n\n    ChargeService(PaymentGateway payments) {\n        this.payments = payments;\n    }\n}",
          ),
          paragraph("PaymentGateway é a abstração e mora perto do caso de uso. StripeGateway implementa e fica no adaptador. O Spring injeta a implementação pelo construtor porque o container é quem monta o grafo, não porque a anotação seja o princípio. Sem o contrato, injetar a classe concreta só esconde o new."),
          paragraph("O ganho que eu cito é o teste e a troca de fornecedor. O teste de ChargeService passa um fake que devolve aprovado ou recusado, sem rede. Trocar o fornecedor muda o adaptador e o binding, não a regra de quando cobrar. Field injection quebra isso: o teste precisa do container, e a dependência deixa de ser obrigatória no construtor."),
        ],
        [
          "Alto nível e detalhe dependem da abstração",
          "Injeção pelo construtor é o mecanismo, não o princípio",
          "Teste com fake e troca de fornecedor sem editar a regra",
        ],
        "Não diga que Dependency Inversion significa usar @Autowired. A anotação sem abstração não inverte nada.",
      ),
      en: locale(
        "Separate inversion from injection. Inversion is the rule: the high level does not import the concrete class. Injection is the mechanism, and in Spring it is the constructor. Show the service depending on the gateway, not on the HTTP client. Close with the test that passes a fake.",
        [
          paragraph("High-level modules do not depend on low-level modules. Both depend on an abstraction. The abstraction does not depend on the detail; the detail depends on the abstraction. In service language: the charge use case does not know RestTemplate, the bank SDK, or the class that opens the socket. It knows a charge contract."),
          code(
            "class ChargeService {\n    private final PaymentGateway payments;\n\n    ChargeService(PaymentGateway payments) {\n        this.payments = payments;\n    }\n}",
          ),
          paragraph("PaymentGateway is the abstraction and lives next to the use case. StripeGateway implements it and lives in the adapter. Spring injects the implementation through the constructor because the container builds the graph, not because the annotation is the principle. Without the contract, injecting the concrete class only hides the new."),
          paragraph("The gain I cite is the test and the supplier swap. The ChargeService test passes a fake that returns approved or declined, with no network. Changing supplier changes the adapter and the binding, not the rule of when to charge. Field injection breaks this: the test needs the container, and the dependency is no longer required by the constructor."),
        ],
        [
          "High level and detail both depend on the abstraction",
          "Constructor injection is the mechanism, not the principle",
          "A fake in the test, and a supplier swap that does not edit the rule",
        ],
        "Do not say Dependency Inversion means using @Autowired. The annotation without an abstraction inverts nothing.",
      ),
    },
    {
      id: "solid-in-a-spring-service",
      conceptId: "def-solid",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Como eu aplico SOLID num serviço Spring sem exagerar?",
        en: "How do you apply SOLID in a Spring service without overdoing it?",
      },
      covers: [
        "How would you apply SOLID in a Spring Boot service?",
        "When is SOLID too much?",
      ],
      pt: locale(
        "Mostre uma fatia real, não os cinco nomes de novo. Controller fino, caso de uso, porta de saída, adaptador. Depois diga o que você não extrai: interface de uma implementação só, hierarquia para dois ifs, e camada que só repassa a chamada. Esse fechamento é o que soa sênior.",
        [
          paragraph("Num serviço Spring eu aplico o que já dói. O controller traduz HTTP e chama um caso de uso. O caso de uso guarda a regra e depende de portas: repositório e gateway. Os adaptadores implementam as portas e conhecem JPA ou HTTP. A regra não importa a anotação de web nem a entidade se o mapeamento começar a vazar."),
          paragraph("SRP aparece porque o controller não calcula preço. OCP aparece numa regra que já teve três variantes, com uma estratégia registrada, não num if eterno. LSP aparece quando eu recuso um subtipo que não cumpre o contrato da porta. ISP aparece quando o caso de uso vê save e find, não o EntityManager. DIP é o construtor recebendo a porta, com o Spring escolhendo o bean."),
          paragraph("O exagero tem cara conhecida. Interface com um único implementador e sem teste que precise de fake. Pacote de cinco classes para somar dois campos. Herança de serviço para reaproveitar três linhas. Eu espero a segunda variação, ou um teste que não consegue subir, antes de abrir a abstração. SOLID serve para o código que muda. O resto pode ser uma classe direta."),
        ],
        [
          "Controller, caso de uso, porta e adaptador",
          "Cada princípio só onde o sintoma já existe",
          "Uma implementação só e um if estável não ganham hierarquia",
        ],
        "Não desenhe hexagonal completo para um CRUD que ninguém vai variar. Também não diga que SOLID e Spring são a mesma coisa.",
      ),
      en: locale(
        "Show a real slice, not the five names again. A thin controller, a use case, an outbound port, an adapter. Then say what you do not extract: an interface with one implementation, a hierarchy for two ifs, and a layer that only forwards the call. That close is what sounds senior.",
        [
          paragraph("In a Spring service I apply what already hurts. The controller translates HTTP and calls a use case. The use case holds the rule and depends on ports: a repository and a gateway. The adapters implement the ports and know JPA or HTTP. The rule does not import a web annotation or the entity once the mapping starts to leak."),
          paragraph("SRP shows up because the controller does not compute the price. OCP shows up in a rule that already had three variants, with a registered strategy, not an eternal if. LSP shows up when I refuse a subtype that does not honor the port's contract. ISP shows up when the use case sees save and find, not the EntityManager. DIP is the constructor receiving the port, with Spring choosing the bean."),
          paragraph("Overdoing it has a familiar face. An interface with a single implementor and no test that needs a fake. A package of five classes to add two fields. A service inheritance to reuse three lines. I wait for the second variation, or for a test that cannot boot, before I open the abstraction. SOLID is for the code that changes. The rest can be a straight class."),
        ],
        [
          "Controller, use case, port, and adapter",
          "Each principle only where the symptom already exists",
          "One implementation and a stable if do not earn a hierarchy",
        ],
        "Do not draw a full hexagonal layout for a CRUD nobody will vary. Do not say SOLID and Spring are the same thing.",
      ),
    },
  ],
};
