# Template: Documento de Skill Skynet

Use este template para documentar cada skill de um agente do Projeto Skynet. Preencha TODAS as seções. Não pule nenhuma.

---

## Formato do Documento

```markdown
---
name: [slug-da-skill]
description: [O que a skill faz em 1 frase]. Usar quando [contexto 1], [contexto 2]. Disparar também quando mencionarem [sinônimo 1], [sinônimo 2].
version: 1.0.0
metadata:
  openclaw:
    requires:
      env:
        - [VARIÁVEIS_DE_AMBIENTE_NECESSÁRIAS]
      bins:
        - [BINÁRIOS_NECESSÁRIOS]
---

# [Nome da Skill]

> Skill do agente [Nome do Agente]

## O QUE FAZ

[2-3 frases descrevendo o que a skill executa. Ser específico e concreto. Não usar linguagem vaga.]

Exemplo:
"Analisa documentos de identidade enviados por clientes durante o onboarding. Extrai dados do documento (nome, data de nascimento, número), valida formato e legibilidade, e compara com os dados informados no cadastro. Aprova automaticamente se tudo bater; sinaliza para revisão humana se houver discrepância."

## TRIGGER

| Tipo | Descrição |
|------|-----------|
| [comando / evento / cron / reação] | [Descrição específica do que aciona a skill] |

Tipos de trigger:
- **comando**: acionado por mensagem direta ao agente (ex: "/verificar documento")
- **evento**: acionado por algo que acontece no sistema (ex: novo documento uploaded)
- **cron**: acionado por schedule (ex: todo dia às 8h)
- **reação**: acionado por output de outra skill ou agente

Exemplo:
| Tipo | Descrição |
|------|-----------|
| evento | Novo documento de identidade uploaded no fluxo de KYC |
| comando | Usuário interno solicita re-análise via "/recheck [user_id]" |

## INPUT

[O que a skill precisa receber para funcionar. Ser específico sobre formato e fonte.]

| Campo | Tipo | Fonte | Obrigatório |
|-------|------|-------|-------------|
| [campo_1] | [tipo de dado] | [de onde vem] | Sim/Não |
| [campo_2] | [tipo de dado] | [de onde vem] | Sim/Não |

Exemplo:
| Campo | Tipo | Fonte | Obrigatório |
|-------|------|-------|-------------|
| document_image | imagem (jpg/png/pdf) | Upload do cliente via app | Sim |
| user_profile | JSON | API Bullet Core /users/{id} | Sim |
| document_type | string (RG/CNH/Passport) | Seleção do cliente no app | Sim |

## OUTPUT

[O que a skill entrega como resultado. Ser específico.]

| Output | Tipo | Destino |
|--------|------|---------|
| [output_1] | [tipo] | [para onde vai] |
| [output_2] | [tipo] | [para onde vai] |

Exemplo:
| Output | Tipo | Destino |
|--------|------|---------|
| Decisão (approved/review/rejected) | enum | API Bullet Core /kyc/{id}/decision |
| Dados extraídos do documento | JSON | Persistido no perfil do usuário |
| Motivo (se review/rejected) | string | Notificação para equipe de compliance |

## PROCESSO

[Passo a passo do que a skill faz, da ativação ao resultado. Numerar os passos.]

Exemplo:
1. Receber imagem do documento e dados do perfil do usuário
2. Validar qualidade da imagem (resolução, legibilidade)
3. Extrair dados via OCR (nome, data de nascimento, número do documento)
4. Comparar dados extraídos com dados do cadastro:
   - Nome: fuzzy match com tolerância de 85%
   - Data de nascimento: match exato
   - Número do documento: match exato
5. Verificar validade do documento (data de expiração)
6. Se tudo OK → aprovar automaticamente
7. Se discrepância → sinalizar para revisão humana com detalhes da discrepância
8. Se documento ilegível → solicitar novo upload ao cliente
9. Logar decisão com timestamp, dados extraídos e scores de confiança

## FERRAMENTAS

[APIs, CLIs, bibliotecas, serviços externos que a skill usa.]

| Ferramenta | Uso | Credencial necessária |
|------------|-----|----------------------|
| [ferramenta_1] | [para que usa] | [env var ou config] |
| [ferramenta_2] | [para que usa] | [env var ou config] |

Exemplo:
| Ferramenta | Uso | Credencial necessária |
|------------|-----|----------------------|
| SumSub API | OCR e validação de documentos | SUMSUB_API_KEY |
| Bullet Core API | Consulta/atualização de perfil | BULLET_CORE_TOKEN |
| Slack API | Notificação para equipe compliance | SLACK_WEBHOOK_COMPLIANCE |

## GUARDRAILS

[Condições de parada, limites e regras de escalação. Esta seção é OBRIGATÓRIA e crítica.]

### Quando escalar para humano
- [Condição 1 que exige intervenção humana]
- [Condição 2 que exige intervenção humana]
- [Condição 3 que exige intervenção humana]

### Limites operacionais
- [Limite 1 - ex: máximo de X operações por minuto]
- [Limite 2 - ex: timeout de X segundos]
- [Limite 3 - ex: retry máximo de X vezes]

### Fallback
- [O que acontece se a skill falhar]
- [Quem é notificado]
- [Processo manual de backup]

Exemplo:
### Quando escalar para humano
- Score de confiança do OCR abaixo de 70%
- Documento de país não suportado
- 3 ou mais discrepâncias entre dados extraídos e cadastro
- Documento possivelmente fraudulento (flags de manipulação)

### Limites operacionais
- Timeout de 30 segundos por documento
- Máximo 3 tentativas de OCR por documento
- Rate limit: 100 documentos/hora

### Fallback
- Se API do SumSub indisponível: enfileirar para processamento posterior
- Notificar #compliance no Slack se fila > 50 documentos
- Processo manual: Nicholas revisa via painel do SumSub

## SOP DE REFERÊNCIA

| SOP | Local | Status |
|-----|-------|--------|
| [Nome do SOP manual] | [Link Slite/Google Drive] | [Existe / Não existe / Desatualizado] |

Se o SOP não existe, a primeira ação antes de implementar a skill deve ser documentar o processo manual como SOP.

## MÉTRICAS DA SKILL

| Métrica | Como medir | Target |
|---------|------------|--------|
| [Métrica 1] | [cálculo/fonte] | [valor alvo] |
| [Métrica 2] | [cálculo/fonte] | [valor alvo] |

Exemplo:
| Métrica | Como medir | Target |
|---------|------------|--------|
| Taxa de aprovação automática | aprovados_auto / total_documentos | > 70% |
| Tempo médio de processamento | avg(timestamp_decisão - timestamp_upload) | < 30 segundos |
| Taxa de falso positivo (aprovação indevida) | falsos_positivos / total_aprovados | < 1% |

## CHANGELOG

- **1.0.0** ([data de criação]): Versão inicial

## REFERÊNCIAS EXTERNAS (Nível 3)

Arquivos de referência que a skill pode consultar sob demanda durante execução.
Estes NÃO ficam no corpo do SKILL.md. Ficam em arquivos separados na pasta references/ do workspace.

| Arquivo | Conteúdo | Quando consultar |
|---------|----------|------------------|
| [arquivo_1.md] | [O que contém] | [Em qual situação o agente deve ler] |

Exemplos de material nível 3:
- SOPs detalhados do processo manual original
- Documentação completa de APIs utilizadas
- Tabelas de referência (códigos de país, listas de documentos aceitos)
- Exemplos extensos de input/output para edge cases
```

