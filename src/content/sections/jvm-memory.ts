import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { jvmMemoryTheory } from "../theory/jvm-memory";

export const jvmMemory: InterviewSection = {
  id: "jvm-memory",
  order: 3,
  titles: {
    pt: "JVM, memória e GC",
    en: "JVM, memory, and GC",
  },
  summaries: {
    pt: "Onde cada coisa mora, por que o GC não impede vazamento, e como investigar pausa, OOM e cache.",
    en: "Where each thing lives, why GC does not prevent leaks, and how to investigate pauses, OOMs, and caches.",
  },
  theory: jvmMemoryTheory,
  questions: [
    {
      id: "memory-areas",
      conceptId: "def-memory-areas",
      difficulty: "pleno",
      speakSeconds: 110,
      titles: {
        pt: "Heap, stack, Metaspace e o PC register: o que fica onde?",
        en: "Heap, stack, Metaspace, and the PC register: what is stored where?",
      },
      covers: [
        "Heap vs Stack — what is stored where?",
        "Explain how JVM memory is managed — Heap, Stack, Metaspace and Garbage Collection.",
        "Explain Java Memory Management and different JVM memory areas.",
        "What is the PC Register?",
      ],
      pt: locale(
        "Organize por dono. Heap é compartilhado e guarda objeto. Stack é por thread e guarda frame. Metaspace guarda a classe, não o objeto. O PC register é uma frase só: o endereço da instrução atual daquela thread. Feche com o que o GC recolhe e com o que não é heap.",
        [
          paragraph("O heap é compartilhado por todas as threads. Objetos e arrays nascem lá, em geral no eden, dentro de um TLAB. O que sobrevive às coletas jovens é promovido para a old generation. O GC automatica recolher o que ficou inalcançável. `-Xms` e `-Xmx` limitam esse espaço."),
          paragraph("Cada thread tem uma stack. Cada chamada cria um frame com variáveis locais, operandos e o endereço de retorno. Primitivo local fica no frame. O objeto não fica: o frame guarda a referência, e o objeto está no heap. Stack cheia estoura `StackOverflowError`, quase sempre recursão sem fim. `-Xss` define o tamanho, e thread demais multiplica esse custo."),
          paragraph("Metaspace, que no Java 8 substituiu a PermGen, guarda metadados de classe: a estrutura, não as instâncias. Fica em memória nativa e cresce com class loaders que não são liberados. `-XX:MaxMetaspaceSize` evita que isso coma a RAM do container sem aviso. O code cache é outra área nativa, onde mora o código que o JIT compilou."),
          paragraph("O PC register é um registrador conceitual por thread. Ele guarda o endereço da instrução da JVM que essa thread está executando. Se o método atual é nativo, a especificação deixa o valor indefinido. Não se tunar isso; existe para a JVM saber por onde cada thread continua."),
          paragraph("Fora do heap ainda existem buffer direto de NIO e outras alocações nativas. Por isso encher o `-Xmx` até o limite do container mata o processo pelo kernel: metaspace, stacks, code cache e buffers também precisam de RAM."),
        ],
        [
          "Heap: objetos, compartilhado, coletado pelo GC",
          "Stack: frames por thread; a referência, não o objeto",
          "Metaspace: metadados de classe, memória nativa",
          "PC register: instrução atual da thread, não se configura",
        ],
        "Não diga que objetos locais vivem na stack. Em geral só a referência vive lá. Também não chame Metaspace de PermGen num JDK atual.",
      ),
      en: locale(
        "Organize by owner. The heap is shared and holds objects. The stack is per thread and holds frames. Metaspace holds the class, not the instance. The PC register is one sentence: the address of that thread's current instruction. Close with what GC collects and what is not the heap.",
        [
          paragraph("The heap is shared by every thread. Objects and arrays are allocated there, usually in eden inside a TLAB. Survivors are promoted to the old generation. GC reclaims what is unreachable. -Xms and -Xmx bound this space."),
          paragraph("Each thread has a stack. Each call pushes a frame with locals, operands, and the return address. A local primitive lives in the frame. The object does not: the frame holds the reference. A full stack throws StackOverflowError, usually unbounded recursion. -Xss sets the size, and too many threads multiply that cost."),
          paragraph("Metaspace replaced PermGen in Java 8. It holds class metadata, not instances, in native memory, and it grows when class loaders are not released. MaxMetaspaceSize stops it from eating the container quietly. The code cache is separate native memory for JIT-compiled code."),
          paragraph("The PC register is a conceptual per-thread register. It holds the address of the JVM instruction that thread is executing. During a native method the spec leaves it undefined. You do not tune it."),
          paragraph("NIO direct buffers and other native allocations also sit outside the heap. Setting -Xmx to the container limit gets the process killed, because metaspace, stacks, the code cache, and buffers need RAM too."),
        ],
        [
          "Heap: shared objects, collected by GC",
          "Stack: per-thread frames; the reference, not the object",
          "Metaspace: class metadata in native memory",
          "PC register: the thread's current instruction",
        ],
        "Do not say local objects live on the stack. Usually only the reference does. Do not call Metaspace PermGen on a current JDK.",
      ),
    },
    {
      id: "memory-leak-with-gc",
      conceptId: "def-memory-leak",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "Como uma aplicação Java vaza memória se existe Garbage Collection?",
        en: "How can a Java application leak memory despite Garbage Collection?",
      },
      covers: [
        "How can a Java application have a memory leak despite having Garbage Collection?",
      ],
      pt: locale(
        "Corrija a expectativa: o GC recolhe o que ninguém alcança. Vazamento em Java é objeto que continua alcançável sem o negócio precisar dele. Dê três causas que você já viu em serviço e o sintoma no gráfico.",
        [
          paragraph("O GC não sabe o que é lixo de negócio. Ele só recolhe objeto inalcançável a partir das raízes: stacks, estáticos e threads vivas. Se a aplicação ainda aponta para o objeto, ele fica. Isso é o vazamento."),
          paragraph("As causas que eu procuro primeiro: coleção estática ou cache sem teto e sem TTL; listener ou callback registrado e nunca removido; `ThreadLocal` num pool de threads, que segura o valor enquanto a thread viver; recurso não fechado; class loader de hot reload que não solta as classes. Contexto de persistência que cresce numa transação longa, e sessão HTTP guardando grafo grande, entram na mesma lista."),
          paragraph("O gráfico típico é heap que sobe, Full GC que devolve pouco, e no fim `OutOfMemoryError`. A prova é um heap dump: o dominator tree mostra quem ainda segura o objeto. Aumentar o heap só adia o erro."),
        ],
        [
          "GC recolhe inalcançável, não o que o negócio esqueceu",
          "Cache, listener, ThreadLocal, class loader, contexto longo",
          "Full GC que não devolve memória é o sintoma",
        ],
        "Não diga que Java não tem memory leak. Tem, só não é o ponteiro solto do C.",
      ),
      en: locale(
        "Correct the premise: GC collects what is unreachable. A Java leak is an object that stays reachable after the business is done with it. Give three service causes and the graph.",
        [
          paragraph("GC does not know business garbage. It reclaims objects unreachable from roots: stacks, statics, and live threads. If the application still references the object, it stays. That is the leak."),
          paragraph("I look first for a static collection or an unbounded cache, a listener that is never removed, a ThreadLocal on a pooled thread, an unclosed resource, and a class loader kept alive by hot reload. A long persistence context and a huge object stored in the HTTP session are the same family."),
          paragraph("The graph is a rising heap, a full GC that returns little, then OutOfMemoryError. A heap dump's dominator tree shows who still holds the object. A larger heap only delays the error."),
        ],
        [
          "GC collects the unreachable, not what the business forgot",
          "Cache, listener, ThreadLocal, class loader, long context",
          "A full GC that frees little is the symptom",
        ],
        "Do not say Java cannot leak. It can; it is not a dangling C pointer.",
      ),
    },
    {
      id: "full-gc-latency",
      conceptId: "def-full-gc",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "O que acontece num Full GC e por que a latência da API sobe?",
        en: "What happens during a Full GC, and why can it affect API latency?",
      },
      covers: [
        "What happens during a Full GC, and why can it affect API latency?",
      ],
      pt: locale(
        "Diga que Full GC não é a coleta jovem normal. É a coleta que varre o heap inteiro e, nos coletores comuns, para as threads de aplicação. Ligue isso ao p99 e ao pool que enche durante a pausa. Diga que aumentar heap sem olhar alocação pode piorar a pausa.",
        [
          paragraph("A coleta jovem limpa o eden e é curta. Full GC, ou uma mixed/old collection que degringolou para full, percorre o heap todo para recuperar a old generation e, conforme o coletor, compactar. No G1, o Full GC é o plano de emergência e é stop-the-world: as threads Java param num safepoint. ZGC e Shenandoah foram feitos para pausas curtas, mas mesmo eles têm stall quando a alocação ganha da coleta."),
          paragraph("Enquanto a aplicação está parada, o tempo entra no p99 de todo request que estava no ar. A fila do Tomcat ou do Netty continua enchendo. Quando o mundo volta, o pool está saturado, os clientes já tentaram de novo, e a latência fica alta por um tempo mesmo depois da pausa. O sintoma no APM é um pente de latência alinhado com a pausa do GC."),
          paragraph("Eu olho log de GC, tempo de pausa, taxa de alocação e quanto do heap continua vivo depois da coleta. Se o live set cabe folgado, o problema é lixo de curto prazo ou pause longa demais para o coletor. Se quase nada é liberado, é retenção, não falta de heap. Subir `-Xmx` sem esse diagnóstico aumenta o volume que a pausa precisa varrer."),
        ],
        [
          "Full GC varre o heap e para as threads no coletor comum",
          "A pausa entra no p99 e a fila do servidor enche",
          "Medir live set e alocação antes de aumentar o heap",
        ],
        "Não diga que GC nunca pausa, nem que toda latência é GC. Confirme no log antes de atribuir.",
      ),
      en: locale(
        "Say a full GC is not a normal young collection. It scans the whole heap and, on common collectors, stops application threads. Connect that to p99 and to the pool filling during the pause. A larger heap can make the pause worse.",
        [
          paragraph("A young collection clears eden and is short. A full GC walks the whole heap to reclaim the old generation and, depending on the collector, to compact it. On G1 a full GC is the emergency plan and is stop-the-world: Java threads stop at a safepoint. ZGC and Shenandoah target short pauses, but they still stall when allocation outruns collection."),
          paragraph("While the application is stopped, the pause is added to the p99 of every in-flight request. The server queue keeps filling. When the world resumes, the pool is saturated and clients have retried, so latency stays high after the pause. In the APM the latency spikes line up with GC pauses."),
          paragraph("I read GC logs, pause time, allocation rate, and the live set after collection. If the live set fits, the issue is short-lived garbage or a collector that pauses too long. If little is freed, it is retention, not a small heap. Raising -Xmx without that diagnosis increases how much a pause must scan."),
        ],
        [
          "A full GC scans the heap and stops threads on common collectors",
          "The pause lands in p99 and the server queue fills",
          "Measure the live set before raising the heap",
        ],
        "Do not say GC never pauses, or that every latency spike is GC. Confirm it in the log.",
      ),
    },
    {
      id: "troubleshoot-oom",
      conceptId: "def-oom",
      difficulty: "senior",
      speakSeconds: 120,
      titles: {
        pt: "Como investigo um OutOfMemoryError em produção?",
        en: "How would you troubleshoot an OutOfMemoryError in production?",
      },
      covers: [
        "How would you troubleshoot an OutOfMemoryError in production?",
        "What tools do you use to investigate Java memory issues?",
        "Heap Dump vs Thread Dump?",
        "How does Java Flight Recorder help with memory analysis?",
      ],
      pt: locale(
        "A primeira frase é: leia a mensagem, porque nem todo OOM é heap. Separe Java heap space, Metaspace, direct buffer, GC overhead e unable to create native thread. Diga que OOMKilled do container pode nem ser exceção Java. Só então fale de dump e de ferramenta.",
        [
          paragraph("`Java heap space` é objeto demais ou retenção. `Metaspace` é classe demais ou class loader vazado. `Direct buffer memory` é NIO fora do heap. `GC overhead limit exceeded` significa que o GC roda quase o tempo todo e libera quase nada. `unable to create native thread` é stack vezes número de threads, ou limite de processo, não o -Xmx. E se o Kubernetes mostra OOMKilled sem essa exceção, o cgroup matou o processo: heap mais nativo passou do limit."),
          paragraph("Com a mensagem em mãos, eu quero evidência, não um restart cego. Heap dump na hora do erro, com `-XX:+HeapDumpOnOutOfMemoryError` e um caminho que caiba no disco. Log de GC com `-Xlog:gc*`. Para latência e deadlock, thread dump, que é barato. Heap dump é pesado e pausa; eu não tiro um de um heap de 16 GB no meio do pico sem necessidade."),
          paragraph("No Eclipse MAT, o dominator tree e o histogram respondem quem segura a memória. `jcmd` dá heap info, GC.class_histogram e thread print sem entrar no processo às cegas. JFR, com overhead baixo, mostra quem aloca, as pausas, contenção de lock e exceções. Ele não substitui o dump quando a pergunta é quem ainda referencia o objeto velho; ele responde de onde o lixo está nascendo. VisualVM e async-profiler fecham o diagnóstico local."),
          paragraph("A correção segue a causa: teto no cache, fechar recurso, soltar ThreadLocal, baixar `-Xmx` para caber no container, ou reduzir threads. Subir memória é aceitável só quando o live set é legítimo e cabe no nó."),
        ],
        [
          "A mensagem diz qual memória acabou",
          "OOMKilled pode ser o cgroup, não o heap",
          "Heap dump para retenção; thread dump para travamento; JFR para alocação",
          "Corrigir a causa, não só aumentar o heap",
        ],
        "Não proponha só aumentar -Xmx. E não chame thread dump de ferramenta de vazamento.",
      ),
      en: locale(
        "First sentence: read the message, because not every OOM is the heap. Separate Java heap space, Metaspace, direct buffer, GC overhead, and unable to create native thread. A container OOMKilled may not be a Java exception at all. Then name dumps and tools.",
        [
          paragraph("Java heap space is too many objects or retention. Metaspace is too many classes or a leaked class loader. Direct buffer memory is NIO outside the heap. GC overhead limit exceeded means the collector runs almost continuously and frees almost nothing. unable to create native thread is stack size times thread count, or a process limit, not -Xmx. If Kubernetes shows OOMKilled without that exception, the cgroup killed the process: heap plus native passed the limit."),
          paragraph("I want evidence, not a blind restart. A heap dump on the error, with HeapDumpOnOutOfMemoryError and a path that fits on disk. GC logs via -Xlog:gc*. A thread dump for latency and deadlock, because it is cheap. A heap dump is heavy and pauses; I do not take a 16 GB one at peak without a reason."),
          paragraph("In Eclipse MAT, the dominator tree answers who retains memory. jcmd gives heap info, a class histogram, and a thread print. JFR, at low overhead, shows who allocates, pauses, lock contention, and exceptions. It does not replace a dump when the question is who still references an old object; it answers where the garbage is born. VisualVM and async-profiler finish a local diagnosis."),
          paragraph("The fix follows the cause: cap the cache, close the resource, drop the ThreadLocal, lower -Xmx so it fits the container, or cut threads. More memory is acceptable only when the live set is legitimate and fits the node."),
        ],
        [
          "The message says which memory ran out",
          "OOMKilled can be the cgroup, not the Java heap",
          "Heap dump for retention, thread dump for stalls, JFR for allocation",
          "Fix the cause, do not only raise the heap",
        ],
        "Do not suggest only raising -Xmx. Do not call a thread dump a leak tool.",
      ),
    },
    {
      id: "cache-oom",
      conceptId: "def-oom",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "Como um cache mal configurado causa OutOfMemoryError?",
        en: "How can an incorrectly configured cache cause OutOfMemoryError?",
      },
      covers: [
        "How can an incorrectly configured cache cause OutOfMemoryError?",
      ],
      pt: locale(
        "A resposta curta é: cache sem teto é um HashMap estático com outro nome. Descreva três configurações que estouram o heap e a correção com tamanho máximo, peso e TTL.",
        [
          paragraph("Um cache guarda objeto de propósito, então o GC não pode recolhê-lo. Se não há máximo de entradas, cada chave nova fica para sempre. Chave granular demais, como a URL inteira com query string, ou o corpo do request, cria cardinalidade infinita. Valor grande demais, como uma entidade JPA com coleções, multiplica o custo por entrada. Cache local em cada instância vezes o dataset inteiro também não cabe."),
          paragraph("A configuração que eu exijo é tamanho máximo ou peso máximo, expiração, e remoção quando passa do teto. Caffeine com `maximumWeight` e `expireAfterAccess` ou `expireAfterWrite` faz isso. A métrica de hit ratio, evictions e tamanho estimado diz se o teto está honesto. Cachear ausência também precisa de teto, senão um ataque de chaves inexistentes enche o mapa."),
          paragraph("Se o cache é distribuído, o heap local ainda sofre com o near cache. O teto local continua obrigatório."),
        ],
        [
          "Sem teto, o cache retém tudo que já viu",
          "Chave ou valor grandes demais multiplicam a retenção",
          "maximumSize ou maximumWeight, mais TTL, mais métrica",
        ],
        "Não diga que weak reference resolve cache de produção. O GC limpa na hora errada e a taxa de acerto desaba.",
      ),
      en: locale(
        "The short answer: an unbounded cache is a static HashMap with another name. Describe three settings that blow the heap, then the fix: a max weight and a TTL.",
        [
          paragraph("A cache keeps objects on purpose, so GC cannot collect them. Without a max size, every new key stays forever. A key that is too specific, such as a full URL or a request body, has unbounded cardinality. A value that is too large, such as a JPA entity with collections, multiplies the cost. A full dataset copied into every instance does not fit either."),
          paragraph("I require a maximum size or weight, expiry, and eviction past the cap. Caffeine with maximumWeight and expireAfterAccess or expireAfterWrite does that. Hit ratio, evictions, and estimated size show whether the cap is honest. Caching absence needs a cap too, or a scan of missing keys fills the map."),
          paragraph("A distributed cache can still exhaust the local heap through a near cache. The local cap stays mandatory."),
        ],
        [
          "Without a cap, the cache retains everything it has seen",
          "Huge keys or values multiply retention",
          "maximumWeight, a TTL, and metrics",
        ],
        "Do not say weak references are a production cache. GC clears them at the wrong time and the hit ratio collapses.",
      ),
    },
  ],
};
