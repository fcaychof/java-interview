import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const stringAndCollectionsTheory: readonly TheoryGroup[] = [
  theoryGroup("string-theory", "String e objeto", "String and object creation", [
    concept(
      "def-string-immutable",
      "String imutável",
      "Immutable String",
      [
        paragraph("String não muda depois de criada. concat, substring e toLowerCase devolvem outro objeto. O array de caracteres interno fica escondido. Por isso a classe é segura para compartilhar entre threads, o hashCode pode ser calculado uma vez e guardado, e o literal pode ir para o pool."),
        paragraph("Se String fosse mutável, uma chave de HashMap mudaria de bucket depois de inserida, e uma string passada a um class loader poderia ser alterada por quem ainda tem a referência. Quando eu preciso montar texto em loop, uso StringBuilder. A String final só nasce no fim."),
      ],
      [
        paragraph("A String does not change after it is created. concat, substring, and toLowerCase return another object. The internal character array stays hidden. That is why the class is safe to share across threads, why hashCode can be computed once and cached, and why a literal can live in the pool."),
        paragraph("If String were mutable, a HashMap key would move buckets after insertion, and a string passed to a class loader could be changed by whoever still holds the reference. When I need to build text in a loop, I use StringBuilder. The final String is born at the end."),
      ],
    ),
    concept(
      "def-string-pool",
      "String pool",
      "String pool",
      [
        paragraph("O pool guarda literais para reutilizar a mesma instância. \"hello\" escrito duas vezes no código aponta para o mesmo objeto. new String(\"hello\") é diferente: o literal continua no pool, e o new cria outro objeto no heap, com a mesma sequência de caracteres."),
        paragraph("Por isso == pode dar true entre literais e false entre um literal e um new. equals compara o conteúdo. intern() pede ao pool a instância canônica, mas eu não uso isso para economizar memória de texto que chega de fora: o pool é da JVM e um intern em massa prende os valores."),
      ],
      [
        paragraph("The pool keeps literals so the same instance can be reused. \"hello\" written twice in code points at the same object. new String(\"hello\") is different: the literal stays in the pool, and new creates another object on the heap, with the same characters."),
        paragraph("That is why == can be true between literals and false between a literal and a new. equals compares the contents. intern() asks the pool for the canonical instance, but I do not use it to save memory on text that arrives from outside: the pool belongs to the JVM, and mass intern pins the values."),
      ],
    ),
    concept(
      "def-equals-identity",
      "== e equals",
      "== and equals",
      [
        paragraph("== compara identidade: as duas referências apontam para o mesmo objeto. equals é o contrato de valor. Em String, equals compara os caracteres. Em tipo próprio, o default de Object ainda é identidade, até alguém sobrescrever."),
        paragraph("Para String de negócio, senha à parte, a comparação é equals. == só acerta por acidente quando as duas referências saíram do pool. Integer tem um cache pequeno, e o mesmo acidente acontece com == em valores baixos. Valor se compara com equals, ou com o método que o tipo oferece."),
      ],
      [
        paragraph("== compares identity: the two references point at the same object. equals is the value contract. On String, equals compares the characters. On your own type, Object's default is still identity, until someone overrides it."),
        paragraph("For a business String, passwords aside, the comparison is equals. == only succeeds by accident when both references came from the pool. Integer has a small cache, and the same accident happens with == on low values. Value is compared with equals, or with the method the type offers."),
      ],
    ),
    concept(
      "def-new-object",
      "O que o new faz",
      "What new does",
      [
        paragraph("new carrega a classe se ela ainda não foi inicializada, reserva espaço no heap, zera os campos, roda os inicializadores e os construtores da superclasse até a subclasse, e devolve a referência. O objeto só é visível para o chamador quando o construtor termina."),
        paragraph("Se o objeto não escapa do método, o JIT pode alocar em stack ou eliminar a alocação. Isso é escape analysis, uma otimização, não uma garantia para eu contar. O modelo mental da entrevista continua sendo: new nasce no heap e vive enquanto alguém alcança a referência."),
      ],
      [
        paragraph("new loads the class if it has not been initialized yet, reserves space on the heap, zeroes the fields, runs the initializers and the constructors from the superclass down to the subclass, and returns the reference. The object is visible to the caller only when the constructor finishes."),
        paragraph("If the object does not escape the method, the JIT can allocate it on the stack or remove the allocation. That is escape analysis, an optimization, not a promise I count on. The interview mental model stays: new is born on the heap and lives while someone can reach the reference."),
      ],
    ),
  ]),
  theoryGroup("collection-theory", "Collections", "Collections", [
    concept(
      "def-hashmap",
      "HashMap",
      "HashMap",
      [
        paragraph("HashMap guarda pares num array de buckets. A capacidade é potência de 2. O índice é (capacidade - 1) & hash, depois de misturar os bits altos do hashCode com os baixos. Bucket vazio recebe o nó. Colisão percorre a lista e usa equals para saber se a chave é a mesma. A partir de 8 nós, com tabela de pelo menos 64, a lista vira árvore. Abaixo de 6, volta a ser lista."),
        paragraph("O load factor padrão é 0,75. Passou disso, o array dobra e as entradas são redistribuídas. Uma chave null é permitida, no índice 0. Nada disso é thread-safe. hashCode igual não significa a mesma chave: só cai no mesmo bucket, e equals decide."),
      ],
      [
        paragraph("HashMap stores entries in an array of buckets. Capacity is a power of two. The index is (capacity - 1) & hash, after spreading the high bits of hashCode into the low bits. An empty bucket gets the node. A collision walks the chain and uses equals to tell whether the key is the same. From 8 nodes, if the table has at least 64 slots, the chain becomes a tree. Below 6, it becomes a list again."),
        paragraph("The default load factor is 0.75. Past that, the array doubles and the entries are redistributed. One null key is allowed, at index 0. None of this is thread-safe. An equal hashCode does not mean the same key: it only lands in the same bucket, and equals decides."),
      ],
    ),
    concept(
      "def-equals-hashcode",
      "Contrato de equals e hashCode",
      "The equals and hashCode contract",
      [
        paragraph("Se a.equals(b), os dois têm o mesmo hashCode. O contrário não vale: hash igual não obriga equals. Quebrar isso faz o HashMap procurar no bucket errado. O objeto foi inserido com um hash e é buscado com outro, então a chave some mesmo estando na tabela."),
        paragraph("HashSet é um HashMap por baixo. Duplicata é chave repetida. equals e hashCode ruins deixam o set aceitar dois objetos que o domínio considera o mesmo, ou perder o que já estava lá. Chave mutável é o mesmo furo: mudar um campo que entra no hash move o lugar lógico sem mover o nó. Campos de equals e hashCode ficam estáveis, ou a chave não entra no mapa."),
      ],
      [
        paragraph("If a.equals(b), both have the same hashCode. The reverse is not required: an equal hash does not force equals. Breaking this makes HashMap look in the wrong bucket. The object was inserted with one hash and looked up with another, so the key disappears even though it is still in the table."),
        paragraph("HashSet is a HashMap underneath. A duplicate is a repeated key. A bad equals and hashCode let the set accept two objects the domain considers the same, or lose what was already there. A mutable key is the same hole: changing a field that participates in the hash moves the logical place without moving the node. Fields used by equals and hashCode stay stable, or the key does not go into the map."),
      ],
    ),
    concept(
      "def-lists",
      "ArrayList e LinkedList",
      "ArrayList and LinkedList",
      [
        paragraph("ArrayList é um array que cresce. get por índice é O(1). add no fim é amortizado O(1), até lotar e copiar para um array maior. Inserir no meio desloca os elementos. A localidade de memória é boa: os itens estão lado a lado."),
        paragraph("LinkedList é uma corrente de nós. get por índice caminha desde a ponta, O(n). Inserir é barato só se eu já estou no nó. Pela API de List, chegar no índice já custou a caminhada. Quase todo uso de lista num serviço é ArrayList. LinkedList entra quando eu realmente adiciono e removo nas pontas o tempo todo e não acesso por índice."),
      ],
      [
        paragraph("ArrayList is an array that grows. get by index is O(1). add at the end is amortized O(1), until it fills and copies into a larger array. Inserting in the middle shifts the elements. Memory locality is good: the items sit next to each other."),
        paragraph("LinkedList is a chain of nodes. get by index walks from an end, O(n). Inserting is cheap only if I am already on the node. Through the List API, reaching the index already paid for the walk. Almost every list in a service is an ArrayList. LinkedList earns its place when I truly add and remove at the ends all the time and do not access by index."),
      ],
    ),
    concept(
      "def-fail-fast",
      "Fail-fast",
      "Fail-fast",
      [
        paragraph("O iterador de ArrayList, HashMap e das outras coleções comuns guarda o modCount da coleção. Se alguém adiciona ou remove durante o for-each, fora do remove do próprio iterador, o modCount diverge e a próxima volta lança ConcurrentModificationException. A coleção prefere falhar a entregar um elemento duas vezes ou pular um."),
        paragraph("Não é detecção perfeita de toda corrida: é uma checagem de boa fé na thread que itera. Outra thread pode corromper a estrutura sem a exceção aparecer na hora. Para mutação concorrente de verdade, a estrutura é outra, ConcurrentHashMap ou uma cópia. No loop de uma thread só, eu removo pelo iterador, ou junto os alvos e removo depois."),
      ],
      [
        paragraph("The iterator of ArrayList, HashMap, and the other ordinary collections stores the collection's modCount. If someone adds or removes during a for-each, other than through the iterator's own remove, modCount diverges and the next step throws ConcurrentModificationException. The collection prefers to fail rather than yield an element twice or skip one."),
        paragraph("It is not a perfect detection of every race: it is a best-effort check on the iterating thread. Another thread can corrupt the structure without the exception showing up immediately. For real concurrent mutation, the structure is a different one, ConcurrentHashMap or a copy. In a single-thread loop, I remove through the iterator, or I collect the targets and remove afterwards."),
      ],
    ),
    concept(
      "def-map-variants",
      "HashMap, Hashtable e ConcurrentHashMap",
      "HashMap, Hashtable, and ConcurrentHashMap",
      [
        paragraph("HashMap não sincroniza, aceita uma chave null e um valor null, e é a escolha de uma thread. Hashtable é a classe legada: sincroniza cada método, não aceita null, e a trava é o mapa inteiro. Iterar e atualizar ao mesmo tempo continua frágil, porque a trava de um get não cobre um fluxo maior."),
        paragraph("ConcurrentHashMap divide a contenção. Leituras não bloqueiam do jeito antigo, updates de chaves diferentes seguem em paralelo, e null é proibido porque null já significa ausência em várias operações. Não substitui um HashMap local. Entra quando o mapa é compartilhado entre threads. LinkedHashMap acrescenta ordem de inserção ou de acesso. TreeMap ordena pela chave, com compareTo, e o contrato de comparação tem de concordar com equals."),
      ],
      [
        paragraph("HashMap does not synchronize, accepts one null key and null values, and is the single-thread choice. Hashtable is the legacy class: it synchronizes every method, rejects null, and the lock is the whole map. Iterating and updating at the same time stays fragile, because the lock of one get does not cover a larger flow."),
        paragraph("ConcurrentHashMap splits the contention. Reads do not block the old way, updates of different keys proceed in parallel, and null is forbidden because null already means absence in several operations. It does not replace a local HashMap. It earns its place when the map is shared across threads. LinkedHashMap adds insertion or access order. TreeMap orders by the key, with compareTo, and the comparison contract has to agree with equals."),
      ],
    ),
  ]),
];
