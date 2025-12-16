---
name: new-feature
description: Orquestrar desenvolvimento completo de nova feature, desde ideação até implementação e documentação. Use quando usuário pedir para implementar nova feature, nova funcionalidade, "new feature", ou variações de "quero criar/desenvolver/implementar uma feature". Oferece dois caminhos - completo (passo a passo com validações) ou rápido (tudo de uma vez).
---

# New Feature Workflow

Skill para conduzir todo o ciclo de desenvolvimento de uma feature.

## Gatilhos
Ativar quando usuário mencionar: "nova feature", "new feature", "implementar feature", "criar funcionalidade", "desenvolver feature" ou variações.

## Início Obrigatório

Sempre começar com:

```
Quer seguir o processo completo ou o caminho rápido?

**Completo**: Passo a passo com validações em cada etapa (Product → UX/UI → Data Model → Revisão → Implementação → Documentação)

**Rápido**: Tudo de uma vez baseado no seu input

Qual prefere?
```

Após escolha, perguntar:
```
Me diga tudo que está na sua cabeça para essa nova feature.
```

## Caminho Rápido

Executar roteiro completo de [references/00-mini-prd.md](references/00-mini-prd.md)

Após criar o arquivo PRD:
1. Perguntar: "PRD criado. Devo implementar a feature agora?"
2. Se sim: analisar documento, montar plano de implementação, apresentar ao usuário
3. Iterar plano até acordo
4. Implementar
5. Quando estável: executar [references/05-update-docs.md](references/05-update-docs.md) para atualizar documentação

## Caminho Completo

### Etapa 1: Product Specs
Executar roteiro de [references/01-product-specs.md](references/01-product-specs.md)
- Criar PRD base com problema, JTBD, user story, journey, critérios
- Criar arquivo `prds/verbo-substantivo.md`
- Iterar até aprovação

### Etapa 2: UX/UI Guidelines
Ao aprovar Etapa 1, perguntar:
```
PRD aprovado. Tem algum input adicional para as diretrizes de UX/UI? (layouts, comportamentos, preferências visuais)
```

Executar roteiro de [references/02-ux-ui.md](references/02-ux-ui.md)
- Criar diretrizes baseadas no PRD + inputs
- Adicionar seção `## UX/UI GUIDELINES` ao PRD
- Iterar até aprovação

### Etapa 3: Data Model
Ao aprovar Etapa 2, perguntar:
```
UX/UI aprovado. Tem comentários adicionais para o data model? (estruturas específicas, integrações, preferências)
```

Executar roteiro de [references/03-data-model.md](references/03-data-model.md)
- Habilitar MCP Supabase via `/mcp`
- Analisar estrutura atual
- Propor mudanças necessárias
- Adicionar seção `## DATA MODEL` ao PRD
- Desabilitar MCP Supabase
- Iterar até aprovação

### Etapa 4: Revisão Crítica
Ao aprovar Etapa 3:
```
Data model aprovado. Vou fazer uma revisão crítica do documento completo para identificar lacunas.
```

Executar roteiro de [references/04-critique.md](references/04-critique.md)
- Identificar 2-5 pontos para esclarecimento
- Conduzir perguntas uma por vez
- Atualizar documento com respostas

### Etapa 5: Implementação
Ao concluir Etapa 4:
```
PRD finalizado. Devo implementar a feature agora?
```

Se sim:
1. Analisar documento minuciosamente
2. Desenvolver plano de implementação
3. Apresentar plano resumido ao usuário
4. Iterar até acordo
5. Implementar completamente

### Etapa 6: Documentação
Quando versão estável:
```
Feature parece estável. Devo atualizar a documentação (features-book e product-resume)?
```

Executar roteiro de [references/05-update-docs.md](references/05-update-docs.md)
- Investigar código implementado (fonte de verdade)
- Propor atualizações estruturadas
- Atualizar após confirmação

## Princípios

### Comunicação
- Linguagem não técnica com usuário
- Foco em comportamento e experiência
- Confirmar entendimento antes de avançar

### Qualidade
- Iterar até aprovação explícita em cada etapa
- Código como fonte de verdade para documentação
- Minimalismo no data model

### Fluxo
- Nunca pular etapas no caminho completo
- Sempre perguntar por inputs adicionais entre etapas
- Confirmar antes de implementar ou documentar

## Nunca Fazer
- Implementar sem aprovação do plano
- Avançar etapa sem aprovação explícita
- Usar linguagem técnica nas explicações
- Propor estruturas de dados desnecessárias
- Atualizar docs sem investigar código real
