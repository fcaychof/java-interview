import {
  locale,
  paragraph,
  type InterviewSection,
} from "../interview-model";
import { qualityAndAwsTheory } from "../theory/quality-and-aws";

export const qualityAndAws: InterviewSection = {
  id: "quality-and-aws",
  order: 15,
  titles: {
    pt: "Qualidade de código e AWS",
    en: "Code quality and AWS",
  },
  summaries: {
    pt: "O que a cobertura mede de verdade, por que o Sonar existe, e a diferença entre EC2, ECS e Lambda.",
    en: "What coverage actually measures, why Sonar exists, and the difference between EC2, ECS, and Lambda.",
  },
  theory: qualityAndAwsTheory,
  questions: [
    {
      id: "code-coverage",
      conceptId: "def-coverage",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Para que serve a cobertura, e como eu meço?",
        en: "What is code coverage for, and how do you measure it?",
      },
      covers: [
        "Have you worked with SonarQube and code coverage?",
        "How do you implement code coverage in an application?",
        "What is the purpose of code coverage?",
      ],
      pt: locale(
        "Se a pergunta é se você já usou, conte a ferramenta e uma decisão que a cobertura mudou. Na definição, diga que cobertura mostra o que o teste não executou, não que o teste está certo. Fale de código novo, não de um número mágico no legado.",
        [
          paragraph("Cobertura é a fração do código executada pelos testes, por linha e por ramo. O propósito é achar caminho que ninguém exercitou: um else, um catch, um limite. Não prova que a asserção confere o resultado. Dá para ter 100% com teste que não verifica nada."),
          paragraph("Num projeto Java eu ligo o JaCoCo no agente dos testes, deixo o Maven ou o Gradle gerar o relatório XML e o HTML, e publico isso no CI. O diff coverage, a cobertura do código novo, entra no quality gate. Cair a cobertura do que você acabou de escrever quebra o build. Exigir 80% no repositório inteiro, de uma vez, só gera teste de getter."),
          paragraph("Quando eu conto experiência, eu descrevo um buraco real: o JaCoCo mostrou o catch de timeout sem teste, a gente cobriu o ramo, e o bug de retry duplicado apareceu ali. Se você ainda não operou o Sonar, diga que mediu com JaCoCo localmente e saiba explicar o relatório."),
        ],
        [
          "Cobertura acha caminho não executado, não prova correção",
          "JaCoCo no teste, relatório no CI, gate no código novo",
          "Conte um buraco que o relatório revelou, sem inventar",
        ],
        "Não prometa um percentual como sinal de qualidade. Não escreva teste sem asserção para subir o número.",
      ),
      en: locale(
        "If the question is whether you have used it, name the tool and one decision coverage changed. In the definition, say coverage shows what the test did not run, not that the test is right. Talk about new code, not a magic number on the legacy.",
        [
          paragraph("Coverage is the fraction of code the tests execute, by line and by branch. Its purpose is to find a path nobody exercised: an else, a catch, a boundary. It does not prove the assertion checks the result. You can have 100% with a test that verifies nothing."),
          paragraph("On a Java project I attach JaCoCo to the test agent, have Maven or Gradle write the XML and HTML report, and publish that in CI. Diff coverage, the coverage of new code, is what enters the quality gate. A drop in the coverage of what you just wrote fails the build. Demanding 80% of the whole repository at once only produces getter tests."),
          paragraph("When I talk about experience, I describe a real hole: JaCoCo showed the timeout catch had no test, we covered the branch, and the duplicate-retry bug was sitting there. If you have not operated Sonar, say you measured with JaCoCo locally and be ready to explain the report."),
        ],
        [
          "Coverage finds an unexecuted path; it does not prove correctness",
          "JaCoCo on the test run, the report in CI, the gate on new code",
          "Tell about a hole the report revealed, and do not invent one",
        ],
        "Do not promise a percentage as a sign of quality. Do not write an assertion-free test to raise the number.",
      ),
    },
    {
      id: "sonarqube",
      conceptId: "def-sonar",
      difficulty: "pleno",
      speakSeconds: 60,
      titles: {
        pt: "Por que usamos SonarQube?",
        en: "Why do we use SonarQube?",
      },
      covers: ["Why do we use SonarQube?"],
      pt: locale(
        "Diga o que o teste não vê: bug provável, vulnerabilidade, duplicação e complexidade, no pull request, com a mesma régua para o time. Cobertura é uma entrada do Sonar, não o produto inteiro.",
        [
          paragraph("SonarQube analisa o código sem executar o caminho de produção. Ele marca bug provável, code smell, duplicação e vulnerabilidade, como SQL concatenado, segredo no repositório ou um catch vazio. O quality gate no pull request impede que o código novo piore essa régua, mesmo que o autor tenha esquecido."),
          paragraph("O teste vê o comportamento que alguém escreveu. O Sonar vê padrão que o teste não cobriu e defeito que passa com o happy path verde. Os dois juntos. Eu não trato o gate como revisão humana: ele não entende a regra de negócio. E não saio corrigindo smell antigo no meio de uma mudança funcional; o gate olha o código novo para o legado não paralisar o time."),
        ],
        [
          "Análise estática no pull request, com a mesma régua",
          "Bug, vulnerabilidade, duplicação e complexidade, além da cobertura",
          "Não substitui teste nem revisão",
        ],
        "Não diga que o Sonar prova que o sistema está seguro ou sem bug. Ele aponta um conjunto de padrões.",
      ),
      en: locale(
        "Say what the test does not see: a likely bug, a vulnerability, duplication, and complexity, on the pull request, with one bar for the team. Coverage is an input to Sonar, not the whole product.",
        [
          paragraph("SonarQube analyzes the code without running the production path. It flags a likely bug, a code smell, duplication, and a vulnerability, such as concatenated SQL, a secret in the repository, or an empty catch. The quality gate on the pull request stops new code from lowering that bar, even when the author forgot."),
          paragraph("The test sees the behavior someone wrote. Sonar sees a pattern the test did not cover and a defect that passes with a green happy path. The two belong together. I do not treat the gate as a human review: it does not understand the business rule. And I do not fix an old smell in the middle of a functional change; the gate watches new code so the legacy does not freeze the team."),
        ],
        [
          "Static analysis on the pull request, with one bar",
          "Bugs, vulnerabilities, duplication, and complexity, besides coverage",
          "It replaces neither tests nor review",
        ],
        "Do not say Sonar proves the system is secure or free of bugs. It flags a set of patterns.",
      ),
    },
    {
      id: "ec2-ecs-lambda",
      conceptId: "def-compute",
      difficulty: "pleno",
      speakSeconds: 70,
      titles: {
        pt: "Qual é a diferença entre EC2, ECS e Lambda?",
        en: "What is the difference between EC2, ECS, and Lambda?",
      },
      covers: ["Difference between EC2, ECS and Lambda."],
      pt: locale(
        "Suba o nível de abstração a cada um: máquina, container, função. Diga quem opera o sistema, quanto tempo o processo vive, e por que um Spring Boot permanente costuma ir para ECS e não para Lambda.",
        [
          paragraph("EC2 é uma máquina virtual. Você escolhe o sistema, aplica patch, sobe o processo e convive com capacidade ociosa se dimensionar para o pico. Controle total, operação alta. Cabe legado que precisa de disco, rede especial ou um agente que não cabe em container."),
          paragraph("ECS roda container. Você entrega a imagem e o serviço; o cluster é EC2 gerenciado por você ou Fargate, em que a AWS opera o nó. É o encaixe natural de um Spring Boot que fica no ar, com várias instâncias, health check e deploy gradual. EKS é a variante Kubernetes, quando o time quer a API do Kubernetes e aceita operá-la."),
          paragraph("Lambda é uma função disparada por evento, escala até zero e cobra por invocação. O processo não fica quente. Para Java, cold start dói, e quinze minutos é o teto. Serve para cola, um webhook leve, uma reação a arquivo. Uma API Spring com tráfego contínuo fica mais previsível em ECS ou EKS do que espremida numa função."),
        ],
        [
          "EC2 é a máquina; você opera o sistema",
          "ECS é o container, com Fargate sem operar o nó",
          "Lambda escala a zero e pune Java no cold start",
        ],
        "Não diga que Lambda substitui qualquer backend Java. O modelo de vida do processo é outro.",
      ),
      en: locale(
        "Raise the abstraction each time: machine, container, function. Say who operates the system, how long the process lives, and why a long-running Spring Boot usually belongs on ECS and not on Lambda.",
        [
          paragraph("EC2 is a virtual machine. You choose the OS, patch it, run the process, and live with idle capacity if you sized for the peak. Full control, high operations. It fits a legacy process that needs a disk, a special network, or an agent that does not fit a container."),
          paragraph("ECS runs a container. You ship the image and the service; the cluster is EC2 you manage or Fargate, where AWS runs the node. It is the natural fit for a Spring Boot that stays up, with several instances, a health check, and a gradual deploy. EKS is the Kubernetes variant, when the team wants the Kubernetes API and accepts operating it."),
          paragraph("Lambda is a function triggered by an event, scales to zero, and is billed per invocation. The process does not stay warm. For Java, cold start hurts, and fifteen minutes is the ceiling. It fits glue, a small webhook, a reaction to a file. A Spring API with steady traffic is more predictable on ECS or EKS than squeezed into a function."),
        ],
        [
          "EC2 is the machine; you operate the OS",
          "ECS is the container, and Fargate means you do not operate the node",
          "Lambda scales to zero and penalizes Java on cold start",
        ],
        "Do not say Lambda replaces any Java backend. The lifetime of the process is different.",
      ),
    },
    {
      id: "aws-monitoring",
      conceptId: "def-aws-monitoring",
      difficulty: "pleno",
      speakSeconds: 60,
      titles: {
        pt: "Como eu monitoro aplicação na AWS?",
        en: "How do you monitor applications on AWS?",
      },
      covers: ["How do you monitor applications in AWS?"],
      pt: locale(
        "Comece pelo sintoma do usuário, não pela lista de serviços. Latência e erro no load balancer, saúde do alvo, log e trace, e só então CPU. Diga que métrica de aplicação sai do Micrometer, não só do hypervisor.",
        [
          paragraph("O sinal de fora é o do load balancer: latência, 5xx, hosts saudáveis e conexões recusadas. Se o alvo está unhealthy, eu olho o health check antes de olhar a CPU da instância. Log vai para o CloudWatch Logs, com o trace id, e um alarme dispara em taxa de erro e em latência, não só em CPU alta."),
          paragraph("Por dentro, a aplicação publica métrica dela, JVM, pool, fila e latência por rota, via Micrometer para CloudWatch ou para o Prometheus que o time já usa. Trace, X-Ray ou OpenTelemetry, liga o request ao RDS e à chamada externa. No RDS eu olho conexão, CPU, armazenamento livre e réplica. No ECS, o serviço mostra task que não estabiliza."),
          paragraph("Alarme sem dono não serve. Cada um tem limiar que representa usuário sofrendo, e uma ação: scale, página, ou rollback. Dashboard de CPU sozinho deixa a API lenta passar."),
        ],
        [
          "ALB: latência, 5xx e alvo saudável",
          "Métrica da aplicação via Micrometer, mais log e trace",
          "Alarme no sintoma do usuário, não só na CPU",
        ],
        "Não liste dez serviços da AWS sem dizer qual gráfico você abre primeiro.",
      ),
      en: locale(
        "Start from the user's symptom, not from the service list. Latency and errors at the load balancer, target health, logs and traces, and only then CPU. Say application metrics come from Micrometer, not only from the hypervisor.",
        [
          paragraph("The outside signal is the load balancer: latency, 5xx, healthy hosts, and rejected connections. If the target is unhealthy, I look at the health check before the instance CPU. Logs go to CloudWatch Logs, with the trace id, and an alarm fires on error rate and latency, not only on high CPU."),
          paragraph("Inside, the application publishes its own metrics, JVM, pool, queue, and latency per route, through Micrometer to CloudWatch or to the Prometheus the team already uses. A trace, X-Ray or OpenTelemetry, ties the request to RDS and to the outbound call. On RDS I watch connections, CPU, free storage, and replica lag. On ECS, the service shows a task that will not stabilize."),
          paragraph("An alarm without an owner is useless. Each one has a threshold that means a user is suffering, and an action: scale, page, or roll back. A CPU dashboard alone lets a slow API pass."),
        ],
        [
          "The load balancer: latency, 5xx, and healthy targets",
          "Application metrics through Micrometer, plus logs and traces",
          "An alarm on the user symptom, not only on CPU",
        ],
        "Do not list ten AWS services without saying which graph you open first.",
      ),
    },
  ],
};
