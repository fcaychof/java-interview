import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { productionTheory } from "../theory/production";

export const production: InterviewSection = {
  id: "production",
  order: 13,
  titles: {
    pt: "Produção e diagnóstico",
    en: "Production and diagnosis",
  },
  summaries: {
    pt: "API lenta, CPU baixa, pool esgotado, réplica que não adianta, dado velho e o que muda entre staging e produção.",
    en: "A slow API, low CPU, an exhausted pool, replicas that do not help, stale data, and what changes between staging and production.",
  },
  theory: productionTheory,
  questions: [
    {
      id: "jvm-metrics-first",
      conceptId: "def-jvm-metrics",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "A API ficou lenta. Quais métricas de JVM eu olho primeiro?",
        en: "The API suddenly becomes slow. Which JVM metrics do you check first?",
      },
      covers: [
        "Your Java API suddenly becomes slow in production. What JVM-level metrics would you check first?",
      ],
      pt: locale(
        "Não abra pelo código. Abra por pausa, heap vivo, threads e CPU, nessa ordem de suspeita de JVM. Diga o que cada gráfico decide, e que a JVM pode estar inocente.",
        [
          paragraph("Eu olho primeiro o tempo e a frequência de pausa do GC, e o heap vivo depois da coleta. Pausa alinhada com o p99 explica a lentidão sem CPU de aplicação. Heap que não desce depois do GC aponta retenção, não tráfego."),
          paragraph("Em seguida, número de threads, threads BLOCKED e deadlock. CPU e load dizem se estamos computando ou esperando. Safepoint longo e code cache cheio são os suspeitos seguintes, menos comuns e fáceis de confirmar no log. Buffer direto entra se a aplicação usa muito NIO."),
          paragraph("Se pausa, heap, thread e CPU estão calmos, a JVM não é o vilão. Eu saio dela e vou para fila do servidor, pool de conexão e tempo das dependências. Métrica de JVM sem a latência por rota não diz qual endpoint piorou."),
        ],
        [
          "Pausa de GC e live set depois da coleta",
          "Threads bloqueadas, deadlock, CPU",
          "Se a JVM está calma, o tempo está fora dela",
        ],
        "Não comece aumentando heap. Você ainda não sabe se a pausa é o problema.",
      ),
      en: locale(
        "Do not open the code. Open pause time, the live heap, threads, and CPU, in that order of JVM suspicion. Say what each graph decides, and that the JVM may be innocent.",
        [
          paragraph("I look first at GC pause time and frequency, and at the live heap after collection. A pause lined up with p99 explains the slowness without application CPU. A heap that does not fall after GC points to retention, not to traffic."),
          paragraph("Next, thread count, BLOCKED threads, and deadlock. CPU and load say whether we are computing or waiting. A long safepoint and a full code cache are the next suspects, less common and easy to confirm in the log. Direct buffer joins the list if the application uses a lot of NIO."),
          paragraph("If pause, heap, threads, and CPU are calm, the JVM is not the villain. I leave it and look at the server queue, the connection pool, and dependency time. A JVM metric without latency per route does not say which endpoint got worse."),
        ],
        [
          "GC pause and the live set after collection",
          "Blocked threads, deadlock, CPU",
          "If the JVM is calm, the time is outside it",
        ],
        "Do not start by raising the heap. You do not yet know whether the pause is the problem.",
      ),
    },
    {
      id: "find-bottleneck",
      conceptId: "def-bottleneck",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "A API ficou lenta. Como eu acho o gargalo?",
        en: "The API is slow. How do you find the bottleneck?",
      },
      covers: [
        "Your API suddenly becomes slow. How do you identify the bottleneck?",
        "How would you handle a slow API in a production environment?",
      ],
      pt: locale(
        "Comece pelo sintoma medido: qual rota, desde quando, latência ou erro. Siga o tempo de fora para dentro: fila, aplicação, dependência. Uma mudança por vez. Não reinicie como diagnóstico.",
        [
          paragraph("Eu fixo o quê e o quando. Uma rota ou todas, p95 ou só p99, coincidiu com deploy, com tráfego ou com uma dependência. RED por rota: rate, error, duration. Sem isso, otimizar é chute."),
          paragraph("O trace mostra se o tempo está na fila antes do controller, no seu código, no banco ou numa chamada externa. Tempo na fila com duração interna baixa significa pool saturado. Banco lento aparece no span do JDBC. Se o trace diz que o tempo é CPU dentro do processo, aí sim o profiler, async-profiler ou JFR, aponta o método. Se as threads estão WAITING em socket ou BLOCKED em monitor, o dump explica mais do que o profiler de CPU."),
          paragraph("A correção segue a evidência: índice, timeout, pool, cache, N+1, ou rollback do deploy. Eu mudo uma coisa e comparo a mesma métrica. Aumentar instância antes de saber o gargalo só multiplica a pressão no banco."),
        ],
        [
          "Qual rota, desde quando, latência ou erro",
          "Trace separa fila, código, banco e chamada externa",
          "Uma mudança por vez, na causa medida",
        ],
        "Não proponha cache, réplica e reescrita na mesma resposta. Escolha o próximo dado que falta.",
      ),
      en: locale(
        "Start from the measured symptom: which route, since when, latency or errors. Follow the time from the outside in: queue, application, dependency. One change at a time. Do not restart as a diagnosis.",
        [
          paragraph("I pin down what and when. One route or all of them, p95 or only p99, whether it matches a deploy, traffic, or a dependency. RED per route: rate, errors, duration. Without that, tuning is a guess."),
          paragraph("The trace shows whether the time is in the queue before the controller, in your code, in the database, or in an outbound call. Queue time with a short internal duration means a saturated pool. A slow database shows up on the JDBC span. If the trace says the time is CPU inside the process, then a profiler, async-profiler or JFR, points at the method. If threads are WAITING on a socket or BLOCKED on a monitor, a dump explains more than a CPU profile."),
          paragraph("The fix follows the evidence: an index, a timeout, a pool, a cache, an N+1, or a rollback of the deploy. I change one thing and compare the same metric. Adding instances before you know the bottleneck only multiplies pressure on the database."),
        ],
        [
          "Which route, since when, latency or errors",
          "A trace separates queue, code, database, and outbound calls",
          "One change at a time, on the measured cause",
        ],
        "Do not propose a cache, a replica, and a rewrite in the same answer. Choose the next fact you are missing.",
      ),
    },
    {
      id: "db-fast-api-slow",
      conceptId: "def-bottleneck",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "O SQL está rápido e a API está lenta. Onde mais pode estar o tempo?",
        en: "The queries are fast, but the API is slow. What else could cause the latency?",
      },
      covers: [
        "Database queries are fast, but the API is slow. What else could be causing the latency?",
      ],
      pt: locale(
        "Aceite a premissa e desconfie dela: rápido no console não é rápido no caminho do request. Depois liste o que mora fora do SQL: conseguir a conexão, N chamadas, serializar, fila e rede.",
        [
          paragraph("A query que o DBA rodou pode não ser a do request. O console usa outro plano, outro limite, e não repete a query N vezes. Eu confirmo no trace o tempo de JDBC do endpoint, não o tempo de um SELECT isolado."),
          paragraph("Fora do SQL, o tempo clássico é esperar conexão no pool: a query é rápida quando finalmente roda, e o request passou 800 ms em `getConnection`. Outro é chatty: dezenas de queries rápidas, ou dezenas de HTTP, cuja soma estoura o prazo. Serializar um grafo enorme, log síncrono no caminho, filtro de segurança e mapeamento objeto a objeto também não aparecem no `EXPLAIN`."),
          paragraph("Rede entre app e banco, DNS, TLS na chamada externa e GC entram na mesma lista. A pergunta que separa isso é onde o span começa a engordar."),
        ],
        [
          "A query do console pode não ser a do request",
          "Espera de conexão, excesso de idas, serialização e log",
          "O span mostra o pedaço que o EXPLAIN não vê",
        ],
        "Não conclua que o banco está inocente só porque um SELECT manual voltou em 2 ms.",
      ),
      en: locale(
        "Accept the premise and doubt it: fast in the console is not fast on the request path. Then list what lives outside the SQL: getting a connection, N round trips, serialization, the queue, and the network.",
        [
          paragraph("The query the DBA ran may not be the request's query. The console uses another plan, another limit, and does not repeat the query N times. I confirm the endpoint's JDBC time on the trace, not the time of an isolated SELECT."),
          paragraph("Outside the SQL, the classic time is waiting for a pool connection: the query is fast once it runs, and the request spent 800 ms in getConnection. Another is chatty work: dozens of fast queries, or dozens of HTTP calls, whose sum misses the deadline. Serializing a huge graph, synchronous logging on the path, a security filter, and object mapping do not show up in EXPLAIN."),
          paragraph("The network between app and database, DNS, TLS on the outbound call, and GC are on the same list. The question that separates them is where the span starts to grow."),
        ],
        [
          "The console query may not be the request's query",
          "Connection wait, too many round trips, serialization, and logging",
          "The span shows the part EXPLAIN does not see",
        ],
        "Do not conclude the database is innocent just because a manual SELECT returned in 2 ms.",
      ),
    },
    {
      id: "low-cpu-timeout",
      conceptId: "def-wait",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "A CPU está em 20% e os requests estouram o tempo. O que eu investigo?",
        en: "CPU is only 20%, but requests are timing out. What would you investigate?",
      },
      covers: [
        "CPU is only 20%, but requests are timing out. What would you investigate?",
      ],
      pt: locale(
        "A conclusão imediata: o request está esperando, não computando. O dump diz esperando o quê. Pool, socket, lock e dependência lenta são a lista, e mais CPU não é o remédio.",
        [
          paragraph("CPU baixa com timeout significa thread parada. Eu tiro um thread dump e olho onde o pool do Tomcat está. `WAITING` em socket é dependência ou banco. `BLOCKED` é lock. Muitas threads presas no mesmo `getConnection` é pool de JDBC esgotado. Fila do servidor crescendo, com poucas threads ativas, é o mesmo padrão."),
          paragraph("Deadlock, de monitor ou de linha no banco, cabe aqui e também não gasta CPU. DNS lento e log síncrono igualmente. GC stop-the-world às vezes aparece com CPU dos threads de GC, então eu confirmo no log de pausa em vez de assumir."),
          paragraph("A correção é soltar a espera: timeout, mais conexão só se o banco aguenta, transação mais curta, ou tirar o HTTP de dentro do lock. Subir CPU do pod não acorda thread bloqueada."),
        ],
        [
          "Estão esperando, não calculando",
          "Thread dump: socket, lock ou pool",
          "Mais CPU não destrava quem está bloqueado",
        ],
        "Não peça um profiler de CPU como primeiro passo. Com 20% ele vai mostrar o que não é o problema.",
      ),
      en: locale(
        "The immediate conclusion: the request is waiting, not computing. The dump says waiting on what. Pool, socket, lock, and a slow dependency are the list, and more CPU is not the remedy.",
        [
          paragraph("Low CPU with timeouts means a parked thread. I take a thread dump and see where the Tomcat pool is. WAITING on a socket is a dependency or the database. BLOCKED is a lock. Many threads stuck in the same getConnection is an exhausted JDBC pool. A growing server queue, with few threads actually running, is the same pattern."),
          paragraph("A deadlock, of a monitor or of a database row, fits here and also spends no CPU. Slow DNS and synchronous logging do too. A stop-the-world GC sometimes shows up as CPU on the GC threads, so I confirm it in the pause log instead of assuming."),
          paragraph("The fix is to release the wait: a timeout, more connections only if the database can take them, a shorter transaction, or moving HTTP out of the lock. Raising the pod CPU does not wake a blocked thread."),
        ],
        [
          "They are waiting, not computing",
          "A thread dump: socket, lock, or pool",
          "More CPU does not unblock a waiting thread",
        ],
        "Do not ask for a CPU profile as the first step. At 20% it will show what is not the problem.",
      ),
    },
    {
      id: "pool-exhausted",
      conceptId: "def-pool",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "O pool de conexão esgotou e o banco está saudável. Por quê?",
        en: "The connection pool is exhausted while the database is healthy. Why?",
      },
      covers: [
        "A database connection pool is exhausted while the database itself is healthy. Why?",
      ],
      pt: locale(
        "O banco ocioso não contradiz o pool cheio. A conexão está emprestada e não devolvida, ou a transação é mais longa que a query. Dê as causas nessa ordem: leak, transação longa, pool pequeno demais, e conexão morta pelo firewall.",
        [
          paragraph("Pool esgotado significa que todas as conexões estão emprestadas, não que o Postgres está sem CPU. A query em si pode ser rápida e mesmo assim o `getConnection` espera até estourar. Hikari mostra pending threads e active connections; é a primeira métrica."),
          paragraph("Vazamento: stream, connection ou cursor aberto e não fechado, visível com leak detection do Hikari. Transação longa: open-in-view, ou HTTP e regra demorada dentro do `@Transactional`, seguram a conexão muito depois do SQL. Pool pequeno para a concorrência real também enche, mas pool grande demais só empurra a fila para o banco. Eu dimensiono pelo que o banco aguenta, não pelo número de threads do Tomcat."),
          paragraph("Outro clássico é o firewall ou o proxy matando conexão idle, e o pool entregando conexão já morta, ou não repondo a tempo. `maxLifetime` menor que o idle timeout da rede, mais validation, corta isso. A correção começa por encurtar a transação e fechar o que vaza, não por abrir 200 conexões."),
        ],
        [
          "Conexão emprestada não é banco ocupado",
          "Leak, transação longa e open-in-view",
          "Tamanho do pool cabe no banco; maxLifetime cabe na rede",
        ],
        "Não aumente o pool como primeira ação. Cem conexões presas em transação lenta derrubam o banco que estava saudável.",
      ),
      en: locale(
        "An idle database does not contradict a full pool. The connection is checked out and not returned, or the transaction is longer than the query. Give the causes in this order: a leak, a long transaction, a pool that is too small, and a connection killed by the firewall.",
        [
          paragraph("An exhausted pool means every connection is checked out, not that Postgres is out of CPU. The query itself can be fast and getConnection still waits until it times out. Hikari's pending threads and active connections are the first metric."),
          paragraph("A leak: a stream, connection, or cursor opened and not closed, visible with Hikari's leak detection. A long transaction: open-in-view, or HTTP and slow work inside @Transactional, hold the connection long after the SQL. A pool that is small for the real concurrency also fills, but a pool that is too large only pushes the queue into the database. I size it by what the database can take, not by the Tomcat thread count."),
          paragraph("Another classic is the firewall or a proxy killing an idle connection, and the pool handing out a dead one, or not replacing it in time. maxLifetime below the network idle timeout, plus validation, cuts that. The fix starts by shortening the transaction and closing the leak, not by opening 200 connections."),
        ],
        [
          "A checked-out connection is not a busy database",
          "A leak, a long transaction, and open-in-view",
          "The pool fits the database; maxLifetime fits the network",
        ],
        "Do not raise the pool as the first action. A hundred connections stuck in a slow transaction will take down the database that was healthy.",
      ),
    },
    {
      id: "scaling-out-no-gain",
      conceptId: "def-scale-out",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "Mais instâncias não melhoram o desempenho. Onde está o gargalo?",
        en: "Adding instances does not improve performance. What could be the bottleneck?",
      },
      covers: [
        "Adding more instances doesn't improve application performance. What could be the bottleneck?",
      ],
      pt: locale(
        "Diga que você escalou o pedaço que não estava saturado. O limite compartilhado é banco, uma linha, uma partição, uma cota ou um lock. Mais pod, nesse caso, piora.",
        [
          paragraph("Instância nova só ajuda se o trabalho paralelo cabe e o recurso compartilhado aguenta. Se a CPU do pod está baixa e a latência não muda, o teto está fora do processo: o banco no limite de conexão ou de I/O, uma linha quente que todo mundo atualiza, uma partição Kafka só, a cota de uma API externa, ou um lock distribuído."),
          paragraph("Também pode ser afinidade: sessão em memória ou sticky session manda tudo para um nó, e os outros ficam ociosos. Ou o autoscaler olha CPU, a CPU não sobe, e as instâncias novas nem eram o que faltava. Cada uma ainda abre pool, e o banco que era o gargalo passa a recusar conexão."),
          paragraph("Eu confirmo saturação no recurso compartilhado antes de pedir mais réplica. A saída é particionar a chave quente, encurtar o lock, aumentar o recurso que realmente saturou, ou tirar aquele trabalho do caminho síncrono."),
        ],
        [
          "O teto está no recurso compartilhado, não no pod",
          "Linha quente, partição única, cota, lock ou sticky session",
          "Mais pod pode esgotar a conexão do banco",
        ],
        "Não sugira outro autoscaler de CPU. A métrica que não sobe não é o gargalo.",
      ),
      en: locale(
        "Say you scaled the part that was not saturated. The shared limit is the database, one row, one partition, a quota, or a lock. More pods, in that case, make it worse.",
        [
          paragraph("A new instance helps only if the parallel work fits and the shared resource can take it. If pod CPU is low and latency does not move, the ceiling is outside the process: the database at its connection or I/O limit, a hot row everyone updates, a single Kafka partition, an external API quota, or a distributed lock."),
          paragraph("It can also be affinity: an in-memory session or a sticky session sends everything to one node, and the others sit idle. Or the autoscaler watches CPU, CPU does not rise, and the new instances were not what was missing. Each one still opens a pool, and the database that was the bottleneck starts refusing connections."),
          paragraph("I confirm saturation on the shared resource before asking for another replica. The way out is to partition the hot key, shorten the lock, grow the resource that is actually saturated, or take that work off the synchronous path."),
        ],
        [
          "The ceiling is the shared resource, not the pod",
          "A hot row, a single partition, a quota, a lock, or a sticky session",
          "More pods can exhaust the database connections",
        ],
        "Do not suggest another CPU autoscaler. The metric that does not rise is not the bottleneck.",
      ),
    },
    {
      id: "stale-data",
      conceptId: "def-stale-read",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "O usuário vê dado velho e o banco já foi atualizado. Como eu depuraria?",
        en: "Users see stale data even though the database was updated. How would you debug it?",
      },
      covers: [
        "Users are seeing stale data even though the database has been updated. How would you debug it?",
      ],
      pt: locale(
        "Siga o caminho da leitura, não o da escrita. Cache, réplica, projeção assíncrona e o próprio browser estão na frente do primary. Compare primary, réplica e o JSON que saiu da API.",
        [
          paragraph("Se o primary tem o valor novo, a leitura do usuário não passou por ele, ou passou e alguém guardou a resposta. Eu comparo, com o mesmo id, o primary, a réplica e o corpo da API. Réplica atrasada explica leitura que foi para o replica de propósito, ou por um balanceamento que manda SELECT para a réplica."),
          paragraph("Cache é o suspeito seguinte: TTL longo, chave que esqueceu o tenant, invalidação que não rodou, segundo nível do Hibernate ou cache de query. CDN e `Cache-Control` no browser devolvem a resposta antiga sem chegar na API. Projeção alimentada por evento fica atrás enquanto o consumer está em lag; o banco transacional já commitou e a tela lê a projeção."),
          paragraph("Eu também confiro se não são dois ambientes ou dois tenants, e se o `updated_at` que a API devolve é o da linha nova. A correção depende de quem está velho: ler o primary depois da escrita do próprio usuário, incluir a versão na chave do cache, ou mostrar a projeção como eventual em vez de fingir que é a transação."),
        ],
        [
          "Comparar primary, réplica e o JSON da API",
          "Cache, CDN, segundo nível e projeção com lag",
          "Leitura do próprio usuário, logo após escrever, vai ao primary",
        ],
        "Não assuma que a tela mente. Prove em qual camada o valor novo desaparece.",
      ),
      en: locale(
        "Follow the read path, not the write. Cache, a replica, an async projection, and the browser itself sit in front of the primary. Compare the primary, the replica, and the JSON that left the API.",
        [
          paragraph("If the primary has the new value, the user's read did not go through it, or it did and someone stored the response. I compare, for the same id, the primary, the replica, and the API body. A lagging replica explains a read that was sent to the replica on purpose, or by a balancer that sends SELECT to the replica."),
          paragraph("Cache is the next suspect: a long TTL, a key that forgot the tenant, an invalidation that did not run, Hibernate's second level or the query cache. A CDN and Cache-Control in the browser return the old response without reaching the API. A projection fed by an event stays behind while the consumer lags; the transactional database has committed and the screen reads the projection."),
          paragraph("I also check that it is not two environments or two tenants, and that the updated_at the API returns belongs to the new row. The fix depends on who is stale: read the primary right after the user's own write, put the version in the cache key, or present the projection as eventual instead of pretending it is the transaction."),
        ],
        [
          "Compare the primary, the replica, and the API JSON",
          "Cache, CDN, the second level, and a lagging projection",
          "The user's own read, just after a write, goes to the primary",
        ],
        "Do not assume the screen is lying. Prove the layer where the new value disappears.",
      ),
    },
    {
      id: "prod-failures",
      conceptId: "def-environment",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Funciona local ou em staging e falha em produção. Por onde eu começo?",
        en: "It works locally or in staging and fails in production. Where do you start?",
      },
      covers: [
        "Your Spring Boot application suddenly starts returning 500 errors in production. How would you troubleshoot it?",
        "Your Java application is working locally but failing in production. What would you check first?",
        "Your service works in staging but randomly fails in production. Where do you start?",
      ],
      pt: locale(
        "Separe dois pedidos que parecem iguais: 500 de repente, e funciona num ambiente e falha no outro. Os dois começam pelo mesmo lugar: o erro exato e o que mudou. Aleatório em produção puxa concorrência, dado e limite, não configuração estática.",
        [
          paragraph("No 500 súbito eu abro o log do trace id e a taxa por rota. Quero a exceção, não o status que o gateway devolveu. Se não há log e o pod reiniciou, pode ser OOMKilled e o proxy traduziu em 502 ou 500. Eu correlaciono com deploy, config e a saúde da dependência. Rollback é válido quando o deploy coincide e o erro é grave; não é o diagnóstico."),
          paragraph("Quando só produção falha, eu comparo configuração efetiva: profile, env, secret, URL, tamanho de memória, versão de Java, fuso, locale e charset. Staging com um décimo dos dados não mostra o null, a collation, o volume nem o timeout. Arquivo local que não existe no container, e HTTPS ou header que o ambiente local não exige, entram nessa lista."),
          paragraph("Falha aleatória, que staging não reproduz, costuma ser corrida, pool no limite, réplica atrasada, relógio torto ou um nó só do cluster. Eu olho se o erro gruda numa instância, numa rota e num horário. Amostra de thread e a métrica de pool no momento do erro valem mais do que rodar de novo na máquina do desenvolvedor."),
        ],
        [
          "A exceção e o que mudou: deploy, config ou dependência",
          "Diff de config, versão, memória, dado e volume",
          "Aleatório: corrida, pool, réplica, um nó ruim",
        ],
        "Não comece reinstalando a máquina local. O defeito está na diferença, e ela não aparece no seu notebook.",
      ),
      en: locale(
        "Separate two questions that sound the same: sudden 500s, and it works in one environment and fails in the other. Both start in the same place: the exact error and what changed. Random failure in production pulls in concurrency, data, and a limit, not static configuration.",
        [
          paragraph("For a sudden 500 I open the log for the trace id and the rate per route. I want the exception, not the status the gateway returned. If there is no log and the pod restarted, it may be OOMKilled and the proxy translated that into a 502 or a 500. I correlate with the deploy, the config, and the dependency's health. A rollback is valid when the deploy lines up and the error is severe; it is not the diagnosis."),
          paragraph("When only production fails, I compare the effective configuration: profile, env, secrets, URLs, memory, Java version, time zone, locale, and charset. Staging with a tenth of the data does not show the null, the collation, the volume, or the timeout. A local file that does not exist in the container, and HTTPS or a header the local environment does not require, are on that list."),
          paragraph("A random failure staging cannot reproduce is usually a race, a pool at its limit, a lagging replica, a skewed clock, or one bad node. I check whether the error sticks to an instance, a route, and a time. A thread sample and the pool metric at the moment of the error are worth more than running it again on a laptop."),
        ],
        [
          "The exception and what changed: deploy, config, or a dependency",
          "A diff of config, version, memory, data, and volume",
          "Random: a race, a pool, a replica, one bad node",
        ],
        "Do not start by reinstalling the local machine. The defect is in the difference, and it does not show up on your laptop.",
      ),
    },
  ],
};
