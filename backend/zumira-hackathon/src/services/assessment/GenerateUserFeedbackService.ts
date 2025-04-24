import prismaClient from "../../prisma";
import OpenAI from "openai";
import { ResponseInputItem } from "openai/resources/responses/responses";

interface GenerateUserFeedbackRequest {
  userId: string;
  assessmentId: string;
}

async function sendMessage(instructions: string | null, message: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const instructionsObj = {
    role: "system",
    content: [
      {
        type: "input_text",
        text: instructions,
      },
    ],
  } as ResponseInputItem;

  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      ...(instructions ? [instructionsObj] : []),
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "text",
      },
    },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
    store: true,
  });

  return response;
}

class GenerateUserFeedbackService {
  async execute({ userId, assessmentId }: GenerateUserFeedbackRequest) {
    const latestResult = await prismaClient.assessmentResult.findFirst({
      where: {
        assessmentId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!latestResult) throw new Error("No results for this assessment");

    const assessment = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
      select: {
        userFeedbackInstructions: true,
        operationType: true,
        assessmentQuestions: {
          select: {
            psychologicalDimension: {
              select: {
                id: true,
                name: true,
              },
            },
            assessmentQuestionAnswers: {
              where: {
                userId: userId,
                assessmentResultId: latestResult.id,
              },
              include: {
                assessmentQuestionChoice: true,
              },
            },
          },
        },
      },
    });
    if (!assessment) throw new Error("Assessment does not exist");

    const dimensions = [] as { data: { id: string; name: string }; values: number[] }[];
    assessment.assessmentQuestions.map((q) => {
      if (!dimensions.find((d) => d.data.id === q.psychologicalDimension.id)) {
        dimensions.push({ data: q.psychologicalDimension, values: [] });
      }
    });

    for (const question of assessment.assessmentQuestions) {
      const answer = question.assessmentQuestionAnswers[0];
      if (!answer) continue;

      const dimension = dimensions.find((d) => d.data.id === question.psychologicalDimension.id);
      dimension?.values.push(answer.assessmentQuestionChoice.value);
    }

    const message = dimensions
      .filter((d) => d.values.length)
      .map((d) => {
        const sum = d.values.reduce((sum, v) => sum + v, 0);
        const average = sum / d.values.length;

        switch (assessment.operationType) {
          case "SUM":
            return `${d.data.name}: ${sum.toFixed(2)}`;
          case "AVERAGE":
            return `${d.data.name}: ${average.toFixed(2)}`;
        }
      })
      .join(", ");
    if (!message) throw new Error("No values to send");

    console.log(`Generating user feedback for assessment ${assessmentId}`);

    const response = await sendMessage(assessment.userFeedbackInstructions, message);

    const assessmentFeeedback = await prismaClient.userAssessmentFeedback.create({
      data: {
        text: response.output_text,
        userId,
        assessmentId,
      },
      select: {
        id: true,
        text: true,
        userId: true,
        assessmentId: true,
      },
    });

    return assessmentFeeedback;
  }
}

export { GenerateUserFeedbackService };
