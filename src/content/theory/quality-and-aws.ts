import { concept, paragraph, theoryGroup, type TheoryGroup } from "../interview-model";

export const qualityAndAwsTheory: readonly TheoryGroup[] = [
  theoryGroup("quality-theory", "Qualidade e AWS", "Quality and AWS", [
    concept(
      "def-coverage",
      "Cobertura",
      "Coverage",
      [
        paragraph("Cobertura mede qual linha, ramo ou instrução o teste executou. Não mede se a asserção era a certa. Cem por cento com teste que não confere o resultado é cem por cento de execução, não de proteção. O número serve para achar o que ninguém exercitou, em especial o ramo de erro."),
        paragraph("Eu olho o buraco, não o percentual sozinho. Regra de dinheiro sem teste, e getter com teste, invertem o valor. JaCoCo no CI publica o relatório. Um limite que só sobe impede o buraco novo. Um limite alto, cobrado de código gerado e de configuração, ensina o time a testar o que não importa."),
      ],
      [
        paragraph("Coverage measures which line, branch, or instruction the test executed. It does not measure whether the assertion was the right one. One hundred percent with a test that does not check the result is one hundred percent of execution, not of protection. The number is for finding what nobody exercised, especially the error branch."),
        paragraph("I look at the hole, not at the percentage alone. A money rule with no test, and a getter with a test, invert the value. JaCoCo in CI publishes the report. A gate that only rises prevents the new hole. A high gate, charged on generated code and configuration, teaches the team to test what does not matter."),
      ],
    ),
    concept(
      "def-sonar",
      "SonarQube",
      "SonarQube",
      [
        paragraph("SonarQube analisa o código parado: bug provável, vulnerabilidade, code smell, duplicação e cobertura. O quality gate falha o pipeline quando a condição combinada não passa. O valor é pegar o mesmo critério em todo PR, não a opinião de quem revisou naquele dia."),
        paragraph("Smell não é defeito em produção. Tratar os dois com a mesma urgência esconde o bug verdadeiro. Eu começo por bug e vulnerabilidade, e pelo código novo. Dívida antiga, cobrada inteira num PR pequeno, para o trabalho. A regra que o time não entende vira ruído, e o ruído faz o gate ser ignorado."),
      ],
      [
        paragraph("SonarQube analyzes the code at rest: likely bugs, vulnerabilities, code smells, duplication, and coverage. The quality gate fails the pipeline when the agreed condition does not pass. The value is the same criterion on every PR, not the opinion of whoever reviewed that day."),
        paragraph("A smell is not a production defect. Treating the two with the same urgency hides the real bug. I start with bugs and vulnerabilities, and with the new code. Old debt, charged in full on a small PR, stops the work. A rule the team does not understand becomes noise, and the noise makes the gate get ignored."),
      ],
    ),
    concept(
      "def-compute",
      "EC2, ECS e Lambda",
      "EC2, ECS, and Lambda",
      [
        paragraph("EC2 é a máquina. Eu cuido do sistema, do processo e da escala da instância. Cabe em workload com estado local, licença, ou controle fino do SO. ECS roda container num cluster. A unidade de deploy é a imagem, e o serviço mantém a contagem de tasks. A máquina ainda existe, mas o que eu versiono é o container."),
        paragraph("Lambda executa uma função num evento, escala a zero, e cobra o tempo. Cabe em trabalho curto, disparado por fila, HTTP ou arquivo. Conexão de banco em função que nasce o tempo todo esgota o banco se cada invocação abre a sua. Cold start aparece na latência. Processo longo, WebSocket permanente, ou latência estável no percentil baixo, não é o encaixe dela."),
      ],
      [
        paragraph("EC2 is the machine. I take care of the system, the process, and the instance scale. It fits a workload with local state, a license, or fine control of the OS. ECS runs a container on a cluster. The deploy unit is the image, and the service keeps the task count. The machine still exists, but what I version is the container."),
        paragraph("Lambda runs a function on an event, scales to zero, and bills the time. It fits short work, fired by a queue, HTTP, or a file. A database connection in a function that is born all the time exhausts the database if each invocation opens its own. Cold start shows up in latency. A long process, a permanent WebSocket, or stable latency at a low percentile is not its fit."),
      ],
    ),
    concept(
      "def-aws-monitoring",
      "Monitorar na AWS",
      "Monitoring on AWS",
      [
        paragraph("Métrica diz a tendência: latência, erro, CPU, profundidade da fila. Log diz o request. Trace diz o caminho. Alarme em cima de sintoma de usuário, erro e latência, acorda gente. Alarme em cima de CPU sem contexto acorda gente para nada, ou não acorda quando o usuário já sofre com CPU baixa."),
        paragraph("CloudWatch guarda métrica e log. O serviço precisa emitir o que a plataforma não vê, o tempo do caso de uso e o id de correlação. Health check que só devolve 200 com o banco fora tira a instância do problema errado, ou mantém a instância doente no balanceador. Eu alarmo o que o usuário sente e deixo o detalhe da JVM para o painel, não para a página de madrugada."),
      ],
      [
        paragraph("A metric says the trend: latency, errors, CPU, queue depth. A log says the request. A trace says the path. An alarm on a user symptom, errors and latency, wakes people up. An alarm on CPU with no context wakes people for nothing, or does not wake them when the user is already suffering at low CPU."),
        paragraph("CloudWatch keeps metrics and logs. The service has to emit what the platform does not see, the use case time and the correlation id. A health check that only returns 200 with the database down pulls the instance for the wrong problem, or keeps the sick instance in the load balancer. I alarm what the user feels and leave the JVM detail for the dashboard, not for the night page."),
      ],
    ),
  ]),
];
