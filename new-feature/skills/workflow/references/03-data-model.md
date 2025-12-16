# Data Model

Propor mudanças na estrutura de dados baseado no PRD.

## Princípios

### Single Source of Truth
Banco de dados é a fonte final. Todo estado do cliente deriva do DB.

### Minimalismo
- NÃO criar estruturas desnecessárias
- Schema mínimo, evoluir com necessidades reais
- Hard delete por padrão (sem soft delete)

### Campos Padrão
- `id`
- `created_at`
- `updated_at`

### Realtime
Apenas onde estritamente necessário.

## Processo

### 1. Descoberta
Investigar estrutura atual do banco:
- Tabelas existentes
- Relações (foreign keys)
- Functions/triggers
- Views e indexes

### 2. Análise do PRD
Identificar:
- Dados a persistir
- Relações entre entidades
- Onde realtime pode ser útil

### 3. Proposta
Estrutura:
```markdown
## DATA MODEL

### Tabelas Novas
- **`nome`**: propósito

### Alterações em Tabelas Existentes
- **`tabela`**: mudança - justificativa

### Views
- **`nome`**: propósito

### Database Functions
- **`nome`**: propósito

### Edge Functions
- **`nome`**: propósito

### Realtime Subscriptions
- **`tabela`**: justificativa

### Triggers
- **`tabela`**: propósito

### Indexes
- **`tabela(coluna)`**: justificativa

### N/A
- [Listar seções sem alterações]
```

### 4. Iteração
Apresentar: "Listei mudanças necessárias. O que você achou?"
Iterar até aprovação.
Ao aprovar: "Posso incorporar no documento?"

### 5. Incorporação
Adicionar seção `## DATA MODEL` ao PRD.

## Nunca Fazer
- Detalhar implementação (SQL, código)
- Criar estruturas "por precaução"
- Sugerir soft delete
- Sugerir realtime sem justificativa
- Incorporar sem aprovação
