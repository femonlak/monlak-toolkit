# Catálogo de Agentes Skynet

Lista dos agentes planejados para o Projeto Skynet. Este documento é atualizado conforme novos agentes são criados ou modificados.

## Projeto Linear

- **Nome:** Implementar Projeto Skynet
- **Time:** Pillars
- **Lead:** Felipe Lachowski
- **Initiative:** Atingir eficiência operacional

## Agentes Planejados

| # | Agente | Área | Pilar | DRI | Status |
|---|--------|------|-------|-----|--------|
| 1 | Agente de CX Autônomo | Customer Experience | Business | Vic | Planned |
| 2 | Agente de KYC/Compliance | Compliance/AML | Business | Arthur | Planned |
| 3 | Agente de Treasury/Reconciliação | Financeiro | Business | Paulo David | Planned |
| 4 | Agente de Settlement | Financeiro | Business | Paulo David | Planned |
| 5 | Agente de Reporting/BI | Business Intelligence | Core | Felipe | Planned |
| 6 | Agente de Onboarding Ops | Onboarding | Business | Nicholas | Planned |
| 7 | Agente de Gestão/PM | Project Management | Core | Felipe | Planned |

Status possíveis: Planned → In Development → Built → Validated → Live

## Skills Planejadas por Agente

### 1. Agente de CX Autônomo
- Resolver tickets L1 sem escalação humana
- Escalar tickets L2 com contexto estruturado
- Gerar FAQ dinâmica a partir de tickets recorrentes
- Coletar e analisar CSAT automaticamente

### 2. Agente de KYC/Compliance
- Analisar documentos de identidade automaticamente
- Executar screening PEP/sanctions
- Scoring automático de risco (aprovar low-risk sem humano)
- Gerar relatórios de compliance periódicos

### 3. Agente de Treasury/Reconciliação
- Executar reconciliação automática (saldos teóricos vs reais)
- Gerar alertas de breaks financeiros
- Monitorar exposição cambial em tempo real
- Controlar fluxo de caixa com projeções

### 4. Agente de Settlement
- Calcular settlement (netting, comissões, impostos)
- Gerar instruções de pagamento automaticamente
- Executar reporting regulatório FX
- Controlar rolling reserve

### 5. Agente de Reporting/BI
- Gerar reports regulatórios automaticamente
- Atualizar dashboards de KPIs
- Criar Bulletin quinzenal automaticamente
- Disparar alertas de métricas fora do target

### 6. Agente de Onboarding Ops
- Executar follow-up automático de onboarding incompleto
- Comunicar status de KYC/KYB proativamente ao cliente
- Identificar e reengajar clientes inativos pós-onboarding

### 7. Agente de Gestão/PM
- Gerar project updates automáticos no Linear
- Criar status reports por pilar/initiative
- Identificar e alertar issues paradas/bloqueadas
- Gerar attack plans de pipeline comercial

---

## Notas

- Esta lista é o ponto de partida. Agentes e skills podem ser adicionados, removidos ou modificados conforme o projeto evolui.
- A priorização de quais agentes construir primeiro deve considerar: impacto em horas economizadas, complexidade de implementação, e dependências técnicas.
- Cada agente precisa ter seu documento completo (usando agent-template.md) antes de iniciar implementação.
- Cada skill precisa ter seu documento completo (usando skill-template.md) antes de iniciar implementação.
