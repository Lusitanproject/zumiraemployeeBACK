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
    const result = await prismaClient.assessmentResult.findFirst({
      where: {
        assessmentId,
        userId,
      },
      include: {
        assessment: true,
        assessmentQuestionAnswers: {
          include: {
            assessmentQuestionChoice: true,
            assessmentQuestion: {
              include: {
                psychologicalDimension: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!result) throw new Error("No results for this assessment");

    const dimensionAnswersValues: Record<string, number[]> = {};
    result.assessmentQuestionAnswers.map((answer) => {
      const dimension = answer.assessmentQuestion.psychologicalDimension.name;

      if (!dimensionAnswersValues[dimension]) dimensionAnswersValues[dimension] = [];
      dimensionAnswersValues[dimension].push(answer.assessmentQuestionChoice.value);
    });

    const message = Object.entries(dimensionAnswersValues)
      .map(([dimension, values]) => {
        const sum = values.reduce((sum, v) => sum + v, 0);
        const average = sum / values.length;

        switch (result.assessment.operationType) {
          case "SUM":
            return `${dimension}: ${sum.toFixed(2)}`;
          case "AVERAGE":
            return `${dimension}: ${average.toFixed(2)}`;
        }
      })
      .join(", ");

    if (!message) throw new Error("No values to send");

    console.log(`Generating user feedback for assessment ${assessmentId}`);

    const response = await sendMessage(result.assessment.userFeedbackInstructions, message);

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
