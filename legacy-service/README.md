# Legacy Service — Agendamentos (XML / SOAP-like)

Dependência **legada** que responde em **XML**. Sua API deve consultá-la para saber se
o paciente tem agendamento no dia e mapear esse contrato antigo para o seu domínio.
Não altere este serviço.

## Contrato

### `GET /health` → `OK` (texto puro)

### `GET /agendamento?cpf=XXXXXXXXXXX`
Recebe o CPF por querystring e devolve XML.

**Com agendamento**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<AgendamentoResponse>
  <cpf>11111111111</cpf>
  <possuiAgendamento>true</possuiAgendamento>
  <especialidade>Cardiologia</especialidade>
  <horario>09:30</horario>
  <medico>Dr. Prado</medico>
</AgendamentoResponse>
```

**Sem agendamento (walk-in)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<AgendamentoResponse>
  <cpf>22222222222</cpf>
  <possuiAgendamento>false</possuiAgendamento>
</AgendamentoResponse>
```

**Erro (intermitente)** → `500` com corpo `<Fault>...`

## Falhas intencionais (trate-as)
- **Latência** de até ~800ms.
- **`500`** em ~10% das chamadas.

## Dados de teste
| CPF          | Agendamento hoje |
|--------------|------------------|
| 11111111111  | Cardiologia 09:30 (Dr. Prado) |
| 33333333333  | Ortopedia 11:00 (Dra. Lemos)  |
| 55555555555  | Oftalmologia 14:15 (Dr. Assis)|
| 22222222222  | sem agendamento (walk-in)     |
| 44444444444  | sem agendamento (walk-in)     |

> Dica: pense em como o fluxo se comporta quando **este** serviço está fora mas o
> cadastro REST está de pé (e vice-versa). Um check-in deveria falhar por completo
> porque o legado caiu? Justifique sua escolha.
