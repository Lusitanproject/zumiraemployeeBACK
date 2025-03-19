import prismaClient from "../../prisma";

interface AssessmentRequest {
    title: string;
    summary: string;
    description?: string;
    selfMonitoringBlockId: string;
}

class CreateAssessmentService {
    async execute({ title, summary, description, selfMonitoringBlockId }: AssessmentRequest) {
        const block = await prismaClient.selfMonitoringBlock.findFirst({
            where: {
                id: selfMonitoringBlockId,
            },
        });

        if (!block) throw new Error("Self monitoring block does not exist");

        const assessment = await prismaClient.assessment.create({
            data: {
                title,
                summary,
                description,
                selfMonitoringBlockId,
            },
            select: {
                id: true,
                title: true,
                summary: true,
                description: true,
                selfMonitoringBlockId: true,
            },
        });

        return assessment;
    }
}

export { CreateAssessmentService };
