// Serviço LEGADO de agendamentos — responde em XML (estilo SOAP/legado).
// Simula um sistema antigo com o qual a sua API precisa integrar.
// NÃO precisa ser alterado.
//
// Falhas intencionais: latência (até ~800ms) e ~10% de 500.

const express = require("express");
const app = express();
app.use(express.text({ type: "*/*" })); // corpo cru, como sistemas legados costumam mandar

// Agendamentos do dia por CPF (fictícios).
const AGENDA = {
  "11111111111": { especialidade: "Cardiologia",  horario: "09:30", medico: "Dr. Prado" },
  "33333333333": { especialidade: "Ortopedia",    horario: "11:00", medico: "Dra. Lemos" },
  "55555555555": { especialidade: "Oftalmologia", horario: "14:15", medico: "Dr. Assis" },
  // Bruno (222...) e Diego (444...) NÃO têm agendamento hoje (walk-in).
};

function xmlResposta(cpf, ag) {
  if (!ag) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<AgendamentoResponse>
  <cpf>${cpf}</cpf>
  <possuiAgendamento>false</possuiAgendamento>
</AgendamentoResponse>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<AgendamentoResponse>
  <cpf>${cpf}</cpf>
  <possuiAgendamento>true</possuiAgendamento>
  <especialidade>${ag.especialidade}</especialidade>
  <horario>${ag.horario}</horario>
  <medico>${ag.medico}</medico>
</AgendamentoResponse>`;
}

app.get("/health", (_req, res) => res.type("text/plain").send("OK"));

// Estilo legado: um único endpoint que recebe o CPF por querystring e devolve XML.
// GET /agendamento?cpf=XXXXXXXXXXX
app.get("/agendamento", (req, res) => {
  const atraso = Math.floor(Math.random() * 800);
  setTimeout(() => {
    if (Math.random() < 0.1) {
      return res
        .status(500)
        .type("application/xml")
        .send(`<?xml version="1.0"?><Fault><message>Erro interno</message></Fault>`);
    }
    const cpf = String(req.query.cpf || "").replace(/\D/g, "");
    res.type("application/xml").send(xmlResposta(cpf, AGENDA[cpf]));
  }, atraso);
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => console.log(`Legacy XML (agendamentos) na porta ${PORT}`));
