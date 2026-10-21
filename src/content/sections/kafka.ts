import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { kafkaTheory } from "../theory/kafka";

export const kafka: InterviewSection = {
  id: "kafka",
  order: 11,
  titles: {
    pt: "Kafka",
    en: "Kafka",
  },
  summaries: {
    pt: "Como contar experiência sem inventar, o que é um grupo, e por que a mesma mensagem chega duas vezes.",
    en: "How to talk about experience without inventing it, what a group is, and why the same message arrives twice.",
  },
  theory: kafkaTheory,
  questions: [
    {
      id: "kafka-experience",
      conceptId: "def-kafka",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Como respondo se já trabalhei com Kafka?",
        en: "How do you answer whether you have worked with Kafka?",
      },
      covers: ["Have you worked with Kafka?"],
      pt: locale(
        "Não responda só sim ou não. Se você operou, conte um fluxo real em quatro frases: tópico, chave, grupo, o que acontecia na falha. Se você só estudou, diga isso e mostre o modelo mental. Inventar cluster em produção quebra na pergunta seguinte.",
        [
          paragraph("Quando eu usei Kafka de verdade, eu conto o caso, não a definição. Qual era o evento, qual era a chave da partição, quantos consumers no grupo, se o commit era depois de persistir o efeito, e um incidente concreto: lag, rebalance ou mensagem duplicada. O resultado fecha a história, por exemplo o consumer passou a gravar o id do evento na mesma transação e o reprocessamento deixou de duplicar pedido."),
          paragraph("Se a experiência é de estudo ou de um producer pequeno, eu digo isso com clareza. Eu explico partição, offset e grupo, e o que eu ainda não operei, como um cluster multi-datacenter. Entrevistador prefere esse limite a um sim que não segura um detalhe de `max.poll.interval.ms`."),
        ],
        [
          "Caso real: evento, chave, grupo, falha e correção",
          "Se não operou, diga o que sabe e o que não operou",
          "A pergunta seguinte testa o detalhe, não o sim",
        ],
        "Não invente volume, cluster ou cargo. A pergunta sobre lag ou commit logo em seguida denuncia.",
      ),
      en: locale(
        "Do not answer only yes or no. If you operated it, tell one real flow in four sentences: topic, key, group, and what happened on failure. If you only studied it, say so and show the mental model. An invented production cluster collapses on the next question.",
        [
          paragraph("When I have actually used Kafka, I tell the case, not the definition. What the event was, what the partition key was, how many consumers were in the group, whether the offset was committed after the effect was persisted, and one concrete incident: lag, a rebalance, or a duplicate. The result closes it, for example the consumer started storing the event id in the same transaction and reprocessing stopped creating duplicate orders."),
          paragraph("If the experience is study or a small producer, I say that plainly. I explain partition, offset, and group, and I name what I have not operated, such as a multi-datacenter cluster. An interviewer prefers that boundary to a yes that cannot hold a detail like max.poll.interval.ms."),
        ],
        [
          "A real case: event, key, group, failure, and fix",
          "If you have not operated it, say what you know and what you have not run",
          "The next question tests the detail, not the yes",
        ],
        "Do not invent volume, a cluster, or a role. The follow-up on lag or commit exposes it.",
      ),
    },
    {
      id: "spring-kafka-and-groups",
      conceptId: "def-kafka",
      difficulty: "pleno",
      speakSeconds: 90,
      titles: {
        pt: "O que é Spring Kafka, um consumer e um consumer group?",
        en: "What are Spring Kafka, a consumer, and a consumer group?",
      },
      covers: [
        "What is Spring Kafka, and why is it used?",
        "What is a Kafka Consumer?",
        "What is a Consumer Group?",
      ],
      pt: locale(
        "Defina os três em sequência, do protocolo para o framework. Spring Kafka é o adapter, não um broker diferente. O grupo é a unidade de paralelismo e de offset.",
        [
          paragraph("Um consumer lê registros de partições de um tópico, na ordem do offset daquela partição. Ele guarda até onde processou. Sozinho, um consumer pode assinar várias partições, mas uma partição não é lida em paralelo por dois consumers do mesmo grupo."),
          paragraph("Consumer group é o conjunto de consumers com o mesmo `group.id`. O Kafka divide as partições entre eles. Cada partição fica com no máximo um consumer do grupo, então a ordem dentro da partição se mantém. Se há mais consumers do que partições, o excedente fica ocioso. Se um cai, o grupo rebalanceia e outro assume as partições dele. Cada grupo tem o próprio offset: dois grupos leem o mesmo tópico sem disputar."),
          paragraph("Spring Kafka é a integração com o container do Spring. `@KafkaListener` registra o método, o `ConcurrentKafkaListenerContainerFactory` define concorrência, deserializer e o modo de ack. `DefaultErrorHandler` com retry e dead-letter tira a mensagem venenosa do caminho sem parar a partição para sempre. Eu ainda entendo o commit por baixo: o framework não muda a semântica at-least-once se o processo morre depois do efeito e antes do commit."),
        ],
        [
          "Consumer lê offset de partição, em ordem",
          "No grupo, uma partição tem no máximo um consumer",
          "Spring Kafka configura listener, concorrência, ack e erro",
        ],
        "Não diga que o consumer group é um conjunto de tópicos. O grupo é um conjunto de leitores, e o offset é dele.",
      ),
      en: locale(
        "Define the three in order, from the protocol to the framework. Spring Kafka is the adapter, not a different broker. The group is the unit of parallelism and of the offset.",
        [
          paragraph("A consumer reads records from partitions of a topic, in offset order on that partition. It records how far it has processed. One consumer can own several partitions, but one partition is not read in parallel by two consumers in the same group."),
          paragraph("A consumer group is the set of consumers that share a group.id. Kafka divides the partitions among them. Each partition goes to at most one consumer in the group, so order inside the partition holds. If there are more consumers than partitions, the extra ones sit idle. If one dies, the group rebalances and another takes its partitions. Each group has its own offset: two groups read the same topic without competing."),
          paragraph("Spring Kafka is the Spring integration. @KafkaListener registers the method, and ConcurrentKafkaListenerContainerFactory sets concurrency, the deserializer, and the ack mode. DefaultErrorHandler with retry and a dead letter removes a poison message without stalling the partition forever. I still understand the commit underneath: the framework does not change at-least-once semantics if the process dies after the effect and before the commit."),
        ],
        [
          "A consumer reads a partition's offsets, in order",
          "Inside a group, a partition has at most one consumer",
          "Spring Kafka sets the listener, concurrency, ack, and errors",
        ],
        "Do not say a consumer group is a set of topics. The group is a set of readers, and the offset belongs to it.",
      ),
    },
    {
      id: "partition-assignment",
      conceptId: "def-partitions",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Como as partições são atribuídas, e outro grupo pode ler a mesma?",
        en: "How are partitions assigned, and can another group read the same one?",
      },
      covers: [
        "How are Kafka partitions assigned to consumers within a Consumer Group?",
        "Can the same Kafka partition be consumed by consumers from different Consumer Groups?",
        "How would Kafka partitions help with ordering?",
      ],
      pt: locale(
        "Responda as duas perguntas na abertura: dentro do grupo, uma partição para um consumer; entre grupos, a mesma partição é lida por cada grupo. Depois fale de rebalance e de ordem por chave.",
        [
          paragraph("Quando o grupo sobe ou um membro entra ou sai, o coordinator dispara um rebalance. O assignor distribui as partições. Os clássicos são range e round-robin. Em produção eu prefiro o cooperative sticky: ele tira só as partições que precisam mudar de dono, em vez de parar o grupo inteiro. Durante um rebalance agressivo o consumo para, e isso aparece como lag."),
          paragraph("Sim, outro consumer group lê a mesma partição ao mesmo tempo. Cada um tem o próprio offset. É assim que pagamento alimenta fraude, extrato e notificação sem um serviço consumir no lugar do outro."),
          paragraph("Ordem vale dentro da partição, não no tópico. Se a chave é o id da conta, todos os eventos daquela conta caem na mesma partição e um único consumer do grupo os vê em ordem. Eventos de contas diferentes, em partições diferentes, não têm ordem global. Eu não prometo ordem do tópico inteiro."),
        ],
        [
          "Um dono por partição dentro do grupo",
          "Grupos diferentes leem a mesma partição com offsets próprios",
          "Chave da conta dá ordem por conta, não ordem global",
        ],
        "Não diga que aumentar consumers além do número de partições aumenta o paralelismo daquele grupo.",
      ),
      en: locale(
        "Answer both questions up front: inside the group, one partition goes to one consumer; across groups, every group reads that partition. Then mention rebalance and order by key.",
        [
          paragraph("When the group starts or a member joins or leaves, the coordinator runs a rebalance. The assignor distributes partitions. The classics are range and round-robin. In production I prefer cooperative sticky: it moves only the partitions that need a new owner, instead of stopping the whole group. An aggressive rebalance pauses consumption and shows up as lag."),
          paragraph("Yes, another consumer group reads the same partition at the same time. Each has its own offset. That is how payments can feed fraud, statements, and notification without one service consuming in place of another."),
          paragraph("Order holds inside a partition, not across the topic. If the key is the account id, every event for that account lands on the same partition and one consumer in the group sees them in order. Events for different accounts have no global order. I do not promise order for the whole topic."),
        ],
        [
          "One owner per partition inside the group",
          "Different groups read the same partition with their own offsets",
          "An account key orders that account, not the world",
        ],
        "Do not say that more consumers than partitions increases parallelism for that group.",
      ),
    },
    {
      id: "duplicate-kafka-delivery",
      conceptId: "def-kafka-delivery",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "A mensagem de pagamento chegou duas vezes. Como o consumer fica idempotente?",
        en: "A payment message was delivered twice. How do you make the consumer idempotent?",
      },
      covers: [
        "A Kafka message is consumed twice. How do you make the consumer idempotent?",
        "What happens if a Kafka payment event is delivered twice?",
      ],
      pt: locale(
        "Diga que entrega duplicada é o contrato normal, at-least-once, não um bug raro. Separe producer idempotente de consumer idempotente. A garantia é gravar o id do evento e o efeito na mesma transação.",
        [
          paragraph("O default do consumer é pelo menos uma vez. Se o processo aplica o pagamento e morre antes de commitar o offset, o próximo dono da partição lê de novo. Se o offset é commitado antes de aplicar, o crash perde a mensagem. Eu escolho aplicar e depois commitar, e trato a duplicata."),
          paragraph("Idempotência do producer, `enable.idempotence`, evita que o retry do producer grave o mesmo registro duas vezes no log. Não impede o consumer de ver o mesmo registro de novo. São problemas diferentes."),
          paragraph("No consumer, o id do evento entra numa tabela inbox com constraint única, na mesma transação que credita a conta. A segunda entrega quebra a constraint, ou encontra a linha já processada, e o método retorna sem creditar outra vez. Só então o offset é commitado. Se o banco e o Kafka precisam do efeito exatamente uma vez de ponta a ponta, a transação do consumer do Kafka entra nessa conversa, com o custo operacional que ela tem. Para a maioria dos pagamentos, inbox mais chave de negócio basta e é mais simples de operar."),
        ],
        [
          "At-least-once torna a segunda entrega esperada",
          "Producer idempotente não torna o consumer idempotente",
          "Inbox com o efeito, na mesma transação, antes do commit do offset",
        ],
        "Não diga que ack manual sozinho elimina duplicata. Ele só muda a janela em que a duplicata ou a perda acontece.",
      ),
      en: locale(
        "Say a duplicate delivery is the normal at-least-once contract, not a rare bug. Separate producer idempotence from consumer idempotence. The guarantee is to store the event id and the effect in the same transaction.",
        [
          paragraph("The consumer default is at least once. If the process applies the payment and dies before committing the offset, the next owner of the partition reads it again. If the offset is committed before the apply, a crash loses the message. I apply and then commit, and I handle the duplicate."),
          paragraph("Producer idempotence, enable.idempotence, stops a producer retry from appending the same record twice. It does not stop the consumer from seeing the same record again. Those are different problems."),
          paragraph("On the consumer, the event id goes into an inbox table with a unique constraint, in the same transaction that credits the account. The second delivery breaks the constraint, or finds the row already processed, and the method returns without crediting again. Only then is the offset committed. A full Kafka transaction is available when the database and the log must move exactly once, and it has an operational cost. For most payments, an inbox plus the business key is enough and simpler to run."),
        ],
        [
          "At-least-once makes the second delivery expected",
          "A idempotent producer does not make the consumer idempotent",
          "An inbox with the effect, in one transaction, before the offset commit",
        ],
        "Do not say a manual ack by itself removes duplicates. It only moves the window where a duplicate or a loss happens.",
      ),
    },
    {
      id: "consumer-lag",
      conceptId: "def-consumer-lag",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "O lag do consumer não para de subir. O que pode ser?",
        en: "Kafka consumer lag keeps increasing. What could be the reason?",
      },
      covers: ["Kafka consumer lag keeps increasing. What could be the reason?"],
      pt: locale(
        "Defina lag como offset produzido menos offset commitado, por partição. Depois dê causas em dois grupos: o consumer é lento, ou ele nem está consumindo. A ação depende de qual dos dois o gráfico mostra.",
        [
          paragraph("Lag crescendo significa que a ponta que escreve anda mais rápido do que a ponta que commita. Eu olho por partição, porque uma chave quente deixa uma partição para trás enquanto as outras estão zeradas. Mais consumer não ajuda essa partição."),
          paragraph("Se o consumer está vivo e o tempo de processamento subiu, a causa costuma ser o downstream: banco lento, HTTP dentro do listener, lote grande demais, ou GC pausando o poll. Se o consumer soma menos do que as partições, falta paralelismo, e aumentar partição é decisão que muda ordem e rebalance, não um botão inofensivo."),
          paragraph("Se o consumer não progride, eu olho rebalance em loop. `max.poll.interval.ms` estoura quando o processamento passa do prazo, o broker expulsa o membro, outro assume, e o ciclo recomeça. O sintoma é lag que sobe com log de rebalance, não com CPU alta. Mensagem venenosa sem dead-letter trava a partição no mesmo offset. Eu separo esses casos antes de pedir mais broker."),
        ],
        [
          "Lag é por partição; chave quente não escala com mais consumer",
          "Lento: downstream, lote, GC",
          "Parado: rebalance, max.poll.interval, mensagem venenosa",
        ],
        "Não responda só aumentar o número de consumers. Sem partição livre, ou com uma chave só, eles ficam ociosos.",
      ),
      en: locale(
        "Define lag as the produced offset minus the committed offset, per partition. Then give causes in two groups: the consumer is slow, or it is not consuming. The action depends on which graph you see.",
        [
          paragraph("Rising lag means the writer is moving faster than the committer. I look per partition, because a hot key leaves one partition behind while the others are at zero. Another consumer does not help that partition."),
          paragraph("If the consumer is alive and processing time rose, the cause is usually downstream: a slow database, HTTP inside the listener, a batch that is too large, or GC pausing the poll. If consumers are fewer than partitions, parallelism is short, and adding partitions changes order and rebalance; it is not a harmless button."),
          paragraph("If the consumer makes no progress, I look for a rebalance loop. max.poll.interval.ms fires when processing exceeds the deadline, the broker kicks the member, someone else takes the partition, and the cycle repeats. The symptom is rising lag with rebalance logs, not high CPU. A poison message without a dead letter sticks the partition on the same offset. I separate those cases before asking for more brokers."),
        ],
        [
          "Lag is per partition; a hot key does not scale with more consumers",
          "Slow: downstream, batch size, GC",
          "Stuck: rebalance, max.poll.interval, a poison message",
        ],
        "Do not answer only by adding consumers. Without a free partition, or with a single key, they sit idle.",
      ),
    },
  ],
};
