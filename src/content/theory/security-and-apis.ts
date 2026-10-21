import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const securityAndApisTheory: readonly TheoryGroup[] = [
  theoryGroup("security-theory", "Segurança e HTTP", "Security and HTTP", [
    concept(
      "def-oauth",
      "OAuth, JWT e OpenID Connect",
      "OAuth, JWT, and OpenID Connect",
      [
        paragraph("OAuth 2.0 é autorização delegada. O dono do recurso concede a um cliente o direito de agir, e o cliente recebe um access token. O token não é, por si, a identidade da pessoa. OpenID Connect é a camada de identidade em cima do OAuth: o id token diz quem autenticou."),
        paragraph("JWT é um formato de token, três partes assinadas: cabeçalho, payload e assinatura. Cabe access token e cabe id token. OAuth não obriga JWT. Confundir os três faz a API tratar um token de acesso como prova de login, ou validar a assinatura e esquecer emissor, audiência e expiração."),
      ],
      [
        paragraph("OAuth 2.0 is delegated authorization. The resource owner grants a client the right to act, and the client receives an access token. The token is not, by itself, the person's identity. OpenID Connect is the identity layer on top of OAuth: the id token says who authenticated."),
        paragraph("JWT is a token format, three signed parts: header, payload, and signature. It can be an access token and it can be an id token. OAuth does not require JWT. Mixing the three makes the API treat an access token as proof of login, or validate the signature and forget issuer, audience, and expiry."),
      ],
    ),
    concept(
      "def-jwt",
      "JWT no Spring Security",
      "JWT in Spring Security",
      [
        paragraph("O filtro, antes do controller, lê o Authorization Bearer, verifica a assinatura com a chave do emissor, e confere iss, aud e exp. Assinatura válida com emissor errado não entra. Token expirado não entra. O filtro monta a autenticação no contexto da thread."),
        paragraph("O controller não decodifica o token na mão. A autorização, o que aquele sujeito pode fazer, vem das authorities que o filtro colocou, e o método ou o security matcher exige o papel. Segredo simétrico no código, ou não checar audiência, abre token cunhado por outro sistema. Eu não guardo sessão de servidor para um token que já carrega o prazo."),
      ],
      [
        paragraph("The filter, before the controller, reads the Authorization Bearer, checks the signature with the issuer's key, and checks iss, aud, and exp. A valid signature with the wrong issuer does not get in. An expired token does not get in. The filter puts the authentication on the thread context."),
        paragraph("The controller does not decode the token by hand. Authorization, what that subject may do, comes from the authorities the filter set, and the method or the security matcher requires the role. A symmetric secret in the code, or skipping the audience, accepts a token minted by another system. I do not keep a server session for a token that already carries its deadline."),
      ],
    ),
    concept(
      "def-api-errors",
      "Erro de API",
      "API error",
      [
        paragraph("O corpo de erro é estável. Status certo, um código que o cliente trata, uma mensagem para gente, e um id de correlação para achar o log. 400 é pedido inválido. 401 é não autenticado. 403 é autenticado sem permissão. 404 é o recurso. 409 é conflito, versão ou idempotência. 422 cabe quando o JSON é válido e a regra de negócio recusa. 500 é falha nossa, sem stack."),
        paragraph("A exceção de negócio vira esse corpo num lugar só, o advice. Cada controller não monta o JSON do erro. Detalhe de validação lista o campo. Stack, SQL e nome de classe ficam no log, ao lado do id que o cliente recebeu. O contrato não muda a cada exceção nova."),
      ],
      [
        paragraph("The error body is stable. The right status, a code the client handles, a message for a person, and a correlation id to find the log. 400 is an invalid request. 401 is unauthenticated. 403 is authenticated without permission. 404 is the missing resource. 409 is a conflict, a version or idempotency. 422 fits when the JSON is valid and the business rule refuses. 500 is our failure, with no stack."),
        paragraph("The business exception becomes that body in one place, the advice. Each controller does not build the error JSON. A validation detail lists the field. Stack, SQL, and class name stay in the log, next to the id the client received. The contract does not change with every new exception."),
      ],
    ),
    concept(
      "def-websocket",
      "WebSocket",
      "WebSocket",
      [
        paragraph("WebSocket é um canal de duas vias sobre uma conexão que começou como HTTP e fez upgrade. O cliente e o servidor mandam frames quando querem, sem abrir um request novo a cada aviso. Serve para algo que empurra: cotação, status de um pedido, uma tela que não pode ficar dando poll."),
        paragraph("Não substitui REST. Operação de comando com resposta única continua sendo HTTP, que atravessa proxy, retry e cache com menos cerimônia. WebSocket atrás de balanceador precisa de afinidade ou de um barramento, senão o aviso nasce na instância que não tem o socket. Autenticação acontece no handshake. A conexão longa também ocupa recurso que o request curto devolvia."),
      ],
      [
        paragraph("WebSocket is a two-way channel over a connection that started as HTTP and upgraded. Client and server send frames when they want, without opening a new request for every notice. It fits something that pushes: a quote, an order status, a screen that cannot keep polling."),
        paragraph("It does not replace REST. A command with a single answer stays HTTP, which crosses proxy, retry, and cache with less ceremony. A WebSocket behind a load balancer needs affinity or a bus, otherwise the notice is born on the instance that does not hold the socket. Authentication happens on the handshake. The long connection also holds a resource the short request used to give back."),
      ],
    ),
    concept(
      "def-http-clients",
      "RestTemplate e WebClient",
      "RestTemplate and WebClient",
      [
        paragraph("RestTemplate é o cliente bloqueante. A thread do request fica parada até a resposta. É simples e suficiente quando a chamada é uma, curta, e o pool de threads aguenta a espera. Está em modo de manutenção."),
        paragraph("WebClient é o cliente do WebFlux. A chamada devolve Mono ou Flux, e a thread não precisa ficar presa na espera se o resto do fluxo também for reativo. Usar WebClient e dar block() na hora só troca o nome do bloqueio. Timeout, pool de conexão e tratamento de status existem nos dois. O que muda é quem segura a thread enquanto a rede não volta."),
      ],
      [
        paragraph("RestTemplate is the blocking client. The request thread sits until the response. It is simple and enough when the call is one, short, and the thread pool can afford the wait. It is in maintenance mode."),
        paragraph("WebClient is the WebFlux client. The call returns a Mono or a Flux, and the thread does not have to stay stuck on the wait if the rest of the flow is reactive too. Using WebClient and calling block() immediately only renames the blocking. Timeout, connection pool, and status handling exist on both. What changes is who holds the thread while the network has not come back."),
      ],
    ),
  ]),
];
