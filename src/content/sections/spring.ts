import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { springTheory } from "../theory/spring";

export const spring: InterviewSection = {
  id: "spring",
  order: 7,
  titles: {
    pt: "Spring Boot e o ciclo do request",
    en: "Spring Boot and the request cycle",
  },
  summaries: {
    pt: "Por que o Boot existe, o que a auto-configuração decide, e o caminho do byte HTTP até o JSON de volta.",
    en: "Why Boot exists, what auto-configuration decides, and the path from HTTP bytes back to JSON.",
  },
  theory: springTheory,
  questions: [
    {
      id: "why-spring-boot",
      conceptId: "def-spring-boot",
      difficulty: "junior",
      speakSeconds: 60,
      titles: {
        pt: "Por que usamos Spring Boot?",
        en: "Why do we use Spring Boot?",
      },
      covers: ["Why do we use Spring Boot?"],
      pt: locale(
        "Não diga só que é mais fácil. Diga o que ele tira do caminho: servidor embutido, starters, auto-configuração e actuator. Feche com o custo: você ainda precisa saber o que foi configurado.",
        [
          paragraph("Spring Boot existe para subir uma aplicação Spring sem montar XML, sem escolher na mão a versão compatível de cada biblioteca e sem deployar um WAR num Tomcat externo. O starter traz um conjunto testado. O servidor vai embutido. A auto-configuração liga os beans que combinam com o que está no classpath. Actuator, health check e métricas entram do jeito que produção espera."),
          paragraph("O ganho é tempo até o primeiro endpoint e um padrão que outro time reconhece. O custo é achar, seis meses depois, um bean que você não declarou. Por isso eu olho o condition evaluation report quando algo sobe sem eu ter pedido, e não trato o Boot como mágica que dispensa entender Spring."),
        ],
        [
          "Starter, servidor embutido, auto-configuração e actuator",
          "Menos wiring manual e versões que combinam",
          "A configuração implícita continua sendo sua responsabilidade",
        ],
        "Não diga que Spring Boot substitui o Spring. Ele é uma opinião em cima do Spring.",
      ),
      en: locale(
        "Do not only say it is easier. Say what it removes: an embedded server, starters, auto-configuration, and Actuator. Close with the cost: you still need to know what was configured.",
        [
          paragraph("Spring Boot exists to start a Spring application without assembling XML, without hand-picking a compatible version of every library, and without deploying a WAR to an external Tomcat. A starter brings a tested set. The server is embedded. Auto-configuration creates the beans that match the classpath. Actuator, health, and metrics arrive in the shape production expects."),
          paragraph("The gain is time to the first endpoint and a layout another team recognizes. The cost is discovering, six months later, a bean you never declared. I read the condition evaluation report when something starts that I did not ask for. Boot is not magic that removes the need to understand Spring."),
        ],
        [
          "Starters, an embedded server, auto-configuration, and Actuator",
          "Less manual wiring and versions that match",
          "Implicit configuration is still your responsibility",
        ],
        "Do not say Spring Boot replaces Spring. It is an opinion on top of Spring.",
      ),
    },
    {
      id: "auto-configuration",
      conceptId: "def-auto-config",
      difficulty: "pleno",
      speakSeconds: 100,
      titles: {
        pt: "Como funcionam @SpringBootApplication, @ComponentScan e a auto-configuração?",
        en: "How do @SpringBootApplication, @ComponentScan, and auto-configuration work?",
      },
      covers: [
        "What is auto-configuration in Spring Boot?",
        "How does Spring Boot auto-configuration work internally?",
        "What is @SpringBootApplication?",
        "What is @ComponentScan?",
      ],
      pt: locale(
        "Abra a anotação composta nos três pedaços. Explique que component scan acha as suas classes e auto-configuração acha as do Boot, por condição. O detalhe que separa pleno de júnior é o pacote da classe principal e a diferença entre spring.factories e AutoConfiguration.imports.",
        [
          paragraph("`@SpringBootApplication` junta `@SpringBootConfiguration`, que é uma `@Configuration`, `@EnableAutoConfiguration` e `@ComponentScan`. O scan parte do pacote da classe que tem essa anotação e desce. Se a main está num pacote estreito, ou no pacote default, o controller de outro ramo não vira bean. A correção é colocar a main na raiz de pacotes da aplicação."),
          paragraph("`@ComponentScan` encontra `@Component`, `@Service`, `@Repository` e `@Controller` e registra as definições. Ele não configura DataSource nem Jackson. Isso é auto-configuração."),
          paragraph("`@EnableAutoConfiguration` importa uma lista. No Boot 2 essa lista vinha do `spring.factories`. No Boot 2.7 e no 3 ela vem de `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. Cada classe de auto-configuração tem condições: `@ConditionalOnClass` só cria o bean se a biblioteca está no classpath, `@ConditionalOnMissingBean` só cria se você ainda não declarou o seu, `@ConditionalOnProperty` obedece o application.yml. A ordem entre auto-configurações é controlada para o bean de que outra depende já existir."),
          paragraph("Quando o default atrapalha, eu declaro o meu bean, e o `OnMissingBean` sai da frente, ou excluo a auto-configuração. Eu não copio a classe interna do Boot para dentro do projeto."),
        ],
        [
          "SpringBootApplication é configuration, auto-config e component scan",
          "O scan começa no pacote da classe main",
          "Condições de classpath, bean já existente e property",
          "Boot 3 usa AutoConfiguration.imports",
        ],
        "Não diga que component scan registra o DataSource. Também não diga que auto-configuração varre o seu código-fonte.",
      ),
      en: locale(
        "Open the composed annotation into its three parts. Component scan finds your classes; auto-configuration finds Boot's, by condition. The detail that marks a mid-level answer is the main class package, and the difference between spring.factories and AutoConfiguration.imports.",
        [
          paragraph("@SpringBootApplication combines @SpringBootConfiguration, which is a @Configuration, @EnableAutoConfiguration, and @ComponentScan. The scan starts at the package of the annotated class and goes downward. If main sits in a narrow package, or in the default package, a controller elsewhere never becomes a bean. Put main at the root of the application packages."),
          paragraph("@ComponentScan finds @Component, @Service, @Repository, and @Controller and registers the definitions. It does not configure a DataSource or Jackson. That is auto-configuration."),
          paragraph("@EnableAutoConfiguration imports a list. In Boot 2 the list came from spring.factories. In Boot 2.7 and 3 it comes from META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Each configuration class has conditions: ConditionalOnClass creates the bean only if the library is present, ConditionalOnMissingBean only if you have not declared your own, ConditionalOnProperty follows application.yml. Ordering makes sure a dependency exists first."),
          paragraph("When the default gets in the way, I declare my bean and OnMissingBean steps aside, or I exclude the auto-configuration. I do not copy Boot's class into the project."),
        ],
        [
          "SpringBootApplication is configuration, auto-config, and component scan",
          "The scan starts at the main class package",
          "Conditions on classpath, an existing bean, and a property",
          "Boot 3 uses AutoConfiguration.imports",
        ],
        "Do not say component scan registers the DataSource, or that auto-configuration scans your source tree.",
      ),
    },
    {
      id: "bean-lifecycle",
      conceptId: "def-bean-lifecycle",
      difficulty: "pleno",
      speakSeconds: 100,
      titles: {
        pt: "Como o Spring faz injeção de dependência e qual é o ciclo do bean?",
        en: "How does Spring do dependency injection, and what is the bean lifecycle?",
      },
      covers: [
        "How does Spring manage Dependency Injection and Bean lifecycle?",
      ],
      pt: locale(
        "Diga que o container cria o objeto e supre as dependências, de preferência pelo construtor. Percorra o ciclo em ordem curta. O ponto que vale nota é o proxy: transação e segurança não rodam em chamada interna.",
        [
          paragraph("O container lê as definições, instancia o objeto e injeta as dependências. Eu prefiro construtor: a dependência é obrigatória, o campo pode ser final, e o teste passa o double sem subir o contexto. Field injection esconde a dependência e dificulta o objeto fora do container. O escopo padrão é singleton: uma instância por contexto. Prototype cria outra a cada pedido. Request e session existem no contexto web."),
          paragraph("A ordem que eu conto é: instancia, injeta dependências, callbacks de Aware como nome do bean e o context, `@PostConstruct`, `InitializingBean` e o init method, e então o bean está pronto. No shutdown: `@PreDestroy`, `DisposableBean` e o destroy method. Se a criação do bean precisa de outro que ainda não existe, o singleton é publicado cedo; ciclo no construtor não tem essa saída e falha na subida, o que eu prefiro."),
          paragraph("`@Transactional`, `@Async` e segurança de método funcionam porque o container entrega um proxy. Chamada interna, `this.metodo()`, não passa pelo proxy, então a transação nova não começa. A correção é mover o método para outro bean, não tornar o método public e rezar."),
        ],
        [
          "Container cria e injeta; construtor é a forma preferida",
          "Singleton por padrão; PostConstruct na ida e PreDestroy na volta",
          "Proxy não intercepta self-invocation",
        ],
        "Não descreva injeção como o Spring procurar anotação em todo request. O grafo é montado na subida.",
      ),
      en: locale(
        "Say the container creates the object and supplies dependencies, preferably through the constructor. Walk the lifecycle in a short order. The point that scores is the proxy: transaction and security do not run on a self-invocation.",
        [
          paragraph("The container reads definitions, instantiates the object, and injects dependencies. I prefer the constructor: the dependency is required, the field can be final, and a test can pass a double without the context. Field injection hides the dependency. The default scope is singleton, one instance per context. Prototype creates another on each request. Request and session exist in the web context."),
          paragraph("The order I tell is: instantiate, inject, Aware callbacks, PostConstruct, InitializingBean and a custom init method, then the bean is ready. On shutdown: PreDestroy, DisposableBean, and the destroy method. A constructor cycle fails at startup, which I prefer to an early-published singleton that hides the cycle."),
          paragraph("@Transactional, @Async, and method security work because the container hands out a proxy. An internal this.method() call skips the proxy, so the new transaction never starts. The fix is another bean, not hoping that public is enough."),
        ],
        [
          "The container creates and injects; constructor injection is the default choice",
          "Singleton by default; PostConstruct on the way in, PreDestroy on the way out",
          "A proxy does not intercept self-invocation",
        ],
        "Do not describe injection as Spring scanning annotations on every request. The graph is built at startup.",
      ),
    },
    {
      id: "request-flow",
      conceptId: "def-request-flow",
      difficulty: "pleno",
      speakSeconds: 120,
      titles: {
        pt: "Qual é o caminho completo de um request até a resposta REST?",
        en: "What is the complete path of a request to a REST response?",
      },
      covers: [
        "Explain the complete request flow from a client to a Spring Boot REST API.",
        "What happens internally when a REST API request reaches a Spring Boot application?",
        "Explain the flow of Spring MVC from request to response.",
      ],
      pt: locale(
        "Conte em camadas, de fora para dentro e de volta. Tomcat, filtros, DispatcherServlet, argument resolvers, controller, mensagem de saída. Não pule o filtro de segurança nem o ponto em que a exceção vira status. Noventa segundos nesse caminho impressionam mais do que citar anotação.",
        [
          paragraph("O cliente abre a conexão com o servidor embutido, em geral Tomcat. Uma thread do pool lê o HTTP. A cadeia de filtros roda antes de qualquer controller: encoding, request id, e o filtro do Spring Security, que autentica ou rejeita com 401 sem chegar no método."),
          paragraph("Quem sobrou entra no `DispatcherServlet`. O `HandlerMapping` acha o método do `@RestController` pelo verbo e pelo path. Os interceptors rodam `preHandle`. Os argument resolvers montam os parâmetros: path e query por conversão, corpo por `HttpMessageConverter`, no caso Jackson, e o Bean Validation dispara se há `@Valid`. Se a validação falha, nem entra no método; o tratamento de exceção produz 400."),
          paragraph("O método chama o service. Se há `@Transactional`, o proxy abre a transação, o repository fala com o banco, e o commit ou o rollback acontece ao sair do proxy. O retorno do controller volta por um converter e vira JSON. Interceptors e filtros rodam na saída. A thread devolve a conexão ao pool."),
          paragraph("Exceção que sai do controller cai num `@ControllerAdvice`, que eu uso para traduzir erro de negócio em status e corpo estável, com um trace id e sem stack para o cliente. Exceção lançada num filtro, antes do servlet, não passa nesse advice a menos que eu tenha ligado o filtro de erro. Eu menciono isso porque já vi 500 genérico cujo catch do controller nunca rodou."),
        ],
        [
          "Tomcat, filtros e segurança antes do controller",
          "DispatcherServlet, mapping, validação e converter",
          "Service com proxy transacional e JSON na volta",
          "ControllerAdvice não pega erro que nasceu no filtro",
        ],
        "Não comece a resposta dentro do método do controller. O entrevistador perguntou o caminho, e metade dele está fora do seu código.",
      ),
      en: locale(
        "Tell it in layers, outside in and back out. Tomcat, filters, DispatcherServlet, argument resolvers, the controller, the outbound message. Do not skip the security filter or the point where an exception becomes a status.",
        [
          paragraph("The client connects to the embedded server, usually Tomcat. A pool thread reads the HTTP. The filter chain runs before any controller: encoding, a request id, and the Spring Security filter, which authenticates or rejects with 401 without reaching the method."),
          paragraph("What remains enters the DispatcherServlet. HandlerMapping finds the RestController method by verb and path. Interceptors run preHandle. Argument resolvers build parameters: path and query by conversion, the body by an HttpMessageConverter, Jackson in the usual case, and Bean Validation fires if there is @Valid. A validation failure never enters the method; exception handling produces a 400."),
          paragraph("The method calls the service. If it is @Transactional, the proxy opens the transaction, the repository talks to the database, and commit or rollback happens as the proxy returns. The controller result goes through a converter and becomes JSON. Interceptors and filters run on the way out. The thread returns the connection to the pool."),
          paragraph("An exception leaving the controller hits a ControllerAdvice, which I use to map a business error to a stable status and body, with a trace id and no stack for the client. An exception thrown in a filter, before the servlet, does not reach that advice unless the error filter is wired. I mention that because I have seen a generic 500 whose controller catch never ran."),
        ],
        [
          "Tomcat, filters, and security before the controller",
          "DispatcherServlet, mapping, validation, and a converter",
          "A transactional proxy and JSON on the way out",
          "ControllerAdvice does not catch an error born in a filter",
        ],
        "Do not start the answer inside the controller method. Half of the path is outside your code.",
      ),
    },
  ],
};
