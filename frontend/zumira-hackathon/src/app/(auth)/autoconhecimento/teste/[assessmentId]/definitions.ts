import { z } from "zod";

export type GetAssessmentData = {
  status: "SUCCESS";
  data: AssessmentDetail;
};

export type AssessmentDetail = {
  id: string;
  title: string;
  description: string | null;
  assessmensQuestions: AssessmentQuestion[];
  lastCompleted: Date | null;
};

export type AssessmentQuestion = {
  id: string;
  description: string;
  index: number;
  assessmentQuestionChoices: Array<{
    id: string;
    label: string;
    value: number;
    index: number;
  }>;
};

export const AssessmentQuestionChoicesSchema = z.array(
  z.object({
    assessmentQuestionId: z.string().uuid(),
    assessmentQuestionChoiceId: z.string().uuid(),
  }),
);

export const SaveAssessmentAnswerSchema = z.object({
  assessmentId: z.string().cuid(),
  answers: AssessmentQuestionChoicesSchema,
});

export type AssessmentQuestionChoices = z.infer<typeof AssessmentQuestionChoicesSchema>;
export type SaveAssessmentAnswer = z.infer<typeof SaveAssessmentAnswerSchema>;

export type FormState =
  | {
      errors?: {
        assessmentId?: string[];
        answers?: string[];
      };
    }
  | undefined;

export type MutateAssessmentResult = {
  status: "SUCCESS";
  data: {
    id: string;
    userId: string;
    assessmentId: string;
  };
};
