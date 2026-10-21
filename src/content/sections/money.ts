import {
  code,
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { moneyTheory } from "../theory/money";

export const money: InterviewSection = {
  id: "money",
  order: 10,
  titles: {
    pt: "Dinheiro, idempotência e falha no meio",
    en: "Money, idempotency, and failure in the middle",
  },
  summaries: {
    pt: "BigDecimal, saldo que não pode negativar, clique duplo e o que fazer quando o débito passou e o crédito não.",
    en: "BigDecimal, a balance that must not go negative, a double click, and what to do when the debit landed and the credit did not.",
  },
  theory: moneyTheory,
  questions: [
    {
      id: "bigdecimal",
      conceptId: "def-bigdecimal",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Por que BigDecimal, e não double, mesmo com DECIMAL no banco?",
        en: "Why BigDecimal instead of double, even when the database uses DECIMAL?",
      },
      covers: [
        "Why is BigDecimal preferred over double for money?",
        "Why avoid double even when the database uses DECIMAL?",
      ],
      pt: locale(
        "Mostre o erro de representação com 0,1 e 0,2. Depois responda a segunda metade: a coluna DECIMAL não protege o cálculo feito em double na aplicação. Feche com a forma certa de construir o BigDecimal e com a escala.",
        [
          paragraph("`double` é ponto flutuante binário. Valores decimais comuns, como 0,10, não têm representação exata. A soma de muitos centavos fecha com erro de fração, e comparação com `==` mente. Dinheiro precisa de escala decimal exata. `BigDecimal` guarda o dígito, não uma aproximação binária."),
          paragraph("A coluna `DECIMAL` no banco também é decimal. O furo é o meio do caminho: se o JDBC lê para `double`, ou se o serviço calcula em `double` e grava de volta, o erro nasce na aplicação e o banco só persiste o número já errado. O driver mapeia `DECIMAL` para `BigDecimal`. Eu mantenho `BigDecimal` no domínio, no DTO e na entidade."),
          paragraph("Eu não construo com `new BigDecimal(0.1)`, porque isso captura o erro do double. Uso `new BigDecimal(\"10.00\")` ou `BigDecimal.valueOf` quando a origem já é um long de centavos. Escala e `RoundingMode` são decisão de negócio, explícita num único lugar, não um `setScale` espalhado."),
        ],
        [
          "double não representa 0,10 com exatidão",
          "DECIMAL no banco não conserta o cálculo feito em double",
          "Construir por String ou por centavos, com escala e arredondamento únicos",
        ],
        "Não diga que BigDecimal é mais rápido. Não é. Ele é exato, e dinheiro pede exatidão.",
      ),
      en: locale(
        "Show the representation error with 0.1 and 0.2. Then answer the second half: a DECIMAL column does not protect arithmetic done in double. Close with how to construct a BigDecimal and where scale lives.",
        [
          paragraph("double is binary floating point. Common decimal amounts such as 0.10 have no exact representation. A long sum of cents closes with a fraction error, and == lies. Money needs an exact decimal scale. BigDecimal stores the digits, not a binary approximation."),
          paragraph("A DECIMAL column is decimal too. The hole is the middle: if JDBC reads it into a double, or the service calculates in double and writes back, the error is born in the application and the database only stores the already-wrong number. The driver maps DECIMAL to BigDecimal. I keep BigDecimal in the domain, the DTO, and the entity."),
          paragraph("I do not construct it with new BigDecimal(0.1), because that captures the double error. I use new BigDecimal(\"10.00\") or BigDecimal.valueOf when the source is already a long of cents. Scale and RoundingMode are a business decision, in one place."),
        ],
        [
          "double cannot represent 0.10 exactly",
          "A DECIMAL column does not fix arithmetic done in double",
          "Construct from a String or from cents, with one scale and rounding mode",
        ],
        "Do not say BigDecimal is faster. It is not. It is exact, and money needs exactness.",
      ),
    },
    {
      id: "no-negative-balance",
      conceptId: "def-no-negative",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Como garanto que a conta não fica negativa com 100 saques ao mesmo tempo?",
        en: "How do you guarantee an account does not go negative under 100 concurrent withdrawals?",
      },
      covers: [
        "How do you guarantee an account doesn’t go negative under 100 concurrent withdrawals?",
      ],
      pt: locale(
        "Descarte synchronized de cara se existe mais de uma instância. A garantia é uma única sentença SQL condicional, mais um CHECK no banco. Diga o que a aplicação faz quando a linha afetada volta zero.",
        [
          paragraph("Cem threads, possivelmente em vários pods, não cabem num `synchronized`. O monitor é local ao processo. A invariante mora na linha da conta."),
          code(
            "UPDATE account\nSET balance = balance - :amount\nWHERE id = :id\n  AND balance >= :amount;",
          ),
          paragraph("Essa sentença trava a linha, lê o saldo e grava o novo valor de forma atômica. Se o saldo não cobre, nenhuma linha muda. A aplicação confere o update count. Zero significa saldo insuficiente, e a API responde 409 ou 422 sem ter debitado. Eu ainda coloco `CHECK (balance >= 0)` para o caso de outro código escrever a tabela por fora."),
          paragraph("Lock otimista com `@Version` também evita a escrita perdida, mas sob cem saques no mesmo registro a maioria aborta e tenta de novo. A sentença única ganha porque não calcula o saldo na aplicação. `SELECT FOR UPDATE` serve quando a regra em volta é maior que uma subtração; a ordem dos locks continua obrigatória se houver duas contas."),
        ],
        [
          "synchronized não atravessa instâncias",
          "UPDATE condicional e checagem do número de linhas",
          "CHECK no banco como última barreira",
        ],
        "Não leia o saldo, compare em Java e depois faça um update cego. Esse é o lost update, só que com mais threads.",
      ),
      en: locale(
        "Discard synchronized immediately if there is more than one instance. The guarantee is one conditional SQL statement, plus a CHECK constraint. Say what the application does when the affected row count is zero.",
        [
          paragraph("A hundred threads, possibly on several pods, do not fit in synchronized. The monitor is local to the process. The invariant lives on the account row."),
          code(
            "UPDATE account\nSET balance = balance - :amount\nWHERE id = :id\n  AND balance >= :amount;",
          ),
          paragraph("That statement locks the row, reads the balance, and writes the new value atomically. If the balance does not cover the amount, no row changes. The application checks the update count. Zero means insufficient funds, and the API returns 409 or 422 without debiting. I still add CHECK (balance >= 0) for the writer that bypasses this statement."),
          paragraph("Optimistic @Version also prevents a lost write, but under a hundred withdrawals of the same row most attempts abort and retry. The single statement wins because it does not compute the balance in the application. SELECT FOR UPDATE fits when the rule is larger than one subtraction; lock order stays mandatory when two accounts are involved."),
        ],
        [
          "synchronized does not cross instances",
          "A conditional UPDATE and a check of the row count",
          "A CHECK constraint as the last barrier",
        ],
        "Do not read the balance, compare it in Java, and then issue a blind update. That is the lost update, with more threads.",
      ),
    },
    {
      id: "debit-without-credit",
      conceptId: "def-partial-transfer",
      difficulty: "senior",
      speakSeconds: 120,
      titles: {
        pt: "O débito passou e o crédito não. Como eu trato isso?",
        en: "The debit succeeded and the credit did not. How do you handle it?",
      },
      covers: [
        "What if money is debited but the application crashes before credit?",
        "How would you handle a debit-success/credit-failure scenario?",
        "A payment succeeds, but Order Service doesn't receive the confirmation. How would you handle this?",
        "What happens if Account A is debited but Account B’s credit fails?",
      ],
      pt: locale(
        "Não proponha transação distribuída XA como primeira resposta. Diga se as duas contas estão no mesmo banco. Se estão, uma transação local. Se não estão, outbox e compensação, com estado explícito. O crash no meio é exatamente o caso que o outbox cobre.",
        [
          paragraph("Se débito e crédito são tabelas do mesmo banco, os dois updates entram na mesma transação. Crash no meio desfaz os dois. Não há janela. Eu só saio desse desenho quando as contas não podem mais morar juntas."),
          paragraph("Quando o crédito é outro serviço, ou um provedor de pagamento, não existe um commit só. Eu gravo o débito e um registro na tabela outbox na mesma transação local. Um publicador lê o outbox e envia o comando de crédito, com chave idempotente. Se o processo morre depois do commit e antes do envio, o registro continua lá e outro ciclo envia. Não dependo da memória do processo."),
          paragraph("O crédito pode falhar de verdade. O estado da transferência fica explícito: pendente, debitada, creditada, compensada, falha. Falha no crédito dispara a compensação, que é um crédito de volta na conta A, também idempotente. Eu não deixo o dinheiro sumir num estado implícito. Um job de reconciliação varre o que ficou pendente além do prazo e consulta a fonte da verdade."),
          paragraph("O caso do pagamento aprovado sem o Order Service saber é o mesmo furo, visto do outro lado. O provedor tem a cobrança; o pedido não avançou. A correção é webhook mais consulta ativa, os dois com a mesma chave idempotente, e uma inbox que grava o fato antes de aplicar o efeito. Reenviar não pode criar outro pedido nem cobrar de novo."),
        ],
        [
          "Mesmo banco: uma transação local",
          "Serviços diferentes: outbox no mesmo commit do débito",
          "Estado explícito e compensação idempotente",
          "Webhook e consulta ativa para o pagamento que o pedido não viu",
        ],
        "Não diga que um try/catch em volta das duas chamadas HTTP resolve. A falha pode ser um kill -9 entre as duas, sem catch nenhum.",
      ),
      en: locale(
        "Do not open with XA. Say whether both accounts live in the same database. If they do, one local transaction. If they do not, an outbox and a compensation, with an explicit state. A crash in the middle is exactly what the outbox covers.",
        [
          paragraph("If the debit and the credit are tables in the same database, both updates belong to one transaction. A crash in the middle rolls both back. There is no window. I leave that design only when the accounts can no longer live together."),
          paragraph("When the credit is another service, or a payment provider, there is no single commit. I write the debit and an outbox row in the same local transaction. A publisher reads the outbox and sends the credit command with an idempotency key. If the process dies after the commit and before the send, the row is still there and the next cycle sends it. I do not depend on the process memory."),
          paragraph("The credit can genuinely fail. The transfer state is explicit: pending, debited, credited, compensated, failed. A credit failure triggers compensation, a credit back to account A, also idempotent. Money does not disappear into an implicit state. A reconciliation job scans what stayed pending past the deadline and asks the source of truth."),
          paragraph("A payment that succeeded while Order Service never heard about it is the same hole, seen from the other side. The provider has the charge; the order did not advance. The fix is a webhook plus an active query, both with the same idempotency key, and an inbox that records the fact before applying the effect. A resend must not create another order or charge again."),
        ],
        [
          "Same database: one local transaction",
          "Different services: an outbox in the same commit as the debit",
          "Explicit state and an idempotent compensation",
          "Webhook plus an active query for the payment the order never saw",
        ],
        "Do not say a try/catch around two HTTP calls solves it. The failure can be a kill between them, with no catch at all.",
      ),
    },
    {
      id: "idempotent-payment",
      conceptId: "def-idempotency",
      difficulty: "senior",
      speakSeconds: 100,
      titles: {
        pt: "Como evito pagamento, pedido ou clique duplicado?",
        en: "How do you prevent a duplicate payment, order, or click?",
      },
      covers: [
        "How do you prevent duplicate payment processing?",
        "How do you make a payment API idempotent?",
        "Two requests create the same order at almost the same time. How do you prevent duplicates?",
        "How would you prevent duplicate transactions if the user clicks multiple times?",
      ],
      pt: locale(
        "A resposta é uma chave idempotente persistida com constraint única, não um flag na tela. Explique o que acontece no primeiro request, na retentativa igual e no reuso da chave com outro corpo. O botão desabilitado é conforto, não garantia.",
        [
          paragraph("O cliente gera uma chave por intenção de pagamento, manda no header ou no corpo, e repete essa mesma chave se a rede falhar. Desabilitar o botão reduz clique duplo de gente apressada. Não cobre timeout com retry do browser, dois devices, nem o gateway chamando de novo."),
          paragraph("No servidor, a primeira coisa dentro da transação é inserir a chave numa tabela única, junto com o hash do pedido e o estado. Se a inserção passa, este request é o dono e segue o débito. Se estoura a constraint, eu leio a linha que já existe. Mesma chave e mesmo hash: devolvo a mesma resposta que o primeiro produziu, sem debitar de novo. Mesma chave e hash diferente: respondo 409, porque a chave foi reutilizada para outra operação."),
          code(
            "UNIQUE (idempotency_key)\n-- insert da chave e efeito de negócio na mesma transação",
          ),
          paragraph("A resposta do primeiro request precisa ficar guardada, ou ser recalculável, senão a retentativa não sabe o que devolver. A chave tem prazo de validade alinhado à janela de retry. Lock em memória não serve com várias instâncias."),
        ],
        [
          "Chave da intenção, repetida na retentativa",
          "Unique constraint na mesma transação do efeito",
          "Mesma chave e mesmo corpo devolve a mesma resposta; corpo diferente é 409",
        ],
        "Não diga que basta desabilitar o botão ou checar um if antes do insert sem constraint. Os dois requests passam no if.",
      ),
      en: locale(
        "The answer is an idempotency key persisted under a unique constraint, not a flag on the screen. Explain the first request, the identical retry, and reuse of the key with a different body. A disabled button is comfort, not a guarantee.",
        [
          paragraph("The client generates a key per payment intent, sends it, and repeats that same key if the network fails. Disabling the button reduces a hurried double click. It does not cover a browser retry, two devices, or the gateway calling again."),
          paragraph("On the server, the first step inside the transaction is to insert the key into a unique table, with the request hash and the state. If the insert succeeds, this request owns the operation and proceeds to the debit. If the constraint fails, I read the existing row. Same key and same hash: return the response the first request produced, without debiting again. Same key and a different hash: return 409, because the key was reused for another operation."),
          code(
            "UNIQUE (idempotency_key)\n-- insert the key and the business effect in the same transaction",
          ),
          paragraph("The first response has to be stored, or be recomputable, or the retry does not know what to return. The key expires on the same horizon as the retry window. An in-memory lock does not work across instances."),
        ],
        [
          "A key for the intent, repeated on retry",
          "A unique constraint in the same transaction as the effect",
          "Same key and same body return the same response; a different body is 409",
        ],
        "Do not say disabling the button is enough, or that a check before the insert works without a constraint. Both requests pass the check.",
      ),
    },
  ],
};
