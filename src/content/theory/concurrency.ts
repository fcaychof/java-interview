import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const concurrencyTheory: readonly TheoryGroup[] = [
  theoryGroup("concurrency-theory", "Concorrência", "Concurrency", [
    concept(
      "def-synchronized-volatile",
      "synchronized e volatile",
      "synchronized and volatile",
      [
        paragraph("volatile trata de visibilidade. A escrita num campo volatile acontece antes da leitura seguinte desse campo por outra thread. Serve para uma flag, um estado publicado uma vez, uma referência que troca por inteiro. Não junta várias operações numa só."),
        paragraph("synchronized faz as duas coisas: exclusão e visibilidade. Só uma thread entra no bloco, e o que ela escreveu fica visível para a próxima que entrar. balance = balance - amount lê, calcula e grava. volatile não torna essas três etapas atômicas. Duas threads leem o mesmo saldo e as duas gravam. Para o saldo, synchronized, um lock, ou um Atomic, não o volatile sozinho."),
      ],
      [
        paragraph("volatile is about visibility. A write to a volatile field happens before a later read of that field by another thread. It fits a flag, a state published once, a reference replaced as a whole. It does not fuse several operations into one."),
        paragraph("synchronized does both: exclusion and visibility. Only one thread enters the block, and what it wrote is visible to the next one that enters. balance = balance - amount reads, computes, and writes. volatile does not make those three steps atomic. Two threads read the same balance and both write. For a balance, synchronized, a lock, or an Atomic, not volatile alone."),
      ],
    ),
    concept(
      "def-lost-update",
      "Lost update",
      "Lost update",
      [
        paragraph("Lost update é a atualização que some porque duas leituras partiram do mesmo valor. As duas threads leem 100, as duas subtraem 30, as duas gravam 70. Um débito desapareceu. O campo pode até ser volatile: a leitura foi visível, a conta aconteceu fora, e a gravação pisou na outra."),
        paragraph("A correção junta a leitura e a escrita numa região que ninguém atravessa, ou empurra a conta para uma operação atômica. No objeto em memória: synchronized, ReentrantLock, ou AtomicLong.addAndGet. No banco, o mesmo furo tem outro nome e outro conserto: UPDATE condicional, SELECT FOR UPDATE, ou versão. Isolamento de transação não soma duas contas feitas em Java."),
      ],
      [
        paragraph("A lost update is the update that disappears because two reads started from the same value. Both threads read 100, both subtract 30, both write 70. One debit vanished. The field can even be volatile: the read was visible, the arithmetic happened outside, and the write stepped on the other one."),
        paragraph("The fix joins the read and the write in a region nobody crosses, or pushes the arithmetic into an atomic operation. In memory: synchronized, ReentrantLock, or AtomicLong.addAndGet. In the database, the same hole has another name and another fix: a conditional UPDATE, SELECT FOR UPDATE, or a version. Transaction isolation does not add two amounts computed in Java."),
      ],
    ),
    concept(
      "def-lock",
      "ReentrantLock",
      "ReentrantLock",
      [
        paragraph("synchronized é a trava embutida no objeto. Entra e sai com o bloco, reentra na mesma thread, e libera sozinho se o bloco terminar ou lançar. Para a maior parte dos serviços, é o que eu uso."),
        paragraph("ReentrantLock é um objeto de trava. Eu preciso do unlock no finally. Em troca, dá tryLock com tempo, várias condições, e a opção de não bloquear quando o recurso está ocupado. Fairness existe e custa throughput. Eu saio do synchronized quando preciso de uma dessas, não porque lock parece mais moderno."),
      ],
      [
        paragraph("synchronized is the lock built into the object. You enter and leave with the block, the same thread can reenter, and it releases on its own if the block ends or throws. For most services, that is what I use."),
        paragraph("ReentrantLock is a lock object. I need unlock in a finally. In exchange, it gives tryLock with a timeout, several conditions, and the option not to block when the resource is busy. Fairness exists and costs throughput. I leave synchronized when I need one of those, not because lock looks more modern."),
      ],
    ),
    concept(
      "def-deadlock",
      "Deadlock",
      "Deadlock",
      [
        paragraph("Deadlock é um ciclo de espera. A thread A segura a conta 1 e quer a conta 2. A thread B segura a conta 2 e quer a conta 1. Nenhuma solta. CPU fica baixa, as duas travas não andam, e o thread dump mostra cada uma em BLOCKED no lock da outra."),
        paragraph("A prevenção estável é ordem global: travar sempre a conta de menor id primeiro. As duas transferências pedem as contas na mesma sequência e o ciclo não fecha. tryLock com timeout é o plano de fuga quando a ordem não dá para impor. Detectar em produção começa pelo thread dump, não por aumentar o pool."),
      ],
      [
        paragraph("Deadlock is a wait cycle. Thread A holds account 1 and wants account 2. Thread B holds account 2 and wants account 1. Neither releases. CPU stays low, the two locks do not move, and the thread dump shows each one BLOCKED on the other's lock."),
        paragraph("The stable prevention is a global order: always lock the account with the smaller id first. Both transfers request the accounts in the same sequence and the cycle does not close. tryLock with a timeout is the escape when the order cannot be imposed. Finding it in production starts with a thread dump, not with growing the pool."),
      ],
    ),
    concept(
      "def-runnable-callable",
      "Runnable e Callable",
      "Runnable and Callable",
      [
        paragraph("Runnable é uma tarefa sem retorno. run não devolve valor e não declara exceção checada. Callable devolve um resultado e pode lançar Exception. O executor guarda esse resultado num Future."),
        paragraph("Eu escolho pelo que a tarefa precisa entregar. Trabalho que só produz efeito, um log ou um envio, cabe em Runnable. Trabalho cujo resultado eu vou buscar, um cálculo ou uma chamada, cabe em Callable. A exceção checada não fica perdida dentro de run: ela volta quando alguém chama get."),
      ],
      [
        paragraph("Runnable is a task with no result. run returns nothing and does not declare a checked exception. Callable returns a result and may throw Exception. The executor keeps that result in a Future."),
        paragraph("I choose by what the task must hand back. Work that only produces an effect, a log or a send, fits Runnable. Work whose result I will fetch, a calculation or a call, fits Callable. The checked exception does not get lost inside run: it comes back when someone calls get."),
      ],
    ),
    concept(
      "def-executor",
      "ExecutorService",
      "ExecutorService",
      [
        paragraph("Criar thread por request não tem teto. Cada thread custa stack, e o processo aceita trabalho até cair. ExecutorService guarda um pool: um número de threads, uma fila, e uma política para quando a fila enche. A thread volta ao pool em vez de morrer."),
        paragraph("newFixedThreadPool limita o paralelo. newCachedThreadPool cria sem teto útil e é perigoso em request web. Eu nomeio as threads e desligo o pool no shutdown da aplicação. Tarefa bloqueante, HTTP ou JDBC, não vai para um pool pequeno demais sem fila pensada: ou a fila cresce na memória, ou o caller espera."),
      ],
      [
        paragraph("Creating a thread per request has no ceiling. Each thread costs a stack, and the process accepts work until it falls over. ExecutorService holds a pool: a number of threads, a queue, and a policy for when the queue fills. The thread returns to the pool instead of dying."),
        paragraph("newFixedThreadPool caps the parallelism. newCachedThreadPool creates without a useful ceiling and is dangerous on a web request. I name the threads and shut the pool down when the application stops. A blocking task, HTTP or JDBC, does not go onto a pool that is too small without a thought-out queue: either the queue grows in memory, or the caller waits."),
      ],
    ),
    concept(
      "def-completable-future",
      "CompletableFuture",
      "CompletableFuture",
      [
        paragraph("CompletableFuture compõe trabalho assíncrono: então, combinar, tratar erro, sem aninhar callbacks na mão. supplyAsync roda a tarefa, thenApply transforma o valor, exceptionally trata a falha. O tipo carrega o resultado ou a exceção."),
        paragraph("O executor padrão de vários métodos é o ForkJoinPool.commonPool. Ele é compartilhado pela JVM e não foi feito para bloquear em JDBC ou HTTP. Tarefa que espera rede vai num executor meu, passado no supplyAsync. Esquecer o executor mistura o bloqueio do request com o pool comum e atrasa o resto da aplicação."),
      ],
      [
        paragraph("CompletableFuture composes asynchronous work: then, combine, handle the error, without nesting callbacks by hand. supplyAsync runs the task, thenApply transforms the value, exceptionally handles the failure. The type carries the result or the exception."),
        paragraph("The default executor of several methods is ForkJoinPool.commonPool. It is shared by the JVM and was not made to block on JDBC or HTTP. A task that waits on the network goes on an executor of mine, passed to supplyAsync. Forgetting the executor mixes the request's blocking with the common pool and delays the rest of the application."),
      ],
    ),
    concept(
      "def-thread-exception",
      "Exceção dentro da thread",
      "An exception inside a thread",
      [
        paragraph("Exceção não checada que escapa de run mata aquela thread. As outras continuam. O grupo de threads chama o uncaught exception handler, que por default imprime no System.err. Se ninguém guardou a exceção, o request que disparou a thread não fica sabendo."),
        paragraph("Future guarda a exceção e entrega em get, embrulhada em ExecutionException. CompletableFuture guarda também, e exceptionally ou handle leem. Pool não morre com uma tarefa: a thread do pool pode ser reposta, e a falha some se o código ignorou o Future. Eu não disparo trabalho assíncrono sem um lugar que observe o erro."),
      ],
      [
        paragraph("An unchecked exception that escapes run kills that thread. The others continue. The thread group calls the uncaught exception handler, which by default prints to System.err. If nobody stored the exception, the request that fired the thread never finds out."),
        paragraph("Future stores the exception and delivers it in get, wrapped in ExecutionException. CompletableFuture stores it too, and exceptionally or handle read it. A pool does not die with one task: the pool thread can be replaced, and the failure disappears if the code ignored the Future. I do not fire asynchronous work without a place that observes the error."),
      ],
    ),
  ]),
];
