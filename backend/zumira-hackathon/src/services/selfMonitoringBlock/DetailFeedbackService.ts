import prismaClient from "../../prisma";

interface DetailFeedbackRequest {
    userId: string;
    selfMonitoringBlockId: string;
}

class DetailFeedbackService {
    async execute({ userId, selfMonitoringBlockId }: DetailFeedbackRequest) {
        const feedback = await prismaClient.selfMonitoringFeedback.findFirst({
            where: {
                selfMonitoringBlockId,
                userId,
            },
            select: {
                text: true,
                userId: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        icon: true,
                        pyschologicalDimensions: {
                            select: {
                                name: true,
                                acronym: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return feedback;
    }
}

export { DetailFeedbackService };
