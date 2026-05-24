# GET /admin/company/:companyId/acts/:actChatbotId/analysis/report

Retorna o laudo completo de uma análise ACT para uma empresa, com scores segmentados por área, gênero, PCD, nível de cargo e faixa etária 60+, além do score geral e a lista de fatores com peso total.

## Params

| Campo          | Tipo   | Descrição         |
| -------------- | ------ | ----------------- |
| `companyId`    | `cuid` | ID da empresa     |
| `actChatbotId` | `cuid` | ID do chatbot ACT |

## Response `200`

```jsonc
{
  "status": "SUCCESS",
  "data": {
    "available": false
    // ou:
    "available": true,
    "report": {
      "userCount": 42,

      "overall": {
        "positiveScore": 380,
        "negativeScore": -120,
        "totalScore": 260,
        "absoluteScore": 500,
        "wellnessPercentage": 76.0   // positiveScore / absoluteScore * 100
      },

      "byArea":            [AnalysisSegmentGroup],
      "byGender":          [AnalysisSegmentGroup],
      "byDisability":      [AnalysisSegmentGroup],
      "byOccupationLevel": [AnalysisSegmentGroup],
      "byAgeRange":        [AnalysisSegmentGroup],  // apenas segmentos "60+" e null

      "factorWeights": [
        {
          "id": "clx...",
          "name": "Sobrecarga de trabalho",
          "wheight": -2,
          "count": 15,       // nº de ocorrências do fator na análise
          "totalWeight": -30 // wheight * count
        }
      ]
    }
  }
}
```

## AnalysisSegmentGroup

Estrutura compartilhada por `byArea`, `byGender`, `byDisability`, `byOccupationLevel` e `byAgeRange`.

```jsonc
{
  "value": "TI", // valor da coluna do usuário; null = sem valor cadastrado
  "positiveScore": 200,
  "negativeScore": -80,
  "totalScore": 120,
  "absoluteScore": 280,
  "wellnessPercentage": 71.43,
}
```

## Response `400`

`companyId` ou `actChatbotId` inválidos.

```json
{ "status": "ERROR", "message": "..." }
```
