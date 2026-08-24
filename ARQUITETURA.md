# Arquitetura & Decisões — [seu nome]

> Este é o documento mais importante da sua entrega. Não precisa ser longo — precisa
> deixar claro **o que você decidiu e por quê**. Sinta-se livre para ajustar a
> estrutura.

## Visão geral
_Um diagrama (pode ser ASCII) ou uma descrição do desenho: componentes, fluxo de um
check-in de ponta a ponta, onde entram os serviços externos e a mensageria._

## Recorte
_O que você escolheu implementar de fato (a fatia vertical) e o que deixou como
desenho/documentação. Por quê._

## Decisões (ADRs)

Use ADRs curtos. Exemplo do formato:

### ADR 1 — [título da decisão]
- **Contexto:** o problema/restrição.
- **Decisão:** o que você escolheu.
- **Alternativas consideradas:** o que descartou e por quê.
- **Consequências:** trade-offs, o que fica mais fácil e o que fica mais difícil.

_(Sugestões de temas que gostaríamos de ver abordados em algum ADR:)_
- Estratégia de **resiliência** para o cadastro REST (timeout, retry/backoff, circuit
  breaker, cache, fallback) e para os `429`.
- Como você trata o **legado XML** e a falha dele **de forma independente** do cadastro
  (degradação graciosa?).
- **Mensageria:** por que publicar evento, garantia de entrega, e **idempotência** /
  reprocessamento.
- **Persistência** e modelagem.
- **Observabilidade:** o que logar (sem PII), health checks, métricas em produção.

## Segurança & LGPD
_Onde estão os dados sensíveis, riscos de privacidade e mitigações (trânsito/repouso,
logs, retenção, minimização). O que você faria antes de ir para produção._

## Testes
_Sua estratégia: o que testou, em que nível, e o que conscientemente deixou de fora._

## Próximos passos rumo a produção
_O que falta e como você evoluiria isto._
