---
name: skynet-agent-builder
description: Especialista em criar e documentar agentes autônomos e suas skills para o Projeto Skynet da Bullet. Usar quando o usuário quiser criar um novo agente com documentação completa (SOUL, escopo, skills, canais, impacto), criar uma nova skill para um agente existente, gerar arquivos OpenClaw (SOUL.md, SKILL.md) prontos para deploy, criar issues no Linear para agentes e sub-issues para skills, ou iterar e otimizar descriptions de skills. Disparar sempre que o contexto envolver Projeto Skynet, agentes autônomos, automação operacional com IA, criação de agentes, bots, assistentes autônomos, ou menções a OpenClaw/SOUL.md/SKILL.md. Disparar também quando o usuário mencionar "automatizar tarefa", "criar bot", "agente pra fazer X", "substituir processo manual por IA", "quero um agente que faça Y", "documentar agente", "skynet", ou qualquer variação de criação/documentação de agentes autônomos para a Bullet.
---

# Skynet Agent Builder

Cria, documenta e estrutura agentes autônomos e suas skills para o Projeto Skynet da Bullet. Gera documentação compatível com OpenClaw e com a gestão interna via Linear.

## Contexto

O Projeto Skynet é uma iniciativa da Bullet para substituir tarefas manuais repetitivas por agentes autônomos de IA. Cada agente é responsável por uma área operacional e possui múltiplas skills (capacidades). O objetivo é escalar operação sem crescimento proporcional de headcount.

→ Ver [references/agent-template.md](references/agent-template.md) para o template completo de documentação de um Agente.
→ Ver [references/skill-template.md](references/skill-template.md) para o template completo de documentação de uma Skill.
→ Ver [references/skynet-agents.md](references/skynet-agents.md) para o catálogo de agentes planejados.

## Capabilities

### 1. Criar Novo Agente

Gera documentação completa de um agente autônomo: identidade, escopo, SOUL (OpenClaw), skills, canais, impacto, dependências e métricas.

**Trigger:** "criar agente", "novo agente", "documentar agente", "agente de [área]", "skynet novo agente", "quero um bot que faça X", "automatizar [área]"

**Workflow:**

1. **Extrair contexto da conversa** - Antes de perguntar qualquer coisa, reler o histórico da conversa. Muitas vezes o usuário já mencionou qual área, quais tarefas, quais limites. Extrair tudo que já foi dito e só perguntar o que falta. Isso evita repetição e mostra que a skill está prestando atenção.

2. **Discovery** - Preencher as lacunas que a conversa não cobriu:
   - Qual área operacional o agente cobre?
   - Quais tarefas manuais ele substitui?
   - Quem é o humano DRI (responsável)?
   - Por quais canais ele opera (WhatsApp, Slack, Bullet Core, cron)?
   - Quais são os limites? O que ele não deve fazer sozinho?

3. **Pesquisa de SOPs** - Buscar no Slite (se disponível) os SOPs das tarefas que o agente vai substituir. SOPs existentes são ouro: contêm o processo real, os edge cases que alguém já mapeou, e as decisões que foram tomadas. Usar como base para as skills.

4. **Estruturar documento do Agente** - Ler references/agent-template.md e preencher todas as seções. O template existe para garantir consistência entre agentes e para que nada importante seja esquecido. Se uma seção parece não se aplicar, explicar por quê em vez de pular.

5. **Listar Skills** - Para cada capacidade do agente, criar uma entrada na tabela de skills com nome, descrição no formato otimizado (ação + contextos + sinônimos) e status Planned.

6. **Validar com o usuário** - Apresentar o documento completo para aprovação. Isso é importante porque o documento vira a "constituição" do agente. Erros aqui se propagam para todo o comportamento futuro.

7. **Criar no Linear** (se aprovado):
   - Criar Issue no projeto "Implementar Projeto Skynet" (time Pillars)
   - Título: "Construir Agente de [Nome do Agente]"
   - Descrição: seções ESCOPO + IMPACTO ESPERADO + MÉTRICAS DE SUCESSO do documento
   - Para cada skill: criar sub-issue com título "Implementar skill [nome-da-skill]"
   - Assignee: Felipe Lachowski (project lead)

8. **Gerar arquivos OpenClaw** (se solicitado):
   - SOUL.md do agente extraindo da seção SOUL do documento
   - SKILL.md de cada skill extraindo do template de skill
   - Colocar na estrutura de workspace correta (ver agent-template.md, seção CONFIGURAÇÃO OPENCLAW)

**Exemplo de um bom Discovery vs ruim:**

Ruim (ignora contexto):
> Usuário: "Quero um agente que faça a reconciliação financeira automaticamente, o Paulo David cuida disso hoje e gasta umas 10h por semana"
> Skill: "Qual área operacional o agente cobre? Quem é o DRI?"
(Já foi dito. Irritante.)

