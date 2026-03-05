# Pipeline Activity Score (0-100)

Score que mede nível de atividade do pipeline comercial por projeto.

## Universo de Análise

Apenas issues com status ativos: To Contact, Contacted, In Conversation, Negotiating, Contract Review, Integration, In Discussion.

## Multiplicador de Urgência por Estágio

Aplicar nos cálculos de Freshness e Stale Ratio. Multiplica os "dias parados" para refletir urgência real.

| Status | Peso | Justificativa |
|--------|------|---------------|
| To Contact | 1.0x | Prospect, urgência normal |
| Contacted | 1.0x | Aguardando resposta, urgência normal |
| In Conversation | 1.5x | Conversa ativa, demora esfria interesse |
| Negotiating | 1.5x | Negociação parada esfria rápido |
| Contract Review | 2.0x | Deal quase fechando, qualquer delay é crítico |
| Integration | 2.0x | Contrato assinado, atraso queima confiança |
| In Discussion | 1.5x | Parceiro ativo, merece atenção rápida |

**Exemplo:** Oportunidade em Negotiating parada 7 dias reais = 7 x 1.5 = 10.5 dias ajustados.

## Componentes do Score

### 1. Freshness (30 pontos)

Média de dias ajustados (com multiplicador) desde o último comentário em cada oportunidade ativa.

| Média dias ajustados | Pontos |
|---------------------|--------|
| < 3 dias | 30 |
| 3-6 dias | 20 |
| 7-13 dias | 10 |
| >= 14 dias | 0 |

**Como calcular:**
1. Para cada issue ativa: pegar data do último comentário
2. Calcular dias desde último comentário
3. Multiplicar pelo peso do status atual
4. Calcular média de todos os valores ajustados

### 2. Coverage (25 pontos)

% de oportunidades ativas que tiveram pelo menos 1 comentário nos últimos 7 dias.

| Coverage | Pontos |
|----------|--------|
| >= 80% | 25 |
| 60-79% | 20 |
| 40-59% | 15 |
| 20-39% | 10 |
| < 20% | 5 |
| 0% | 0 |

### 3. Progression (25 pontos)

% de oportunidades ativas que avançaram de status nos últimos 30 dias.

| Progression | Pontos |
|-------------|--------|
| >= 50% | 25 |
| 40-49% | 20 |
| 30-39% | 15 |
| 20-29% | 10 |
| 10-19% | 5 |
| < 10% | 0 |

**Nota:** "Avançar" = mudar para status mais avançado no funil. Regredir ou mover para Lost não conta. Para medir progression, verificar se o status atual é diferente (e mais avançado) do que era 30 dias atrás. Se não houver dados históricos suficientes, usar o status da issue no momento da criação como baseline.

### 4. Stale Ratio (20 pontos, invertido)

% de oportunidades ativas sem nenhum comentário há mais de 14 dias (dias reais, sem multiplicador).

| Stale % | Pontos |
|---------|--------|
| 0% | 20 |
| 1-10% | 16 |
| 11-20% | 12 |
| 21-30% | 8 |
| 31-40% | 4 |
| > 40% | 0 |

## Score Final

```
Pipeline Activity Score = Freshness + Coverage + Progression + Stale Ratio
```

| Score | Classificação | Ação |
|-------|--------------|------|
| 80-100 | Pipeline saudável | Manter ritmo |
| 50-79 | Precisa de atenção | Identificar gaps e agir |
| 0-49 | Pipeline dormindo | Ação urgente necessária |

## Formato de Apresentação

```
## Diagnóstico - [Projeto] - [Data]

**Pipeline Activity Score: XX/100** [emoji] [classificação]

| Componente | Score | Detalhe |
|-----------|-------|---------|
| Freshness | XX/30 | Média: X dias ajustados |
| Coverage | XX/25 | X de Y oportunidades ativas (Z%) |
| Progression | XX/25 | X de Y avançaram nos últimos 30 dias (Z%) |
| Stale Ratio | XX/20 | X oportunidades paradas >14 dias (Z%) |

### Oportunidades que precisam de ação
[Lista ordenada por urgência ajustada]

### Recomendações
[2-3 ações concretas para melhorar o score]
```
