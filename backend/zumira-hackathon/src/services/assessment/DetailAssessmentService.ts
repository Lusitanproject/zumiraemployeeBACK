import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";

interface DetailAssessmentRequest {
    userId: string;
    assessmentId: string;
}

interface QueryResult {
    id: string;
    title: string;
    description: string | null;
    question: {
        id: string;
        description: string;
        index: number;
        choice: {
            id: string;
            label: string;
            value: number;
            index: number;
        };
    };
    lastCompleted: Date | null;
}

interface AssessmentResult {
    id: string;
    title: string;
    description: string | null;
    questions: {
        id: string;
        description: string;
        index: number;
        choices: {
            id: string;
            label: string;
            value: number;
            index: number;
        }[];
    }[];
    lastCompleted: Date | null;
}

class DetailAssessmentService {
    async execute({ userId, assessmentId }: DetailAssessmentRequest) {
        const queryResults = await prismaClient.$queryRaw<QueryResult[]>(Prisma.sql`
            SELECT a.id, a.title, a.description, 
                jsonb_build_object(
                    'id', q.id, 'description', q.description, 'index', q.index, 
                    'choice', jsonb_build_object('id', c.id, 'label', c.label, 'value', c.value, 'index', c.index)
                ) as question,
                MAX(ans.created_at) AS "lastCompleted"
            FROM assessments a
            JOIN assessment_questions q ON a.id = q.assessment_id
            JOIN assessment_question_choices c ON q.id = c.assessment_question_id
            LEFT JOIN assessment_question_answers ans ON q.id = ans.assessment_question_id AND ans.user_id = ${userId}
            WHERE assessment_id = ${assessmentId}
            GROUP BY a.id, a.title, a.description, q.id, q.description, c.id, c.label, c.value
            ORDER BY q.index ASC, c.index ASC
        `);

        if (queryResults.length === 0) throw new Error("Assessment does not exist");

        const assessment: AssessmentResult = {
            id: queryResults[0].id,
            title: queryResults[0].title,
            description: queryResults[0].description,
            questions: [],
            lastCompleted: null,
        };

        for (const result of queryResults) {
            // Atualizar last completed
            assessment.lastCompleted = result.lastCompleted ?? assessment.lastCompleted;

            // Atualizar questions
            let question = assessment.questions.find((q) => q.id === result.question.id);
            if (!question) {
                question = {
                    id: result.question.id,
                    description: result.question.description,
                    index: result.question.index,
                    choices: [],
                };
                assessment.questions.push(question);
            }

            // Atualizar choices
            const choice = {
                id: result.question.choice.id,
                label: result.question.choice.label,
                value: result.question.choice.value,
                index: result.question.choice.index,
            };
            question.choices.push(choice);
        }

        console.log(JSON.stringify(assessment, null, 2));

        return assessment;
    }
}

export { DetailAssessmentService };
