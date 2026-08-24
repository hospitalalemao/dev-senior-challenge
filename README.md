# Desafio Técnico — Desenvolvedor Sênior (Full Stack)

Olá! Este desafio faz parte do nosso processo seletivo para uma posição sênior.

Diferente de um desafio júnior/pleno, aqui **não estamos avaliando se você consegue
implementar um CRUD** — sabemos que consegue. Estamos avaliando **como você projeta,
decide e comunica** um sistema sob restrições reais: dependências instáveis, requisitos
de resiliência, dados sensíveis e escolhas de arquitetura com trade-offs.

**Importante sobre o escopo:** o enunciado é propositalmente maior do que 1 dia de
trabalho. **Não queremos que você faça tudo.** Queremos que você escolha o que faz
sentido, **implemente bem uma fatia vertical** e **documente as decisões** — inclusive
o que decidiu *não* fazer e por quê. Um recorte pequeno, sólido e bem justificado vale
muito mais do que um projeto grande e raso.

**Tempo sugerido:** ~1 dia de trabalho focado. Respeite seu tempo.

---

## O contexto de negócio

Você vai desenhar o núcleo de um sistema de **check-in de pacientes** para a recepção
de um hospital (o fluxo do totem). Parece simples, mas tem as características complexas de
um sistema real de saúde:

- depende de **serviços externos instáveis** (um cadastro moderno em REST e um sistema
  **legado** que só fala XML);
- lida com **dado sensível de paciente** (contexto de LGPD);
- precisa ser **confiável** mesmo quando as dependências falham;
- é ponto de entrada de um fluxo maior — outros sistemas precisam **reagir** a cada
  check-in.

---

## O domínio

1. O paciente faz check-in informando o CPF.
2. O sistema consulta o **cadastro (REST)** para validar e enriquecer os dados do
   paciente (`mock-service`).
3. O sistema consulta o **sistema legado (XML/SOAP-like)** para verificar se há um
   **agendamento** para aquele paciente no dia (`legacy-service`).
4. O check-in entra em uma **fila de atendimento**, com status
   (`aguardando` → `em_atendimento` → `finalizado`).
5. A cada novo check-in, um **evento é publicado** para que outros sistemas possam
   reagir (ex.: painel de senha, notificação da equipe).
6. A recepção acompanha e opera a fila.

---

## O que esperamos que você demonstre

Não é uma checklist de "fazer tudo". É o conjunto de competências que queremos **ver
evidência** de que você domina — via código **ou** via documentação de decisão.

### Arquitetura e código
- API em **Node.js + TypeScript / NestJS**, bem modularizada.
- Front-end em **React** para operar o check-in e a fila (pode ser enxuto; o foco é
  back-end/arquitetura).
- Modelagem coerente e separação clara de responsabilidades.

### Resiliência (aqui está o coração do desafio)
As dependências externas **falham de propósito** (veja os READMEs dos serviços):
latência, `503` intermitente e `429` (rate limit). Queremos ver como você trata isso —
**timeout, retry com backoff, circuit breaker, fallback, idempotência** — e, mais
importante, **por que** escolheu cada estratégia. Não precisa aplicar todas; precisa
justificar.

### Integração
- Consumo do **cadastro REST** (`mock-service`).
- Consumo do **legado XML/SOAP-like** (`legacy-service`) — parsing e mapeamento do
  contrato legado para o seu domínio.

### Arquitetura distribuída
- Publicação de um **evento por check-in** (mensageria/fila). Um broker está disponível
  no `docker-compose.yml`, mas você pode justificar outra abordagem.
- Pensar em **idempotência** e no que acontece em caso de reprocessamento.

### Qualidade e operação
- **Estratégia de testes** consciente (unit + integração; e2e se fizer sentido).
  Não buscamos cobertura alta — buscamos testes nos lugares certos.
- **Observabilidade**: logs estruturados, health checks, e o que você exporia de
  métrica em produção.
- Como você subiria isso: **Docker** e um esboço de **CI**.

### Segurança e LGPD
- O sistema lida com dado de paciente. Aponte **onde** estão os riscos de privacidade e
  como você os mitigaria (dados em trânsito/repouso, logs que não vazam PII, retenção,
  minimização). Não precisa implementar tudo — precisa **demonstrar a maturidade** do
  raciocínio.

### (Opcional) IA com responsabilidade
Se quiser, adicione um recurso de IA — por exemplo, priorização/triagem sugerida da
fila. Se fizer, o que mais nos interessa são os **guardrails**: privacidade dos dados
enviados ao modelo, o que fazer com baixa confiança, e por que a decisão final continua
sendo humana num contexto clínico.

---

## Entregáveis

Além do código:

1. **`ARQUITETURA.md`** — o documento mais importante da entrega. Explique o desenho,
   os trade-offs e as decisões. Use o formato que preferir (recomendamos alguns
   **ADRs** curtos — Architecture Decision Records). Queremos entender *por que*, não só
   *o quê*.
2. **`ENTREGA.md`** — como rodar, o que está pronto, o que ficou fora do recorte e
   quais seriam os próximos passos rumo a produção.

---

## Como entregar

1. Faça um **fork** deste repositório.
2. Desenvolva na sua cópia, com um histórico de commits que conte a evolução do
   raciocínio.
3. Preencha `ARQUITETURA.md` e `ENTREGA.md`.
4. Envie o **link do seu fork** (público ou com acesso concedido).

---

## Como avaliamos

Peso alto em **julgamento de engenharia**, não em quantidade de features:

- **Decisões de arquitetura:** você entende os trade-offs e escolhe conscientemente?
- **Resiliência:** o sistema se comporta bem quando as dependências falham?
- **Qualidade:** código limpo, testes nos lugares certos, operabilidade.
- **Segurança/LGPD:** maturidade no trato de dado sensível.
- **Comunicação:** seus documentos deixam claro o raciocínio para o time?

Estamos explicitamente **ok com escopo incompleto**. Preferimos uma fatia vertical
sólida, resiliente e bem explicada a um sistema amplo e frágil.

---

## O que já entregamos para você

- `mock-service/` — cadastro de pacientes (**REST**), com falhas intencionais
  (latência, `503`, `429`). Ver `mock-service/README.md`.
- `legacy-service/` — sistema de agendamentos **legado (XML/SOAP-like)**, também
  instável. Ver `legacy-service/README.md`.
- `docker-compose.yml` — ponto de partida com os dois serviços externos, um banco
  PostgreSQL e um broker RabbitMQ já disponíveis. Complete com `api` e `web`.

Boa sorte. Estamos mais interessados em como você pensa do que em quantas linhas você
escreve.
