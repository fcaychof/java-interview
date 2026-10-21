import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const transactionsTheory: readonly TheoryGroup[] = [
  theoryGroup("transactions-theory", "Transação e JPA", "Transactions and JPA", [
    concept(
      "def-transactional",
      "@Transactional",
      "@Transactional",
      [
        paragraph("@Transactional abre uma transação em volta do método, pelo proxy do Spring. No fim sem exceção, commit. Exceção não checada, RuntimeException e Error, marca rollback. Exceção checada, por default, não marca. rollbackFor deixa isso explícito quando o método declara Exception."),
        paragraph("O proxy só vê chamada que entra de fora. this.metodo() na mesma classe não passa por ele, e a anotação não vale. Método private também não é interceptado. Transação que não abre é o motivo mais comum de um save que não aparece e de um rollback que não acontece."),
      ],
      [
        paragraph("@Transactional opens a transaction around the method, through Spring's proxy. At the end with no exception, commit. An unchecked exception, RuntimeException and Error, marks rollback. A checked exception, by default, does not. rollbackFor makes that explicit when the method declares Exception."),
        paragraph("The proxy only sees a call that comes from outside. this.method() in the same class does not go through it, and the annotation does not apply. A private method is not intercepted either. A transaction that never opens is the most common reason a save does not show up and a rollback does not happen."),
      ],
    ),
    concept(
      "def-propagation",
      "Propagação",
      "Propagation",
      [
        paragraph("REQUIRED, o default, entra na transação que já existe ou abre uma. O rollback de um método interno marca a transação inteira. REQUIRES_NEW suspende a de fora e abre outra. O commit dela sobrevive se a de fora falhar depois. Serve para auditoria que precisa gravar mesmo quando o caso de uso desfaz."),
        paragraph("NESTED, quando o banco e o manager suportam savepoint, desfaz só até o savepoint. Sem suporte, não é um REQUIRED disfarçado em que você pode confiar. Eu não uso NESTED para isolar um efeito que precisa sobreviver: isso é REQUIRES_NEW. Propagação errada ou prende a conexão por tempo demais, ou commita metade sem querer."),
      ],
      [
        paragraph("REQUIRED, the default, joins the transaction that already exists or opens one. A rollback from an inner method marks the whole transaction. REQUIRES_NEW suspends the outer one and opens another. Its commit survives if the outer one fails later. It fits an audit that must be written even when the use case undoes."),
        paragraph("NESTED, when the database and the manager support a savepoint, undoes only back to the savepoint. Without support, it is not a disguised REQUIRED you can trust. I do not use NESTED to isolate an effect that must survive: that is REQUIRES_NEW. The wrong propagation either holds the connection for too long, or commits half of the work by accident."),
      ],
    ),
    concept(
      "def-isolation",
      "Isolamento",
      "Isolation",
      [
        paragraph("READ UNCOMMITTED vê débito que a outra transação ainda pode desfazer. READ COMMITTED, default do Postgres, não vê dado não commitado, mas a mesma leitura pode mudar se alguém commitou no meio. REPEATABLE READ estabiliza as linhas já lidas. No Postgres um update concorrente na mesma linha pode falhar com erro de serialização. No MySQL InnoDB o mesmo nome trava e enxerga snapshot de outro jeito. SERIALIZABLE pede o efeito de uma atrás da outra, e aborta mais."),
        paragraph("Isolamento não conserta lost update calculado em Java. Duas transações leem 100, as duas gravam 70. O conserto é UPDATE condicional conferindo a linha afetada, SELECT FOR UPDATE na ordem de id, ou @Version com retry. Versão otimista cabe quando o conflito é raro."),
      ],
      [
        paragraph("READ UNCOMMITTED sees a debit the other transaction may still undo. READ COMMITTED, Postgres's default, does not see uncommitted data, but the same read can change if someone committed in between. REPEATABLE READ stabilizes rows already read. On Postgres a concurrent update of the same row can fail with a serialization error. On MySQL InnoDB the same name locks and sees a snapshot differently. SERIALIZABLE asks for the effect of one after another, and aborts more."),
        paragraph("Isolation does not fix a lost update computed in Java. Two transactions read 100, both write 70. The fix is a conditional UPDATE checking the affected row, SELECT FOR UPDATE in id order, or @Version with a retry. Optimistic locking fits when conflict is rare."),
      ],
    ),
    concept(
      "def-n-plus-one",
      "N+1",
      "N+1",
      [
        paragraph("N+1 é uma consulta para achar os pais e mais uma por filho. A lista de pedidos carrega, e cada acesso a pedido.getItens(), se a coleção é lazy, dispara um SELECT. Cem pedidos viram cem e uma idas ao banco. O loop parece inocente porque a consulta está escondida no getter."),
        paragraph("A correção traz o que o caso de uso precisa numa ida: join fetch, @EntityGraph, ou uma consulta que já projeta o DTO. Fetch global EAGER na entidade só empurra o custo para quem não precisava dos filhos. Eu olho o log de SQL do caso de uso, não o mapeamento no escuro."),
      ],
      [
        paragraph("N+1 is one query to find the parents and one more per child. The order list loads, and each access to order.getItems(), if the collection is lazy, fires a SELECT. A hundred orders become a hundred and one trips to the database. The loop looks innocent because the query is hidden in the getter."),
        paragraph("The fix brings what the use case needs in one trip: join fetch, @EntityGraph, or a query that already projects the DTO. A global EAGER fetch on the entity only pushes the cost onto whoever did not need the children. I look at the SQL log of the use case, not at the mapping in the dark."),
      ],
    ),
    concept(
      "def-lazy-eager",
      "Lazy e Eager",
      "Lazy and Eager",
      [
        paragraph("Lazy carrega a associação quando alguém navega, dentro de uma sessão aberta. Fora da sessão, a navegação lança LazyInitializationException. Eager carrega junto com o pai, sempre, mesmo para um endpoint que só queria o id e o total."),
        paragraph("O default de coleção no Hibernate é lazy, e é o que eu mantenho. Eager numa lista de itens faz todo carregamento de pedido pagar os filhos. O caso de uso que precisa dos filhos declara o fetch na consulta daquele caso. Open-in-view esconde o problema até a view disparar SQL. Eu prefiro a transação fechada no serviço e o DTO já montado."),
      ],
      [
        paragraph("Lazy loads the association when someone navigates it, inside an open session. Outside the session, the navigation throws LazyInitializationException. Eager loads it with the parent, always, even for an endpoint that only wanted the id and the total."),
        paragraph("The Hibernate default for a collection is lazy, and that is what I keep. Eager on a list of items makes every order load pay for the children. The use case that needs the children declares the fetch on that case's query. Open-in-view hides the problem until the view fires SQL. I prefer the transaction closed in the service and the DTO already built."),
      ],
    ),
  ]),
];
