import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const kafkaTheory: readonly TheoryGroup[] = [
  theoryGroup("kafka-theory", "Kafka", "Kafka", [
    concept(
      "def-kafka",
      "Tópico, partição e grupo",
      "Topic, partition, and group",
      [
        paragraph("Kafka guarda mensagens num log particionado. O produtor publica num tópico. Cada partição é uma sequência ordenada num broker. O consumer lê o offset, a posição dele nesse log. Spring Kafka é a integração: listener, container e a configuração do grupo."),
        paragraph("Consumer group é o conjunto de consumers que dividem as partições de um tópico. Uma partição vai para um consumer do grupo. Dois consumers do mesmo grupo não leem a mesma partição ao mesmo tempo. Outro group id é outro grupo, e lê o log do próprio offset, a mesma mensagem, de propósito. Experiência se conta pelo que o serviço publicou e consumiu, não por uma lista de termos."),
      ],
      [
        paragraph("Kafka stores messages in a partitioned log. The producer publishes to a topic. Each partition is an ordered sequence on a broker. The consumer reads the offset, its position in that log. Spring Kafka is the integration: the listener, the container, and the group configuration."),
        paragraph("A consumer group is the set of consumers that split a topic's partitions. One partition goes to one consumer in the group. Two consumers in the same group do not read the same partition at the same time. Another group id is another group, and it reads the log from its own offset, the same message, on purpose. Experience is told by what the service published and consumed, not by a list of terms."),
      ],
    ),
    concept(
      "def-partitions",
      "Atribuição de partição",
      "Partition assignment",
      [
        paragraph("O grupo rebalanceia quando um consumer entra, sai ou falha. O protocolo entrega cada partição a um membro. Se há mais consumers do que partições, o excedente fica sem partição e sem trabalho. A ordem vale dentro da partição, não no tópico inteiro."),
        paragraph("A chave de particionamento manda mensagens da mesma conta para a mesma partição, e portanto para o mesmo consumer do grupo. Sem chave, o produtor espalha. Outro grupo não entra nesse acordo: ele tem a própria atribuição e o próprio offset. Escalar consumer sem aumentar partição não aumenta o paralelo daquele grupo."),
      ],
      [
        paragraph("The group rebalances when a consumer joins, leaves, or fails. The protocol gives each partition to one member. If there are more consumers than partitions, the extra ones sit without a partition and without work. Order holds inside the partition, not across the whole topic."),
        paragraph("The partition key sends messages of the same account to the same partition, and therefore to the same consumer in the group. Without a key, the producer spreads them. Another group is not part of that agreement: it has its own assignment and its own offset. Scaling consumers without adding partitions does not increase that group's parallelism."),
      ],
    ),
    concept(
      "def-kafka-delivery",
      "Entrega duplicada",
      "Duplicate delivery",
      [
        paragraph("At-least-once é o contrato comum. O consumer processa, e o offset só avança depois. Se ele cai no meio, ou commita antes de terminar, a mensagem volta. Exactly-once de ponta a ponta não é o default do listener. O consumer de pagamento tem de aguentar a segunda entrega."),
        paragraph("A proteção é a mesma da API: chave de idempotência, gravada na mesma transação do efeito. A segunda entrega acha a chave e não debita de novo. Commitar o offset antes do efeito perde mensagem. Efeito sem chave, com offset depois, duplica. Os dois juntos, efeito e marca de processado, fecham."),
      ],
      [
        paragraph("At-least-once is the common contract. The consumer processes, and the offset only moves forward afterwards. If it dies in the middle, or commits before finishing, the message comes back. End-to-end exactly-once is not the listener default. A payment consumer has to withstand the second delivery."),
        paragraph("The protection is the same as in the API: an idempotency key, written in the same transaction as the effect. The second delivery finds the key and does not debit again. Committing the offset before the effect loses the message. An effect with no key, offset afterwards, duplicates. The two together, effect and processed mark, close the gap."),
      ],
    ),
    concept(
      "def-consumer-lag",
      "Consumer lag",
      "Consumer lag",
      [
        paragraph("Lag é a distância entre o fim do log e o offset do grupo. Subir sem parar quer dizer que a produção entrou mais rápido do que o consumo sai. Não é, sozinho, um broker doente. Pode ser consumer lento, pouco paralelo, ou um processamento que espera rede dentro do loop."),
        paragraph("Eu olho lag por partição. Uma partição quente, por uma chave ruim, não se cura com mais consumer no grupo: a partição continua com um dono. O conserto é acelerar o handler, tirar I/O bloqueante, ou reparticionar com uma chave que espalhe. Aumentar consumer só ajuda até o número de partições, e só se o trabalho estava igualmente dividido."),
      ],
      [
        paragraph("Lag is the distance between the end of the log and the group's offset. Climbing without stopping means production came in faster than consumption goes out. It is not, by itself, a sick broker. It can be a slow consumer, too little parallelism, or processing that waits on the network inside the loop."),
        paragraph("I look at lag per partition. A hot partition, from a bad key, is not cured by more consumers in the group: the partition still has one owner. The fix is to speed up the handler, take blocking I/O out, or repartition with a key that spreads. Adding consumers only helps up to the number of partitions, and only if the work was evenly split."),
      ],
    ),
  ]),
];
