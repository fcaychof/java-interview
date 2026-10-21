import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const softwareDesignTheory: readonly TheoryGroup[] = [
  theoryGroup(
    "design-criteria",
    "O critério",
    "The criterion",
    [
      concept(
        "def-software-design",
        "O que a entrevista chama de desenho",
        "What the interview means by design",
        [
          paragraph("Desenho de software é a forma do código para que uma mudança caia num lugar só. Não é concurso de diagrama. Na entrevista de backend eu nomeio a mudança que estou protegendo — a regra de preço, o provedor de pagamento, o contrato HTTP — e o tipo que é dono dela."),
          paragraph("SOLID e os padrões GoF são ferramentas desse desenho. Aqui o critério é outro: o limite do caso de uso, o invariante que não pode quebrar, e o que eu me recuso a acoplar. Um CRUD que só espelha a tabela não ganha três camadas extras."),
        ],
        [
          paragraph("Software design is the shape of the code so a change lands in one place. It is not a diagram contest. In a backend interview I name the change I am protecting — the price rule, the payment provider, the HTTP contract — and the type that owns it."),
          paragraph("SOLID and the GoF patterns are tools of that design. The criterion here is different: the use-case boundary, the invariant that must not break, and what I refuse to couple. A CRUD that only mirrors the table does not earn three extra layers."),
        ],
      ),
      concept(
        "def-coupling-cohesion",
        "Acoplamento e coesão",
        "Coupling and cohesion",
        [
          paragraph("Acoplamento é o quanto um tipo precisa saber de outro para mudar. Coesão é se o que está dentro do tipo muda pelo mesmo motivo. Um `OrderService` que valida HTTP, calcula preço, chama a Stripe e monta e-mail tem coesão baixa e acoplamento alto."),
          paragraph("O caso de uso coordena. Preço, a porta do gateway e o envio de e-mail ficam separados. Acoplamento baixo não é acoplamento zero: o caso de uso conhece a porta. Ele não conhece o `RestTemplate` nem o SDK."),
          paragraph("A Lei de Demeter é o mesmo critério na chamada. `order.getCustomer().getAddress().getCity()` atravessa três objetos que o método não deveria conhecer. Eu peço à ordem o que preciso, ou recebo um valor já resolvido. Encadear getter não é desenho."),
        ],
        [
          paragraph("Coupling is how much one type must know about another in order to change. Cohesion is whether what sits inside the type changes for the same reason. An OrderService that validates HTTP, calculates price, calls Stripe, and builds the email has low cohesion and high coupling."),
          paragraph("The use case coordinates. Pricing, the gateway port, and the mailer stay separate. Low coupling is not zero coupling: the use case knows the port. It does not know RestTemplate or the SDK."),
          paragraph("The Law of Demeter is the same criterion on a call. order.getCustomer().getAddress().getCity() walks three objects the method should not know. I ask the order for what I need, or I receive a value already resolved. A getter chain is not a design."),
        ],
      ),
    ],
  ),
  theoryGroup(
    "design-code",
    "O código",
    "The code",
    [
      concept(
        "def-composition-over-inheritance",
        "Composição em vez de herança",
        "Composition over inheritance",
        [
          paragraph("Composição: o objeto guarda outro e delega. Herança: o objeto é um subtipo. Eu estendo quando o subtipo cumpre o contrato da base. Eu componho quando quero reusar comportamento sem herdar um ciclo de vida."),
          paragraph("Um serviço de cobrança guarda um `PaymentGateway` e um ledger. Ele não estende `AbstractCrudService` para reusar três linhas. Herança de serviço acopla o teste à classe base e força o filho a carregar o que não usa."),
        ],
        [
          paragraph("Composition: the object holds another and delegates. Inheritance: the object is a subtype. I extend when the subtype honors the base contract. I compose when I want to reuse behavior without inheriting a lifecycle."),
          paragraph("A charge service holds a PaymentGateway and a ledger. It does not extend AbstractCrudService to reuse three lines. Service inheritance couples the test to the base class and forces the child to carry what it does not use."),
        ],
      ),
      concept(
        "def-dry-kiss-yagni",
        "DRY, KISS e YAGNI",
        "DRY, KISS, and YAGNI",
        [
          paragraph("DRY é uma regra num lugar só. A armadilha é extrair um método compartilhado de duas linhas que se parecem e mudam por motivos diferentes. Isso é DRY falso: a próxima mudança enfia uma flag no helper."),
          paragraph("KISS é o código reto que um colega lê às duas da manhã. YAGNI é não construir o segundo provedor, o ponto de plugin ou o motor genérico antes do segundo caso existir. A segunda variação paga a abstração. O primeiro `if` pode ficar."),
        ],
        [
          paragraph("DRY is one rule in one place. The trap is extracting a shared method from two lines that look alike and change for different reasons. That is false DRY: the next change pushes a flag into the helper."),
          paragraph("KISS is the straight code a teammate reads at two in the morning. YAGNI is not building the second provider, the plugin point, or the generic engine before the second case exists. The second variation pays for the abstraction. The first if can stay."),
        ],
      ),
      concept(
        "def-rich-domain",
        "Modelo anêmico e modelo rico",
        "Anemic and rich models",
        [
          paragraph("Modelo anêmico: a entidade é um saco de campos e o serviço tem todas as regras. Modelo rico: o tipo protege o invariante. `Account.debit` recusa saldo negativo em vez de o serviço lembrar de checar."),
          paragraph("JPA ainda pode mapear a entidade. A regra não vive só num serviço de quatrocentas linhas sem setter. Eu não ponho Spring nem HTTP dentro do tipo de domínio. Se a regra precisa de três repositórios, ela fica no caso de uso. A entidade que só existe para a tabela, num CRUD sem invariante, é um transaction script honesto. Vira problema quando o invariante é o produto."),
        ],
        [
          paragraph("An anemic model: the entity is a bag of fields and the service holds every rule. A rich model: the type protects the invariant. Account.debit refuses a negative balance instead of the service remembering to check."),
          paragraph("JPA can still map the entity. The rule does not live only in a four-hundred-line service with no setter. I do not put Spring or HTTP inside the domain type. If the rule needs three repositories, it stays in the use case. An entity that exists only for the table, in a CRUD with no invariant, is an honest transaction script. It becomes a problem when the invariant is the product."),
        ],
      ),
      concept(
        "def-value-object",
        "Value object",
        "Value object",
        [
          paragraph("Value object é definido pelo valor, imutável, com igualdade pelo conteúdo. Dez reais não é uma entidade com id. E-mail, id de conta e um intervalo de datas são value objects. Eu não espalho `BigDecimal` mais uma string de moeda pelo serviço."),
          paragraph("A escala e a moeda mudam dentro de `Money`. Sem identidade, não há repositório para ele. Dois values iguais são intercambiáveis. Se o objeto precisa ser rastreado ao longo do tempo, ele é entidade, não value."),
        ],
        [
          paragraph("A value object is defined by its value, immutable, with equality by content. Ten reais is not an entity with an id. An email, an account id, and a date range are value objects. I do not scatter a BigDecimal plus a currency string through the service."),
          paragraph("Scale and currency change inside Money. With no identity, there is no repository for it. Two equal values are interchangeable. If the object must be tracked over time, it is an entity, not a value."),
        ],
      ),
    ],
  ),
  theoryGroup(
    "design-structure",
    "A estrutura",
    "The structure",
    [
      concept(
        "def-model-boundaries",
        "DTO, entidade e domínio",
        "DTO, entity, and domain",
        [
          paragraph("Três objetos, três trabalhos. O DTO de request é o contrato HTTP. A entidade JPA é a tabela. O tipo de domínio é a regra. Devolver a entidade no controller vaza relação lazy, o formato da tabela e um caminho de escrita que o cliente não deveria ter."),
          paragraph("Mapear tem custo. Num CRUD de uma tabela e sem regra, um DTO que coincide com a entidade basta, e uma terceira classe é cerimônia. A separação começa quando o JSON e a tabela divergem, ou quando a regra não pode ver `@Column`."),
        ],
        [
          paragraph("Three objects, three jobs. The request DTO is the HTTP contract. The JPA entity is the table. The domain type is the rule. Returning the entity from the controller leaks a lazy relation, the table shape, and a write path the client should not have."),
          paragraph("Mapping has a cost. In a one-table CRUD with no rule, a DTO that matches the entity is enough, and a third class is ceremony. The split starts when the JSON and the table diverge, or when the rule must not see @Column."),
        ],
      ),
      concept(
        "def-layers-and-ports",
        "Camadas e portas",
        "Layers and ports",
        [
          paragraph("Três camadas: o controller traduz HTTP, o serviço segura o caso, o repositório segura a tabela. Isso basta quando o caso é a tabela. Porta e adaptador: o caso de uso depende de uma porta, `PaymentGateway`, e o adaptador implementa a porta e conhece o SDK."),
          paragraph("Eu abro uma porta quando existe uma segunda implementação ou um teste que não pode subir a rede. Uma implementação só, sem dublê de teste, não paga a interface. Hexagonal num CRUD que ninguém vai variar é um passeio de pasta."),
        ],
        [
          paragraph("Three layers: the controller translates HTTP, the service holds the case, the repository holds the table. That is enough when the case is the table. Port and adapter: the use case depends on a port, PaymentGateway, and the adapter implements the port and knows the SDK."),
          paragraph("I open a port when there is a second implementation or a test that must not boot the network. One implementation and no test double does not earn the interface. Hexagonal on a CRUD nobody will vary is a folder tour."),
        ],
      ),
      concept(
        "def-package-by-feature",
        "Pacote por feature",
        "Package by feature",
        [
          paragraph("Pacote por camada junta todos os controllers, todos os serviços e todos os repositórios. Pacote por feature junta, em `order`, o controller, o caso de uso, a porta e a persistência do pedido. A mudança do pedido fica num pacote."),
          paragraph("Camada ganha numa aplicação pequena em que todo mundo já conhece as pastas. Feature ganha quando o sistema tem vários casos e uma mudança de pagamento não deveria atravessar cada pasta técnica. No topo eu corto por feature. O detalhe técnico mora dentro da feature, não misturado sem regra."),
        ],
        [
          paragraph("Package by layer groups every controller, every service, and every repository. Package by feature groups, inside order, the controller, the use case, the port, and the order persistence. The order change stays in one package."),
          paragraph("Layers win on a small application where everyone already knows the folders. Features win when the system has several cases and a payment change should not walk every technical folder. At the top I cut by feature. The technical detail lives inside the feature, not mixed without a rule."),
        ],
      ),
      concept(
        "def-use-case-shape",
        "Como eu corto um caso de uso",
        "How I cut a use case",
        [
          paragraph("Num quadro eu começo pelo invariante, não pela classe. Cobrar um pedido: o pedido existe, ainda não foi cobrado, o valor é positivo, e a cobrança ou acontece uma vez ou falha sem débito duplicado. Isso é o que o tipo protege."),
          paragraph("Depois os colaboradores. O caso de uso orquestra. `Money` é value object. A ordem de cobrança é entidade. O gateway é porta. O adaptador e o repositório ficam de fora do domínio. Eu digo o que ainda não abstraio: um provedor só, sem interface, até o segundo existir."),
        ],
        [
          paragraph("On a board I start from the invariant, not from the class. Charging an order: the order exists, it has not been charged, the amount is positive, and the charge either happens once or fails without a duplicate debit. That is what the type protects."),
          paragraph("Then the collaborators. The use case orchestrates. Money is a value object. The charge order is an entity. The gateway is a port. The adapter and the repository stay outside the domain. I say what I do not abstract yet: one provider, no interface, until the second one exists."),
        ],
      ),
    ],
  ),
];
