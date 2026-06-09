# ACT Analysis — Geração Incremental

## Contexto

Antes dessa mudança, chamar `POST /admin/acts/:actChatbotId/analysis` sempre criava uma `CompanyActAnalysis` nova e reprocessava **todas** as mensagens de todos os capítulos da empresa do zero. Isso era caro e descartava o trabalho anterior a cada geração.

A regra correta é incremental: reaproveitar a análise existente e processar apenas as mensagens ainda não analisadas, adicionando o resultado à mesma análise.

---

## Por que funciona sem migration

O report já agrega `ActMessagesPsychosocialFactors` de **uma** `CompanyActAnalysis` somando todos os seus batches (`WHERE cab.company_act_analysis_id = analysisId`). Basta acumular batches numa mesma análise em vez de criar uma nova.

Mensagens processadas sem fator não deixavam rastro (só linhas positivas eram gravadas). Todas as queries de report filtram `factorId IS NOT NULL`, então gravar uma linha com `factorId = null` serve como marcador de "já processado" sem aparecer nos resultados — sem necessidade de migration.

---

## O que mudou

### `ActAdminService.generateAnalysis` (`src/services/admin/ActAdminService.ts`)

1. **Reutiliza a análise existente** — cria `CompanyActAnalysis` só na primeira vez.
2. **Bloqueia sobreposição** — lança erro amigável se já houver batch `in_progress` (evita contagem duplicada de mensagens em voo).
3. **Seleciona só capítulos com mensagens novas** — filtra capítulos que têm ≥1 mensagem de usuário sem linha em `ActMessagesPsychosocialFactors` vinculada à análise atual. O capítulo inteiro é reenviado à IA como contexto (necessário para a conversa fazer sentido), mas ao salvar os resultados só as mensagens novas são contadas.
4. **Lança erro se não há nada novo** — "Não há novas mensagens para analisar."

### `ActService.retrieveAndSaveAnalysisResults` (`src/services/act/ActService.ts`)

1. **Carrega `processedMessageIds`** — busca todos os `messageId` já gravados nos batches desta análise (incluindo marcadores `null`).
2. **Filtra associações positivas para mensagens novas** — descarta reclassificações de mensagens antigas reenviadas como contexto.
3. **Grava marcadores `factorId = null`** — para mensagens novas de usuário que a IA não associou a nenhum fator, insere linha com `factorId = null`. Na próxima geração incremental, essas mensagens já estarão em `processedMessageIds` e não serão reprocessadas.

---

## Comportamento do laudo

O laudo (`CompanyActAnalysis.text`) sempre reflete o estado completo acumulado — `buildAnalysisReportData` agrega todas as `ActMessagesPsychosocialFactors` de todos os batches da análise. Batches antigos e novos ficam na mesma `CompanyActAnalysis`, então regerar o laudo sempre considera todas as mensagens já processadas.

---

## Commit

```
feat: make act analysis incremental — reuse analysis and process only new messages

Instead of creating a new CompanyActAnalysis on every generation (discarding
previous work), generateAnalysis now reuses the existing analysis and sends only
chapters that have unprocessed user messages to the OpenAI batch API.

retrieveAndSaveAnalysisResults was updated to filter out already-processed
messages when saving results (preventing double-counting when a chapter is
resent as context) and to write factorId=null marker rows for new messages
that the AI found no factor for, so they are not picked up again on the next
incremental run.

Additionally blocks concurrent generation when a batch is still in_progress.
```
