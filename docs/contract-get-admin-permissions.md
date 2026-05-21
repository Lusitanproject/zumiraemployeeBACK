# Contrato: `GET /admin/permissions`

## Autenticação

Requer Bearer token com permissão `manage-roles`.

---

## Antes

```json
{
  "status": "SUCCESS",
  "data": {
    "permissions": [
      "answer-act",
      "manage-acts",
      "view-act-analysis",
      "answer-assessment",
      "manage-assessments",
      "view-assessment-results",
      "manage-company",
      "view-company-users",
      "manage-dimension",
      "manage-nationalities",
      "manage-notifications",
      "manage-psychosocial-factors",
      "manage-roles",
      "manage-self-monitoring",
      "manage-trails",
      "manage-users"
    ]
  }
}
```

---

## Depois

```json
{
  "status": "SUCCESS",
  "data": {
    "permissions": [
      {
        "domain": "acts",
        "label": "Atos",
        "permissions": [
          { "key": "answer-act",        "label": "Responder Ato" },
          { "key": "manage-acts",       "label": "Gerenciar Atos" },
          { "key": "view-act-analysis", "label": "Ver Análise de Atos" }
        ]
      },
      {
        "domain": "assessments",
        "label": "Testes",
        "permissions": [
          { "key": "answer-assessment",        "label": "Responder Teste" },
          { "key": "manage-assessments",       "label": "Gerenciar Testes" },
          { "key": "view-assessment-results",  "label": "Ver Resultados de Testes" }
        ]
      },
      {
        "domain": "companies",
        "label": "Empresas",
        "permissions": [
          { "key": "manage-company",     "label": "Gerenciar Empresa" },
          { "key": "view-company-users", "label": "Ver Usuários da Empresa" }
        ]
      },
      {
        "domain": "dimensions",
        "label": "Dimensões",
        "permissions": [
          { "key": "manage-dimension", "label": "Gerenciar Dimensões" }
        ]
      },
      {
        "domain": "nationalities",
        "label": "Nacionalidades",
        "permissions": [
          { "key": "manage-nationalities", "label": "Gerenciar Nacionalidades" }
        ]
      },
      {
        "domain": "notifications",
        "label": "Notificações",
        "permissions": [
          { "key": "manage-notifications", "label": "Gerenciar Notificações" }
        ]
      },
      {
        "domain": "psychosocial-factors",
        "label": "Fatores Psicossociais",
        "permissions": [
          { "key": "manage-psychosocial-factors", "label": "Gerenciar Fatores Psicossociais" }
        ]
      },
      {
        "domain": "roles",
        "label": "Perfis",
        "permissions": [
          { "key": "manage-roles", "label": "Gerenciar Perfis" }
        ]
      },
      {
        "domain": "self-monitoring",
        "label": "Automonitoramento",
        "permissions": [
          { "key": "manage-self-monitoring", "label": "Gerenciar Automonitoramento" }
        ]
      },
      {
        "domain": "trails",
        "label": "Trilhas",
        "permissions": [
          { "key": "manage-trails", "label": "Gerenciar Trilhas" }
        ]
      },
      {
        "domain": "users",
        "label": "Usuários",
        "permissions": [
          { "key": "manage-users", "label": "Gerenciar Usuários" }
        ]
      }
    ]
  }
}
```

---

## Schema TypeScript

```typescript
interface PermissionItem {
  key: string;   // identificador usado internamente (ex: "manage-assessments")
  label: string; // nome legível para exibição (ex: "Gerenciar Testes")
}

interface PermissionDomainResponse {
  domain: string;                // slug do domínio (ex: "assessments")
  label: string;                 // nome legível do domínio (ex: "Testes")
  permissions: PermissionItem[];
}

interface GetAdminPermissionsResponse {
  status: "SUCCESS";
  data: {
    permissions: PermissionDomainResponse[];
  };
}
```
