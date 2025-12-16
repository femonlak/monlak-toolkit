# Update Docs

Atualizar documentação após implementar feature.

## Fonte de Verdade
**CRÍTICO:** Codebase é a ÚNICA fonte. NUNCA usar docs antigos como base.

## Processo

### 1. Identificar Feature
- Usar contexto da conversa ou descrição
- Investigar codebase para confirmar implementação real

### 2. Analisar Código
- Identificar arquivos relevantes
- Entender comportamento real
- Confirmar funcionalidades, fluxos, regras

### 3. Localizar Docs
Buscar documentação existente do projeto.

### 4. Estruturar Proposta

**Para documentação de features:**
```markdown
### [Nome da Feature]
[Descrição 1-2 frases]

**Por que importa:** [Problema, contexto, impacto. 2-4 parágrafos.]

**Como funciona:** [Comportamento, fluxo, comandos, regras.]
```

**Para resumo de produto:**
```markdown
**[Nome]** - [Descrição em 1 linha, máx 80 chars]
```

### 5. Apresentar
```
Analisei a implementação de [feature] no codebase.

## PROPOSTA DE ATUALIZAÇÃO

### Documentação de Features
**Localização:** [Categoria]
**Ação:** [Adicionar/Criar categoria]

[Conteúdo proposto]

---

### Resumo de Produto
**Localização:** [Seção]
**Ação:** [Adicionar item]

[Linha proposta]

---

## CONFIRMAÇÃO
Digite "sim" para atualizar ou sugira ajustes.
```

### 6. Atualizar
Após "sim", atualizar os arquivos.

## Tom de Escrita
- Objetivo e direto
- Foco em valor (what/why), não técnico (how)
- Sem jargões desnecessários
- Exemplos concretos quando relevante

## Nunca Fazer
- Atualizar sem confirmação
- Usar docs antigos como fonte
- Assumir sem verificar código
- Modificar outros arquivos
- Adicionar especulações
