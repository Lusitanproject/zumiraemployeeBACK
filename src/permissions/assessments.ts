import { PermissionDomainDefinition } from "../types/permissions";

export const AssessmentPermissions = {
  ANSWER_ASSESSMENT: "answer-assessment",
  MANAGE_ASSESSMENTS: "manage-assessments",
  VIEW_ASSESSMENT_RESULTS: "view-assessment-results",
} as const;

export const AssessmentDomain: PermissionDomainDefinition = {
  domain: "assessments",
  label: "Testes",
  permissions: [
    { key: AssessmentPermissions.ANSWER_ASSESSMENT, label: "Responder Teste" },
    { key: AssessmentPermissions.MANAGE_ASSESSMENTS, label: "Gerenciar Testes" },
    { key: AssessmentPermissions.VIEW_ASSESSMENT_RESULTS, label: "Ver Resultados de Testes" },
  ],
};
