import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const jvmMemoryTheory: readonly TheoryGroup[] = [
  theoryGroup("jvm-theory", "Memória da JVM", "JVM memory", [
    concept(
      "def-memory-areas",
      "Onde cada coisa mora",
      "Where each thing lives",
      [
        paragraph("Heap é o lugar dos objetos e dos arrays, compartilhado pelas threads. Stack é por thread: frames de método, variáveis locais e a referência para o objeto, que em si está no heap. PC register, também por thread, marca a instrução corrente. Metaspace guarda metadado de classe, fora do heap desde o Java 8. O antigo PermGen ficou para trás."),
        paragraph("Um new de conta cria o objeto no heap. A variável local no método guarda só a referência, na stack. A classe Account, o bytecode e o reflexo, ficam no Metaspace. Estourar stack é recursão ou frame grande. Estourar heap é objeto vivo demais. Estourar Metaspace é class loader que não solta, típico de redeploy ou geração dinâmica sem limite."),
      ],
      [
        paragraph("The heap is where objects and arrays live, shared by the threads. The stack is per thread: method frames, local variables, and the reference to the object, which itself is on the heap. The PC register, also per thread, marks the current instruction. Metaspace holds class metadata, outside the heap since Java 8. The old PermGen is gone."),
        paragraph("A new of an account creates the object on the heap. The local variable in the method holds only the reference, on the stack. The Account class, the bytecode and the reflection data, live in Metaspace. Blowing the stack is recursion or a huge frame. Blowing the heap is too many live objects. Blowing Metaspace is a class loader that does not let go, typical of redeploy or unbounded dynamic generation."),
      ],
    ),
    concept(
      "def-memory-leak",
      "Vazamento com GC",
      "A leak with a GC",
      [
        paragraph("O garbage collector libera objeto que ninguém alcança. Vazamento em Java é objeto que ainda é alcançado e não deveria ser. Uma lista estática, um cache sem teto, um listener que o sujeito não esquece, um ThreadLocal que a thread do pool não limpa. O GC vê a referência e preserva."),
        paragraph("O sintoma é o heap usado que sobe e não volta depois do Full GC, ou volta cada vez de um patamar mais alto. Heap dump mostra o caminho da raiz até o objeto. A correção tira a referência, põe teto e expiração no cache, ou remove o listener. Aumentar -Xmx só adia."),
      ],
      [
        paragraph("The garbage collector frees an object nobody can reach. A leak in Java is an object that is still reachable and should not be. A static list, a cache with no ceiling, a listener the subject never forgets, a ThreadLocal the pool thread never clears. The GC sees the reference and keeps it."),
        paragraph("The symptom is used heap that climbs and does not come back after a Full GC, or comes back each time from a higher floor. A heap dump shows the path from the root to the object. The fix drops the reference, puts a ceiling and an expiry on the cache, or removes the listener. Raising -Xmx only delays it."),
      ],
    ),
    concept(
      "def-full-gc",
      "Full GC",
      "Full GC",
      [
        paragraph("O coletor jovem limpa objetos que morreram cedo, em geral com pausa curta. Objeto que sobrevive é promovido. Full GC, ou uma coleta que olha o heap inteiro, entra quando o espaço velho enche, quando a alocação falha, ou quando alguém chama de propósito. A aplicação para enquanto as raízes são varridas."),
        paragraph("A latência da API sobe porque as threads de request ficam paradas durante a pausa. Full GC frequente diz que o heap velho está cheio de objeto vivo, ou pequeno demais para a promoção. Eu olho tempo de pausa, frequência, e o que sobrou ocupado depois da coleta. Trocar de G1 para ZGC muda a pausa. Não muda um cache que segura o mundo."),
      ],
      [
        paragraph("The young collector cleans objects that died early, usually with a short pause. An object that survives is promoted. A Full GC, or a collection that looks at the whole heap, runs when old space fills, when an allocation fails, or when someone calls it on purpose. The application stops while the roots are scanned."),
        paragraph("API latency climbs because the request threads sit still during the pause. Frequent Full GC says the old heap is full of live objects, or too small for the promotion. I look at pause time, frequency, and what stayed occupied after the collection. Switching from G1 to ZGC changes the pause. It does not change a cache that holds the world."),
      ],
    ),
    concept(
      "def-oom",
      "OutOfMemoryError",
      "OutOfMemoryError",
      [
        paragraph("OutOfMemoryError diz qual área acabou: Java heap space, Metaspace, ou unable to create native thread. A mensagem muda o próximo passo. Heap pede dump. Metaspace pede class loader. Native thread pede contagem de threads, não mais heap."),
        paragraph("Cache sem máximo, sem expiração, ou com chave que nunca repete, enche o heap com objeto alcançável. O GC roda, não libera, e a alocação falha. Em produção eu quero heap dump no OOM, -XX:+HeapDumpOnOutOfMemoryError, e um teto no cache antes disso. Subir a memória sem achar quem segura a referência repete o incidente maior."),
      ],
      [
        paragraph("OutOfMemoryError says which area ran out: Java heap space, Metaspace, or unable to create native thread. The message changes the next step. Heap wants a dump. Metaspace wants class loaders. Native thread wants a thread count, not more heap."),
        paragraph("A cache with no maximum, no expiry, or a key that never repeats fills the heap with reachable objects. The GC runs, frees nothing, and the allocation fails. In production I want a heap dump on OOM, -XX:+HeapDumpOnOutOfMemoryError, and a ceiling on the cache before that. Raising memory without finding who holds the reference repeats the incident, larger."),
      ],
    ),
  ]),
];
