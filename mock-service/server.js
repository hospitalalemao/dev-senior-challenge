// Serviço externo (mock) de cadastro de pacientes — REST.
// Simula uma dependência REAL e instável. NÃO precisa ser alterado.
//
// Falhas intencionais:
//  - latência aleatória (até ~600ms);
//  - ~12% de 503 (indisponibilidade);
//  - rate limit: mais de 5 req / 10s por IP -> 429.

const express = require("express");
const app = express();
app.use(express.json());

const PACIENTES = {
  "11111111111": { nome: "Ana Souza",        dataNascimento: "1988-03-12" },
  "22222222222": { nome: "Bruno Carvalho",   dataNascimento: "1975-11-02" },
  "33333333333": { nome: "Carla Menezes",    dataNascimento: "1993-07-25" },
  "44444444444": { nome: "Diego Fernandes",  dataNascimento: "2001-01-30" },
  "55555555555": { nome: "Elaine Rodrigues", dataNascimento: "1960-09-18" },
};

// Rate limit simples por IP: janela de 10s, máx 5 requisições.
const janela = new Map(); // ip -> { count, resetAt }
function rateLimit(req, res, next) {
  const ip = req.ip || "anon";
  const agora = Date.now();
  const registro = janela.get(ip);
  if (!registro || agora > registro.resetAt) {
    janela.set(ip, { count: 1, resetAt: agora + 10_000 });
    return next();
  }
  registro.count += 1;
  if (registro.count > 5) {
    const retryAfter = Math.ceil((registro.resetAt - agora) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({ erro: "Rate limit excedido" });
  }
  return next();
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/pacientes/:cpf", rateLimit, (req, res) => {
  const atraso = Math.floor(Math.random() * 600);
  setTimeout(() => {
    if (Math.random() < 0.12) {
      return res.status(503).json({ erro: "Serviço temporariamente indisponível" });
    }
    const cpf = String(req.params.cpf).replace(/\D/g, "");
    const paciente = PACIENTES[cpf];
    if (!paciente) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }
    return res.json({ cpf, ...paciente });
  }, atraso);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock REST (cadastro) na porta ${PORT}`));