Bom (extrai do contexto):
> Usuário: "Quero um agente que faça a reconciliação financeira automaticamente, o Paulo David cuida disso hoje e gasta umas 10h por semana"
> Skill: "Entendi. Área: Treasury/Reconciliação. DRI: Paulo David. Impacto: ~10h/semana. Preciso saber: por quais canais ele deveria operar? E quais situações exigem que o Paulo valide manualmente?"

---

### 2. Criar Nova Skill para Agente

Gera documentação completa de uma skill: o que faz, trigger, input/output, processo, ferramentas, guardrails e SOP de referência.

**Trigger:** "criar skill", "nova skill", "adicionar capacidade", "skill para o agente de [X]", "o agente precisa saber fazer Y"

**Workflow:**

1. **Identificar o agente** - Inferir do contexto ou perguntar a qual agente a skill pertence. Se o agente ainda não existe, sugerir criá-lo primeiro (sem agente, a skill fica órfã e sem contexto de boundaries).

2. **Extrair contexto** - Mesmo princípio: reler a conversa, extrair o que já foi dito, perguntar só o que falta.

3. **Discovery da Skill:**
   - O que exatamente a skill executa?
   - Como é acionada? (comando, evento, cron, reação a algo?)
   - Quais dados precisa receber?
   - O que entrega como resultado?
   - Quando deve parar e escalar para humano?
   - Existe SOP manual que ela substitui?

4. **Estruturar documento da Skill** - Ler references/skill-template.md e preencher todas as seções. A seção de GUARDRAILS é especialmente crítica: um agente sem limites claros de escalação é um risco operacional. Se o usuário não mencionou guardrails, perguntar explicitamente.

5. **Validar com o usuário** - Apresentar para aprovação.

6. **Criar sub-issue no Linear** (se aprovado):
   - Parent: Issue do agente correspondente
   - Título: "Implementar skill [nome-da-skill]"
   - Descrição com seções O QUE FAZ + PROCESSO + GUARDRAILS

7. **Gerar SKILL.md OpenClaw** (se solicitado):
   - Arquivo pronto para deploy com YAML frontmatter + instruções em forma imperativa

---

## Progressive Disclosure

Skills e agentes seguem um sistema de 3 níveis de carregamento. Isso importa porque o OpenClaw injeta as skills no system prompt e cada token custa dinheiro e contexto. Documentação interna também precisa ser navegável sem ler tudo.

### Nível 1: Metadata (sempre visível)
- **Agente:** nome + 1 frase de identidade + lista de skills (só nomes)
- **Skill:** name + description do YAML frontmatter (~100 palavras max)
- É o que aparece em listagens, catálogos, e no system prompt do OpenClaw

### Nível 2: Documento principal (carregado quando acionado)
- **Agente:** SOUL.md completo (identity, values, boundaries, rules)
- **Skill:** SKILL.md body (O QUE FAZ, TRIGGER, PROCESSO, GUARDRAILS)
- Manter abaixo de 500 linhas. Se passar disso, mover detalhes para nível 3.

### Nível 3: Referências (sob demanda)
- SOPs detalhados, exemplos, documentação de APIs, tabelas de referência
- Carregado apenas quando o agente/skill precisa consultar durante execução
- Arquivos separados na pasta references/ do workspace

Ao criar documentação, perguntar para cada bloco de conteúdo: "o agente precisa disso em toda interação (nível 2) ou só quando consultar algo específico (nível 3)?"

---

## Iteração e Versionamento

Agentes e skills evoluem. A documentação precisa acompanhar, senão vira artefato morto que ninguém confia.

### Versionamento de Skills

Toda skill tem um campo `version` no frontmatter YAML (semver: major.minor.patch).

| Mudança | Bump | Exemplo |
|---------|------|---------|
| Correção de instrução sem mudar comportamento | patch | 1.0.0 → 1.0.1 |
| Nova capacidade ou mudança de processo | minor | 1.0.1 → 1.1.0 |
| Reescrita completa ou mudança de escopo | major | 1.1.0 → 2.0.0 |

### Changelog

Cada skill mantém um changelog no final do documento:

```markdown
## CHANGELOG
- **1.1.0** (2026-03-15): Adicionado fallback para API indisponível
- **1.0.1** (2026-03-12): Corrigido threshold de confiança de 80% para 70%
- **1.0.0** (2026-03-10): Versão inicial
```

### Processo de Iteração

Quando o usuário pedir para modificar um agente ou skill existente:

1. Ler o documento atual
2. Identificar o que muda (escopo, processo, guardrails, etc.)
3. Aplicar a mudança no documento
4. Bumpar versão conforme tabela acima
5. Adicionar entrada no changelog
6. Validar com o usuário antes de atualizar no Linear/OpenClaw

