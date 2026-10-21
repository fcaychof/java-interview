import {
  code,
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { concurrencyTheory } from "../theory/concurrency";

export const concurrency: InterviewSection = {
  id: "concurrency",
  order: 2,
  titles: {
    pt: "Concorrência",
    en: "Concurrency",
  },
  summaries: {
    pt: "Visibilidade, atomicidade, locks, deadlock, pools e o que uma exceção faz com a thread.",
    en: "Visibility, atomicity, locks, deadlocks, pools, and what an exception does to a thread.",
  },
  theory: concurrencyTheory,
  questions: [
    {
      id: "synchronized-vs-volatile",
      conceptId: "def-synchronized-volatile",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "synchronized ou volatile: quando uso cada um?",
        en: "synchronized vs volatile: when would you use each?",
      },
      covers: ["synchronized vs volatile — when would you use each?"],
      pt: locale(
        "Separe visibilidade de atomicidade na primeira frase. volatile publica uma escrita; synchronized também exclui a outra thread. Dê um exemplo de cada: flag de parada, e invariante de dois campos. Não trate os dois como graus da mesma trava.",
        [
          paragraph("`volatile` garante visibilidade e ordenação de uma variável. Uma escrita happens-before a leitura seguinte em outra thread. Serve para uma flag de parada, para publicar uma referência imutável, ou para o campo da double-checked locking. A leitura e a escrita da variável são atômicas, inclusive `long` e `double`. Uma sequência de passos não é."),
          paragraph("`synchronized` faz duas coisas: exclusão mútua e a mesma visibilidade, porque sair do bloco happens-before entrar no mesmo monitor. Eu uso quando a invariante envolve mais de um campo, ou quando o novo valor depende do antigo. O lock é reentrante e é liberado mesmo se o bloco lançar exceção."),
          paragraph("A escolha prática: se basta uma thread ver o último valor escrito, `volatile`. Se duas threads não podem executar o trecho ao mesmo tempo, `synchronized` ou um lock."),
        ],
        [
          "volatile é visibilidade de uma variável, não exclusão",
          "synchronized é exclusão mútua mais visibilidade",
          "Ação composta pede synchronized ou lock",
        ],
        "Não diga que volatile é um synchronized mais leve para qualquer contador. Contador é leitura-modificação-escrita.",
      ),
      en: locale(
        "Separate visibility from atomicity in the first sentence. volatile publishes a write; synchronized also excludes the other thread. Give a stop flag and a multi-field invariant.",
        [
          paragraph("`volatile` gives visibility and ordering for one variable. A write happens-before a later read in another thread. I use it for a cancellation flag, for publishing an immutable reference, or for the field in double-checked locking. The read or write of that variable is atomic, including long and double. A sequence of steps is not."),
          paragraph("`synchronized` adds mutual exclusion and the same visibility, because leaving the monitor happens-before the next entry. I use it when an invariant covers more than one field, or when the new value depends on the old one. The lock is reentrant and is released if the block throws."),
          paragraph("If one thread only needs to see the latest write, use volatile. If two threads must not run the section together, use synchronized or a lock."),
        ],
        [
          "volatile is visibility, not exclusion",
          "synchronized is exclusion plus visibility",
          "Compound actions need synchronized or a lock",
        ],
        "Do not call volatile a lighter synchronized for any counter. A counter is a read-modify-write.",
      ),
    },
    {
      id: "volatile-balance",
      conceptId: "def-synchronized-volatile",
      difficulty: "pleno",
      speakSeconds: 60,
      titles: {
        pt: "volatile torna um saldo bancário thread-safe?",
        en: "Can volatile make a bank balance thread-safe?",
      },
      covers: ["Can volatile make a bank balance thread-safe?"],
      pt: locale(
        "Responda não na primeira palavra. Explique que o débito é ler, subtrair e gravar, três passos, e volatile só publica cada gravação. Diga onde a atomicidade mora de verdade: na linha do banco, não no campo da JVM, se houver mais de uma instância.",
        [
          paragraph("Não. `volatile` no campo `balance` faz cada thread ver a última escrita. Não junta a leitura, a subtração e a escrita numa ação só. Duas threads leem 100, as duas calculam 100 menos 80 e as duas gravam 20. O saldo fica 20, e 160 saíram da lógica do negócio."),
          paragraph("Dentro de uma JVM, `synchronized`, um `AtomicLong` com `compareAndSet`, ou um `LongAdder` quando o número é só contador, resolvem a corrida local. Saldo de conta quase nunca mora só na memória do processo. Com várias instâncias, a garantia tem de ser o `UPDATE` condicional no banco, com constraint. O campo volatile nem entra nessa história."),
        ],
        [
          "Não: volatile não torna o read-modify-write atômico",
          "As duas threads gravam o saldo calculado a partir do mesmo valor",
          "Dinheiro de verdade é protegido no banco, não num campo da JVM",
        ],
        "Não ofereça volatile mais synchronized no mesmo campo como se os dois fossem necessários. Escolha o mecanismo que dá atomicidade.",
      ),
      en: locale(
        "Answer no in the first word. The debit is read, subtract, write. volatile only publishes each write. If there is more than one instance, the real atomicity belongs in the database.",
        [
          paragraph("No. A volatile `balance` makes each thread see the latest write. It does not make the read, the subtraction, and the write one action. Two threads read 100, both compute 100 minus 80, and both store 20. The balance is 20 even though the business tried to remove 160."),
          paragraph("Inside one JVM, synchronized, an AtomicLong compare-and-set, or a LongAdder for a pure counter, closes the race. Account money almost never lives only in the process. With several instances the guarantee is a conditional UPDATE in the database, plus a constraint. A volatile field is irrelevant there."),
        ],
        [
          "No: volatile does not make the read-modify-write atomic",
          "Both threads write a balance computed from the same read",
          "Real money is protected in the database",
        ],
        "Do not add volatile and synchronized to the same field as if both were required. Pick the tool that gives atomicity.",
      ),
    },
    {
      id: "lost-update",
      conceptId: "def-lost-update",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que acontece quando duas threads executam balance = balance - amount?",
        en: "What happens when two threads execute balance = balance - amount?",
      },
      covers: [
        "What happens when two threads execute balance = balance - amount?",
      ],
      pt: locale(
        "Mostre o entrelaçamento com números, não com definição de race condition. Depois diga que a expressão não é atômica em Java: lê o campo, calcula, grava. Feche com a correção.",
        [
          paragraph("A expressão lê o campo, subtrai na CPU e grava o resultado. Nada nela trava o campo. Com saldo 100 e dois débitos de 80, o entrelaçamento clássico é:"),
          code(
            "A lê 100\nB lê 100\nA grava 20\nB grava 20\nSaldo final: 20, e não -60 nem 20 com um dos débitos rejeitado",
          ),
          paragraph("Uma das atualizações desaparece. Isso é lost update. Se as duas gravações se sobrepõem no nível de palavra sem volatile e sem lock, também pode haver rasgo de leitura, mas o bug que importa no saldo é a atualização perdida."),
          paragraph("A correção local é entrar num mesmo monitor, ou usar `compareAndSet` em loop. A correção de sistema, com várias instâncias, é uma escrita condicional no banco: só debita se o saldo ainda cobre o valor, e confere as linhas afetadas."),
        ],
        [
          "A expressão é três passos, não uma instrução atômica",
          "Os dois débitos leem o mesmo saldo e um efeito se perde",
          "Lock, CAS, ou UPDATE condicional",
        ],
        "Não diga que o resultado sempre será a soma errada de um jeito só. A ordem muda o número; o que é estável é que o resultado pode estar errado.",
      ),
      en: locale(
        "Show the interleaving with numbers. The expression is not atomic: read, compute, write. Then name the fix.",
        [
          paragraph("The expression reads the field, subtracts on the CPU, and writes the result. Nothing locks the field. With a balance of 100 and two debits of 80:"),
          code(
            "A reads 100\nB reads 100\nA writes 20\nB writes 20\nFinal balance: 20, not a rejected debit and not -60",
          ),
          paragraph("One update disappears. That is a lost update. The business-relevant bug is the lost debit, not a theoretical torn read."),
          paragraph("Locally, use one monitor or a compare-and-set loop. Across instances, use a conditional database update and check the affected row count."),
        ],
        [
          "The expression is three steps",
          "Both debits read the same balance and one effect is lost",
          "Lock, CAS, or a conditional UPDATE",
        ],
        "Do not claim one specific wrong number always appears. The interleaving changes the number; the stable fact is that it can be wrong.",
      ),
    },
    {
      id: "synchronized-vs-lock",
      conceptId: "def-lock",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "synchronized ou ReentrantLock?",
        en: "synchronized vs ReentrantLock?",
      },
      covers: ["synchronized vs ReentrantLock?"],
      pt: locale(
        "Diga que os dois dão exclusão reentrante e que você prefere synchronized até precisar de uma capacidade que ele não tem. Liste só as capacidades reais: tryLock, espera interrompível, fairness e várias conditions.",
        [
          paragraph("Os dois garantem exclusão mútua e são reentrantes. `synchronized` é a escolha padrão: o monitor é liberado sozinho ao sair do bloco, inclusive quando há exceção, e a JVM trata bem o caso sem contenção."),
          paragraph("`ReentrantLock` entra quando eu preciso de algo que o bloco synchronized não expressa. `tryLock` com timeout para não ficar preso. `lockInterruptibly` para uma thread cancelável. Modo justo, sabendo que fairness custa vazão. Várias `Condition`, quando um wait/notify não basta. O `unlock` tem de ficar num `finally`. Esquecer isso segura o lock para sempre."),
          paragraph("Eu não troco para Lock por estilo. E não uso `ReadWriteLock` ou `StampedLock` sem uma medida de leitura dominante. Para saldo, muitas vezes o lock certo nem está na JVM."),
        ],
        [
          "synchronized é o default e se libera sozinho",
          "Lock quando há timeout, interrupção, fairness ou várias conditions",
          "unlock sempre no finally",
        ],
        "Não diga que ReentrantLock é mais rápido por padrão. Sem contenção, synchronized costuma ser excelente.",
      ),
      en: locale(
        "Both give reentrant exclusion. Prefer synchronized until you need tryLock, interruptible wait, fairness, or multiple conditions.",
        [
          paragraph("Both provide mutual exclusion and are reentrant. synchronized is the default: the monitor is released when the block exits, including on an exception, and the JVM handles the uncontended case well."),
          paragraph("ReentrantLock is for what the keyword cannot say. tryLock with a timeout. lockInterruptibly for cancellation. A fair mode, knowing fairness costs throughput. Several Conditions when one wait/notify is not enough. unlock belongs in a finally. Forgetting it holds the lock forever."),
          paragraph("I do not switch for style, and I do not reach for a read-write lock without a measured read-heavy workload. For a balance, the right lock is often in the database."),
        ],
        [
          "synchronized is the default and releases itself",
          "Lock for timeout, interruption, fairness, or multiple conditions",
          "unlock always in a finally",
        ],
        "Do not say ReentrantLock is faster by default. Uncontended synchronized is usually excellent.",
      ),
    },
    {
      id: "identify-deadlock",
      conceptId: "def-deadlock",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "Como identifico um deadlock numa aplicação Java?",
        en: "How would you identify a deadlock in a Java application?",
      },
      covers: ["How would you identify a deadlock in a Java application?"],
      pt: locale(
        "Comece pelo sintoma: latência sobe, CPU não acompanha, threads do pool ficam paradas. A prova é o thread dump, não uma teoria. Diga o comando e o que você procura no texto. Separe deadlock de JVM e deadlock de banco.",
        [
          paragraph("O sintoma típico é pedido emperrado com CPU baixa. As threads existem, mas não progridem. Eu tiro um thread dump, não um heap dump. `jcmd <pid> Thread.print` ou `jstack` servem. No container, o dump também pode sair por sinal QUIT, com cuidado para não matar o processo errado."),
          paragraph("No texto eu procuro o bloco que a própria JVM escreve quando detecta deadlock de monitor: quem segura qual lock e quem espera qual lock. Um ciclo clássico é a thread 1 com a conta A esperando a conta B, e a thread 2 com a conta B esperando a conta A. Também olho threads BLOCKED crescendo no mesmo pool."),
          paragraph("Deadlock de banco não aparece como esse ciclo de monitor. Aparece como espera em socket e como erro ou lock wait no Postgres ou no MySQL. JFR e o AP de locks ajudam quando o ciclo é intermitente e o dump único não pegou."),
        ],
        [
          "Sintoma: travou e a CPU não explica",
          "Thread dump com jcmd ou jstack",
          "Ciclo de locks, e deadlock de SQL é outro diagnóstico",
        ],
        "Não comece por heap dump. Deadlock é estado de thread, não grafo de objeto.",
      ),
      en: locale(
        "Start from the symptom: latency up, CPU flat, pool threads stuck. The evidence is a thread dump. Name the command and what you look for. Separate a JVM deadlock from a database deadlock.",
        [
          paragraph("The usual symptom is stuck requests with low CPU. Threads exist and do not progress. I take a thread dump, not a heap dump: `jcmd <pid> Thread.print` or `jstack`. In a container a QUIT signal can print one too, aimed at the right process."),
          paragraph("I look for the JVM's deadlock report: which thread holds which lock and which lock it waits for. The classic cycle is thread 1 holding account A and waiting for B, while thread 2 holds B and waits for A. A growing set of BLOCKED pool threads is the other clue."),
          paragraph("A database deadlock does not show up as that monitor cycle. It shows up as threads blocked on a socket and as a lock-wait error in Postgres or MySQL. JFR helps when a single dump misses an intermittent cycle."),
        ],
        [
          "Symptom: stuck work that CPU does not explain",
          "Thread dump via jcmd or jstack",
          "Lock cycle; a SQL deadlock is a different diagnosis",
        ],
        "Do not start with a heap dump. A deadlock is thread state, not an object graph.",
      ),
    },
    {
      id: "transfer-deadlock",
      conceptId: "def-deadlock",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "Como evito deadlock entre duas transferências de conta?",
        en: "How can you prevent deadlocks between two account transfers?",
      },
      covers: [
        "How can you prevent deadlocks between two account transfers?",
      ],
      pt: locale(
        "A resposta é ordem global dos locks. Diga que as duas transferências pegam as contas em ordem de id, não na ordem da transferência. Se o saldo está no banco, a mesma regra vale para o SELECT FOR UPDATE. Timeout é rede de segurança, não o desenho.",
        [
          paragraph("Deadlock nasce quando uma transferência trava primeiro a conta de origem e outra, no sentido contrário, trava primeiro a outra conta. Cada uma fica com um lock e espera o outro."),
          paragraph("A prevenção é uma ordem global: travar sempre o menor id primeiro, depois o maior, independentemente de quem é origem ou destino. As duas threads pedem os locks na mesma ordem e o ciclo deixa de existir. No banco, dois `SELECT ... FOR UPDATE` na mesma ordem de id fazem a mesma coisa dentro da transação."),
          paragraph("Timeout e retry tratam o caso que a ordem não cobre, por exemplo lock espalhado por serviços diferentes. Eles não substituem a ordem. Se cada conta mora num serviço, eu prefiro não segurar dois locks remotos: reservo o valor, confirmo o outro lado e compenso se falhar."),
        ],
        [
          "O ciclo é origem-primeiro nos dois sentidos",
          "Ordem global por id, na JVM e no SELECT FOR UPDATE",
          "Timeout é contenção, não a regra principal",
        ],
        "Não diga para sincronizar num único lock global de todas as transferências. Isso elimina o deadlock e também a vazão.",
      ),
      en: locale(
        "The answer is a global lock order. Both transfers lock accounts by id, not in transfer order. The same rule applies to SELECT FOR UPDATE. A timeout is a backstop.",
        [
          paragraph("A deadlock appears when one transfer locks the source first and the opposite transfer locks the other account first. Each holds one lock and waits for the other."),
          paragraph("Always lock the lower id first and the higher id second, regardless of which account is the source. Both threads request locks in the same order, so the cycle cannot form. In the database, two SELECT FOR UPDATE statements in id order do the same thing inside the transaction."),
          paragraph("A timeout plus retry covers locks that span services. It does not replace the order. If each account lives in a different service, I avoid holding two remote locks: reserve the amount, confirm the other side, and compensate on failure."),
        ],
        [
          "The cycle is source-first in opposite directions",
          "Global id order, in the JVM and in SELECT FOR UPDATE",
          "Timeout is a backstop, not the design",
        ],
        "Do not put every transfer on one global lock. That removes the deadlock and the throughput.",
      ),
    },
    {
      id: "runnable-vs-callable",
      conceptId: "def-runnable-callable",
      difficulty: "junior",
      speakSeconds: 60,
      titles: {
        pt: "Runnable ou Callable: quando escolho cada um?",
        en: "Runnable vs Callable: when would you choose each?",
      },
      covers: ["Runnable vs Callable — when would you choose each?"],
      pt: locale(
        "A diferença que importa é resultado e exceção, não qual é mais moderno. Runnable quando o fim é o efeito. Callable quando quem chamou precisa do valor ou da falha.",
        [
          paragraph("`Runnable` é `run()`: não devolve valor e não declara exceção checada. Se o trabalho falha, a falha tem de ser tratada dentro da task ou vai para o handler da thread. Eu uso para um efeito que ninguém espera de volta, como consumir uma fila que já tem o próprio tratamento de erro."),
          paragraph("`Callable` é `call()`: devolve um valor e pode lançar exceção checada. `ExecutorService.submit` devolve um `Future`. Quem chamou usa `get` e recebe o resultado, ou uma `ExecutionException` com a causa original. Eu escolho Callable quando a thread produz uma resposta, por exemplo o total calculado em paralelo ou a chamada externa cujo erro o request precisa ver."),
        ],
        [
          "Runnable não devolve valor nem exceção checada",
          "Callable devolve valor e propaga a falha pelo Future",
          "A escolha depende de o chamador precisar do resultado",
        ],
        "Não diga que Callable cria thread e Runnable não. Os dois são tasks; quem cria thread é o executor ou o new Thread.",
      ),
      en: locale(
        "The difference that matters is the result and the exception, not which one is newer. Runnable for a side effect. Callable when the caller needs the value or the failure.",
        [
          paragraph("Runnable's `run` returns nothing and declares no checked exception. Failure is handled inside the task or goes to the thread's uncaught handler. I use it for work nobody waits on."),
          paragraph("Callable's `call` returns a value and may throw a checked exception. `submit` returns a Future. `get` yields the result or an ExecutionException wrapping the cause. I choose Callable when the caller needs the answer, such as a parallel total or an external call whose error must fail the request."),
        ],
        [
          "Runnable returns no value and no checked exception",
          "Callable returns a value and surfaces failure through the Future",
          "Choose based on whether the caller needs the result",
        ],
        "Do not say Callable creates a thread and Runnable does not. Both are tasks.",
      ),
    },
    {
      id: "executor-service",
      conceptId: "def-executor",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Por que ExecutorService em vez de criar threads na mão?",
        en: "Why use ExecutorService instead of creating threads manually?",
      },
      covers: [
        "Why would you use ExecutorService instead of creating threads manually?",
      ],
      pt: locale(
        "Fale de limite e de ciclo de vida, não de moda. Pool reutiliza thread, fila dá contrapressão, shutdown existe. Aponte o perigo do cached pool sem limite num servidor.",
        [
          paragraph("Criar `new Thread` por request não tem teto. Cada thread custa stack, e sob pico o processo passa a falhar com unable to create native thread, ou o sistema operacional degrada. Também não há um lugar único para parar as threads no shutdown."),
          paragraph("`ExecutorService` reutiliza um número decidido de threads, coloca o excesso numa fila e devolve `Future` quando o resultado importa. No desligamento eu chamo `shutdown`, espero um prazo e depois `shutdownNow`. O tamanho do pool segue o trabalho: perto do número de CPUs para cálculo, e um número medido para espera de I/O, porque thread parada em socket não usa CPU mas ocupa o pool."),
          paragraph("Eu não uso `newCachedThreadPool` num endpoint. A fila é direta e o número de threads cresce sem teto, que é o mesmo problema do `new Thread`. Pool nomeado, fila limitada e política de rejeição explícita fazem o excesso virar erro controlado, não um processo sem fôlego."),
        ],
        [
          "Thread manual não tem teto nem shutdown coordenado",
          "Pool, fila e Future",
          "Cached pool sem limite é perigoso em servidor",
        ],
        "Não diga que ExecutorService deixa o código automaticamente thread-safe. Ele só organiza as threads.",
      ),
      en: locale(
        "Talk about a bound and a lifecycle, not fashion. A pool reuses threads, a queue applies backpressure, and shutdown exists. Flag the unbounded cached pool on a server.",
        [
          paragraph("A new Thread per request has no ceiling. Each thread costs a stack, and a spike ends in unable to create native thread or in OS degradation. There is also no single place to stop them on shutdown."),
          paragraph("ExecutorService reuses a chosen number of threads, queues the overflow, and returns a Future when the result matters. On shutdown I call shutdown, wait, then shutdownNow. Pool size follows the work: near the CPU count for computation, and a measured size for blocking I/O."),
          paragraph("I do not use newCachedThreadPool on an endpoint. It grows without a bound. A named pool, a bounded queue, and an explicit rejection policy turn overload into a controlled error."),
        ],
        [
          "Manual threads have no ceiling and no coordinated shutdown",
          "Pool, queue, and Future",
          "An unbounded cached pool is unsafe on a server",
        ],
        "Do not say ExecutorService makes the code thread-safe. It only organizes threads.",
      ),
    },
    {
      id: "completable-future",
      conceptId: "def-completable-future",
      difficulty: "senior",
      speakSeconds: 110,
      titles: {
        pt: "Que problema o CompletableFuture resolve, e que pool ele usa?",
        en: "What problem does CompletableFuture solve, and which pool does it use?",
      },
      covers: [
        "What problem does CompletableFuture solve?",
        "Difference between ExecutorService and CompletableFuture.",
        "Does CompletableFuture create its own thread pool? Which pool does it use by default?",
      ],
      pt: locale(
        "Diga o problema: compor passos assíncronos sem aninhar callback e sem bloquear a thread do request. Depois responda a pegadinha do pool: ele não cria um pool seu; o default é o commonPool, e I/O bloqueante não deve ir para lá.",
        [
          paragraph("`ExecutorService` executa tasks e devolve `Future`, cujo `get` bloqueia e cuja composição é manual. `CompletableFuture` resolve o encadeamento: chamar dois serviços em paralelo, seguir só quando os dois voltarem, aplicar timeout, transformar o valor e tratar a falha no próprio pipeline, sem callback hell."),
          paragraph("Ele não cria um pool próprio. `supplyAsync` e os métodos `*Async` sem executor usam `ForkJoinPool.commonPool()`. Esse pool é compartilhado pela JVM, pensado para cálculo curto, e no Java 8 o paralelismo fica em processadores menos um. Se eu bloqueio ali em HTTP ou JDBC, seguro o pool de todo mundo, inclusive do `parallelStream`."),
          paragraph("Em serviço eu passo um executor meu, nomeado e limitado. `thenApply` roda na thread que completou o estágio anterior; `thenApplyAsync` volta para o executor. Timeout com `orTimeout` ou `completeOnTimeout`. E eu não ignoro o future: falha não observada só aparece como exceção não tratada bem mais tarde."),
        ],
        [
          "O problema é composição assíncrona, não criação de thread",
          "O default é ForkJoinPool.commonPool(), não um pool próprio",
          "I/O bloqueante recebe um executor da aplicação",
        ],
        "Não diga que CompletableFuture substitui o ExecutorService. Um compõe; o outro é o pool. Os dois se usam juntos.",
      ),
      en: locale(
        "State the problem: compose async steps without nested callbacks and without blocking the request thread. Then answer the pool trap: it does not create a pool; the default is the common pool, and blocking I/O does not belong there.",
        [
          paragraph("ExecutorService runs tasks and returns a Future whose get blocks and whose composition is manual. CompletableFuture is the composition: call two services in parallel, continue when both finish, apply a timeout, map the value, and handle the failure in the pipeline."),
          paragraph("It does not create its own pool. supplyAsync and the Async methods without an executor use ForkJoinPool.commonPool(). That pool is JVM-wide and meant for short CPU work. In Java 8 its parallelism is processors minus one. Blocking it on HTTP or JDBC stalls everyone, including parallelStream."),
          paragraph("In a service I pass my own named, bounded executor. thenApply runs on the thread that completed the previous stage; thenApplyAsync hops back to the executor. I set a timeout, and I do not drop the future: an unobserved failure shows up late as an uncaught exception."),
        ],
        [
          "The problem is async composition, not thread creation",
          "The default is ForkJoinPool.commonPool()",
          "Blocking I/O gets an application executor",
        ],
        "Do not say CompletableFuture replaces ExecutorService. One composes; the other is the pool.",
      ),
    },
    {
      id: "exception-in-thread",
      conceptId: "def-thread-exception",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que acontece se uma exceção estoura dentro de uma thread?",
        en: "What happens if an exception is thrown inside a thread?",
      },
      covers: ["What happens if an exception is thrown inside a thread?"],
      pt: locale(
        "A primeira correção é: a JVM não cai por causa disso. A thread morre, as outras seguem. Depois diferencie thread crua, executor e CompletableFuture, porque em dois desses a exceção some se ninguém busca.",
        [
          paragraph("Numa thread criada na mão, uma exceção não capturada mata só aquela thread. O grupo chama o `UncaughtExceptionHandler`, cujo padrão imprime a stack em `System.err`. A thread principal e as outras continuam. O request que dependia daquela thread fica sem resposta se ninguém estava esperando."),
          paragraph("No `ExecutorService`, a exceção não sobe no submit. Ela fica guardada no `Future`, e `get` embrulha a causa em `ExecutionException`. Se o código ignora o future, a falha desaparece. Num `ScheduledExecutorService`, uma exceção pode ainda suprimir as próximas execuções daquela task, então o catch fica dentro da task e o erro vai para log e métrica."),
          paragraph("No `CompletableFuture`, a falha completa o future de forma excepcional. Só aparece para quem fez `join`, `get` ou um `exceptionally` / `handle`. Por isso todo pipeline meu termina num tratamento explícito, com log e métrica, e a resposta HTTP deixa de ficar pendurada."),
        ],
        [
          "A thread morre; o processo não",
          "No executor a falha fica no Future e some se ninguém chama get",
          "CompletableFuture exige exceptionally ou handle",
        ],
        "Não diga que a exceção derruba a aplicação inteira. Também não diga que o executor relança sozinho no lugar do submit.",
      ),
      en: locale(
        "Correct the premise first: the JVM does not exit. That thread dies and the others continue. Then separate a raw thread, an executor, and CompletableFuture, because in two of those the exception vanishes if nobody collects it.",
        [
          paragraph("On a raw thread, an uncaught exception kills only that thread. The group invokes the UncaughtExceptionHandler, which by default prints the stack to System.err. The main thread and the others keep running."),
          paragraph("On an ExecutorService the exception does not escape submit. It is stored in the Future, and get wraps the cause in ExecutionException. If the code ignores the Future, the failure disappears. On a scheduled executor an exception can also suppress the next runs of that task, so I catch inside the task and record a metric."),
          paragraph("On a CompletableFuture the failure completes the future exceptionally. It surfaces only through join, get, exceptionally, or handle. Every pipeline I ship ends in explicit handling so the HTTP call does not hang and the error is logged."),
        ],
        [
          "The thread dies; the process does not",
          "An executor stores the failure in the Future",
          "CompletableFuture needs exceptionally or handle",
        ],
        "Do not say the exception crashes the whole application, or that submit rethrows it on its own.",
      ),
    },
  ],
};
