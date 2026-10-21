import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { stringAndCollectionsTheory } from "../theory/string-and-collections";

export const stringAndCollections: InterviewSection = {
  id: "string-and-collections",
  order: 1,
  titles: {
    pt: "String, objetos e collections",
    en: "Strings, objects, and collections",
  },
  summaries: {
    pt: "Imutabilidade, pool, igualdade, criação de objeto e o contrato que faz HashMap e HashSet funcionarem.",
    en: "Immutability, the pool, equality, object creation, and the contract behind HashMap and HashSet.",
  },
  theory: stringAndCollectionsTheory,
  questions: [
    {
      id: "string-immutable",
      conceptId: "def-string-immutable",
      difficulty: "junior",
      speakSeconds: 75,
      titles: {
        pt: "Por que String é imutável?",
        en: "Why is String immutable in Java?",
      },
      covers: ["Why is String immutable in Java?"],
      pt: locale(
        "Abra com a definição em uma frase e já entregue os quatro motivos: segurança, String Pool, hashCode cacheado e compartilhamento entre threads. Feche com a decisão prática: concatenação em loop usa StringBuilder. Um minuto basta.",
        [
          paragraph("String é imutável: depois de criada, a sequência de caracteres não muda. `concat`, `replace` e `toUpperCase` devolvem um objeto novo e deixam o original intacto. A variável pode passar a apontar para outra string; o objeto antigo é que não é alterado."),
          paragraph("Eu justifico isso com quatro efeitos. Segurança: strings guardam caminhos, nomes de classe, URLs e credenciais, e uma validação perde o sentido se alguém alterar o conteúdo pela mesma referência. String Pool: literais iguais compartilham a mesma instância, o que só é seguro se ninguém puder mutá-la. O `hashCode` é calculado uma vez e reaproveitado, então a string pode ser chave de `HashMap`. E várias threads podem ler a mesma instância sem sincronização."),
          paragraph("Se a concatenação acontece dentro de um loop, eu não uso `+`. Uso `StringBuilder` e converto para `String` uma vez, no fim."),
        ],
        [
          "A operação que parece alterar a string cria outro objeto",
          "Segurança, pool, cache de hash e leitura concorrente",
          "StringBuilder quando há concatenação repetida",
        ],
        "Não diga que a variável não pode receber outra string. Imutabilidade é do objeto, não da referência.",
      ),
      en: locale(
        "Define it in one sentence, then give four reasons: security, the pool, a cached hashCode, and safe sharing. Close with StringBuilder. Do not tour the String source.",
        [
          paragraph("A String is immutable: once created, its character sequence does not change. `concat`, `replace`, and `toUpperCase` return a new object. You can point a variable at a different String; you cannot change the original object."),
          paragraph("Four practical reasons. Security: strings hold paths, class names, URLs, and credentials, so a check is useless if a caller can mutate the value afterward. The pool can share one instance for equal literals only if that instance cannot change. `hashCode` is cached, which is required for a stable HashMap key. Threads can read the same instance without synchronization."),
          paragraph("For repeated concatenation I use a StringBuilder and produce the String once at the end."),
        ],
        [
          "Mutating operations return a new object",
          "Security, interning, cached hash, safe sharing",
          "StringBuilder for repeated concatenation",
        ],
        "Do not say the variable cannot be reassigned. Immutability is about the object.",
      ),
    },
    {
      id: "string-pool",
      conceptId: "def-string-pool",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "String Pool e Heap: qual é a diferença?",
        en: "What is the difference between the String Pool and the heap?",
      },
      covers: ["Explain String Pool vs Heap memory."],
      pt: locale(
        "Diga primeiro que o pool fica dentro do heap, não ao lado dele. Depois separe literal de `new`. Feche com `intern()` e com o cuidado de não internar texto ilimitado vindo do usuário.",
        [
          paragraph("O String Pool é uma área especial do heap, mantida pela JVM, que guarda strings literais e o resultado de `intern()`. O heap, no sentido mais amplo, é onde moram os objetos. O pool não é um espaço separado do heap."),
          paragraph("Quando o código contém o literal `\"hello\"`, a JVM coloca essa instância no pool e reutiliza a mesma referência em outros literais iguais. Já `new String(...)` pede um objeto novo no heap, mesmo que os caracteres sejam iguais aos de uma string do pool. Por isso dois literais iguais passam em `==`, e um literal comparado com `new String` do mesmo texto não passa."),
          paragraph("`intern()` devolve a instância do pool, criando-a se ainda não existir. Eu não uso isso como otimização geral: internar dados vindos de fora, sem limite, enche o pool e pressiona a memória, porque essas instâncias ficam fortemente referenciadas."),
        ],
        [
          "O pool é parte do heap, não uma memória à parte",
          "Literal reutiliza instância; new cria outra",
          "intern() sem limite pode reter memória demais",
        ],
        "Não desenhe o pool fora do heap. Desde o Java 7 ele fica no heap, não na PermGen.",
      ),
      en: locale(
        "Say the pool lives inside the heap. Then contrast a literal with new. Mention intern() and why interning untrusted input is a memory leak.",
        [
          paragraph("The String pool is a JVM-managed table inside the heap. It holds string literals and the results of `intern()`. The heap is the broader area where objects live. The pool is not a separate memory space."),
          paragraph("A literal such as `\"hello\"` is placed in the pool and reused. `new String(...)` allocates a distinct heap object even when the characters match a pooled string. Two equal literals are `==`. A literal and a `new String` with the same text are not."),
          paragraph("`intern()` returns the pooled instance, creating it if needed. I do not intern unbounded user input: those references stay strongly reachable and can exhaust memory."),
        ],
        [
          "The pool is inside the heap since Java 7",
          "Literals are shared; new allocates another object",
          "Unbounded intern() retains memory",
        ],
        "Do not draw the pool outside the heap or place it in PermGen.",
      ),
    },
    {
      id: "new-string-existing",
      conceptId: "def-string-pool",
      difficulty: "pleno",
      speakSeconds: 60,
      titles: {
        pt: "O que acontece em new String(\"hello\") se \"hello\" já está no pool?",
        en: "What happens on new String(\"hello\") when \"hello\" is already in the pool?",
      },
      covers: [
        "What happens when we use new String(\"hello\") if \"hello\" already exists in the String Pool?",
      ],
      pt: locale(
        "Responda em três passos: o literal já está no pool, o construtor cria outra instância, `==` é falso e `equals` é verdadeiro. Ofereça `intern()` só se perguntarem como obter a do pool.",
        [
          paragraph("O literal `\"hello\"` já ocupa uma instância no pool. A expressão `new String(\"hello\")` não reutiliza essa instância. O construtor copia o conteúdo e devolve um objeto novo no heap."),
          paragraph("Resultado: `new String(\"hello\") == \"hello\"` é falso, porque são duas referências. `equals` é verdadeiro, porque a sequência de caracteres é a mesma. Se eu chamar `intern()` nesse objeto novo, aí sim recebo a referência que já estava no pool."),
        ],
        [
          "O literal continua no pool",
          "new sempre produz outra instância",
          "== compara referência; equals compara conteúdo",
        ],
        "Não diga que o construtor devolve a instância do pool. Isso só acontece com intern().",
      ),
      en: locale(
        "Three beats: the literal stays in the pool, the constructor allocates a copy, == is false and equals is true. Mention intern() only as the way back to the pooled instance.",
        [
          paragraph("The literal `\"hello\"` is already in the pool. `new String(\"hello\")` does not return that instance. The constructor copies the characters into a new heap object."),
          paragraph("So `new String(\"hello\") == \"hello\"` is false, while `equals` is true. Calling `intern()` on the new object returns the pooled reference."),
        ],
        [
          "The literal remains in the pool",
          "new allocates a distinct object",
          "== is identity; equals is content",
        ],
        "Do not say the constructor returns the pooled instance.",
      ),
    },
    {
      id: "equals-vs-identity",
      conceptId: "def-equals-identity",
      difficulty: "junior",
      speakSeconds: 70,
      titles: {
        pt: "Qual é a diferença entre == e equals() para String?",
        en: "What is the difference between == and equals() for String?",
      },
      covers: ["Difference between == and .equals() for String."],
      pt: locale(
        "Comece pelo contrato, não pelo exemplo. `==` é identidade; `equals` em String é conteúdo. Mostre um caso em que os dois divergem, quase sempre literal contra `new` ou contra valor vindo do banco. Diga que em código de produção você compara strings com equals.",
        [
          paragraph("`==` compara referências: os dois lados apontam para o mesmo objeto? `equals`, na classe String, compara a sequência de caracteres. Duas strings com o mesmo texto podem falhar em `==` e passar em `equals`."),
          paragraph("O caso clássico é um literal e um `new String` com o mesmo texto. Outro caso real é texto que veio de um `ResultSet`, de um JSON ou de uma concatenação: o conteúdo bate, a referência não. Por isso regra de negócio não usa `==` para string."),
          paragraph("Há um detalhe que eu só menciono se o entrevistador puxar: literais e constantes de compilação podem ser a mesma instância por causa do pool, então `==` às vezes passa por acidente. Isso não é um contrato em que eu possa confiar."),
        ],
        [
          "== é identidade, equals é conteúdo",
          "Literal versus new, ou texto vindo de fora, diverge",
          "Regra de negócio usa equals, não ==",
        ],
        "Não recomende == só porque o pool faz alguns literais coincidirem. Isso quebra assim que a string deixa de ser literal.",
      ),
      en: locale(
        "Start with the contract: == is identity, String.equals is content. Give one case where they disagree. Say production checks use equals.",
        [
          paragraph("`==` asks whether both sides point to the same object. `String.equals` compares the character sequence. Two strings with the same text can fail `==` and pass `equals`."),
          paragraph("A literal compared with `new String` of the same text is the classroom example. A value from a database, JSON, or concatenation is the production example. Business rules use `equals`."),
          paragraph("Literals can accidentally be `==` because of the pool. That is not a contract I rely on."),
        ],
        [
          "== is identity, equals is content",
          "new or external input breaks ==",
          "Production code uses equals",
        ],
        "Do not recommend == because the pool sometimes makes literals identical.",
      ),
    },
    {
      id: "new-object",
      conceptId: "def-new-object",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "O que acontece internamente quando usamos new?",
        en: "What happens internally when you create an object with new?",
      },
      covers: ["What happens internally when you create an object using new?"],
      pt: locale(
        "Conte a história em ordem: carregar a classe se preciso, alocar, zerar a memória, rodar o construtor, devolver a referência. Se sobrar tempo, feche com o bônus de sênior: escape analysis pode não materializar o objeto no heap.",
        [
          paragraph("Se a classe ainda não foi usada, a JVM carrega o bytecode, faz o linking e inicializa os estáticos. Isso acontece uma vez por class loader, não a cada `new`."),
          paragraph("No `new`, a JVM reserva espaço para o objeto, em geral num TLAB, que é um pedaço do eden já reservado para a thread, para evitar sincronizar toda alocação. A memória é zerada, então campos nascem com valor default. Em seguida roda o construtor, de baixo para cima: `Object`, a superclasse, inicializadores de campo e o corpo do construtor. A referência entra na pilha do frame atual, numa variável local ou como operando."),
          paragraph("O JIT pode aplicar escape analysis. Se o objeto não escapa do método, ele pode ser escalarizado e nem ir para o heap. Eu não prometo isso; depende do JIT e de o objeto não ser publicado."),
        ],
        [
          "Carga e inicialização da classe só se ainda não ocorreram",
          "Alocação, zeragem e cadeia de construtores",
          "A referência fica na stack; o objeto, no heap, salvo otimização do JIT",
        ],
        "Não diga que todo new é sempre uma ida lenta ao heap global com lock. TLAB existe justamente para a alocação comum ser barata.",
      ),
      en: locale(
        "Walk it in order: load the class if needed, allocate, zero, run constructors, push the reference. Close with escape analysis if you want a senior signal.",
        [
          paragraph("If the class is not ready, the JVM loads, links, and initializes it once per class loader. That does not happen on every `new`."),
          paragraph("Allocation usually comes from the thread's TLAB in eden, so the common case does not lock the heap. Memory is zeroed, so fields start at default values. Then constructors run from `Object` downward, including field initializers. The reference is pushed into the current stack frame."),
          paragraph("If escape analysis proves the object never leaves the method, the JIT may scalar-replace it and skip the heap. I do not promise that; it depends on the JIT and on the object not being published."),
        ],
        [
          "Class initialization is once per class loader",
          "Allocate, zero, then the constructor chain",
          "The reference is on the stack; the object is on the heap unless the JIT removes it",
        ],
        "Do not describe every new as a globally locked heap allocation. TLABs exist so the common path is cheap.",
      ),
    },
    {
      id: "hashmap-internals",
      conceptId: "def-hashmap",
      difficulty: "pleno",
      speakSeconds: 120,
      titles: {
        pt: "Como o HashMap funciona internamente?",
        en: "How does HashMap work internally?",
      },
      covers: [
        "How does HashMap work internally?",
        "How does HashMap work internally in Java?",
      ],
      pt: locale(
        "Desenhe com palavras: array de buckets, índice por potência de 2, colisão em lista e árvore, resize no load factor. Diga que é para uma thread só. Se o entrevistador pedir o índice, fale a fórmula. Não recite o arquivo inteiro.",
        [
          paragraph("`HashMap` guarda pares num array de nós. A capacidade é potência de 2. A chave passa por `hashCode`, e a JVM mistura os bits altos com os baixos (`hashCode ^ (hashCode >>> 16)`) para o índice não depender só dos bits que a máscara joga fora. O índice é `(capacidade - 1) & hash`."),
          paragraph("Se o bucket está vazio, o nó entra ali. Se já existe nó, é colisão: a implementação percorre a lista e usa `equals` para decidir se a chave é a mesma. A partir de 8 nós, e se a tabela tem pelo menos 64 posições, a lista vira árvore rubro-negra, para um hash ruim não degradar a busca para O(n). Abaixo de 6 nós, a árvore volta a ser lista."),
          paragraph("O load factor padrão é 0,75. Quando o número de entradas passa de capacidade vezes 0,75, o array dobra e as chaves são redistribuídas. Uma chave null é permitida e cai no índice 0. Nada disso é thread-safe: uso concorrente pode perder atualização e corromper a estrutura."),
        ],
        [
          "Índice = (n - 1) & hash, com n potência de 2",
          "Colisão: lista e, no limite, árvore",
          "Resize em 0,75 e uma única chave null",
          "Não é seguro para várias threads",
        ],
        "Não diga que hashCode igual significa a mesma chave. Isso é a pergunta seguinte, e misturar as duas perde o ponto.",
      ),
      en: locale(
        "Describe the bucket array, the power-of-two index, list-then-tree collisions, and resize. State that it is single-threaded. Give the index formula if asked. Do not recite the source file.",
        [
          paragraph("HashMap stores entries in an array of nodes. Capacity is a power of two. The key's `hashCode` is spread with `hashCode ^ (hashCode >>> 16)`, then the index is `(capacity - 1) & hash`."),
          paragraph("An empty bucket gets the node. A collision walks the chain and uses `equals` to tell same key from different key. At 8 nodes, if the table length is at least 64, the chain becomes a red-black tree so a bad hash cannot degrade lookup to O(n). Below 6 nodes it becomes a list again."),
          paragraph("The default load factor is 0.75. Past capacity times 0.75, the array doubles and entries are rehashed. One null key is allowed, at index 0. None of this is thread-safe."),
        ],
        [
          "Index is (n - 1) & hash, n a power of two",
          "Collisions are a list, then a tree",
          "Resize at 0.75, one null key",
          "Not safe for concurrent use",
        ],
        "Do not say an equal hashCode means an equal key.",
      ),
    },
    {
      id: "same-hashcode",
      conceptId: "def-hashmap",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "O que acontece quando duas chaves têm o mesmo hashCode?",
        en: "What happens when two keys have the same hashCode?",
      },
      covers: ["What happens when two keys have the same hashcode?"],
      pt: locale(
        "A frase que destrava a pergunta: mesmo hash não é a mesma chave. Explique que elas caem no mesmo bucket e que `equals` decide. Diferencie correção de performance.",
        [
          paragraph("As duas chaves vão para o mesmo bucket. Isso é colisão, não substituição. O `HashMap` percorre a lista ou a árvore daquele bucket e chama `equals`. Se `equals` for verdadeiro, é a mesma chave e o valor é substituído. Se for falso, as duas convivem no bucket."),
          paragraph("Correção e performance são coisas diferentes. O contrato exige que chaves iguais tenham o mesmo hash, mas hashes iguais não exigem chaves iguais. Muitas colisões deixam o bucket longo; a árvore a partir de 8 nós limita o dano, porém um `hashCode` bem distribuído continua sendo o que mantém o get perto de O(1)."),
        ],
        [
          "Mesmo hash significa mesmo bucket, não mesma chave",
          "equals decide se o put substitui ou encadeia",
          "Colisão demais piora performance, não a correção do contrato",
        ],
        "Não diga que a segunda chave é descartada ou que o mapa lança exceção.",
      ),
      en: locale(
        "Open with: same hash is not the same key. They share a bucket and equals decides. Separate correctness from performance.",
        [
          paragraph("Both keys land in the same bucket. That is a collision, not a replacement. HashMap walks the chain or tree and calls `equals`. If it returns true, the value is replaced. If it returns false, both entries stay."),
          paragraph("Equal objects must share a hashCode. Equal hashCodes do not imply equal objects. A long chain hurts performance; treeifying at eight nodes limits the damage, but a well-spread hashCode is what keeps get near O(1)."),
        ],
        [
          "Same hash means same bucket, not same key",
          "equals decides replace versus chain",
          "Collisions hurt performance, not the equality contract",
        ],
        "Do not say the second key is dropped or that the map throws.",
      ),
    },
    {
      id: "equals-hashcode-contract",
      conceptId: "def-equals-hashcode",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "Por que equals() e hashCode() precisam seguir um contrato?",
        en: "Why must equals() and hashCode() follow a contract?",
      },
      covers: [
        "Why must equals() and hashCode() follow a contract?",
      ],
      pt: locale(
        "Diga a regra em uma frase: se equals é verdadeiro, hashCode tem de ser igual. Depois diga o que quebra quando isso é mentira: o objeto entra num bucket e é procurado em outro. Complete com as propriedades de equals e com o perigo de mutar o campo usado na chave.",
        [
          paragraph("Coleções baseadas em hash encontram o bucket pelo `hashCode` e só então confirmam com `equals`. A regra obrigatória é: se `a.equals(b)`, então `a.hashCode() == b.hashCode()`. O contrário não vale. Se duas chaves são iguais para o negócio e têm hashes diferentes, o `put` guarda num bucket e o `contains` ou o `get` olham outro. O mapa responde que a chave não existe."),
          paragraph("`equals` precisa ser reflexivo, simétrico, transitivo, consistente e falso contra null. Os campos usados nos dois métodos têm de ser os mesmos. E esses campos não podem mudar enquanto o objeto estiver dentro do `HashMap`: o bucket foi escolhido com o hash antigo, e a chave fica perdida na estrutura."),
          paragraph("Na prática eu uso os mesmos componentes nos dois métodos, prefiro classes imutáveis como chave, e deixo o IDE ou um record gerar o par para não atualizar só um lado."),
        ],
        [
          "equals verdadeiro implica hashCode igual",
          "Hash diferente manda a busca para o bucket errado",
          "Não mutar campo de equals/hashCode enquanto a chave está no mapa",
        ],
        "Não diga que hashCode igual obriga equals verdadeiro. Essa inversão é o erro mais comum.",
      ),
      en: locale(
        "State the one-way rule first: equals true implies equal hashCodes. Then show the failure: put stores the entry in one bucket and get looks in another. Add equals properties and the mutated-key bug.",
        [
          paragraph("Hash collections pick a bucket with `hashCode` and confirm with `equals`. If `a.equals(b)`, then `a.hashCode()` must equal `b.hashCode()`. The reverse is not required. If two business-equal keys hash differently, `put` stores the entry in one bucket and `get` searches another, so the key looks missing."),
          paragraph("`equals` must be reflexive, symmetric, transitive, consistent, and false for null. Both methods must use the same fields. Those fields must not change while the object is a map key, or the entry stays in the bucket chosen by the old hash."),
          paragraph("I use the same components in both methods, prefer immutable keys, and let a record or the IDE generate the pair."),
        ],
        [
          "equals true implies equal hashCodes",
          "A different hash sends get to the wrong bucket",
          "Do not mutate key fields while the key is in the map",
        ],
        "Do not say equal hashCodes require equals to return true.",
      ),
    },
    {
      id: "hashset-bad-contract",
      conceptId: "def-equals-hashcode",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Por que um HashSet erra duplicata se equals e hashCode estão ruins?",
        en: "Why can HashSet miss duplicates when equals and hashCode are wrong?",
      },
      covers: [
        "Why can HashSet detect duplicate objects incorrectly if equals() and hashCode() are implemented badly?",
      ],
      pt: locale(
        "Lembre que HashSet é um HashMap por baixo. A duplicata só é vista se o hash levar ao bucket certo e o equals confirmar. Dê um exemplo de cada falha: hash inconsistente e equals que ignora um campo.",
        [
          paragraph("`HashSet` guarda os elementos como chaves de um `HashMap`, com um valor sentinela. `add` só descobre duplicata se achar o bucket pelo `hashCode` e se `equals` disser que o elemento já está lá."),
          paragraph("Se duas pessoas são iguais por documento, mas o `hashCode` usa só o nome, objetos iguais caem em buckets diferentes e o set aceita os dois. Se o `hashCode` está certo e o `equals` esquece o documento, o set trata pessoas diferentes como a mesma, ou o contrário, conforme o método mentir. O sintoma no negócio é transação duplicada ou registro que `contains` jura que não existe."),
          paragraph("Record com os campos certos, ou uma classe imutável com os dois métodos gerados juntos, evita esse defeito. Teste de contrato, do tipo EqualsVerifier, pega a regressão."),
        ],
        [
          "HashSet é HashMap por baixo",
          "Hash inconsistente deixa iguais em buckets diferentes",
          "equals incompleto confunde identidade de negócio",
        ],
        "Não explique HashSet como uma árvore que compara com compareTo. Isso é TreeSet.",
      ),
      en: locale(
        "Remind them HashSet is a HashMap. A duplicate is detected only if the hash finds the bucket and equals confirms. Give one failure for each method.",
        [
          paragraph("HashSet stores elements as HashMap keys. `add` treats a value as a duplicate only when `hashCode` selects the right bucket and `equals` says the element is already there."),
          paragraph("If two people are equal by document id but `hashCode` uses only the name, equal objects land in different buckets and the set keeps both. If `equals` ignores the document, distinct people collapse into one. The business symptom is a duplicate transaction or a `contains` that returns false for data you just added."),
          paragraph("An immutable type or a record with both methods generated from the same fields prevents it. A contract test such as EqualsVerifier catches the regression."),
        ],
        [
          "HashSet is backed by HashMap",
          "Inconsistent hashes hide equal elements",
          "A partial equals collapses distinct business keys",
        ],
        "Do not describe HashSet as ordered by compareTo. That is TreeSet.",
      ),
    },
    {
      id: "arraylist-vs-linkedlist",
      conceptId: "def-lists",
      difficulty: "junior",
      speakSeconds: 70,
      titles: {
        pt: "ArrayList ou LinkedList: quando uso cada um?",
        en: "ArrayList vs LinkedList: when would you use each?",
      },
      covers: ["ArrayList vs LinkedList — when would you use each?"],
      pt: locale(
        "Seja honesto: o default é ArrayList. Explique acesso O(1), localidade de cache e insert no meio O(n). Diga que LinkedList quase nunca ganha, e que fila ou pilha pedem ArrayDeque. Isso soa mais sênior do que repetir a tabela do livro.",
        [
          paragraph("`ArrayList` é um array que cresce. `get` por índice é O(1), a iteração é sequencial na memória e o processador aproveita a cache. Inserir ou remover no meio desloca elementos, então é O(n). O resize copia o array, mas é raro perto do custo de percorrer nós espalhados."),
          paragraph("`LinkedList` guarda nós ligados, cada um com o valor e duas referências. Inserir no meio só é O(1) se você já tem o nó. Achar a posição é O(n), e cada nó é uma alocação separada, ruim para a cache. Em código de aplicação eu quase não escolho `LinkedList`."),
          paragraph("Para fila ou pilha, uso `ArrayDeque`. Ele é contíguo, não sofre o custo dos nós e cobre os dois lados. `LinkedList` implementa `Deque`, mas perde nessa comparação."),
        ],
        [
          "ArrayList é o default: acesso e iteração",
          "LinkedList perde por localidade de memória",
          "Fila e pilha: ArrayDeque",
        ],
        "Não diga que LinkedList é a escolha natural para muita inserção no meio. Sem um nó já localizado, achar o meio já é O(n).",
      ),
      en: locale(
        "Be direct: the default is ArrayList. Explain O(1) access, cache locality, and O(n) mid-list edits. Say LinkedList almost never wins, and a queue or stack should be an ArrayDeque.",
        [
          paragraph("ArrayList is a growable array. Index get is O(1) and iteration is contiguous, which the CPU cache likes. Insert or remove in the middle shifts elements, so it is O(n). Resize copies the array, but that is rare next to pointer-chasing nodes."),
          paragraph("LinkedList nodes each hold the value and two references. A middle insert is O(1) only when you already hold the node. Finding the index is O(n), and every node is a separate allocation. I almost never choose it in application code."),
          paragraph("For a queue or a stack I use ArrayDeque. LinkedList implements Deque, but the array-backed deque is the better structure."),
        ],
        [
          "ArrayList is the default",
          "LinkedList loses on locality",
          "Queue or stack: ArrayDeque",
        ],
        "Do not say LinkedList is the natural choice for many middle insertions. Finding the middle is already O(n).",
      ),
    },
    {
      id: "concurrent-modification",
      conceptId: "def-fail-fast",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que acontece se eu modifico uma collection enquanto itero?",
        en: "What happens if you modify a collection while iterating it?",
      },
      covers: [
        "What happens if you modify a collection while iterating over it?",
      ],
      pt: locale(
        "Diga o nome do sintoma: ConcurrentModificationException, fail-fast, baseada em modCount. Deixe claro que isso não é trava de concorrência. Feche com três saídas legais: remove do iterator, removeIf, ou cópia.",
        [
          paragraph("O for-each usa um iterator. Em `ArrayList` e `HashMap`, uma mudança estrutural incrementa `modCount`. No próximo passo o iterator vê que o contador mudou e lança `ConcurrentModificationException`. É comportamento fail-fast: detecta o erro cedo, mas não é uma garantia formal se duas threads correm sem sincronização. A exceção pode não aparecer, e a estrutura pode só corromper."),
          paragraph("Remover pelo próprio `iterator.remove()`, usar `removeIf`, ou iterar uma cópia é seguro. Alterar o valor dentro de um mapa, sem adicionar ou remover chave, em geral não é modificação estrutural. Para várias threads de verdade, a saída é lock em volta da iteração ou uma collection concorrente, cujo iterator é fracamente consistente e não promete esse fail-fast."),
        ],
        [
          "modCount e ConcurrentModificationException",
          "Fail-fast não é o mesmo que thread safety",
          "iterator.remove, removeIf ou cópia",
        ],
        "Não diga que a exceção prova que houve duas threads. Uma thread só, removendo dentro do for-each, já dispara isso.",
      ),
      en: locale(
        "Name the symptom: ConcurrentModificationException, fail-fast, driven by modCount. Say it is not a concurrency lock. Close with iterator.remove, removeIf, or a copy.",
        [
          paragraph("A for-each uses an iterator. On ArrayList and HashMap, a structural change increments `modCount`. On the next step the iterator notices and throws `ConcurrentModificationException`. Fail-fast detects the bug early. It is not a formal guarantee under real races: the exception can be missed and the structure can just be corrupted."),
          paragraph("Legal options are `iterator.remove()`, `removeIf`, or iterating a copy. Replacing a map value without adding or removing a key is usually not structural. Across threads, synchronize the whole iteration or use a concurrent collection, whose iterators are weakly consistent and do not promise this fail-fast check."),
        ],
        [
          "modCount and ConcurrentModificationException",
          "Fail-fast is not thread safety",
          "iterator.remove, removeIf, or a snapshot",
        ],
        "Do not say the exception proves two threads were involved. One thread removing inside for-each is enough.",
      ),
    },
    {
      id: "map-variants",
      conceptId: "def-map-variants",
      difficulty: "pleno",
      speakSeconds: 110,
      titles: {
        pt: "HashMap, ConcurrentHashMap e Hashtable: qual é a diferença real?",
        en: "What is the real difference between HashMap, ConcurrentHashMap, and Hashtable?",
      },
      covers: [
        "HashMap vs ConcurrentHashMap — what's the real difference?",
        "What is the difference between HashMap, ConcurrentHashMap and Hashtable?",
        "Why can HashMap be dangerous in concurrent applications?",
        "Difference between HashMap and ConcurrentHashMap.",
        "Different between HashMap vs ConcurrentHashMap?",
      ],
      pt: locale(
        "Separe os três em uma frase cada e depois gaste o tempo no que ConcurrentHashMap não faz: ele não torna mágica uma sequência check-then-act. Dê o método atômico certo, `compute` ou `putIfAbsent`. Hashtable deve aparecer só como legado.",
        [
          paragraph("`HashMap` é a implementação para uma thread. Permite uma chave null, não sincroniza e o iterator é fail-fast. Usar o mesmo mapa em várias threads sem lock externo é data race: atualização perdida e estrutura corrompida. No Java 7, o resize concorrente podia até prender uma thread num ciclo; no Java 8 esse laço clássico não é o mesmo bug, mas o uso concorrente continua proibido. Eu não minimizo isso."),
          paragraph("`Hashtable` é a versão antiga: todo método é `synchronized`, null é proibido, e o lock é no mapa inteiro. Não uso em código novo."),
          paragraph("`ConcurrentHashMap` permite leitura e escrita concorrentes sem travar o mapa todo. No Java 8 a trava é por bucket, com CAS na posição vazia. Não aceita null, porque null se confunde com ausência. O iterator é fracamente consistente: não lança `ConcurrentModificationException` e não garante uma foto instantânea perfeita. `size` é uma aproximação."),
          paragraph("O ponto que o entrevistador espera: operações compostas continuam por sua conta. `if (!map.containsKey(k)) map.put(k, v)` perde para duas threads mesmo no mapa concorrente. O substituto é `putIfAbsent`, `compute` ou `merge`. Várias chaves que precisam mudar juntas pedem outra coordenação, não só essa classe."),
        ],
        [
          "HashMap é single-thread; uso concorrente corrompe dados",
          "Hashtable é legado com lock no mapa inteiro",
          "ConcurrentHashMap trava o bucket, não a ação composta",
          "putIfAbsent, compute ou merge para o check-then-act",
        ],
        "Não diga que trocar para ConcurrentHashMap elimina toda condição de corrida do seu código. Ele protege cada operação do mapa, não a regra de negócio em volta.",
      ),
      en: locale(
        "Give one sentence for each class, then spend the time on what ConcurrentHashMap does not do: it does not make a check-then-act atomic. Name putIfAbsent, compute, or merge. Mention Hashtable only as legacy.",
        [
          paragraph("HashMap is the single-thread map. It allows one null key, has no synchronization, and its iterator is fail-fast. Sharing it across threads without an external lock is a data race: lost updates and a corrupted structure. Java 7 could infinite-loop during a concurrent resize; that classic loop is not the Java 8 bug, but concurrent use is still illegal."),
          paragraph("Hashtable synchronizes every method, forbids null, and locks the entire map. I do not use it in new code."),
          paragraph("ConcurrentHashMap allows concurrent reads and writes without a map-wide lock. Since Java 8 the lock is per bucket, with CAS for an empty bin. Null is forbidden because it cannot be distinguished from absence. Iterators are weakly consistent: no ConcurrentModificationException and no perfect snapshot. `size` is an approximation."),
          paragraph("Compound actions are still the caller's job. `containsKey` followed by `put` races on a concurrent map too. Use `putIfAbsent`, `compute`, or `merge`. Updates that must cover several keys need a wider protocol than this class."),
        ],
        [
          "HashMap is single-threaded and unsafe to share",
          "Hashtable is a legacy fully synchronized map",
          "ConcurrentHashMap locks the bin, not your business check-then-act",
          "Use putIfAbsent, compute, or merge",
        ],
        "Do not say switching to ConcurrentHashMap removes every race in the surrounding business logic.",
      ),
    },
  ],
};
