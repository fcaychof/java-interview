import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { microservicesTheory } from "../theory/microservices";

export const microservices: InterviewSection = {
  id: "microservices",
  order: 12,
  titles: {
    pt: "Microsserviços",
    en: "Microservices",
  },
  summaries: {
    pt: "Descoberta, circuit breaker, uma dependência caída no checkout, serviço quente e o rastro entre seis serviços.",
    en: "Discovery, a circuit breaker, a dead dependency at checkout, a hot service, and the trace across six services.",
  },
  theory: microservicesTheory,
  questions: [
    {
      id: "scalable-architecture",
      conceptId: "def-microservices",
      difficulty: "senior",
      speakSeconds: 100,
      titles: {
        pt: "Como eu desenharia uma arquitetura Java de microsserviços escalável?",
        en: "How would you design a scalable Java microservices architecture?",
      },
      covers: [
        "How would you design a scalable Java microservices architecture?",
      ],
      pt: locale(
        "Não desenhe doze caixas de imediato. Comece pelo limite de consistência e pelo que pode ser eventual. Diga stateless, banco por serviço, fila para o que não precisa de resposta agora, e o que você observa. Escale o gargalo, não todos os retângulos.",
        [
          paragraph("Eu mantenho o serviço sem estado local de sessão, para qualquer instância atender o request. O que é estado fica no banco ou num cache com teto. Cada serviço é dono dos seus dados; outro serviço não lê a tabela dele. A API síncrona fica para a pergunta cuja resposta o usuário espera. O que é consequência, notificação, fraude, extrato, vai para o Kafka, com consumer idempotente."),
          paragraph("Na frente, um gateway autentica, limita taxa e propaga o trace. Service discovery no Kubernetes é o Service e o DNS; eu não adiciono Eureka se a plataforma já resolve o nome. Timeout, retry só em operação idempotente, e circuit breaker na saída. Pool de conexão e pool de threads são dimensionados junto com o banco, porque mais pod sem mais conexão só enfileira."),
          paragraph("Escalar é horizontal no serviço sem estado, partição no Kafka pela chave que precisa de ordem, e leitura em réplica para consulta. O caminho de escrita de dinheiro continua transacional e pequeno. Observabilidade entra no desenho: métrica RED, log com trace id e health que reflete dependência crítica sem derrubar o pod por uma dependência opcional."),
        ],
        [
          "Stateless, um banco por serviço, síncrono só quando o usuário espera",
          "Gateway, timeout, retry idempotente e breaker",
          "Escalar o gargalo: pod, partição ou réplica de leitura",
        ],
        "Não proponha microsserviço para cada tabela logo de saída. O limite errado custa mais do que um módulo dentro de um serviço.",
      ),
      en: locale(
        "Do not draw twelve boxes first. Start from the consistency boundary and from what can be eventual. Say stateless, a database per service, a log for what does not need an answer now, and what you observe. Scale the bottleneck, not every rectangle.",
        [
          paragraph("I keep the service free of local session state, so any instance can take the request. State lives in the database or in a capped cache. Each service owns its data; another service does not read its tables. A synchronous API is for a question the user is waiting on. Consequences, notification, fraud, and statements go to Kafka, with an idempotent consumer."),
          paragraph("At the edge, a gateway authenticates, rate-limits, and propagates the trace. On Kubernetes, discovery is the Service and DNS; I do not add Eureka when the platform already resolves the name. Timeouts, retries only on idempotent operations, and a circuit breaker on the way out. Connection pools and thread pools are sized with the database, because more pods without more connections only queue."),
          paragraph("Scaling is horizontal for the stateless service, a Kafka partition for the key that needs order, and a read replica for queries. The money write path stays transactional and small. Observability is part of the design: RED metrics, logs with a trace id, and a health check that understands a critical dependency without killing the pod over an optional one."),
        ],
        [
          "Stateless, one database per service, synchronous only when the user waits",
          "Gateway, timeout, idempotent retry, and a breaker",
          "Scale the bottleneck: pods, partitions, or a read replica",
        ],
        "Do not propose a microservice per table on day one. A wrong boundary costs more than a module inside one service.",
      ),
    },
    {
      id: "circuit-breaker",
      conceptId: "def-resilience",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que é um circuit breaker?",
        en: "What is a circuit breaker in microservices?",
      },
      covers: ["What is a Circuit Breaker in Microservices?"],
      pt: locale(
        "Use os três estados e o motivo: parar de martelar uma dependência doente e falhar rápido. Diga que retry sem breaker amplifica a queda. Fallback depende de se a dependência é opcional.",
        [
          paragraph("Circuit breaker conta falha e lentidão de uma dependência. Fechado, a chamada passa. Quando a taxa de erro ou de chamada lenta passa do limite, ele abre e as chamadas seguintes falham na hora, sem esperar o timeout. Depois de uma espera, ele fica meio aberto e deixa passar um punhado de provas. Se elas vão bem, fecha. Se falham, abre de novo."),
          paragraph("O objetivo é proteger quem chama e dar tempo de a dependência respirar. Retry em cima de um serviço caído, sem breaker, transforma uma falha em tempestade. No Resilience4j eu configuro a janela, o limiar, a espera em aberto e quantas chamadas de prova passam. Timeout vem antes; breaker sem timeout não vê a chamada que ficou pendurada."),
          paragraph("Fallback vazio serve para recomendação. Para pagamento no checkout, falhar fechado é o certo: o pedido não confirma. Bulkhead separa o pool dessa dependência para ela não ocupar todas as threads do Tomcat."),
        ],
        [
          "Fechado, aberto e meio aberto",
          "Falha rápido e evita tempestade de retry",
          "Fallback só se o negócio aceita degradar; pagamento falha fechado",
        ],
        "Não diga que o breaker faz a chamada dar certo. Ele muda o erro de lento para imediato e protegido.",
      ),
      en: locale(
        "Use the three states and the reason: stop hammering a sick dependency and fail fast. Say that retry without a breaker amplifies the outage. The fallback depends on whether the dependency is optional.",
        [
          paragraph("A circuit breaker counts failures and slowness of a dependency. Closed, the call goes through. When the error rate or the slow-call rate crosses the threshold, it opens and the next calls fail immediately, without waiting for the timeout. After a wait it becomes half-open and lets a few probes through. If they succeed, it closes. If they fail, it opens again."),
          paragraph("The goal is to protect the caller and give the dependency room. Retry against a dead service, without a breaker, turns one failure into a storm. With Resilience4j I set the window, the threshold, the open wait, and how many probes pass. The timeout comes first; a breaker without a timeout never notices the call that hung."),
          paragraph("An empty fallback fits a recommendation. For payment at checkout, failing closed is right: the order is not confirmed. A bulkhead gives that dependency its own pool so it cannot occupy every Tomcat thread."),
        ],
        [
          "Closed, open, and half-open",
          "Fail fast and avoid a retry storm",
          "A fallback only if the business can degrade; payment fails closed",
        ],
        "Do not say the breaker makes the call succeed. It turns a slow error into an immediate, contained one.",
      ),
    },
    {
      id: "service-discovery",
      conceptId: "def-discovery",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "Como funciona o service discovery quando A chama B?",
        en: "How does service discovery work when A calls B?",
      },
      covers: [
        "What is Service Discovery, and why is it needed?",
        "How do you register a microservice with a Service Discovery server?",
        "If Service A calls Service B, how does the complete Service Discovery flow work?",
      ],
      pt: locale(
        "Diga por que o IP fixo não serve. Depois conte o fluxo registrar, heartbeat, resolver, balancear. Feche com a versão de Kubernetes, porque é a que a maioria dos sistemas novos usa, e trate Eureka como a variante Spring Cloud.",
        [
          paragraph("Instância nasce e morre, e o IP muda. O chamador não pode ter o endereço gravado. Ele conhece um nome lógico. Alguém traduz esse nome numa instância saudável."),
          paragraph("No modelo com registry, o serviço B ao subir registra o nome, o host e a porta, e passa a enviar heartbeat. Se o heartbeat para, o registry tira B da lista. O serviço A consulta o registry, guarda uma cache curta para não perguntar a cada request, e um load balancer do lado cliente escolhe uma instância. No Spring Cloud isso é o registro no Eureka mais o Spring Cloud LoadBalancer. A URL que A usa é o nome, não o IP."),
          paragraph("No Kubernetes o control plane já faz esse papel. O Deployment sobe os pods, o Service tem um nome DNS e um IP virtual, e o kube-proxy ou o dataplane manda para um pod ready. Não há cliente Eureka para registrar; o manifesto é o registro. Eu digo qual dos dois o sistema usa, em vez de descrever os dois como se fossem obrigatórios juntos."),
          paragraph("Falha de discovery aparece como nome que não resolve ou instância já morta na cache. Readiness separado de liveness evita mandar tráfego para pod que subiu e ainda não pode atender."),
        ],
        [
          "Nome lógico no lugar de IP fixo",
          "Registro, heartbeat, cache e escolha da instância",
          "No Kubernetes, Service e DNS; Eureka é a variante de registry",
        ],
        "Não descreva Eureka como obrigatório em todo microsserviço. Em cluster Kubernetes ele costuma ser redundante.",
      ),
      en: locale(
        "Say why a fixed IP fails. Then walk register, heartbeat, resolve, balance. Close with the Kubernetes version, because that is what most new systems use, and treat Eureka as the Spring Cloud variant.",
        [
          paragraph("Instances come and go, and the IP changes. The caller cannot have the address hardcoded. It knows a logical name. Something translates that name into a healthy instance."),
          paragraph("With a registry, service B registers its name, host, and port on startup and sends heartbeats. If the heartbeat stops, the registry drops B. Service A queries the registry, keeps a short cache so it does not ask on every request, and a client-side load balancer picks an instance. In Spring Cloud that is Eureka plus Spring Cloud LoadBalancer. The URL A uses is the name, not the IP."),
          paragraph("On Kubernetes the control plane already does this. The Deployment starts the pods, the Service has a DNS name and a virtual IP, and kube-proxy or the dataplane sends traffic to a ready pod. There is no Eureka client to register; the manifest is the registration. I say which one the system uses instead of describing both as if they were required together."),
          paragraph("A discovery failure shows up as a name that does not resolve or a dead instance still in the cache. Readiness separate from liveness stops traffic from hitting a pod that is up and not ready."),
        ],
        [
          "A logical name instead of a fixed IP",
          "Register, heartbeat, cache, and pick an instance",
          "On Kubernetes, Service and DNS; Eureka is the registry variant",
        ],
        "Do not describe Eureka as mandatory for every microservice. On Kubernetes it is usually redundant.",
      ),
    },
    {
      id: "dependency-down",
      conceptId: "def-resilience",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Um serviço cai no meio do checkout. O que acontece com o fluxo?",
        en: "One service goes down during checkout. What should happen to the workflow?",
      },
      covers: [
        "One microservice goes down during checkout. What should happen to the overall workflow?",
        "How would you handle cascading failures in microservices?",
      ],
      pt: locale(
        "Não existe uma reação só. Depende de o passo ser obrigatório e de ele já ter efeito commitado. Separe falhar fechado, degradar e continuar depois. Cascata se evita com timeout curto, breaker e bulkhead.",
        [
          paragraph("Se o serviço que caiu é o pagamento e nada foi commitado ainda, o checkout falha rápido, com erro claro, e não confirma o pedido. Esperar até o timeout do cliente ocupa as threads e leva os vizinhos juntos. Timeout menor que o do caller, breaker aberto e bulkhead limitam o estrago ao caminho que depende daquele serviço."),
          paragraph("Se um passo anterior já commitou, por exemplo o estoque foi reservado e o pagamento não responde, o fluxo não fica numa thread esperando. A reserva tem prazo. Ou o pagamento confirma e a reserva vira captura, ou o prazo estoura e a reserva é liberada. Esse é o saga do checkout, não um rollback mágico entre processos."),
          paragraph("Dependência opcional, como recomendação ou um programa de pontos na mesma tela, degrada: a página segue sem aquele bloco. Eu não deixo o opcional no mesmo pool de threads do pagamento."),
          paragraph("Cascata é o serviço A lento segurando as threads de B, que seguram as de C. A defesa é não esperar demais, não retentar operação que não é idempotente, limitar concorrência para aquele destino e ter um alarm no erro e na saturação do pool, não só na CPU."),
        ],
        [
          "Passo obrigatório sem efeito ainda: falha rápida",
          "Efeito já commitado: reserva com prazo e compensação",
          "Opcional degrada; timeout, breaker e bulkhead seguram a cascata",
        ],
        "Não diga que o circuit breaker desfaz o que o serviço anterior já gravou. Ele não é compensação.",
      ),
      en: locale(
        "There is no single reaction. It depends on whether the step is mandatory and whether it already committed an effect. Separate fail closed, degrade, and continue later. A cascade is contained with a short timeout, a breaker, and a bulkhead.",
        [
          paragraph("If the dead service is payment and nothing has committed yet, checkout fails fast, with a clear error, and does not confirm the order. Waiting until the client's timeout occupies threads and drags the neighbors along. A timeout shorter than the caller's, an open breaker, and a bulkhead limit the damage to the path that depends on that service."),
          paragraph("If an earlier step already committed, for example stock was reserved and payment does not answer, the flow does not sit on a thread. The reservation has a deadline. Either payment confirms and the reservation becomes a capture, or the deadline passes and the reservation is released. That is the checkout saga, not a magic cross-process rollback."),
          paragraph("An optional dependency, such as a recommendation or a loyalty block on the same page, degrades: the page continues without it. I do not put the optional call on the same thread pool as payment."),
          paragraph("A cascade is slow service A holding B's threads, which hold C's. The defense is not waiting too long, not retrying a non-idempotent operation, limiting concurrency toward that destination, and alarming on errors and pool saturation, not only on CPU."),
        ],
        [
          "A mandatory step with no effect yet: fail fast",
          "An effect already committed: a reservation with a deadline and a compensation",
          "Optional work degrades; timeout, breaker, and bulkhead contain the cascade",
        ],
        "Do not say the circuit breaker undoes what the previous service already stored. It is not compensation.",
      ),
    },
    {
      id: "hot-service",
      conceptId: "def-hot-service",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "Um serviço recebe muito mais tráfego que os outros. Como eu lido com isso?",
        en: "One service is receiving much more traffic than the others. How would you handle it?",
      },
      covers: [
        "One service is receiving much more traffic than others. How would you handle it?",
      ],
      pt: locale(
        "Primeiro descubra se o tráfego é legítimo. Retry storm e um tenant só não se resolvem com mais réplica do mesmo jeito. Depois fale de limite, cache e escala do que realmente satura.",
        [
          paragraph("Eu olho se o aumento é de cliente novo, de um endpoint só, de um tenant, ou de retry. Tempestade de retry aparece como erro subindo junto com o RPS, e a correção é breaker e retry com jitter no chamador, não só mais pod no chamado."),
          paragraph("Se o tráfego é legítimo e o serviço é sem estado, escala horizontal com limite de taxa por cliente para um tenant não comer o cluster. Cache na leitura que aguenta estar um pouco atrás. A chave quente de escrita não escala com réplica: ela pede fila particionada ou um desenho que não serialize todo mundo na mesma linha."),
          paragraph("Eu separo o endpoint barulhento do caminho crítico, com pool próprio, para o pico de consulta não esgotar as threads do pagamento. A métrica de escala é saturação, latência e lag, não só CPU."),
        ],
        [
          "Distinguir retry storm, tenant e crescimento legítimo",
          "Escala horizontal e rate limit; cache só na leitura que pode atrasar",
          "Chave quente e pool separado para o caminho crítico",
        ],
        "Não responda só com mais instâncias. Se o tráfego é retry ou uma linha só, as instâncias novas pioram a dependência.",
      ),
      en: locale(
        "First find out whether the traffic is legitimate. A retry storm and a single tenant are not solved by more replicas in the same way. Then talk about a limit, a cache, and scaling what is actually saturated.",
        [
          paragraph("I check whether the increase is new customers, one endpoint, one tenant, or retries. A retry storm shows up as errors rising with RPS, and the fix is a breaker and jittered retry on the caller, not only more pods on the callee."),
          paragraph("If the traffic is legitimate and the service is stateless, scale horizontally, with a per-client rate limit so one tenant cannot eat the cluster. Cache a read that can be slightly stale. A hot write key does not scale with replicas: it needs a partitioned queue or a design that does not serialize everyone on the same row."),
          paragraph("I isolate the noisy endpoint from the critical path, with its own pool, so a query spike cannot exhaust the payment threads. The scaling signal is saturation, latency, and lag, not CPU alone."),
        ],
        [
          "Separate a retry storm, a tenant, and real growth",
          "Horizontal scale and a rate limit; cache only a read that can lag",
          "A hot key, and a separate pool for the critical path",
        ],
        "Do not answer with only more instances. If the traffic is retries or a single row, the new instances make the dependency worse.",
      ),
    },
    {
      id: "distributed-tracing",
      conceptId: "def-tracing",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Como eu rastreio um request que passa por seis serviços?",
        en: "A request travels through six microservices. How would you trace it end to end?",
      },
      covers: [
        "A request travels through 6 microservices. How would you trace it end-to-end?",
      ],
      pt: locale(
        "A resposta é um trace id gerado na borda e propagado, não um id novo em cada serviço. Diga o header W3C, o que vira span, e que Kafka também precisa carregar o contexto. Feche com a ferramenta, sem prender a resposta numa marca só.",
        [
          paragraph("O gateway gera, ou aproveita, um trace id e o coloca no header `traceparent`. Cada serviço lê esse header, abre um span filho para o seu trabalho e para as chamadas que faz, e repassa o header adiante. O id não muda no meio do caminho. Log de cada serviço inclui o mesmo id, então um erro sem APM ainda pode ser seguido no log."),
          paragraph("Span de HTTP de saída, de banco e de fila mostra onde o tempo foi. No Kafka, o producer grava o contexto nos headers da mensagem e o consumer reconstitui o span. Sem isso o trace morre na fronteira assíncrona, que é exatamente onde o checkout costuma quebrar."),
          paragraph("OpenTelemetry é a API que eu instrumentaria, exportando para Jaeger, Tempo, X-Ray ou o APM que a empresa já paga. A amostragem precisa ser suficiente para o erro raro; amostrar só um por cento esconde o request que o cliente reclamou. Eu também não ponho dado de cartão no span."),
        ],
        [
          "Um trace id na borda, propagado no traceparent",
          "Span de HTTP, banco e fila; header também no Kafka",
          "OpenTelemetry para o backend que o time já tem",
        ],
        "Não diga que cada serviço gera o próprio correlation id e loga localmente. Sem propagação não há trace, há seis logs soltos.",
      ),
      en: locale(
        "The answer is one trace id created at the edge and propagated, not a new id in every service. Name the W3C header, what becomes a span, and that Kafka must carry the context too. Close with the tool, without locking the answer to one vendor.",
        [
          paragraph("The gateway creates, or accepts, a trace id and puts it in the traceparent header. Each service reads that header, opens a child span for its work and for the calls it makes, and forwards the header. The id does not change along the way. Every service's log includes the same id, so an error without the APM can still be followed."),
          paragraph("Spans for outbound HTTP, the database, and the queue show where the time went. On Kafka, the producer writes the context into the message headers and the consumer restores the span. Without that, the trace dies at the async boundary, which is exactly where checkout usually breaks."),
          paragraph("OpenTelemetry is the API I would instrument, exporting to Jaeger, Tempo, X-Ray, or the APM the company already pays for. Sampling has to be high enough for the rare error; sampling one percent hides the request the customer reported. I also do not put card data on a span."),
        ],
        [
          "One trace id at the edge, propagated in traceparent",
          "Spans for HTTP, the database, and the queue; headers on Kafka too",
          "OpenTelemetry into the backend the team already has",
        ],
        "Do not say each service generates its own correlation id and logs locally. Without propagation there is no trace, only six loose logs.",
      ),
    },
    {
      id: "slow-external-api",
      conceptId: "def-resilience",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "Uma API externa leva 20 segundos. Como eu protejo o meu serviço?",
        en: "An external API takes 20 seconds to respond. How would you protect your service?",
      },
      covers: [
        "An external API takes 20 seconds to respond. How would you protect your service?",
      ],
      pt: locale(
        "A frase principal: o seu timeout não é o timeout deles. Vinte segundos dentro do pool do Tomcat esgota o serviço. Diga o número que você aceita, o pool separado e o que o usuário recebe.",
        [
          paragraph("Eu não deixo a chamada herdar um timeout infinito nem os 20 segundos do parceiro. Connect timeout e response timeout ficam baixos, na ordem de um a dois segundos, alinhados ao que a minha API promete. A thread que espera volta ao pool, e o cliente recebe erro ou um estado pendente, não uma conexão pendurada."),
          paragraph("Essa chamada mora num pool pequeno e separado, com fila limitada. Quando o pool enche, eu recuso rápido em vez de ocupar as threads do resto da API. Breaker abre se a lentidão vira padrão. Retry de uma chamada de 20 segundos, sem idempotência, só duplica efeito e segura mais threads."),
          paragraph("Se o negócio pode esperar de verdade, a API responde 202, grava a intenção e um worker chama o parceiro fora do request. O usuário consulta o estado ou recebe o resultado por outro canal. Cache entra só quando a resposta aguenta atraso. Hedging, chamar duas vezes e ficar com a primeira, só com operação idempotente e capacidade sobrando."),
        ],
        [
          "Timeout seu, curto, separado do timeout do parceiro",
          "Pool e fila próprios, breaker, e sem retry cego",
          "Se pode ser assíncrono, 202 e um worker",
        ],
        "Não aumente o timeout do Tomcat para 20 segundos. Você oficializa a lentidão e esgota o pool.",
      ),
      en: locale(
        "The main sentence: your timeout is not their timeout. Twenty seconds inside the Tomcat pool exhausts your service. Say the number you accept, the separate pool, and what the user receives.",
        [
          paragraph("I do not let the call inherit an infinite timeout or the partner's 20 seconds. Connect and response timeouts stay short, on the order of one to two seconds, aligned with what my API promises. The waiting thread returns to the pool, and the client gets an error or a pending state, not a hung connection."),
          paragraph("The call lives on a small separate pool with a bounded queue. When the pool is full, I reject quickly instead of occupying the threads of the rest of the API. The breaker opens if slowness becomes the pattern. Retrying a 20-second call, without idempotency, only duplicates the effect and holds more threads."),
          paragraph("If the business can actually wait, the API returns 202, stores the intent, and a worker calls the partner outside the request. The user polls the state or gets the result on another channel. A cache is only for a response that can be stale. Hedging, calling twice and keeping the first, only fits an idempotent operation with capacity to spare."),
        ],
        [
          "Your own short timeout, separate from the partner's",
          "A dedicated pool and queue, a breaker, and no blind retry",
          "If it can be async, 202 and a worker",
        ],
        "Do not raise the Tomcat timeout to 20 seconds. You standardize the slowness and exhaust the pool.",
      ),
    },
    {
      id: "rest-kafka-rabbit",
      conceptId: "def-integration-style",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Quando uso REST, Kafka ou RabbitMQ?",
        en: "When would you use REST, Kafka, or RabbitMQ?",
      },
      covers: [
        "When would you use Kafka instead of RabbitMQ?",
        "How do microservices communicate with each other?",
        "When would you use REST vs Kafka?",
      ],
      pt: locale(
        "Escolha pelo formato da conversa, não pela moda. REST quando alguém espera a resposta. Kafka quando o fato precisa durar e ser relido. Rabbit quando a fila é trabalho para ser feito e esquecido. Diga uma desvantagem de cada.",
        [
          paragraph("REST é pedido e resposta. Consulta de saldo, criar um recurso quando o cliente precisa do status agora, chamada entre serviços no mesmo fluxo síncrono. É simples de depurar e acopla no tempo: se o outro está lento, você espera. Não é bom para fan-out nem para replay."),
          paragraph("Kafka é um log. O evento fica retido, vários grupos leem, e a ordem vale por partição. Eu uso para fato que outros contextos reagem no seu tempo: pagamento confirmado, extrato, fraude, integração. O custo é operar partição, lag e consumer idempotente, porque a entrega é pelo menos uma vez."),
          paragraph("RabbitMQ é broker de tarefa. A mensagem é roteada, alguém dá ack e ela sai. Serve para trabalho de fundo com routing e prioridade, quando eu não preciso reler o que já foi processado. Eu não uso Rabbit como histórico de eventos, e não uso Kafka como fila de um job curto se o time não precisa de retenção nem de replay."),
        ],
        [
          "REST: resposta agora, acoplamento no tempo",
          "Kafka: fato retido, vários leitores, ordem por partição",
          "Rabbit: tarefa com ack, sem vocação para replay",
        ],
        "Não diga que microsserviço tem de falar por Kafka. Consulta síncrona continua REST.",
      ),
      en: locale(
        "Choose by the shape of the conversation, not by fashion. REST when someone is waiting for the answer. Kafka when the fact must last and be reread. Rabbit when the queue is work to be done and forgotten. Name one disadvantage of each.",
        [
          paragraph("REST is request and response. A balance query, creating a resource when the client needs the status now, a call inside a synchronous flow. It is simple to debug and it couples you in time: if the other side is slow, you wait. It is a poor fan-out and a poor replay."),
          paragraph("Kafka is a log. The event is retained, many groups read it, and order holds per partition. I use it for a fact other contexts react to on their own time: payment confirmed, a statement, fraud, an integration. The cost is operating partitions, lag, and an idempotent consumer, because delivery is at least once."),
          paragraph("RabbitMQ is a work broker. The message is routed, someone acks, and it is gone. It fits background work with routing and priority, when I do not need to reread what was already processed. I do not use Rabbit as an event history, and I do not use Kafka as the queue for a short job when the team needs neither retention nor replay."),
        ],
        [
          "REST: an answer now, coupling in time",
          "Kafka: a retained fact, many readers, order per partition",
          "Rabbit: an acked task, not a replay log",
        ],
        "Do not say microservices must talk through Kafka. A synchronous query stays REST.",
      ),
    },
  ],
};
