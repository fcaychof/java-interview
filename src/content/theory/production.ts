import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const productionTheory: readonly TheoryGroup[] = [
  theoryGroup("production-theory", "Diagnóstico", "Diagnosis", [
    concept(
      "def-jvm-metrics",
      "Métrica de JVM",
      "JVM metrics",
      [
        paragraph("API lenta começa pelo que a JVM já conta. Uso de heap e o que sobra depois do GC dizem se a memória está no limite. Tempo e frequência de pausa dizem se o request parou por causa do coletor. Threads, em execução e bloqueadas, dizem se o pool acabou ou se todo mundo espera trava. CPU do processo separa trabalho de espera."),
        paragraph("Eu olho essas quatro antes de abrir um profiler. Métrica sem taxa mente: um heap em 80% estável não é vazamento, um heap que não desce depois do GC é. O golden signals do serviço, latência, tráfego, erro e saturação, dizem se o problema é da JVM ou se a JVM está saudável e o tempo está em outro lugar."),
      ],
      [
        paragraph("A slow API starts with what the JVM already counts. Heap use and what remains after GC say whether memory is at the limit. Pause time and frequency say whether the request stopped because of the collector. Threads, running and blocked, say whether the pool ran out or everyone is waiting on a lock. Process CPU separates work from waiting."),
        paragraph("I look at those four before opening a profiler. A metric without a rate lies: a heap at a stable 80% is not a leak, a heap that does not come down after GC is. The service golden signals, latency, traffic, errors, and saturation, say whether the problem is the JVM or the JVM is healthy and the time is somewhere else."),
      ],
    ),
    concept(
      "def-bottleneck",
      "Onde está o tempo",
      "Where the time is",
      [
        paragraph("Gargalo é o recurso que limita o throughput ou a latência. Eu corto o caminho: fila na entrada, thread do servidor, código, pool de conexão, SQL, chamada externa, GC. Medir o trecho, não o palpite. SQL rápido com API lenta empurra o tempo para fora do banco: serialização, N+1 que o explain não viu porque cada query é barata, transformação, ou a ida a outro serviço."),
        paragraph("Trace ou um log com tempo por etapa acha o trecho. Profiler acha o método quente quando a CPU está alta. CPU baixa com latência alta não é método quente: é espera. Otimizar o SQL que já voltou em um milissegundo não mexe no percentil."),
      ],
      [
        paragraph("A bottleneck is the resource that limits throughput or latency. I cut the path: the entrance queue, the server thread, the code, the connection pool, SQL, an external call, GC. Measure the stretch, not the guess. Fast SQL with a slow API pushes the time outside the database: serialization, an N+1 the explain did not see because each query is cheap, transformation, or the trip to another service."),
        paragraph("A trace or a log with time per stage finds the stretch. A profiler finds the hot method when CPU is high. Low CPU with high latency is not a hot method: it is waiting. Optimizing the SQL that already came back in one millisecond does not move the percentile."),
      ],
    ),
    concept(
      "def-wait",
      "CPU baixa e timeout",
      "Low CPU and timeouts",
      [
        paragraph("CPU em 20% com request estourando o tempo significa thread parada, não thread calculando. Os lugares clássicos: pool de conexão esgotado, chamada externa sem timeout, lock, fila do executor, GC em pausa longa. A thread está em WAITING ou BLOCKED, e o dump mostra em quê."),
        paragraph("Timeout que falta transforma a lentidão do vizinho em ocupação da nossa thread. O pool de request acaba, a CPU continua ociosa, e o cliente vê 504. O primeiro artefato é o thread dump, junto com o tempo de cada dependência. Subir CPU ou réplica não acorda quem está esperando o mesmo lock."),
      ],
      [
        paragraph("CPU at 20% with requests blowing the deadline means a stopped thread, not a thread computing. The classic places: an exhausted connection pool, an external call with no timeout, a lock, an executor queue, a long GC pause. The thread is WAITING or BLOCKED, and the dump shows on what."),
        paragraph("A missing timeout turns the neighbor's slowness into occupation of our thread. The request pool runs out, CPU stays idle, and the client sees 504. The first artifact is the thread dump, together with the time of each dependency. Adding CPU or a replica does not wake whoever is waiting on the same lock."),
      ],
    ),
    concept(
      "def-pool",
      "Pool esgotado",
      "An exhausted pool",
      [
        paragraph("Pool esgotado com banco ocioso quer dizer que a conexão saiu e não voltou, ou que a transação dura mais do que a query. A sessão está ocupada no lado da aplicação. O banco espera o commit. As outras threads esperam vaga no pool."),
        paragraph("As causas, nessa ordem: vazamento, conexão que não fecha porque a exceção pulou o close; transação longa, que abre cedo e chama rede no meio; pool pequeno para o paralelo real; conexão morta pelo firewall, que o pool ainda acha viva. Hikari conta pending e active. Active no máximo, com SQL rápido, é transação ou vazamento, não query lenta."),
      ],
      [
        paragraph("An exhausted pool with an idle database means the connection was checked out and not returned, or the transaction lasts longer than the query. The session is busy on the application side. The database waits for the commit. The other threads wait for a free slot."),
        paragraph("The causes, in this order: a leak, a connection that does not close because an exception skipped the close; a long transaction, which opens early and calls the network in the middle; a pool that is small for the real parallelism; a connection killed by the firewall, which the pool still thinks is alive. Hikari counts pending and active. Active at the maximum, with fast SQL, is a transaction or a leak, not a slow query."),
      ],
    ),
    concept(
      "def-scale-out",
      "Réplica que não ajuda",
      "A replica that does not help",
      [
        paragraph("Mais instâncias aumentam o paralelo até o recurso compartilhado encher. Se o banco, a fila de uma partição, ou um lock global já está no limite, a réplica nova só manda mais espera para o mesmo lugar. O throughput não sobe. A latência sobe."),
        paragraph("Eu acho o recurso que saturou: conexão, CPU do banco, uma partição quente, um limite de API externa. Escalar ajuda quando a aplicação era CPU ou thread, e o de baixo ainda tinha folga. Cache e menos ida ao banco mexem no gargalo. Réplica cega não."),
      ],
      [
        paragraph("More instances increase parallelism until the shared resource fills. If the database, a single partition's queue, or a global lock is already at the limit, the new replica only sends more waiting to the same place. Throughput does not rise. Latency does."),
        paragraph("I find the resource that saturated: connections, database CPU, a hot partition, an external API limit. Scaling helps when the application was CPU or threads, and what sits underneath still had room. A cache and fewer trips to the database move the bottleneck. A blind replica does not."),
      ],
    ),
    concept(
      "def-stale-read",
      "Leitura velha",
      "A stale read",
      [
        paragraph("O banco já tem o valor novo e a tela mostra o antigo. O caminho entre os dois guardou a resposta: cache da aplicação, cache de CDN, réplica de leitura atrasada, ou o próprio browser. Cada um tem uma idade. Eu meço o atraso da réplica e o TTL do cache antes de culpar o commit."),
        paragraph("Cache de leitura precisa de invalidação ou de um TTL que o produto aceite. Réplica assíncrona não serve para ler o que você acabou de gravar, a menos que essa leitura volte na primária. Esquecer o header de cache no GET de saldo entrega dado velho com status 200. O bug parece de banco e é de borda."),
      ],
      [
        paragraph("The database already has the new value and the screen shows the old one. Something on the path kept the answer: the application cache, a CDN cache, a lagging read replica, or the browser itself. Each one has an age. I measure replica lag and the cache TTL before blaming the commit."),
        paragraph("A read cache needs invalidation or a TTL the product accepts. An asynchronous replica is not for reading what you just wrote, unless that read goes back to the primary. Forgetting the cache header on a balance GET serves stale data with status 200. The bug looks like the database and is at the edge."),
      ],
    ),
    concept(
      "def-environment",
      "Só quebra em produção",
      "It only breaks in production",
      [
        paragraph("O que muda entre staging e produção não é o if. É dado, volume, configuração, relógio, fuso, limite de recurso, versão de dependência, e o vizinho que staging não chama. Segredo diferente, pool menor, timeout default, feature flag, e um volume que faz o N+1 aparecer."),
        paragraph("Eu comparo configuração efetiva, não o que alguém acha que subiu. Log da versão, das propriedades e do primeiro erro, com o id. Reproduzir começa por aproximar o dado e o limite, não por reler o código que em staging passou. Diferença de fuso e de locale quebra data que no notebook era óbvia."),
      ],
      [
        paragraph("What changes between staging and production is not the if. It is data, volume, configuration, clock, timezone, resource limits, a dependency version, and the neighbor staging does not call. A different secret, a smaller pool, a default timeout, a feature flag, and a volume that makes the N+1 show up."),
        paragraph("I compare the effective configuration, not what someone thinks was deployed. A log of the version, the properties, and the first error, with the id. Reproducing starts by getting closer to the data and the limit, not by rereading the code that passed in staging. A timezone and locale difference breaks a date that was obvious on the laptop."),
      ],
    ),
  ]),
];
