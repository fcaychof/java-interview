import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { transactionsTheory } from "../theory/transactions";

export const transactions: InterviewSection = {
  id: "transactions",
  order: 8,
  titles: {
    pt: "Transações, JPA e Hibernate",
    en: "Transactions, JPA, and Hibernate",
  },
  summaries: {
    pt: "Rollback que não acontece, propagação, isolamento, N+1 e o custo de carregar cedo demais.",
    en: "Rollbacks that do not happen, propagation, isolation, N+1, and the cost of loading too early.",
  },
  theory: transactionsTheory,
  questions: [
    {
      id: "transactional-rollback",
      conceptId: "def-transactional",
      difficulty: "pleno",
      speakSeconds: 110,
      titles: {
        pt: "O que @Transactional faz, e por que às vezes não dá rollback?",
        en: "What does @Transactional do, and why might it not roll back?",
      },
      covers: [
        "Explain @Transactional and what happens when a transaction fails halfway.",
        "What happens if an exception occurs after a DB update?",
        "Why might @Transactional not roll back?",
      ],
      pt: locale(
        "Explique o proxy em duas frases e depois a regra de rollback: RuntimeException e Error desfazem; checked exception, por padrão, commita. Os outros três furos são engolir a exceção, self-invocation e fazer outra coisa depois do commit sem perceber. É essa lista que o entrevistador está caçando.",
        [
          paragraph("`@Transactional` no método público faz o proxy abrir uma transação ao entrar e, ao sair sem erro, dar commit. A transação fica amarrada à thread. Se no meio do método uma escrita já foi para o banco e uma `RuntimeException` sai do proxy, o proxy marca rollback e nada daquela transação permanece. O cliente vê o erro; o banco volta ao estado anterior."),
          paragraph("O rollback deixa de acontecer em casos bem concretos. Exceção checada, se você não colocou `rollbackFor`, porque o default do Spring só desfaz em `RuntimeException` e `Error`. Exceção capturada dentro do método: o proxy vê retorno normal e commita, inclusive o que aconteceu antes do catch. Chamada interna `this.metodo()`: não passa no proxy, então nem há transação nova, e a anotação do método interno não existe para o Spring. Método private ou chamado por fora do bean tem o mesmo furo."),
          paragraph("Há um segundo ato perigoso. A transação commita ao sair do método. Código depois disso, ou um evento publicado sem `AFTER_COMMIT`, pode falhar com o banco já confirmado. Se a regra é tudo ou nada, a escrita e o registro do que fazer depois entram na mesma transação. Eu também não chamo HTTP dentro dela: a conexão fica presa durante a espera, e um timeout externo não desfaz sozinho o que o outro sistema já fez."),
        ],
        [
          "O proxy abre, commita ou desfaz ao sair",
          "Checked exception, catch interno e self-invocation não desfazem",
          "Depois do commit, falha seguinte não volta o banco",
        ],
        "Não diga que qualquer exceção dá rollback. O default ignora checked exception. Também não diga que a anotação funciona em método private.",
      ),
      en: locale(
        "Explain the proxy in two sentences, then the rollback rule: RuntimeException and Error roll back; a checked exception commits by default. The other three holes are swallowing the exception, self-invocation, and work after commit. That is the list they are hunting.",
        [
          paragraph("@Transactional on a public method makes the proxy open a transaction on entry and commit on a normal return. The transaction is bound to the thread. If a write already reached the database and a RuntimeException leaves the proxy, the proxy marks rollback and nothing from that transaction remains."),
          paragraph("Rollback does not happen in a few concrete cases. A checked exception, unless rollbackFor is set, because Spring's default rolls back only on RuntimeException and Error. An exception caught inside the method: the proxy sees a normal return and commits, including the work from before the catch. A this.method() call never enters the proxy, so the inner annotation does not exist for Spring. A private method has the same hole."),
          paragraph("There is a second dangerous act. The transaction commits when the method returns. Code after that, or an event published without AFTER_COMMIT, can fail with the database already committed. If the rule is all or nothing, the write and the record of what to do next belong in the same transaction. I also do not call HTTP inside it: the connection stays checked out, and an external timeout does not undo what the other system already did."),
        ],
        [
          "The proxy opens, then commits or rolls back on exit",
          "Checked exceptions, an internal catch, and self-invocation do not roll back",
          "After commit, a later failure does not undo the database",
        ],
        "Do not say any exception rolls back. The default ignores checked exceptions. Do not say the annotation works on a private method.",
      ),
    },
    {
      id: "propagation",
      conceptId: "def-propagation",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "REQUIRED, REQUIRES_NEW e NESTED: qual uso?",
        en: "REQUIRED vs REQUIRES_NEW vs NESTED?",
      },
      covers: ["REQUIRED vs REQUIRES_NEW vs NESTED?"],
      pt: locale(
        "REQUIRED é o default e quase sempre o certo. REQUIRES_NEW é outra transação de verdade, que sobrevive ao rollback de fora. NESTED é savepoint, não um segundo banco, e muita stack JPA não se comporta como o nome sugere. Diga isso antes de dar exemplo.",
        [
          paragraph("`REQUIRED` entra na transação que já existe ou abre uma se não houver. É o default. Serviço chamado por outro serviço participa do mesmo commit. Se um falha e a exceção sai, os dois desfazem. É o que eu quero numa transferência em que débito e crédito estão no mesmo banco."),
          paragraph("`REQUIRES_NEW` suspende a transação atual e abre outra, com commit independente. Eu uso para um registro de auditoria que precisa sobreviver mesmo se o negócio der rollback, e uso pouco. O efeito colateral é visibilidade: o commit interno já pode ser lido por outra thread antes do externo terminar. Se o método interno falha e o externo captura a exceção, só o interno desfaz."),
          paragraph("`NESTED` não abre outro banco. Com JDBC ele cria um savepoint. O miolo pode desfazer até o savepoint sem desfazer o que veio antes; se a transação de fora desfaz, o miolo vai junto, porque é a mesma transação. Com JPA isso depende do transaction manager e muitas vezes não é o aninhamento que o nome promete. Eu não escolho NESTED num fluxo de dinheiro sem ter visto o savepoint funcionar na stack do projeto."),
        ],
        [
          "REQUIRED junta no mesmo commit",
          "REQUIRES_NEW commita à parte e já fica visível",
          "NESTED é savepoint; confirme se a stack JPA honra isso",
        ],
        "Não diga que NESTED é um REQUIRES_NEW mais fraco. Um sobrevive ao rollback externo; o outro não.",
      ),
      en: locale(
        "REQUIRED is the default and usually right. REQUIRES_NEW is a real second transaction that survives an outer rollback. NESTED is a savepoint, not a second database, and many JPA stacks do not behave like the name suggests. Say that before the example.",
        [
          paragraph("REQUIRED joins the current transaction or opens one. It is the default. A service called by another service shares the commit. If one fails and the exception escapes, both roll back. That is what I want when the debit and the credit are in the same database."),
          paragraph("REQUIRES_NEW suspends the current transaction and opens another, with an independent commit. I use it for an audit row that must survive a business rollback, and I use it rarely. The inner commit can be visible to another thread before the outer one finishes. If the inner method fails and the outer one catches it, only the inner work rolls back."),
          paragraph("NESTED does not open another database. On JDBC it creates a savepoint. The inner block can roll back to the savepoint without undoing earlier work; if the outer transaction rolls back, the inner work goes with it, because it is the same transaction. On JPA this depends on the transaction manager and often is not the nesting the name promises. I do not pick NESTED for money without seeing the savepoint work on that stack."),
        ],
        [
          "REQUIRED shares one commit",
          "REQUIRES_NEW commits separately and becomes visible",
          "NESTED is a savepoint; verify that the JPA stack honors it",
        ],
        "Do not say NESTED is a weaker REQUIRES_NEW. One survives an outer rollback; the other does not.",
      ),
    },
    {
      id: "isolation-levels",
      conceptId: "def-isolation",
      difficulty: "senior",
      speakSeconds: 120,
      titles: {
        pt: "Como explico os níveis de isolamento com exemplo de banco?",
        en: "How do you explain transaction isolation levels with banking examples?",
      },
      covers: [
        "Explain transaction isolation levels with banking examples.",
        "What happens when two transactions update the same bank account simultaneously?",
        "How would you handle concurrency when multiple users update the same record simultaneously?",
      ],
      pt: locale(
        "Percorra os quatro níveis com um fenômeno cada, usando saldo. O fechamento que mostra senioridade: isolamento não conserta o lost update feito em Java. A escrita condicional, o lock da linha ou a versão consertam. Diga que Postgres e MySQL não implementam o mesmo nome do mesmo jeito.",
        [
          paragraph("`READ UNCOMMITTED` deixa ver débito que a outra transação ainda pode desfazer. Eu não uso isso para saldo. `READ COMMITTED` é o default do Postgres: você não vê dado não commitado. Ainda pode ler o mesmo extrato duas vezes e ver totais diferentes, porque outra transação commitou no meio. É um default honesto para a maior parte das APIs."),
          paragraph("`REPEATABLE READ` estabiliza as linhas que você já leu. No Postgres, um update concorrente na mesma linha pode falhar com erro de serialização em vez de sobrescrever em silêncio. No MySQL InnoDB o mesmo nome tem outro comportamento de lock e de snapshot. Eu não transporto a definição de um banco para o outro."),
          paragraph("`SERIALIZABLE` pede o efeito de transações uma atrás da outra. Protege mais e aborta mais. Quem usa precisa de retry."),
          paragraph("O furo do saldo é outro. Duas transações em `READ COMMITTED` leem 100 na aplicação, as duas calculam 20 e as duas gravam. O nível não junta a conta feita fora do SQL. Para o mesmo registro eu escolho uma destas: `UPDATE ... SET balance = balance - :amount WHERE id = :id AND balance >= :amount` e confiro se uma linha foi afetada; `SELECT FOR UPDATE` na ordem de id; ou `@Version`, capturando `OptimisticLockException` e tentando de novo. Versão otimista é boa quando o conflito é raro. Sob muita disputa no mesmo saldo, a escrita condicional única dói menos do que abortar cem vezes."),
        ],
        [
          "Cada nível elimina um fenômeno: dirty read, non-repeatable, phantom",
          "O nome não significa a mesma coisa em Postgres e MySQL",
          "Lost update calculado na aplicação pede UPDATE condicional, lock ou versão",
        ],
        "Não diga que READ COMMITTED impede duas transações de perder um débito calculado em Java. Não impede.",
      ),
      en: locale(
        "Walk the four levels with one phenomenon each, using a balance. The senior close: isolation does not fix a lost update computed in Java. A conditional write, a row lock, or a version does. Say Postgres and MySQL do not implement the same name the same way.",
        [
          paragraph("READ UNCOMMITTED can see a debit the other transaction may still undo. I do not use it for a balance. READ COMMITTED is Postgres's default: you do not see uncommitted data. You can still read a statement twice and see different totals, because another transaction committed in between. It is an honest default for most APIs."),
          paragraph("REPEATABLE READ stabilizes rows you have already read. On Postgres, a concurrent update of the same row can fail with a serialization error instead of overwriting quietly. On MySQL InnoDB the same name has different lock and snapshot behavior. I do not carry one database's definition to the other."),
          paragraph("SERIALIZABLE asks for the effect of one-after-another transactions. It protects more and aborts more. Callers need a retry."),
          paragraph("The balance hole is different. Two READ COMMITTED transactions read 100 in the application, both compute 20, and both write it. The level does not make the Java arithmetic atomic. For one record I pick one of these: UPDATE balance = balance - :amount WHERE id = :id AND balance >= :amount, and check that one row was affected; SELECT FOR UPDATE in id order; or @Version, catching OptimisticLockException and retrying. Optimistic locking is good when conflict is rare. Under heavy contention on one balance, a single conditional write hurts less than aborting a hundred times."),
        ],
        [
          "Each level removes a phenomenon: dirty read, non-repeatable read, phantom",
          "The name does not mean the same thing on Postgres and MySQL",
          "A lost update computed in the app needs a conditional UPDATE, a lock, or a version",
        ],
        "Do not say READ COMMITTED prevents two transactions from losing a debit computed in Java. It does not.",
      ),
    },
    {
      id: "n-plus-one",
      conceptId: "def-n-plus-one",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "O que causa o N+1 no Hibernate e como eu corrijo?",
        en: "What causes the N+1 query problem, and how do you fix it?",
      },
      covers: [
        "What causes the N+1 query problem in Hibernate, and how would you fix it?",
        "What is the N+1 problem in Hibernate/JPA and how would you solve it?",
      ],
      pt: locale(
        "Defina com um número: 1 query dos pedidos mais N queries dos itens. A causa é associação lazy tocada em loop. A correção não é EAGER global. É fetch no caso de uso, ou uma projeção. Diga como você prova: log de SQL ou estatística, não o achismo.",
        [
          paragraph("N+1 é uma query para a lista pai e mais uma query por filho. Cem pedidos, ao tocar `order.getItems()` em cada um, viram uma query de pedidos e cem de itens. A causa usual é associação lazy, que é o default de coleção, acessada dentro de um loop com a sessão ainda aberta. Open-in-view esconde a exceção e deixa o N+1 passar calado, com a conexão presa até o fim da serialização."),
          paragraph("Eu não resolvo marcando a coleção como EAGER. Isso carrega o grafo em toda query, inclusive nas que não precisam dos itens, e vários EAGER se multiplicam. A correção é local: `JOIN FETCH` na query daquele caso de uso, `@EntityGraph`, ou `@BatchSize` quando eu quero poucas queries sem um produto cartesiano. Se a API devolve um DTO, eu seleciono o DTO direto e não carrego entidade para jogar campo fora."),
          paragraph("A prova é o SQL. Em desenvolvimento, log de statement ou p6spy. Em produção, a métrica de queries por request. Um JOIN FETCH de duas coleções ao mesmo tempo infla o resultado; nesse caso eu busco uma coleção e deixo a outra em batch."),
        ],
        [
          "1 query pai mais 1 por filho, em geral lazy dentro de loop",
          "EAGER global piora outros casos de uso",
          "JOIN FETCH, EntityGraph, BatchSize ou DTO, provado no SQL",
        ],
        "Não diga que N+1 se resolve com FetchType.EAGER na entidade. Você troca um problema por outro.",
      ),
      en: locale(
        "Define it with a number: 1 query for the orders plus N queries for the items. The cause is a lazy association touched in a loop. The fix is not global EAGER. It is a fetch for that use case, or a projection. Say how you prove it.",
        [
          paragraph("N+1 is one query for the parent list and one more per child. A hundred orders, each touching order.getItems(), become one order query and a hundred item queries. The usual cause is a lazy association, the default for collections, accessed in a loop while the session is open. Open-in-view hides the exception and lets the N+1 through quietly, holding the connection until serialization finishes."),
          paragraph("I do not fix it by marking the collection EAGER. That loads the graph on every query, including queries that do not need the items, and several EAGER associations multiply. The fix is local: JOIN FETCH on that use case's query, an EntityGraph, or BatchSize when I want a few queries without a cartesian product. If the API returns a DTO, I select the DTO and do not load an entity just to drop fields."),
          paragraph("The proof is the SQL. In development, statement logging or p6spy. In production, queries per request. A JOIN FETCH of two collections at once inflates the rows; then I fetch one and batch the other."),
        ],
        [
          "One parent query plus one per child, usually a lazy loop",
          "Global EAGER hurts other use cases",
          "JOIN FETCH, EntityGraph, BatchSize, or a DTO, proved in the SQL",
        ],
        "Do not say N+1 is solved by FetchType.EAGER on the entity. You trade one problem for another.",
      ),
    },
    {
      id: "lazy-vs-eager",
      conceptId: "def-lazy-eager",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Lazy ou Eager: quando uso cada um?",
        en: "Lazy or Eager: when would you use each?",
      },
      covers: [
        "Difference between Lazy and Eager loading — when would you use each?",
      ],
      pt: locale(
        "Diga o default da spec, porque muita gente inverte: coleção nasce lazy, ManyToOne e OneToOne nascem eager. A sua política pode ser lazy em tudo, com fetch explícito. Explique LazyInitializationException e por que open-in-view não é a solução.",
        [
          paragraph("Lazy carrega a associação na primeira vez que o código toca nela, se a sessão ainda está aberta. Eager carrega junto com o pai. Na spec, `@OneToMany` e `@ManyToMany` são lazy; `@ManyToOne` e `@OneToOne` são eager. Esse eager escondido é a origem de muita query grande que ninguém pediu."),
          paragraph("A política que eu defendo é lazy em todas as associações, e fetch explícito no caso de uso que precisa do dado. Eager na entidade parece cômodo e passa a custar em todo `findById`, relatório e job. Lazy sem sessão aberta lança `LazyInitializationException` na hora de serializar. A solução não é `open-in-view=true`, que segura a conexão durante o Jackson e empurra o N+1 para produção. A solução é carregar, dentro da transação, exatamente o que o DTO precisa."),
          paragraph("Eager ainda tem um lugar: uma associação pequena, sempre usada, que não puxa coleção. Mesmo aí eu prefiro ver o SQL do caso principal antes de cravar."),
        ],
        [
          "Coleção é lazy por default; ManyToOne é eager por default",
          "Política: lazy na entidade, fetch no caso de uso",
          "Open-in-view esconde o erro e prende a conexão",
        ],
        "Não diga que Eager é mais seguro porque evita LazyInitializationException. Ele só muda o momento em que você paga.",
      ),
      en: locale(
        "State the spec defaults, because people invert them: collections start lazy, ManyToOne and OneToOne start eager. Your policy can be lazy everywhere, with an explicit fetch. Explain LazyInitializationException and why open-in-view is not the fix.",
        [
          paragraph("Lazy loads the association the first time code touches it, if the session is still open. Eager loads it with the parent. In the spec, OneToMany and ManyToMany are lazy; ManyToOne and OneToOne are eager. That hidden eager is the source of large queries nobody asked for."),
          paragraph("The policy I defend is lazy on every association, and an explicit fetch in the use case that needs the data. Eager on the entity feels convenient and then costs on every findById, report, and job. Lazy without an open session throws LazyInitializationException during serialization. The fix is not open-in-view=true, which holds the connection during Jackson and pushes N+1 into production. The fix is to load, inside the transaction, exactly what the DTO needs."),
          paragraph("Eager still has a place: a small association that is always used and does not pull a collection. Even then I want the SQL of the main use case before I commit to it."),
        ],
        [
          "Collections are lazy by default; ManyToOne is eager by default",
          "Policy: lazy on the entity, fetch in the use case",
          "Open-in-view hides the error and holds the connection",
        ],
        "Do not say Eager is safer because it avoids LazyInitializationException. It only changes when you pay.",
      ),
    },
  ],
};
