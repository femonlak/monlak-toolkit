# BizDev Plugin

Plugin de Business Development para a Bullet. Coach comercial para pipeline de parceiros com integração Linear e Slack.

## Componentes

### Skill: bizdev-helper

Conhecimento de domínio sobre o pipeline comercial da Bullet. Cobre:

- Plano de ataque diário com priorização por urgência
- Stale alerts para oportunidades negligenciadas
- Pipeline Activity Score (0-100) com 4 componentes
- Atualização conversacional de oportunidades
- Visualização de funil
- Project updates para reporting

### Commands

| Comando | Descrição |
|---------|-----------|
| `/ataque` | Plano de ataque comercial do dia |
| `/pipeline` | Visualização do funil por projeto |
| `/diagnostico` | Diagnóstico de saúde do pipeline (score 0-100) |
| `/update-pipeline` | Gerar project update para o Linear |

### Integrações

- **Linear** - Pipeline controlado no time Partners (issues, comentários, status, project updates)
- **Slack** - Comunicação com parceiros e time

## Setup

O plugin requer conexão com Linear e Slack. Ambos são configurados automaticamente via MCP.

## Uso

O plugin responde naturalmente a pedidos sobre pipeline comercial, funil de vendas, oportunidades de parceria e follow-ups. Use os commands para atalhos rápidos ou converse livremente para acionar a skill.

Exemplos de interação:
- "Monta meu plano de ataque" ou `/ataque`
- "Como tá o pipeline?" ou `/diagnostico`
- "Tive uma reunião com a PokerStars, deixa eu te contar..."
- "O que tá parado?"
- `/pipeline Poker Operators`
