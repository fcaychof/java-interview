import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { systemDesignTheory } from "../theory/system-design";

export const systemDesign: InterviewSection = {
  id: "system-design",
  order: 16,
  titles: {
    pt: "Desenho: transferência e volume",
    en: "Design: transfers and volume",
  },
  summaries: {
    pt: "O ledger, a saga quando o dinheiro atravessa serviços, a ordem por conta e o que segura 100 mil mensagens por segundo.",
    en: "The ledger, the saga when money crosses services, per-account order, and what holds 100,000 messages per second.",
  },
  theory: systemDesignTheory,
  questions: [
    {
      id: "fund-transfer-design",
      conceptId: "def-ledger",
      difficulty: "senior",
      speakSeconds: 150,
      titles: {
        pt: "Como eu desenharia uma transferência que aguenta milhões de transações?",
        en: "How would you design a fund transfer system for millions of transactions?",
      },
      covers: [
        "Design a fund transfer system capable of handling millions of transactions.",
        "Which design would you use to avoid duplicate transactions and ensure correct processing?",
      ],
      pt: locale(
        "Comece pelos invariantes, não pelas caixas: não perder dinheiro, não duplicar, não negativar, e saber explicar cada estado. Mantenha débito e crédito na mesma transação enquanto couberem no mesmo ledger. Kafka fica na borda, para o que reage ao fato, não como substituto do saldo.",
        [
          paragraph("O núcleo é um ledger de partidas dobradas. Cada transferência grava o débito e o crédito na mesma transação do Postgres, com a sentença condicional que recusa saldo insuficiente, a constraint de não negativar, e a chave idempotente do cliente. Enquanto as duas contas moram nesse banco, eu não distribuo o saldo. Milhões de transações cabem num Postgres bem partido por conta, com a escrita curta e a leitura de extrato em réplica ou em projeção."),
          paragraph("A API é stateless. Ela valida, grava a transferência uma vez e responde. Notificação, fraude e extrato consomem o evento publicado por outbox, na mesma transação da escrita. Reprocessar o evento não move saldo de novo, porque o consumer tem inbox. Um job de reconciliação compara a soma do ledger com o que os consumidores acharam que aconteceu."),
          paragraph("Eu só quebro as contas em serviços diferentes quando um limite real obriga: outro país, outro produto, outro banco. Aí o caminho vira saga, com estado explícito. Escalar o desenho errado, doze microsserviços para um saldo, multiplica duplicata e compensação sem aumentar a correção."),
        ],
        [
          "Invariantes primeiro: sem perda, sem duplicata, sem saldo negativo",
          "Ledger e as duas pernas na mesma transação, enquanto o banco for o mesmo",
          "Outbox para o resto; saga só quando o saldo não cabe junto",
        ],
        "Não comece com um microsserviço por verbo. Também não ponha o saldo no Redis.",
      ),
      en: locale(
        "Start from the invariants, not the boxes: do not lose money, do not duplicate it, do not go negative, and be able to explain every state. Keep the debit and the credit in one transaction for as long as they fit in one ledger. Kafka sits at the edge, for what reacts to the fact, not as a replacement for the balance.",
        [
          paragraph("The core is a double-entry ledger. Each transfer writes the debit and the credit in the same Postgres transaction, with the conditional statement that refuses insufficient funds, the non-negative constraint, and the client's idempotency key. As long as both accounts live in that database, I do not distribute the balance. Millions of transactions fit in a Postgres partitioned by account, with a short write and the statement read on a replica or a projection."),
          paragraph("The API is stateless. It validates, records the transfer once, and responds. Notification, fraud, and statements consume the event published through an outbox, in the same transaction as the write. Reprocessing the event does not move the balance again, because the consumer has an inbox. A reconciliation job compares the ledger sum with what the consumers believe happened."),
          paragraph("I split accounts across services only when a real boundary forces it: another country, another product, another bank. Then the path becomes a saga, with explicit state. Scaling the wrong design, twelve microservices for one balance, multiplies duplicates and compensation without making the result more correct."),
        ],
        [
          "Invariants first: no loss, no duplicate, no negative balance",
          "One ledger and both legs in one transaction, while the database is the same",
          "An outbox for the rest; a saga only when the balances cannot live together",
        ],
        "Do not start with a microservice per verb. Do not put the balance in Redis.",
      ),
    },
    {
      id: "saga-transfer",
      conceptId: "def-saga",
      difficulty: "senior",
      speakSeconds: 120,
      titles: {
        pt: "Como a saga conduz uma transferência entre serviços?",
        en: "How does a saga run a fund transfer?",
      },
      covers: [
        "Explain how the Saga pattern can be used for fund transfer.",
        "Explain the architecture/flow of a Saga-based fund transfer system.",
      ],
      pt: locale(
        "Diga que saga é uma sequência de transações locais com compensação, não um 2PC. Eu prefiro orquestração para dinheiro porque o estado fica num lugar só. Conte os passos e o que o crash encontra no banco.",
        [
          paragraph("Cada passo commita no seu próprio serviço. Não há rollback global. Se um passo seguinte falha, um passo novo desfaz o efeito, em vez de desfazer o commit antigo. Para transferência, eu uso um orquestrador com a linha da transferência, porque o estado pendente precisa ser consultável. Coreografia, cada serviço reagindo ao evento do anterior, funciona, mas o fluxo fica espalhado e a operação sofre para responder onde o dinheiro parou."),
          paragraph("O cliente manda a transferência com a chave idempotente. O orquestrador grava pendente e, na mesma transação, o outbox do comando de débito. O serviço da conta A debita com a sentença condicional e responde debitado, ou recusa por saldo. Se debitou, o orquestrador pede o crédito em B. Se B credita, a transferência fecha. Se B falha ou o prazo estoura, o orquestrador pede a compensação: creditar A de volta, com outra chave idempotente. O estado visível é pendente, debitada, concluída ou compensada."),
          paragraph("Crash em qualquer ponto deixa uma linha e um outbox. O publicador continua. Um varredor pega transferência pendente além do prazo e consulta os dois serviços antes de compensar, para não devolver um dinheiro que na verdade creditou. Os handlers são idempotentes, porque o comando chega duas vezes."),
        ],
        [
          "Transações locais mais compensação, não XA",
          "Orquestrador com estado: debitar, creditar, compensar",
          "Outbox, prazo e handler idempotente",
        ],
        "Não chame a saga de transação distribuída que volta tudo sozinha. A compensação é uma escrita nova, e ela também pode falhar.",
      ),
      en: locale(
        "Say a saga is a sequence of local transactions with compensation, not 2PC. I prefer orchestration for money because the state lives in one place. Walk the steps and what a crash finds in the database.",
        [
          paragraph("Each step commits in its own service. There is no global rollback. If a later step fails, a new step undoes the effect, instead of undoing the old commit. For a transfer I use an orchestrator with the transfer row, because the pending state has to be queryable. Choreography, each service reacting to the previous event, works, but the flow is scattered and operations suffer to answer where the money stopped."),
          paragraph("The client sends the transfer with the idempotency key. The orchestrator records pending and, in the same transaction, the outbox row for the debit command. Account A's service debits with the conditional statement and replies debited, or refuses for insufficient funds. If it debited, the orchestrator asks for the credit on B. If B credits, the transfer completes. If B fails or the deadline passes, the orchestrator asks for compensation: credit A back, with another idempotency key. The visible states are pending, debited, completed, or compensated."),
          paragraph("A crash at any point leaves a row and an outbox. The publisher continues. A scanner picks up a transfer pending past the deadline and asks both services before compensating, so it does not return money that actually credited. Handlers are idempotent, because the command arrives twice."),
        ],
        [
          "Local transactions plus compensation, not XA",
          "An orchestrator with state: debit, credit, compensate",
          "An outbox, a deadline, and an idempotent handler",
        ],
        "Do not call the saga a distributed transaction that undoes everything by itself. Compensation is a new write, and it can fail too.",
      ),
    },
    {
      id: "ordering",
      conceptId: "def-ordering",
      difficulty: "senior",
      speakSeconds: 80,
      titles: {
        pt: "Como eu garanto a ordem das transações de uma conta?",
        en: "How do you keep one account's transactions in order?",
      },
      covers: [
        "How would you ensure transactions for an account are processed in order?",
        "How would Kafka partitions help with ordering?",
      ],
      pt: locale(
        "Ordem por conta, não ordem global. A chave da partição é o id da conta, e um consumer só trata aquela partição. Duas contas na mesma transferência não cabem numa partição só; a ordem entre elas volta para o lock ordenado ou para a saga.",
        [
          paragraph("Eu não prometo ordem do sistema inteiro. Isso seria uma partição só, e o volume morre ali. A ordem que o negócio pede é por conta: dois débitos da mesma conta não podem ser aplicados fora da sequência em que foram aceitos."),
          paragraph("No Kafka, a chave da mensagem é o id da conta. Tudo daquela conta cai na mesma partição, e o grupo entrega a partição a um consumer, que processa em ordem de offset. Outra conta em outra partição anda em paralelo. Aumentar consumer além das partições não cria ordem nem paralelismo novo."),
          paragraph("Uma transferência mexe em duas contas, logo em duas partições. A ordem entre A e B não vem do Kafka. No mesmo banco, os locks seguem a ordem de id. Na saga, o orquestrador é quem serializa os passos daquela transferência. Se eu precisar da posição exata do saldo, ela continua sendo a linha no ledger, não o offset."),
        ],
        [
          "Ordem por chave, não ordem global",
          "Partição da conta e um consumer por vez",
          "Duas contas: lock ordenado ou orquestrador, não uma partição mágica",
        ],
        "Não diga que o tópico inteiro é ordenado. Também não use uma partição única para ter ordem global.",
      ),
      en: locale(
        "Order per account, not global order. The partition key is the account id, and one consumer handles that partition. Two accounts in one transfer do not fit in a single partition; the order between them goes back to an ordered lock or to the saga.",
        [
          paragraph("I do not promise order for the whole system. That would be a single partition, and the volume dies there. The order the business needs is per account: two debits of the same account cannot be applied out of the sequence in which they were accepted."),
          paragraph("On Kafka, the message key is the account id. Everything for that account lands on the same partition, and the group gives the partition to one consumer, which processes it in offset order. Another account on another partition runs in parallel. More consumers than partitions create neither order nor new parallelism."),
          paragraph("A transfer touches two accounts, therefore two partitions. The order between A and B does not come from Kafka. In the same database, locks follow id order. In the saga, the orchestrator is what serializes the steps of that transfer. If I need the exact balance, it is still the ledger row, not the offset."),
        ],
        [
          "Order by key, not global order",
          "The account partition and one consumer at a time",
          "Two accounts: an ordered lock or the orchestrator, not a magic partition",
        ],
        "Do not say the whole topic is ordered. Do not use a single partition to buy global order.",
      ),
    },
    {
      id: "database-choice",
      conceptId: "def-database-choice",
      difficulty: "senior",
      speakSeconds: 70,
      titles: {
        pt: "Qual banco eu escolheria para o saldo, e por quê?",
        en: "Which database would you choose for the balance, and why?",
      },
      covers: ["Which database would you choose and why?"],
      pt: locale(
        "Responda Postgres, e diga a propriedade que você está comprando: transação, lock de linha, constraint e índice único. Mencione quando um NewSQL entraria, e o que não é banco de saldo.",
        [
          paragraph("Para o ledger eu escolho Postgres. Preciso de uma transação que grave as duas pernas ou nenhuma, de `UPDATE` condicional com lock de linha, de `CHECK` para saldo, e de índice único para a chave idempotente. O time sabe operar backup, réplica e explain. MySQL InnoDB também entrega isso; eu não transformo a escolha em guerra, e digo que o critério é ACID maduro, não o logotipo."),
          paragraph("NewSQL, como Spanner ou Cockroach, entra se a escrita precisa ser global, forte e horizontal ao mesmo tempo, e o negócio aceita a latência e o custo. Não é o primeiro passo de um ledger que ainda cabe partido por conta num Postgres."),
          paragraph("Redis não guarda saldo. Ele pode guardar a chave idempotente na frente, com TTL, desde que a constraint do banco continue sendo a barreira. Documento ou evento sem transação entre as duas contas não fecha o invariante."),
        ],
        [
          "Postgres pelo ACID, pelo lock e pela constraint",
          "NewSQL só com escrita global de verdade",
          "Redis não é o ledger",
        ],
        "Não escolha o banco pela moda do diagrama. Diga qual invariante ele sustenta.",
      ),
      en: locale(
        "Answer Postgres, and name the property you are buying: a transaction, a row lock, a constraint, and a unique index. Mention when a NewSQL database would enter, and what is not a balance database.",
        [
          paragraph("For the ledger I choose Postgres. I need one transaction that writes both legs or neither, a conditional UPDATE with a row lock, a CHECK on the balance, and a unique index for the idempotency key. The team knows how to operate backup, replica, and explain. MySQL InnoDB also delivers this; I do not turn the choice into a war, and I say the criterion is mature ACID, not the logo."),
          paragraph("A NewSQL database, such as Spanner or Cockroach, enters when the write truly has to be global, strong, and horizontal at the same time, and the business accepts the latency and the cost. It is not the first step for a ledger that still fits, partitioned by account, in Postgres."),
          paragraph("Redis does not hold the balance. It can hold the idempotency key in front, with a TTL, as long as the database constraint remains the barrier. A document or an event without a transaction across the two accounts does not close the invariant."),
        ],
        [
          "Postgres for ACID, the lock, and the constraint",
          "NewSQL only for a genuinely global write",
          "Redis is not the ledger",
        ],
        "Do not pick the database by the fashion of the diagram. Say which invariant it holds.",
      ),
    },
    {
      id: "kafka-throughput",
      conceptId: "def-kafka-throughput",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Como eu processaria 100 mil mensagens por segundo no Kafka?",
        en: "How would you process 100,000 messages per second in Kafka?",
      },
      covers: [
        "How would you process 1 lakh messages/second in Kafka?",
      ],
      pt: locale(
        "Traduza 1 lakh para 100 mil e confirme o tamanho da mensagem, porque o limite pode ser rede e não contagem. O desenho é partição suficiente, lote, e consumer que não faz uma chamada remota por mensagem. Chave quente derruba a conta.",
        [
          paragraph("Cem mil por segundo é desenho de pipeline, não de um listener que abre transação por mensagem. Primeiro eu pergunto o tamanho do payload. Mensagem de 1 KB e mensagem de 100 KB não cabem no mesmo cluster."),
          paragraph("No producer, lote, `linger.ms`, compressão e idempotência. `acks=all` quando a perda não é aceitável, sabendo o custo. A chave não pode concentrar tudo numa partição. O número de partições cobre o paralelismo dos consumers, com folga para rebalance, sem transformar cada partição num arquivo minúsculo demais."),
          paragraph("No consumer, um por partição no grupo, processamento em lote e escrita em lote no banco. Efeito idempotente, porque vai haver reentrega. Eu não faço HTTP síncrono por mensagem nesse volume. O broker vive de page cache e disco sequencial; consumer que não acompanha perde o cache e o lag vira problema de disco. A métrica é lag por partição, handler idle e partição sub-replicada. Exatamente uma vez de ponta a ponta só entra se a medida mostrar que a inbox não basta."),
        ],
        [
          "Confirmar o tamanho; 100 mil mensagens não é 100 mil iguais",
          "Partição, lote, compressão e chave que espalha",
          "Consumer em lote, sem uma chamada remota por mensagem",
        ],
        "Não prometa o número sem partição, lote e uma chave que não esquente. Uma partição não chega lá.",
      ),
      en: locale(
        "Translate 1 lakh to 100,000 and confirm the message size, because the limit may be the network and not the count. The design is enough partitions, batching, and a consumer that does not make a remote call per message. A hot key breaks the arithmetic.",
        [
          paragraph("One hundred thousand per second is a pipeline design, not a listener that opens a transaction per message. First I ask the payload size. A 1 KB message and a 100 KB message do not fit the same cluster."),
          paragraph("On the producer: batches, linger.ms, compression, and idempotence. acks=all when loss is unacceptable, knowing the cost. The key must not concentrate everything on one partition. The partition count covers the consumers' parallelism, with room for rebalance, without turning every partition into a tiny file."),
          paragraph("On the consumer: one per partition in the group, batch processing, and batch writes to the database. An idempotent effect, because there will be redelivery. I do not do synchronous HTTP per message at this volume. The broker lives on the page cache and sequential disk; a consumer that falls behind loses the cache and the lag becomes a disk problem. The metrics are lag per partition, handler idle, and under-replicated partitions. End-to-end exactly once only enters if measurement shows the inbox is not enough."),
        ],
        [
          "Confirm the size; 100,000 messages are not 100,000 identical ones",
          "Partitions, batches, compression, and a key that spreads",
          "A batched consumer, with no remote call per message",
        ],
        "Do not promise the number without partitions, batches, and a key that does not run hot. One partition will not get there.",
      ),
    },
  ],
};
