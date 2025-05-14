export interface Result {
  id: string;
  feedback: string;
  assessmentResultRating: AssessmentResultRating;
  assessment: Assessment;
  assessmentQuestionAnswers: AssessmentQuestionAnswer[];
  createdAt: Date;
  psychologicalDimensions: PsychologicalDimension[];
}

interface Assessment {
  id: string;
  title: string;
  summary: string;
  description: string;
  nationality: Nationality;
  selfMonitoringBlock: SelfMonitoringBlock;
}

interface Nationality {
  name: string;
  acronymn: string;
}

interface SelfMonitoringBlock {
  id: string;
  icon: string;
  title: string;
  summary: string;
  psychologicalDimensions: PsychologicalDimension[];
}

interface PsychologicalDimension {
  acronym: string;
  name: string;
}

interface AssessmentQuestionAnswer {
  assessmentQuestionChoice: AssessmentQuestionChoice;
  assessmentQuestion: AssessmentQuestion;
}

interface AssessmentQuestion {
  description: string;
  index: number;
  psychologicalDimension: PsychologicalDimension;
}

interface AssessmentQuestionChoice {
  label: string;
  value: number;
  index: number;
}

interface AssessmentResultRating {
  name: string;
}

export type GetResults = {
  status: "SUCCESS" | "ERROR";
  data?: Result;
  message?: string;
};
