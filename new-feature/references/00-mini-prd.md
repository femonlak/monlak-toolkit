# Mini PRD (Caminho Rápido)

Estruturar PRD completo em um único fluxo: Produto + UX/UI + Data Model.

## Processo

### Fase 1: Análise e Esclarecimento
- Leia input do usuário
- Identifique lacunas críticas
- Pergunte APENAS se necessário para:
  - Entender problema real
  - Esclarecer comportamentos
  - Definir escopo técnico
- Se claro, pule para Fase 2

**Não pergunte por perguntar.** Se consegue inferir com confiança, siga.

### Fase 2: Descoberta do Banco de Dados
Investigar estrutura atual:
- Listar tabelas relevantes
- Ver estrutura de colunas
- Identificar relações (FKs)
- Verificar functions/triggers

**Objetivo:** Evitar duplicação, respeitar arquitetura atual.

### Fase 3: Montagem da Proposta
```markdown
# [Nome da Feature]

## PRODUTO

### Problema
[Dor específica]

### Job to be Done
"Quando [situação], quero [motivação], para [resultado]."

### User Story
Como [usuário], quero [ação], para [resultado].

### Solução
[Como elimina/reduz o problema]

### User Journey
1. [Verbo] [substantivo]
2. [Verbo] [substantivo]
...

### Critérios de Aceitação
- Dado [contexto], quando [ação], então [resultado]

### Edge Cases
- Se [condição rara], então [comportamento]

---

## UX/UI GUIDELINES

### Fluxo de Telas
[Navegação e estrutura]

### Componentes Principais
[Elementos-chave]

### Hierarquia Visual
[Priorização e layout]

### Feedback e Estados
[Loading, erro, sucesso, vazios]

### Micro-interações
[Animações e transições]

### Acessibilidade
[Requisitos básicos]

---

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
[Seções sem alterações]
```

### Fase 4: Iteração
```
Montei a estrutura completa para [nome]:

[proposta]

---

O que você achou? Quer ajustar algo?
```

- Aguarde feedback
- Ajuste conforme solicitado
- Repita até aprovação
- Quando aprovado: "Posso criar o arquivo?"

### Fase 5: Criação do Arquivo
Após aprovação explícita:
1. Nome: `verbo-substantivo.md`
2. Criar arquivo PRD
3. Confirmar criação

## Princípios

### Produto
- Nome: Verbo + Substantivo
- Foco em user value
- User journey com passos específicos
- Critérios mensuráveis

### UX/UI
- Diretrizes objetivas
- Proporcional à complexidade
- Sem detalhes de implementação

### Data Model
- Minimalismo absoluto
- Hard delete (sem soft delete)
- Realtime só com justificativa

### Seções Vazias
- **Data Model**: Omitir subseção, listar em N/A
- **UX/UI**: Todas obrigatórias (adaptar)
- **Produto**: Todas obrigatórias

## Nunca Fazer
- Adicionar info técnica de implementação
- Criar estruturas desnecessárias
- Sugerir soft delete
- Forçar perguntas se claro
- Criar arquivo sem aprovação
