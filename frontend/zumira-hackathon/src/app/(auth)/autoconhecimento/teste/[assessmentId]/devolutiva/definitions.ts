export interface Result {
  assessment: Assessment;
  assessmentQuestionAnswers: AssessmentQuestionAnswer[];
  assessmentResultRating: AssessmentResultRating;
  createdAt: Date;
  feedback: string;
  id: string;
  psychologicalDimensions: PsychologicalDimension[];
}

interface Assessment {
  description: string;
  id: string;
  nationality: Nationality;
  selfMonitoringBlock: SelfMonitoringBlock;
  summary: string;
  title: string;
}

interface Nationality {
  acronymn: string;
  name: string;
}

interface SelfMonitoringBlock {
  icon: string;
  id: string;
  psychologicalDimensions: PsychologicalDimension[];
  summary: string;
  title: string;
}

interface PsychologicalDimension {
  acronym: string;
  name: string;
}

interface AssessmentQuestionAnswer {
  assessmentQuestion: AssessmentQuestion;
  assessmentQuestionChoice: AssessmentQuestionChoice;
}

interface AssessmentQuestion {
  description: string;
  index: number;
  psychologicalDimension: PsychologicalDimension;
}

interface AssessmentQuestionChoice {
  index: number;
  label: string;
  value: number;
}

interface AssessmentResultRating {
  name: string;
}

export type GetResults = {
  status: "SUCCESS" | "ERROR";
  data?: Result;
  message?: string;
};
