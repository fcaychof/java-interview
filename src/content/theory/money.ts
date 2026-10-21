import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const moneyTheory: readonly TheoryGroup[] = [
  theoryGroup("money-theory", "Dinheiro", "Money", [
    concept(
      "def-bigdecimal",
      "BigDecimal",
      "BigDecimal",
      [
        paragraph("double é ponto flutuante binário. 0,10 não tem representação exata, e a soma de centavos fecha com erro. Dinheiro precisa de escala decimal. BigDecimal guarda o dígito. A coluna DECIMAL no banco também é decimal, mas não protege a conta feita em double na aplicação: o erro nasce antes do INSERT."),
        paragraph("new BigDecimal(0.1) captura o erro do double. A construção certa é a string, new BigDecimal(\"10.00\"), ou valueOf quando a origem já é um inteiro de centavos. Escala e RoundingMode são decisão de negócio, num lugar só."),
      ],
      [
        paragraph("double is binary floating point. 0.10 has no exact representation, and a sum of cents closes with an error. Money needs a decimal scale. BigDecimal stores the digit. A DECIMAL column is also decimal, but it does not protect arithmetic done in double in the application: the error is born before the INSERT."),
        paragraph("new BigDecimal(0.1) captures the double's error. The right construction is the string, new BigDecimal(\"10.00\"), or valueOf when the source is already an integer of cents. Scale and RoundingMode are a business decision, in one place."),
      ],
    ),
    concept(
      "def-no-negative",
      "Saldo que não negativa",
      "A balance that must not go negative",
      [
        paragraph("Cem saques ao mesmo tempo não podem confiar em ler o saldo, comparar em Java e gravar. As cem leem o valor antigo. A conta que segura é uma escrita só no banco: UPDATE ... SET balance = balance - :amount WHERE id = :id AND balance >= :amount. Se nenhuma linha voltou, o saque não cabe."),
        paragraph("SELECT FOR UPDATE serializa quem mexe naquela linha, na ordem em que as travas fecham. @Version aborta o segundo e pede retry. Sob disputa forte no mesmo saldo, a escrita condicional dói menos do que abortar cem vezes. Checagem só na aplicação perde."),
      ],
      [
        paragraph("A hundred withdrawals at once cannot rely on reading the balance, comparing in Java, and writing. All hundred read the old value. The check that holds is a single write in the database: UPDATE ... SET balance = balance - :amount WHERE id = :id AND balance >= :amount. If no row came back, the withdrawal does not fit."),
        paragraph("SELECT FOR UPDATE serializes whoever touches that row, in the order the locks close. @Version aborts the second one and asks for a retry. Under heavy contention on the same balance, the conditional write hurts less than aborting a hundred times. A check only in the application loses."),
      ],
    ),
    concept(
      "def-partial-transfer",
      "Débito sem crédito",
      "Debit without credit",
      [
        paragraph("Na mesma base, débito e crédito são uma transação. Ou os dois commitam, ou nenhum. O furo aparece quando cada perna está num serviço ou num banco. O débito passou, a rede caiu, o crédito não. Desfazer no escuro pode debitar de novo ou creditar duas vezes."),
        paragraph("O registro da transferência nasce antes das pernas, com estado. Cada perna é idempotente. Se o crédito não confirma, eu não invento um estorno cego: consulto o destino, e só então compenso ou repito. Saga é essa sequência explícita, com compensação, não um @Transactional abraçando dois bancos."),
      ],
      [
        paragraph("In the same database, debit and credit are one transaction. Either both commit, or neither does. The hole appears when each leg is in a service or a database of its own. The debit landed, the network dropped, the credit did not. Undoing in the dark can debit again or credit twice."),
        paragraph("The transfer record is born before the legs, with a state. Each leg is idempotent. If the credit does not confirm, I do not invent a blind reversal: I ask the destination, and only then compensate or retry. A saga is that explicit sequence, with compensation, not one @Transactional hugging two databases."),
      ],
    ),
    concept(
      "def-idempotency",
      "Idempotência",
      "Idempotency",
      [
        paragraph("Idempotência é a segunda execução igual não mudar o resultado de novo. O cliente reenvia porque deu timeout, não porque quer pagar duas vezes. A chave de idempotência, vinda de quem chama, identifica a tentativa. A primeira grava o efeito e a resposta. A segunda acha a chave e devolve a mesma resposta, sem debitar outra vez."),
        paragraph("Chave só na memória morre com o processo e não segura dois nós. A unicidade é constraint no banco, inserida na mesma transação do efeito. Checar e depois inserir, em dois passos sem trava, deixa as duas requisições passarem no meio. GET pode ser idempotente por natureza. POST de pagamento só é se a chave existir."),
      ],
      [
        paragraph("Idempotency means a second identical execution does not change the result again. The client resends because of a timeout, not because it wants to pay twice. The idempotency key, from the caller, identifies the attempt. The first one writes the effect and the response. The second finds the key and returns the same response, without debiting again."),
        paragraph("A key only in memory dies with the process and does not hold two nodes. Uniqueness is a database constraint, inserted in the same transaction as the effect. Check and then insert, in two steps with no lock, lets both requests through the gap. GET can be idempotent by nature. A payment POST is only idempotent if the key exists."),
      ],
    ),
  ]),
];
