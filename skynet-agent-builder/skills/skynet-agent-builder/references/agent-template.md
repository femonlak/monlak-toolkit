# Template: Documento de Agente Skynet

Use este template para documentar cada agente autônomo do Projeto Skynet. Preencha TODAS as seções. Não pule nenhuma.

---

## Formato do Documento

```markdown
# [Nome do Agente]

> [Uma frase que define a razão de existir do agente]

## IDENTIDADE

[2-3 frases descrevendo quem é o agente, qual seu papel na operação da Bullet, e qual problema ele resolve. Escrito na primeira pessoa do agente.]

Exemplo:
"Sou o agente responsável por toda a operação de atendimento ao cliente da Bullet. Resolvo tickets de suporte de forma autônoma, escalo quando necessário, e garanto que nenhum cliente fique sem resposta."

## ESCOPO

| Campo | Valor |
|-------|-------|
| Área operacional | [Ex: Customer Experience, Compliance, Treasury] |
| Pilar owner | [Product / Business / Growth / Core] |
| DRI (humano responsável) | [Nome da pessoa] |
| Projeto Linear | Implementar Projeto Skynet |

### Dentro do escopo
- [Tarefa/responsabilidade 1]
- [Tarefa/responsabilidade 2]
- [Tarefa/responsabilidade 3]

### Fora do escopo
- [O que o agente NÃO faz 1]
- [O que o agente NÃO faz 2]
- [O que o agente NÃO faz 3]

## SOUL

### Personality
[Como o agente se comunica. Tom, estilo, nível de formalidade. Exemplos concretos.]

Exemplo:
- Direto e objetivo, sem enrolação
- Profissional mas acessível
- Sempre confirma antes de executar ações destrutivas
- Responde em português para clientes BR, inglês para demais

### Values
[Prioridades de decisão do agente, em ordem. O que importa mais quando há conflito.]

Exemplo:
- Segurança do cliente > velocidade de resolução
- Dados verificados > suposições
- Escalar na dúvida > resolver errado

### Boundaries
[O que o agente NUNCA faz, sem exceção. Limites absolutos.]

Exemplo:
- NUNCA aprova transações acima de $X sem validação humana
- NUNCA compartilha dados de um cliente com outro
- NUNCA executa operações financeiras sem confirmação

### Rules
[Regras operacionais que o agente segue sempre. Diferente de Boundaries (que são proibições), Rules são procedimentos obrigatórios.]

Exemplo:
- Sempre logar toda ação executada no sistema
- Sempre incluir timestamp e ID da operação em respostas
- Escalar para humano após 3 tentativas falhas consecutivas
- Notificar DRI quando uma métrica sair do target

## SKILLS

| # | Skill | Descrição | Status |
|---|-------|-----------|--------|
| 1 | [nome-da-skill-1] | [O que faz em 1 linha] | Planned |
| 2 | [nome-da-skill-2] | [O que faz em 1 linha] | Planned |
| 3 | [nome-da-skill-3] | [O que faz em 1 linha] | Planned |

Status possíveis: Planned → In Development → Built → Validated (ao menos 1 execução real)

## CANAIS

| Canal | Tipo | Descrição |
|-------|------|-----------|
| [Ex: WhatsApp] | [on-demand / cron / event] | [Como opera nesse canal] |
| [Ex: Slack] | [on-demand / cron / event] | [Como opera nesse canal] |
| [Ex: Bullet Core] | [cron / event] | [Como opera nesse canal] |

### Heartbeat / Cron
[Se o agente tem tarefas agendadas, listar aqui com frequência]

Exemplo:
- A cada 30 min: verificar tickets não respondidos
- Diário 8h: gerar briefing matinal
- Semanal seg 9h: relatório consolidado

## IMPACTO ESPERADO

### Tarefas manuais substituídas

| Tarefa | Responsável atual | Horas/semana | SOP existente? |
|--------|-------------------|--------------|----------------|
| [Tarefa 1] | [Pessoa] | [X]h | [Sim/Não - link] |
| [Tarefa 2] | [Pessoa] | [X]h | [Sim/Não - link] |
| [Tarefa 3] | [Pessoa] | [X]h | [Sim/Não - link] |

### Resumo
- Total horas/semana economizadas: [X]h
- Headcount equivalente liberado: [X.X] FTE
- Tempo de resposta esperado: de [atual] para [com agente]

## DEPENDÊNCIAS

### APIs e integrações
- [API/sistema 1]: [para que usa]
- [API/sistema 2]: [para que usa]

### Dados necessários
- [Base/fonte de dados 1]: [que dados precisa]
- [Base/fonte de dados 2]: [que dados precisa]

### Outros agentes
- [Agente X]: [relação - alimenta, consome, depende]

## MÉTRICAS DE SUCESSO

| Métrica | Baseline (manual) | Target (com agente) | Como medir |
|---------|-------------------|---------------------|------------|
| [Métrica 1] | [valor atual] | [meta] | [fonte/cálculo] |
| [Métrica 2] | [valor atual] | [meta] | [fonte/cálculo] |
| [Métrica 3] | [valor atual] | [meta] | [fonte/cálculo] |

## CHANGELOG

- **1.0.0** ([data de criação]): Versão inicial do agente

## CONFIGURAÇÃO OPENCLAW

### Workspace
```
~/.openclaw/agents/[slug-do-agente]/
├── SOUL.md                    ← Nível 2: identidade do agente (carregado sempre)
├── USER.md                    ← Contexto da Bullet para o agente
├── skills/
│   ├── [skill-1]/
│   │   ├── SKILL.md           ← Nível 2: instruções da skill (carregado quando acionada)
│   │   └── references/        ← Nível 3: material de consulta (sob demanda)
│   ├── [skill-2]/
│   │   ├── SKILL.md
│   │   └── references/
│   └── [skill-3]/
│       ├── SKILL.md
│       └── references/
└── memory/
```

### Progressive Disclosure
- **Nível 1 (sempre no context):** Nome do agente + descrições curtas das skills (~100 palavras cada). Custo fixo no system prompt.
- **Nível 2 (quando acionado):** SOUL.md completo + SKILL.md da skill relevante. Ideal < 500 linhas por arquivo.
- **Nível 3 (sob demanda):** Arquivos em references/ consultados apenas quando o agente precisa de detalhes (SOPs, docs de API, tabelas). Sem limite de tamanho.

### Provider / Model
- Primary: [modelo principal - ex: claude-sonnet-4-20250514]
- Heartbeat: [modelo para cron - ex: claude-haiku-4-5-20251001]

### Channels
- [Canais configurados no OpenClaw - whatsapp, slack, etc.]
```

---

## Checklist de Qualidade

Antes de considerar o documento completo, verificar:

- [ ] IDENTIDADE escrita na primeira pessoa do agente
- [ ] ESCOPO tem "dentro" e "fora" claramente separados
- [ ] SOUL tem todas as 4 seções (Personality, Values, Boundaries, Rules)
- [ ] Boundaries tem ao menos 3 proibições absolutas
- [ ] SKILLS tem ao menos 2 skills listadas
- [ ] Cada skill tem description no formato otimizado (ação + contextos + sinônimos)
- [ ] CANAIS define como o agente é acionado
- [ ] IMPACTO referencia tarefas reais com horas estimadas
- [ ] DEPENDÊNCIAS lista APIs e dados necessários
- [ ] MÉTRICAS tem baseline e target quantificáveis
- [ ] CHANGELOG tem ao menos a entrada da versão 1.0.0
- [ ] Workspace OpenClaw respeita separação Nível 2 / Nível 3