---

## Checklist de Qualidade

Antes de considerar o documento completo, verificar:

- [ ] O QUE FAZ é concreto e específico (não genérico)
- [ ] TRIGGER tem tipo definido (comando/evento/cron/reação)
- [ ] INPUT lista todos os campos com tipo e fonte
- [ ] OUTPUT lista todos os resultados com destino
- [ ] PROCESSO é numerado e sequencial
- [ ] FERRAMENTAS lista credenciais necessárias
- [ ] GUARDRAILS tem ao menos 2 condições de escalação para humano
- [ ] GUARDRAILS tem fallback definido
- [ ] SOP DE REFERÊNCIA está preenchido (mesmo que "não existe")
- [ ] MÉTRICAS tem target quantificável
- [ ] CHANGELOG tem ao menos a entrada da versão 1.0.0
- [ ] Description do frontmatter segue formato otimizado (ação + contextos + sinônimos)
- [ ] Documento principal < 500 linhas (material extenso movido para references/)

## Conversão para OpenClaw SKILL.md

Para gerar o arquivo final do OpenClaw, extrair:

1. **Frontmatter YAML**: name, description (formato otimizado), version, metadata.openclaw.requires (env vars das ferramentas)
2. **Corpo markdown (Nível 2)**: Seções O QUE FAZ + PROCESSO + GUARDRAILS, reescritas como instruções diretas para o agente (imperativo, segunda pessoa). Manter < 500 linhas.
3. **References (Nível 3)**: Mover para arquivos separados na pasta references/ do workspace do agente. Referenciar no corpo com links relativos e indicação de QUANDO consultar.

Exemplo de conversão do PROCESSO para instruções OpenClaw:

**Documento Skynet:**
```
1. Receber imagem do documento
2. Validar qualidade da imagem
3. Extrair dados via OCR
```

**SKILL.md OpenClaw:**
```
When triggered:
1. Receive the document image from the upload event
2. Validate image quality (minimum 300dpi, no blur)
3. Extract data using SumSub OCR API
```
