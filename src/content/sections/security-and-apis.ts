import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { securityAndApisTheory } from "../theory/security-and-apis";

export const securityAndApis: InterviewSection = {
  id: "security-and-apis",
  order: 13,
  titles: {
    pt: "Segurança, erros e clientes HTTP",
    en: "Security, errors, and HTTP clients",
  },
  summaries: {
    pt: "OAuth, JWT e o filtro do Spring Security; o corpo de erro que produção aguenta; WebSocket, RestTemplate e WebClient.",
    en: "OAuth, JWT, and the Spring Security filter; an error body production can live with; WebSocket, RestTemplate, and WebClient.",
  },
  theory: securityAndApisTheory,
  questions: [
    {
      id: "oauth-jwt-oidc",
      conceptId: "def-oauth",
      difficulty: "senior",
      speakSeconds: 90,
      titles: {
        pt: "Qual é a relação entre OAuth 2.0, JWT e OpenID Connect?",
        en: "What is the relationship between OAuth 2.0, JWT, and OpenID Connect?",
      },
      covers: [
        "Difference/relationship between OAuth 2.0, JWT and OpenID Connect.",
      ],
      pt: locale(
        "A frase que evita a confusão: OAuth não é login, JWT não é protocolo, OIDC é o login em cima do OAuth. Diga o que cada um entrega. Não desenhe os quatro grant types a menos que peçam.",
        [
          paragraph("OAuth 2.0 é delegação de autorização. O dono do recurso deixa um cliente acessar uma API com um access token, sem entregar a senha. O token pode ser opaco. O protocolo não diz, por si, quem é o usuário. Usar OAuth puro como login é o furo que o OIDC veio fechar."),
          paragraph("OpenID Connect é uma camada de identidade sobre o OAuth. Além do access token, o authorization server emite um ID token sobre o usuário, e há o endpoint de UserInfo. Quando o entrevistador fala em login com Google ou com o IdP da empresa, o protocolo é OIDC."),
          paragraph("JWT é formato de token: três partes codificadas, assinadas, não necessariamente criptografadas. Um access token de OAuth pode ser JWT, e o ID token do OIDC é JWT. Um access token opaco também é OAuth válido. Tratar JWT e OAuth como sinônimos é o erro que eu corrijo na primeira frase."),
        ],
        [
          "OAuth 2.0 autoriza um cliente a chamar uma API",
          "OIDC adiciona identidade e o ID token",
          "JWT é o formato, não o protocolo",
        ],
        "Não diga que JWT é um tipo de OAuth, nem que OAuth autentica o usuário.",
      ),
      en: locale(
        "The sentence that prevents the mix-up: OAuth is not login, JWT is not a protocol, OIDC is login on top of OAuth. Say what each one delivers. Do not draw the four grant types unless asked.",
        [
          paragraph("OAuth 2.0 is delegated authorization. The resource owner lets a client call an API with an access token, without handing over the password. The token may be opaque. The protocol by itself does not say who the user is. Using raw OAuth as login is the hole OIDC closed."),
          paragraph("OpenID Connect is an identity layer on OAuth. Besides the access token, the authorization server issues an ID token about the user, and there is a UserInfo endpoint. When the interviewer says login with Google or with the company IdP, the protocol is OIDC."),
          paragraph("JWT is a token format: three encoded parts, signed, not necessarily encrypted. An OAuth access token can be a JWT, and the OIDC ID token is a JWT. An opaque access token is also valid OAuth. Treating JWT and OAuth as synonyms is the mistake I correct in the first sentence."),
        ],
        [
          "OAuth 2.0 authorizes a client to call an API",
          "OIDC adds identity and the ID token",
          "JWT is the format, not the protocol",
        ],
        "Do not say JWT is a kind of OAuth, or that OAuth authenticates the user.",
      ),
    },
    {
      id: "jwt-spring-security",
      conceptId: "def-jwt",
      difficulty: "senior",
      speakSeconds: 110,
      titles: {
        pt: "Como funcionam a estrutura do JWT e o Spring Security de ponta a ponta?",
        en: "How do JWT structure and Spring Security authentication work end to end?",
      },
      covers: [
        "Explain JWT structure and JWT authentication/validation flow.",
        "How does Spring Security + JWT authentication work end-to-end?",
      ],
      pt: locale(
        "Mostre as três partes e diga que payload não é segredo. Na validação, a lista de algoritmos e o kid importam mais do que recitar claims. No Spring, o resource server valida localmente com a chave pública; não chama o IdP a cada request.",
        [
          paragraph("O JWT é `header.payload.signature`, cada parte em base64url. O header traz `alg` e `kid`. O payload traz claims: `iss`, `sub`, `aud`, `exp`, `iat`, `nbf` e os escopos ou papéis. A assinatura é HMAC ou, no caso que eu prefiro entre serviços, RSA ou ECDSA. Quem tem o token lê o payload. Se o dado é sensível, ele não entra aí; criptografia seria JWE, e eu quase nunca preciso."),
          paragraph("Validar é checar a assinatura com a chave do `kid`, buscada no JWKS e cacheada, e recusar algoritmo que não está na lista, inclusive `none` e um HS256 quando o servidor espera RS256. Depois confiro `iss`, `aud` e a expiração, com uma folga pequena de relógio. Access token curto. Refresh token fica em cookie httpOnly quando o cliente é browser; localStorage é o lugar de onde o XSS lê o token."),
          paragraph("No fluxo, o cliente autentica no authorization server e recebe o token. Nas chamadas seguintes manda `Authorization: Bearer`. No resource server Spring Boot, o filtro do `oauth2ResourceServer` extrai o bearer, o `JwtDecoder` valida e monta o `JwtAuthenticationToken` com as autoridades vindas do scope ou das roles. O `SecurityFilterChain` autoriza o path antes do controller. Chave nova aparece no JWKS; o decoder recarrega. Eu não implemento esse filtro na mão se o resource server já faz."),
        ],
        [
          "Header, payload legível e assinatura",
          "Allow-list de algoritmo, kid, iss, aud e exp",
          "Bearer filter, JwtDecoder e autorização no filter chain",
        ],
        "Não diga que o payload é criptografado. Também não diga que cada request valida o token chamando o authorization server, se a chave pública já está em cache.",
      ),
      en: locale(
        "Show the three parts and say the payload is not a secret. In validation, the algorithm allow-list and the kid matter more than reciting claims. In Spring, the resource server validates locally with the public key; it does not call the IdP on every request.",
        [
          paragraph("A JWT is header.payload.signature, each part base64url-encoded. The header carries alg and kid. The payload carries claims: iss, sub, aud, exp, iat, nbf, and the scopes or roles. The signature is HMAC or, for the case I prefer between services, RSA or ECDSA. Anyone with the token can read the payload. If the data is sensitive, it does not go in there; encryption would be JWE, and I rarely need it."),
          paragraph("Validation checks the signature with the key for the kid, fetched from JWKS and cached, and rejects an algorithm that is not on the allow-list, including none and an HS256 when the server expects RS256. Then I check iss, aud, and expiry, with a small clock skew. The access token is short-lived. A refresh token lives in an httpOnly cookie when the client is a browser; localStorage is where XSS reads the token."),
          paragraph("In the flow, the client authenticates at the authorization server and receives the token. Later calls send Authorization: Bearer. On a Spring Boot resource server, the oauth2ResourceServer filter takes the bearer, the JwtDecoder validates it, and builds a JwtAuthenticationToken with authorities from the scope or the roles. The SecurityFilterChain authorizes the path before the controller. A new key shows up on the JWKS and the decoder reloads. I do not hand-write that filter when the resource server already does it."),
        ],
        [
          "Header, a readable payload, and a signature",
          "An algorithm allow-list, kid, iss, aud, and exp",
          "The bearer filter, JwtDecoder, and authorization on the filter chain",
        ],
        "Do not say the payload is encrypted. Do not say every request validates the token by calling the authorization server when the public key is already cached.",
      ),
    },
    {
      id: "api-errors",
      conceptId: "def-api-errors",
      difficulty: "pleno",
      speakSeconds: 80,
      titles: {
        pt: "Como eu desenharia o tratamento de erro de uma API REST?",
        en: "How would you design exception handling for a production REST API?",
      },
      covers: [
        "How would you design exception handling for a production REST API?",
      ],
      pt: locale(
        "Mostre um formato estável, um mapa curto de exceção para status, e o que nunca volta no corpo. Diga onde isso mora: ControllerAdvice, mais o caso do filtro que o advice não vê.",
        [
          paragraph("Erro de API é contrato, não stack trace. Eu devolvo um corpo estável, no espírito do problem+json: type, title, status, detail seguro, instance e o trace id. O cliente trata pelo status e por um código de negócio. A mensagem humana pode mudar; o código não."),
          paragraph("Validação de bean vira 400 com os campos. Recurso ausente, 404. Conflito de versão ou chave repetida, 409. Regra de negócio recusada, 422. Limite de taxa, 429. Falha inesperada, 500 genérico. SQL, caminho interno e exceção crua ficam no log, no mesmo trace id, e não no JSON. Eu não deixo o container HTML de erro escapar para uma API."),
          paragraph("Isso fica num `@ControllerAdvice` que traduz exceção de domínio, `MethodArgumentNotValidException` e o que mais for previsto. Exceção desconhecida cai no 500 e incrementa métrica. Erro nascido no filtro de segurança precisa do mesmo formato, porque ele não passa no advice. Eu registro a taxa de 5xx por rota. E não uso exceção para o fluxo normal de um if barato; uso para a regra que já falhou."),
        ],
        [
          "Corpo estável com código e trace id, sem stack",
          "400, 404, 409, 422, 429 e 500 com critério",
          "ControllerAdvice, e o mesmo formato para erro de filtro",
        ],
        "Não devolva a mensagem crua do banco nem a stack para o cliente, nem mesmo em staging se o corpo é o mesmo contrato.",
      ),
      en: locale(
        "Show a stable shape, a short map from exception to status, and what never goes in the body. Say where it lives: ControllerAdvice, plus the filter case the advice does not see.",
        [
          paragraph("An API error is a contract, not a stack trace. I return a stable body, in the spirit of problem+json: type, title, status, a safe detail, instance, and the trace id. The client branches on the status and a business code. The human sentence can change; the code does not."),
          paragraph("Bean validation becomes a 400 with the fields. A missing resource is 404. A version conflict or a duplicate key is 409. A refused business rule is 422. A rate limit is 429. An unexpected failure is a generic 500. SQL, internal paths, and the raw exception stay in the log, on the same trace id, and out of the JSON. I do not let the container's HTML error page escape into an API."),
          paragraph("That lives in a ControllerAdvice that translates domain exceptions, MethodArgumentNotValidException, and the other expected ones. An unknown exception becomes a 500 and increments a metric. An error born in the security filter needs the same shape, because it never reaches the advice. I record the 5xx rate per route. And I do not use an exception for a cheap normal branch; I use it for a rule that has already failed."),
        ],
        [
          "A stable body with a code and a trace id, and no stack",
          "400, 404, 409, 422, 429, and 500 with a reason for each",
          "ControllerAdvice, and the same shape for a filter error",
        ],
        "Do not return the raw database message or the stack to the client, even in staging if the body is the same contract.",
      ),
    },
    {
      id: "websocket",
      conceptId: "def-websocket",
      difficulty: "pleno",
      speakSeconds: 60,
      titles: {
        pt: "O que é WebSocket?",
        en: "What is WebSocket?",
      },
      covers: ["What is WebSocket?"],
      pt: locale(
        "Defina o canal e o problema que ele resolve: o servidor precisa empurrar dado, e HTTP request-response fica caro. Diga o upgrade, e logo em seguida quando você não usaria. Feche com autenticação no handshake e com várias instâncias.",
        [
          paragraph("WebSocket é um canal full duplex sobre uma conexão TCP que começou como HTTP. O cliente pede upgrade, o servidor aceita, e os dois passam a enviar frames sem abrir uma request por mensagem. Serve para cotação, status de pedido ao vivo, ou presença, quando o servidor é quem tem a novidade."),
          paragraph("Não substitui REST de CRUD. A conexão é stateful: com várias instâncias, ou eu fixo o cliente num nó, ou publico o evento num broker e cada nó entrega para os sockets que ele segura. Sem isso, o evento cai no pod que não tem aquele cliente."),
          paragraph("Autenticação acontece no handshake, não num header mágico a cada frame. Heartbeat detecta conexão morta. No Spring, eu usaria o suporte de WebSocket, com STOMP só se o modelo pub-sub combinasse; não adiciono STOMP por reflexo."),
        ],
        [
          "Upgrade HTTP para um canal dos dois lados",
          "Bom para push; ruim como CRUD",
          "Handshake autenticado, e broker se houver mais de uma instância",
        ],
        "Não diga que WebSocket é mais rápido para toda API. O custo que ele evita é o request repetido, não a regra de negócio.",
      ),
      en: locale(
        "Define the channel and the problem it solves: the server needs to push, and request-response becomes expensive. Mention the upgrade, then when you would not use it. Close with authentication on the handshake and with multiple instances.",
        [
          paragraph("WebSocket is a full-duplex channel over a TCP connection that started as HTTP. The client requests an upgrade, the server accepts, and both sides send frames without a new request per message. It fits a quote, a live order status, or presence, when the server is the one with the news."),
          paragraph("It does not replace CRUD REST. The connection is stateful: with several instances, I either pin the client to a node or publish the event to a broker and let each node deliver to the sockets it holds. Otherwise the event lands on the pod that does not have that client."),
          paragraph("Authentication happens on the handshake, not in a magic header on every frame. A heartbeat detects a dead connection. In Spring I would use the WebSocket support, and STOMP only if the pub-sub model fit; I do not add STOMP by reflex."),
        ],
        [
          "An HTTP upgrade to a two-way channel",
          "Good for push; a poor CRUD",
          "An authenticated handshake, and a broker when there is more than one instance",
        ],
        "Do not say WebSocket is faster for every API. The cost it avoids is the repeated request, not the business rule.",
      ),
    },
    {
      id: "webclient-vs-resttemplate",
      conceptId: "def-http-clients",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Qual é a diferença entre RestTemplate e WebClient?",
        en: "What is the difference between RestTemplate and WebClient?",
      },
      covers: [
        "What is WebClient?",
        "What is the difference between RestTemplate and WebClient?",
      ],
      pt: locale(
        "Diga o estado de cada um e o modelo de thread. RestTemplate é bloqueante e está em manutenção. WebClient é o cliente novo, reativo, e bloquear o event loop dele é o erro clássico. Timeout explícito nos dois.",
        [
          paragraph("`RestTemplate` é o cliente síncrono do Spring MVC. A thread que chama fica bloqueada até a resposta. Funciona, está em modo de manutenção, e o time ainda encontra muito código nele. O defeito típico é o timeout default generoso demais, que segura a thread do Tomcat."),
          paragraph("`WebClient` é o cliente não bloqueante, em cima do Reactor Netty. A chamada devolve um `Mono` ou um `Flux`, e a thread do event loop segue para outro trabalho. Eu uso isso quando o serviço já é WebFlux ou quando há muitas chamadas externas concorrentes e eu não quero uma thread por espera."),
          paragraph("Numa aplicação MVC, dá para chamar `block()`, desde que quem bloqueia seja a thread do Tomcat e não a thread do Netty. Bloquear o event loop reproduz o problema que o WebClient queria evitar, só que pior. Nos dois clientes eu configuro connect timeout, response timeout e o pool de conexões. Para código novo síncrono, o sucessor suportado no ecossistema atual é o cliente HTTP bloqueante do Spring, `RestClient`, que tem a cara de API nova sem obrigar Reactor. Eu cito os três se a vaga for Spring recente, e não finjo que RestTemplate foi apagado do legado."),
        ],
        [
          "RestTemplate bloqueia e está em manutenção",
          "WebClient é reativo; block não pode cair no event loop",
          "Timeout e pool nos dois; RestClient é a API síncrona nova",
        ],
        "Não diga que trocar para WebClient deixa o MVC mais rápido se você dá block na mesma thread do request sem mudar o modelo.",
      ),
      en: locale(
        "Say the status of each and the thread model. RestTemplate is blocking and in maintenance. WebClient is the newer reactive client, and blocking its event loop is the classic mistake. An explicit timeout on both.",
        [
          paragraph("RestTemplate is the synchronous client from Spring MVC. The calling thread blocks until the response. It works, it is in maintenance, and teams still have a lot of it. The typical defect is a generous default timeout, which holds the Tomcat thread."),
          paragraph("WebClient is the non-blocking client, on Reactor Netty. The call returns a Mono or a Flux, and the event-loop thread moves on. I use it when the service is already WebFlux, or when many concurrent outbound calls should not cost one thread per wait."),
          paragraph("In an MVC application you can call block(), as long as the thread that blocks is the Tomcat thread and not the Netty thread. Blocking the event loop recreates the problem WebClient was meant to avoid, only worse. On both clients I set a connect timeout, a response timeout, and the connection pool. For new synchronous code, the supported successor is Spring's blocking RestClient, which has a current API without requiring Reactor. I mention all three for a recent Spring role, and I do not pretend the legacy RestTemplate has vanished."),
        ],
        [
          "RestTemplate blocks and is in maintenance",
          "WebClient is reactive; block must not hit the event loop",
          "Timeout and pool on both; RestClient is the new synchronous API",
        ],
        "Do not say switching to WebClient makes MVC faster if you block on the same request thread and change nothing else.",
      ),
    },
  ],
};
