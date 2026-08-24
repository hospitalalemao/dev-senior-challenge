# Mock Service — Cadastro de Pacientes (REST)

Dependência externa **moderna (REST)** que sua API deve consumir para validar e
enriquecer os dados do paciente. Não altere este serviço.

## Endpoints

### `GET /health` → `{ "status": "ok" }`

### `GET /pacientes/:cpf`
**200**
```json
{ "cpf": "11111111111", "nome": "Ana Souza", "dataNascimento": "1988-03-12" }
```
**404** → `{ "erro": "Paciente não encontrado" }`

## Falhas intencionais (trate-as)
- **Latência** aleatória de até ~600ms.
- **`503`** em ~12% das chamadas.
- **`429` (rate limit):** acima de **5 requisições por 10s** (por IP). Respeita o
  header `Retry-After`.

A estratégia de tratamento é sua escolha (timeout, retry com backoff, circuit breaker,
cache, fallback…). Explique-a no `ARQUITETURA.md`.

## CPFs de teste
`11111111111` Ana · `22222222222` Bruno · `33333333333` Carla · `44444444444` Diego ·
`55555555555` Elaine. Demais CPFs → 404.
