import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const springTheory: readonly TheoryGroup[] = [
  theoryGroup("spring-theory", "Spring Boot", "Spring Boot", [
    concept(
      "def-spring-boot",
      "Por que o Boot existe",
      "Why Boot exists",
      [
        paragraph("Spring Boot tira do caminho o que todo serviço repetia: escolher versões compatíveis, subir um servidor, e escrever a configuração óbvia. O starter traz um conjunto de dependências que já foram testadas juntas. O Tomcat vem embutido. O actuator expõe saúde e métricas."),
        paragraph("Auto-configuração olha o classpath e o que você declarou, e registra os beans que faltam. Não é mágica irresponsável: a condição está no código, em @ConditionalOnClass e nos irmãos. O custo é saber o que foi ligado. Eu leio o relatório de condições quando um bean apareceu sem eu ter pedido, ou quando o que eu pedi não subiu."),
      ],
      [
        paragraph("Spring Boot takes out of the way what every service used to repeat: picking compatible versions, starting a server, and writing the obvious configuration. A starter brings a set of dependencies that were already tested together. Tomcat comes embedded. Actuator exposes health and metrics."),
        paragraph("Auto-configuration looks at the classpath and at what you declared, and registers the beans that are missing. It is not reckless magic: the condition is in the code, on @ConditionalOnClass and its siblings. The cost is knowing what was turned on. I read the conditions report when a bean showed up without me asking, or when the one I asked for did not start."),
      ],
    ),
    concept(
      "def-auto-config",
      "Auto-configuração",
      "Auto-configuration",
      [
        paragraph("@SpringBootApplication junta três coisas: @Configuration, para a classe ser fonte de beans; @ComponentScan, para achar componentes no pacote dela e abaixo; @EnableAutoConfiguration, para importar as configurações do Boot. O scan não sobe acima do pacote da classe principal. Componente fora dali não nasce."),
        paragraph("A auto-configuração perde para a sua. Se você declara um DataSource, a condição que criaria o default enxerga o bean e recua. Ordem e @Conditional são o mecanismo. Exclude na anotação desliga uma configuração inteira quando o classpath sozinho ligaria algo que o serviço não quer."),
      ],
      [
        paragraph("@SpringBootApplication joins three things: @Configuration, so the class is a source of beans; @ComponentScan, to find components in its package and below; @EnableAutoConfiguration, to import the Boot configurations. The scan does not climb above the main class's package. A component outside that does not get created."),
        paragraph("Auto-configuration loses to yours. If you declare a DataSource, the condition that would create the default sees the bean and backs off. Order and @Conditional are the mechanism. An exclude on the annotation turns off a whole configuration when the classpath alone would turn on something the service does not want."),
      ],
    ),
    concept(
      "def-bean-lifecycle",
      "Ciclo do bean",
      "Bean lifecycle",
      [
        paragraph("O container instancia, injeta as dependências pelo construtor, chama os callbacks de inicialização e publica o bean. Na descida, chama a destruição. Escopo padrão é um bean por container. Injeção por construtor deixa a dependência obrigatória e o objeto imutável. Field injection esconde o que a classe precisa e dificulta o teste sem o container."),
        paragraph("O ciclo importa quando há ordem. Um bean que chama outro no construtor pode ver o outro pela metade, se os dois se dependem. @PostConstruct roda depois da injeção. @PreDestroy roda no shutdown, se o processo desligar em ordem. Bean de request não é singleton: nasce e morre com o request, e não pode ser injetado direto num singleton sem um proxy."),
      ],
      [
        paragraph("The container instantiates, injects the dependencies through the constructor, calls the initialization callbacks, and publishes the bean. On the way down, it calls destruction. The default scope is one bean per container. Constructor injection makes the dependency required and the object immutable. Field injection hides what the class needs and makes a test without the container harder."),
        paragraph("The lifecycle matters when there is an order. A bean that calls another in the constructor can see the other one half-built, if the two depend on each other. @PostConstruct runs after injection. @PreDestroy runs on shutdown, if the process stops in order. A request bean is not a singleton: it is born and dies with the request, and it cannot be injected straight into a singleton without a proxy."),
      ],
    ),
    concept(
      "def-request-flow",
      "Caminho do request",
      "Request path",
      [
        paragraph("O byte chega no Tomcat. O filtro, inclusive o do Spring Security, roda antes do servlet. O DispatcherServlet acha o controller pelo mapeamento, aplica os argument resolvers, converte o JSON no DTO, chama o método, e o retorno passa pelo HttpMessageConverter de volta para JSON. No meio, interceptors e o handler de exceção."),
        paragraph("@ControllerAdvice com @ExceptionHandler transforma a exceção de negócio no status e no corpo, em vez de estourar stack no cliente. O filtro vê a requisição cedo demais para conhecer o método do controller. Validação de bean, @Valid, acontece antes do método, e a falha vira MethodArgumentNotValidException, que o advice também traduz."),
      ],
      [
        paragraph("The bytes arrive at Tomcat. The filter, including Spring Security's, runs before the servlet. The DispatcherServlet finds the controller by the mapping, applies the argument resolvers, converts the JSON into the DTO, calls the method, and the return goes through the HttpMessageConverter back to JSON. In the middle, interceptors and the exception handler."),
        paragraph("@ControllerAdvice with @ExceptionHandler turns a business exception into the status and the body, instead of dumping a stack on the client. The filter sees the request too early to know the controller method. Bean validation, @Valid, happens before the method, and the failure becomes MethodArgumentNotValidException, which the advice also translates."),
      ],
    ),
  ]),
];
