import { z } from "zod";

export const SelfMonitoringBlockSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  summary: z.string().optional(),
  icon: z.string().optional(),
});

export const AssessmentSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  selfMonitoringBlock: z.object({
    id: z.string().cuid(),
    title: z.string(),
  }),
  assessmentQuestions: z.array(
    z.object({
      id: z.string().uuid(),
      description: z.string(),
      index: z.number().int(),
      assessmentQuestionChoices: z.array(
        z.object({
          id: z.string().uuid(),
          label: z.string(),
          value: z.number(),
          index: z.number().int(),
        })
      ),
    })
  ),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  company: z
    .object({
      id: z.string().cuid(),
      name: z.string(),
    })
    .optional(),
  role: z.object({
    id: z.string(),
    slug: z.string(),
  }),
});

export const CompanySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
});

export const RoleSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
});

export const PsychologicalDimensionSchema = z.object({
  id: z.string().uuid(),
  acronym: z.string().min(1),
  name: z.string().min(1),
  selfMonitoringBlock: z.object({
    id: z.string().cuid(),
    title: z.string().min(1),
  }),
});

export const AssessmentQuestionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1),
  assessmentId: z.string().cuid(),
  index: z.number().int(),
  psychologicalDimension: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    acronym: z.string().min(1),
  }),
  assessmentQuestionChoices: z.array(
    z.object({
      id: z.string().uuid(),
      label: z.string().min(1),
      value: z.number(),
      index: z.number().int(),
    })
  ),
});

export const NationalitySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  acronym: z
    .string()
    .toLowerCase()
    .regex(/^[a-z]{2}-[a-z]{2}$/i, {
      message: "Acronym must be in the format xx-yy (e.g., pt-br, en-us)",
    }),
});

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  notificationType: z.object({
    id: z.string().cuid(),
    name: z.string().min(1),
    priority: z.number().int(),
    color: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i), // #RGB ou #RRGGBB
  }),
});

export const NotificationTypeSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  priority: z.number().int(),
  color: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
});
