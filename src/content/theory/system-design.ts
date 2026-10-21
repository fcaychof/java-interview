import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const systemDesignTheory: readonly TheoryGroup[] = [
  theoryGroup("design-theory", "Desenho", "Design", [
    concept(
      "def-ledger",
      "Ledger de transferência",
      "A transfer ledger",
      [
        paragraph("Transferência em um banco é uma transação: debita uma conta, credita a outra, grava o lançamento. O saldo pode ser a soma do razão, não um número solto que alguém atualiza. O lançamento é imutável. Correção é outro lançamento. Isso deixa auditoria e reconstrói o saldo."),
        paragraph("Milhões de transações pedem escrita que não briga na mesma linha o tempo todo, partição por conta, e leitura de saldo que não varre o histórico a cada GET. O saldo materializado existe, atualizado na mesma transação do lançamento, e o razão continua sendo a fonte. Idempotência na entrada segura o retry do cliente."),
      ],
      [
        paragraph("A transfer in one database is one transaction: debit one account, credit the other, write the posting. The balance can be the sum of the ledger, not a loose number someone updates. The posting is immutable. A correction is another posting. That leaves an audit and rebuilds the balance."),
        paragraph("Millions of transactions need a write that does not fight on the same row all the time, partitioning by account, and a balance read that does not scan the history on every GET. A materialized balance exists, updated in the same transaction as the posting, and the ledger stays the source. Idempotency at the door holds the client's retry."),
      ],
    ),
    concept(
      "def-saga",
      "Saga",
      "Saga",
      [
        paragraph("Saga é uma sequência de transações locais, cada uma no seu serviço, com uma compensação para cada passo que já commitou. Não é uma transação distribuída com lock em dois bancos. O orquestrador guarda o estado da transferência e decide o próximo passo. Coreografia deixa cada serviço reagir ao evento do anterior."),
        paragraph("Compensação não é undo mágico. Estornar é um crédito novo, idempotente, não um delete. Passo que não confirma fica em dúvida até uma consulta. Timeout sem consulta duplica o débito. O estado explícito, pendente, debitado, creditado, compensado, é o que permite retomar depois que o processo caiu."),
      ],
      [
        paragraph("A saga is a sequence of local transactions, each in its own service, with a compensation for every step that already committed. It is not a distributed transaction with a lock on two databases. The orchestrator keeps the transfer state and decides the next step. Choreography lets each service react to the previous one's event."),
        paragraph("Compensation is not a magic undo. A reversal is a new credit, idempotent, not a delete. A step that does not confirm stays in doubt until a query. A timeout without a query duplicates the debit. The explicit state, pending, debited, credited, compensated, is what lets you resume after the process died."),
      ],
    ),
    concept(
      "def-ordering",
      "Ordem por conta",
      "Order per account",
      [
        paragraph("A ordem que importa é a da conta, não a do mundo. Dois débitos da mesma conta não podem ser aplicados fora da sequência em que foram aceitos, senão o saldo passa por um estado que nunca existiu. Contas diferentes andam em paralelo."),
        paragraph("Na fila, a chave de partição é a conta. Tudo daquela conta cai na mesma partição, e um consumer aplica em ordem. No banco, a linha da conta ou a sequência do lançamento serializa. Relógio de parede entre serviços não ordena: o clock desvia. A sequência é um número que a conta emite, ou a ordem do log da partição."),
      ],
      [
        paragraph("The order that matters is the account's, not the world's. Two debits on the same account cannot be applied out of the sequence in which they were accepted, or the balance passes through a state that never existed. Different accounts move in parallel."),
        paragraph("On the queue, the partition key is the account. Everything for that account lands on the same partition, and one consumer applies it in order. In the database, the account row or the posting sequence serializes. A wall clock between services does not order: the clock drifts. The sequence is a number the account issues, or the order of the partition log."),
      ],
    ),
    concept(
      "def-database-choice",
      "Banco para o saldo",
      "A database for the balance",
      [
        paragraph("Saldo pede transação, integridade e leitura consistente do que acabou de ser escrito. Banco relacional encaixa: a linha da conta, o lançamento, a constraint que não deixa o saldo negativo, o índice pela conta. O modelo é conhecido e a operação é SQL."),
        paragraph("Documento ou chave-valor entra quando o acesso é por chave, o agregado é lido inteiro, e a transação entre agregados não é o centro. Colunar entra em análise, não no débito do caminho quente. Eu não escolho o banco pela moda. Escolho por consistência do saldo, pelo padrão de leitura, e por como a operação recupera um nó."),
      ],
      [
        paragraph("A balance wants a transaction, integrity, and a consistent read of what was just written. A relational database fits: the account row, the posting, the constraint that does not let the balance go negative, the index by account. The model is familiar and the operation is SQL."),
        paragraph("A document or key-value store earns its place when access is by key, the aggregate is read whole, and a transaction across aggregates is not the center. Columnar storage earns its place in analytics, not on the hot-path debit. I do not pick the database by fashion. I pick it by balance consistency, by the read pattern, and by how the operation recovers a node."),
      ],
    ),
    concept(
      "def-kafka-throughput",
      "Volume no Kafka",
      "Kafka volume",
      [
        paragraph("Cem mil mensagens por segundo saem de partição, batch e consumer que não faz I/O bobo por mensagem. Cada partição é um paralelo. A chave espalha, senão uma partição segura o número e as outras ficam vazias. O produtor agrupa em batch. O consumer processa em lote quando o efeito permite, e não abre uma transação nova com fsync por mensagem se dá para agrupar com segurança."),
        paragraph("Ack e replicação custam latência de escrita e compram durabilidade. all espera as réplicas. Para pagamento eu pago esse custo. Aumentar partição depois muda a ordem de quem já estava numa partição, então o número nasce do throughput desejado, não de um default de três. Medir lag por partição diz se o desenho segurou."),
      ],
      [
        paragraph("A hundred thousand messages a second come from partitions, batches, and a consumer that does not do silly I/O per message. Each partition is one parallel lane. The key spreads, otherwise one partition holds the number and the others stay empty. The producer groups into batches. The consumer processes in batches when the effect allows it, and does not open a new transaction with an fsync per message if it can group safely."),
        paragraph("Acks and replication cost write latency and buy durability. all waits for the replicas. For a payment I pay that cost. Adding partitions later changes the order of whoever was already on a partition, so the number is born from the throughput you want, not from a default of three. Measuring lag per partition says whether the design held."),
      ],
    ),
  ]),
];