Ao iterar, resistir à tentação de adicionar regras cada vez mais rígidas para resolver problemas pontuais. Se algo não está funcionando, tentar reformular a instrução explicando o raciocínio em vez de empilhar restrições. Instruções que explicam o "porquê" são mais robustas do que listas de proibições.

---

## Otimização de Description/Trigger

A description no frontmatter YAML é o que determina se o OpenClaw (ou Claude) vai acionar a skill. Modelos tendem a sub-acionar skills, então a description precisa ser explícita sobre quando usar.

### Princípios

Uma boa description combina o que a skill faz com quando deve ser usada, incluindo variações de linguagem natural. "Ajuda com operações" é inútil. "Executa reconciliação automática entre saldos teóricos e reais, gerando alertas de breaks financeiros. Usar quando o contexto envolver conferência de saldos, batimento, diferenças entre banco e sistema, breaks" é acionável.

Incluir sinônimos: se a skill resolve "tickets", a description deve conter também "chamados", "reclamações", "suporte", "atendimento". Pessoas usam palavras diferentes para a mesma coisa.

### Formato recomendado

```
[O que a skill faz em 1 frase]. Usar quando [contexto 1], [contexto 2], [contexto 3]. 
Disparar também quando o usuário mencionar [sinônimo 1], [sinônimo 2], [sinônimo 3].
```

### Workflow de Otimização

Quando o usuário pedir para otimizar a description de uma skill:

1. Ler o documento completo da skill (O QUE FAZ, TRIGGER, PROCESSO)
2. Identificar todos os contextos em que a skill deveria ser acionada
3. Pensar em como um usuário real pediria isso, com linguagem casual, abreviações, contexto implícito. Não pensar em queries limpas e formais. Pensar em como alguém digitaria rápido no chat.
4. Listar sinônimos e variações para cada contexto
5. Reescrever a description combinando: ação principal + contextos de trigger + sinônimos
6. Manter abaixo de ~200 palavras (custo de tokens no system prompt)
7. Validar com o usuário

---

## Regras

### Nomenclatura

**Agentes:**
- Nome interno: descritivo em português (ex: "Agente de CX Autônomo")
- Nome OpenClaw: slug em inglês (ex: "bullet-cx-agent")
- Nome no Linear (issue): "Construir Agente de [Nome]"

**Skills:**
- Nome interno: descritivo (ex: "Resolver tickets L1 sem escalação")
- Nome OpenClaw: slug (ex: "resolve-l1-tickets")
- Nome no Linear (sub-issue): "Implementar skill [nome-da-skill]"

### Princípios de Design de Agentes

1. **Autonomia com guardrails**: O agente faz o máximo sozinho, mas tem limites claros de quando escalar. Um agente que faz tudo sem supervisão é mais perigoso que útil. O valor está no equilíbrio.

2. **Observabilidade**: Tudo que o agente faz deve ser logado e rastreável. Sem isso, quando algo der errado (e vai dar), não tem como diagnosticar.

3. **Falha segura**: Na dúvida, o agente para e pergunta. O custo de perguntar é baixo. O custo de um erro autônomo pode ser alto (financeiro, compliance, reputacional).

4. **Uma área, múltiplas skills**: Cada agente é dono de uma área. Skills são as capacidades dentro dessa área. Evitar agentes "faz-tudo" porque ficam com contexto enorme e boundaries confusas.

5. **SOP-first**: Sempre que possível, derivar a skill de um SOP manual existente. Se não existe SOP, vale criar primeiro. Automatizar um processo que ninguém documentou é automatizar caos.

### Princípios de Design de Skills

1. **Trigger claro**: Toda skill precisa ter um trigger inequívoco. Se não dá pra explicar em 1 frase quando a skill entra em ação, o escopo está confuso.

2. **Input/Output definidos**: A skill sabe exatamente o que recebe e o que entrega. Ambiguidade aqui vira bug em produção.

3. **Guardrails explícitos**: Condições de parada e escalação documentadas. Um agente sem guardrails é uma bomba-relógio.

4. **Testável**: Deve ser possível validar a skill com ao menos 1 execução real antes de considerar "pronta".

5. **Incremental**: v1 simples, depois evolui. Tentar cobrir 100% dos edge cases na primeira versão gera documentos enormes e frágeis. Melhor entregar algo que funciona para 80% dos casos e iterar.

### Compatibilidade OpenClaw

Os documentos gerados seguem o formato OpenClaw. Para detalhes de estrutura de workspace, SOUL.md e SKILL.md, consultar os templates em references/ (agent-template.md seção CONFIGURAÇÃO OPENCLAW e skill-template.md seção Conversão para OpenClaw SKILL.md).

### Sobre issues no Linear

Ao criar issues para agentes e sub-issues para skills, seguir as regras do time Pillars: verbos no infinitivo (Construir, Implementar, Criar), evitar verbos vagos (Definir, Alinhar, Revisar), assignee sempre o project lead.
