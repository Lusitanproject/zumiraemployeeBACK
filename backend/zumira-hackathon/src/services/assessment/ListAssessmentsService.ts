import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";

type AssessmentResult = {
    id: string;
    title: string;
    summary: string;
    scale: { id: string; name: string };
    selfMonitoring: { id: string; title: string };
    lastCompleted: Date | null;
};

class ListAssessmentsService {
    async execute(userId: string) {
        const userExists = await prismaClient.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!userExists) throw new Error("User does not exist");

        const assessments = await prismaClient.$queryRaw<AssessmentResult[]>(Prisma.sql`
            SELECT a.id, a.title, a.summary, 
                jsonb_build_object('id', s.id, 'name', s.name) AS "scale", 
                jsonb_build_object('id', smb.id, 'title', smb.title) AS "selfMonitoring",
                MAX(ans.created_at) AS "lastCompleted"
            
            FROM assessments a 

            -- Obter info da scale
            JOIN assessment_scales s ON a.assessment_scale_id = s.id

            -- Obter info do self monitoring block
            JOIN self_monitoring_scales sms ON s.id = sms.assessment_scale_id
            JOIN self_monitoring_blocks smb ON sms.self_monitoring_id = smb.id
            
            -- Obter respostas para lastCompleted
            LEFT JOIN assessment_questions q ON a.id = q.assessment_id
            LEFT JOIN assessment_question_answers ans ON q.id = ans.assessment_question_id AND ans.user_id = ${userId}

            GROUP BY a.id, a.title, a.summary, s.id, s.name, smb.id, smb.title
        `);

        return { assessments };
    }
}

export { ListAssessmentsService };
