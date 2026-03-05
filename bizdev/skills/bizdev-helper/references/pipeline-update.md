# Pipeline Project Update

Update consolidado do projeto/funil para reporting no Linear. Adaptado para contexto comercial.

## Diferenças do Update Padrão

1. **Score usa Pipeline Activity Score** (0-100) em vez do Quality Check Score
2. **DONE lista deals que avançaram ou fecharam**, não issues "completed"
3. **NEXT foca em ações comerciais concretas**, não issues "in progress"
4. **Seção extra: PIPELINE SNAPSHOT** com contagem por estágio
5. **Health baseado no Pipeline Activity Score**

## Process

### Step 1: Coletar Dados

1. Listar issues do projeto (todas as issues)
2. Para cada issue ativa: buscar comentários (último comentário)
3. Calcular Pipeline Activity Score (ver pipeline-scoring.md)

### Step 2: Confirmar Período

Perguntar: "Qual o período deste update?" (ex: última semana, últimos 15 dias)

### Step 3: Montar Update

Identificar:
- Oportunidades que avançaram de status no período (DONE)
- Ações realizadas relevantes mencionadas nos comentários (DONE)
- Próximas ações críticas extraídas dos comentários (NEXT)
- Bloqueios e riscos (BLOCKERS)

### Step 4: Gerar e Confirmar

Apresentar update para aprovação. Após confirmação, postar via Linear.

## Formato do Update

```
Pipeline Activity Score: XX/100 [emoji] [classificação]

[2 linhas de contexto sobre movimentação do pipeline no período]

PIPELINE SNAPSHOT
- To Contact: X | Contacted: X | In Conversation: X
- Negotiating: X | Contract Review: X | Integration: X
- In Discussion: X | Live: X | Lost: X

MOVIMENTAÇÃO NO PERÍODO
- [Oportunidade]: [de status] > [para status] - [contexto breve]
- [Oportunidade]: [ação relevante realizada]

PRÓXIMAS AÇÕES
- [Oportunidade]: [ação específica] (prazo se houver)
- [Oportunidade]: [ação específica]

BLOQUEIOS / RISCOS (se houver)
- [Bloqueio ou risco identificado]
```

## Health Mapping

| Pipeline Activity Score | Linear Health |
|------------------------|---------------|
| 80-100 | onTrack |
| 50-79 | atRisk |
| 0-49 | offTrack |

## Regras

- NUNCA incluir issue codes (PARTNER-XX)
- Focar em nomes das oportunidades e ações concretas
- MOVIMENTAÇÃO lista mudanças de status E ações relevantes (reuniões, propostas enviadas)
- PRÓXIMAS AÇÕES devem ser extraídas dos "Próximos passos" dos comentários mais recentes
- Se não houver movimentação no período, dizer explicitamente e listar o que deveria ter acontecido
