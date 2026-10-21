import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const microservicesTheory: readonly TheoryGroup[] = [
  theoryGroup("microservices-theory", "Microsserviços", "Microservices", [
    concept(
      "def-microservices",
      "Serviço que escala",
      "A service that scales",
      [
        paragraph("Escalar cópia do processo só funciona se o processo não guarda estado de request. Sessão e cache local não acompanham a segunda instância. O estado fica no banco, na fila ou num cache compartilhado. Cada serviço tem o próprio deploy e o próprio dado. Compartilhar tabela entre dois serviços acopla o deploy de novo."),
        paragraph("O corte segue o motivo de mudança e a fronteira de consistência, não o substantivo do diagrama. Checkout que chama preço, estoque e pagamento por rede paga latência e falha parcial. Se esses três mudam juntos e no mesmo time, o módulo dentro de um processo é mais honesto do que três redes."),
      ],
      [
        paragraph("Scaling a copy of the process only works if the process does not keep request state. A session and a local cache do not follow the second instance. State lives in the database, the queue, or a shared cache. Each service has its own deploy and its own data. Sharing a table between two services couples the deploy again."),
        paragraph("The cut follows the reason to change and the consistency boundary, not the noun on the diagram. A checkout that calls price, stock, and payment over the network pays latency and partial failure. If those three change together and in the same team, a module inside one process is more honest than three networks."),
      ],
    ),
    concept(
      "def-resilience",
      "Falha na chamada",
      "Failure on the call",
      [
        paragraph("Circuit breaker conta falha. Passou do limiar, abre e falha rápido, sem esperar o timeout de quem já está caído. Meio aberto deixa uma chamada de prova. Timeout curto limita quanto uma dependência lenta segura a thread. Bulkhead separa o pool: o cliente da API externa não come todas as threads do serviço."),
        paragraph("Fallback é resposta degradada, não dado inventado. Estoque fora do ar não vira estoque infinito. No checkout, a perna que falhou fica explícita: o pedido não confirma, ou segue o que já foi combinado como opcional. Chamar de novo sem limite, em cima de quem está lento, aumenta a fila dos dois lados."),
      ],
      [
        paragraph("A circuit breaker counts failure. Past the threshold, it opens and fails fast, without waiting out the timeout of someone who is already down. Half-open lets one probe through. A short timeout caps how long a slow dependency holds the thread. A bulkhead separates the pool: the external API client does not eat every thread of the service."),
        paragraph("A fallback is a degraded answer, not invented data. Stock being down does not become infinite stock. In checkout, the leg that failed stays explicit: the order does not confirm, or it continues with what was already agreed as optional. Retrying without a limit, on top of someone who is slow, grows the queue on both sides."),
      ],
    ),
    concept(
      "def-discovery",
      "Service discovery",
      "Service discovery",
      [
        paragraph("Discovery responde onde está uma instância viva de B quando A precisa chamar. B registra o endereço ao subir e tira ao cair. A pergunta ao registro, ou recebe a lista, e escolhe uma instância. O cliente não guarda IP fixo de pod que morre."),
        paragraph("No balanceador da plataforma, Kubernetes Service já é essa descoberta: o nome estável, os pods atrás. Um registry à parte, Eureka da era Spring Cloud, faz o mesmo quando não há essa malha. Saúde atrasada manda tráfego para instância que já saiu. O registro precisa do health, não só do momento do start."),
      ],
      [
        paragraph("Discovery answers where a live instance of B is when A needs to call. B registers the address on startup and removes it on shutdown. A asks the registry, or receives the list, and picks an instance. The client does not keep a fixed IP of a pod that dies."),
        paragraph("On the platform load balancer, a Kubernetes Service is already that discovery: the stable name, the pods behind it. A separate registry, Eureka from the Spring Cloud era, does the same when that mesh is not there. Stale health sends traffic to an instance that has already left. The registry needs health, not only the moment of start."),
      ],
    ),
    concept(
      "def-hot-service",
      "Serviço quente",
      "A hot service",
      [
        paragraph("Um serviço que recebe muito mais tráfego que os vizinhos não se cura só com mais cópia dos outros. Eu escalo o quente, e olho por que ele é quente: fan-out, consulta pesada, ou uma chave que concentra. Cache na leitura que aguenta dado um pouco velho tira pressão. Fila na escrita absorve pico sem derrubar o caller."),
        paragraph("Escalar a cópia sem aumentar o recurso de baixo, o pool do banco ou a partição da fila, só muda a fila de lugar. Limite de concorrência no quente protege o banco. O vizinho frio não precisa da mesma contagem de pods."),
      ],
      [
        paragraph("A service that receives much more traffic than its neighbors is not cured only by more copies of the others. I scale the hot one, and I look at why it is hot: fan-out, a heavy query, or a key that concentrates. A cache on the read that can stand slightly old data takes pressure off. A queue on the write absorbs a spike without dropping the caller."),
        paragraph("Scaling the copy without growing the resource underneath, the database pool or the queue partition, only moves the queue. A concurrency limit on the hot service protects the database. The cold neighbor does not need the same pod count."),
      ],
    ),
    concept(
      "def-tracing",
      "Rastro distribuído",
      "Distributed tracing",
      [
        paragraph("Um request que passa por seis serviços precisa de um id que atravesse a rede. O primeiro serviço cria o trace. Cada saída HTTP ou mensagem propaga o contexto. Cada serviço abre um span com o nome da operação, o tempo e o status. No fim, o rastro mostra onde o tempo foi."),
        paragraph("Sem propagação, cada log tem um id local e a história quebra na fronteira. O header, W3C traceparent ou o B3, tem de ser lido e escrito nos clientes. Log com o trace id ainda ajuda quando a ferramenta de trace não está na frente. O rastro não substitui métrica: um span acha o request lento, a métrica diz se isso é o caso comum."),
      ],
      [
        paragraph("A request that passes through six services needs an id that crosses the network. The first service creates the trace. Each HTTP or message exit propagates the context. Each service opens a span with the operation name, the time, and the status. At the end, the trace shows where the time went."),
        paragraph("Without propagation, each log has a local id and the story breaks at the boundary. The header, W3C traceparent or B3, has to be read and written on the clients. A log with the trace id still helps when the tracing tool is not in front. The trace does not replace a metric: a span finds the slow request, the metric says whether that is the common case."),
      ],
    ),
    concept(
      "def-integration-style",
      "REST, Kafka e RabbitMQ",
      "REST, Kafka, and RabbitMQ",
      [
        paragraph("REST é pedido e resposta. Quem chama precisa da resposta agora, e sabe quem chama. Cabe em consulta e em comando cuja confirmação é síncrona. A falha volta no status."),
        paragraph("Kafka é log. Vários grupos leem o mesmo fato, a ordem vale na partição, e o consumidor atrasado alcança o offset. Cabe em evento que mais de um serviço precisa, e em volume. RabbitMQ é fila de trabalho: a mensagem vai para um consumidor, com roteamento e ack. Cabe em tarefa, não em histórico que outros vão reler. Eu não publico no Kafka o que era um GET, e não chamo REST para um fato que cinco serviços precisam sem o produtor conhecer os cinco."),
      ],
      [
        paragraph("REST is request and response. The caller needs the answer now, and knows who it calls. It fits a query and a command whose confirmation is synchronous. The failure comes back in the status."),
        paragraph("Kafka is a log. Several groups read the same fact, order holds in the partition, and a late consumer catches up to the offset. It fits an event that more than one service needs, and it fits volume. RabbitMQ is a work queue: the message goes to one consumer, with routing and ack. It fits a task, not a history that others will reread. I do not publish to Kafka what was a GET, and I do not call REST for a fact that five services need without the producer knowing the five."),
      ],
    ),
  ]),
];
