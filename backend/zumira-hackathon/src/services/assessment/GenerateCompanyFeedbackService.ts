import prismaClient from "../../prisma";
import OpenAI from "openai";
import { ResponseInputItem } from "openai/resources/responses/responses";

interface GenerateCompanyFeedbackRequest {
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

class GenerateCompanyFeedbackService {
  async execute({ userId, assessmentId }: GenerateCompanyFeedbackRequest) {
    const company = await prismaClient.company.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    if (!company) throw new Error("User was not found or has no associated company.");

    const allResults = await prismaClient.assessmentResult.findMany({
      where: {
        assessmentId,
        user: {
          companyId: company.id,
        },
      },
      include: {
        assessment: true,
        assessmentQuestionAnswers: {
          include: {
            assessmentQuestion: {
              include: {
                psychologicalDimension: true,
              },
            },
            assessmentQuestionChoice: true,
          },
        },
      },
    });

    if (!allResults.length) throw new Error("This company has no results for this assessment");

    const exampleResult = allResults[0];
    const assessment = exampleResult.assessment;

    // Manter somente os resultados mais recentes
    const latestResults: Record<string, typeof exampleResult> = {};
    allResults.forEach((r) => {
      if (!latestResults[r.userId] || latestResults[r.userId].createdAt < r.createdAt) latestResults[r.userId] = r;
    });

    const dimensionScores: Record<string, number[]> = {};

    for (const result of Object.values(latestResults)) {
      const userDimensionAnswersValues: Record<string, number[]> = {};

      // Obter os valores das respostas de cada usuario
      for (const answer of result.assessmentQuestionAnswers) {
        const dimension = answer.assessmentQuestion.psychologicalDimension.name;

        if (!userDimensionAnswersValues[dimension]) userDimensionAnswersValues[dimension] = [];

        userDimensionAnswersValues[dimension].push(answer.assessmentQuestionChoice.value);
      }

      // Adicionar os scores aos valores das dimensoes
      for (const [dimension, scores] of Object.entries(userDimensionAnswersValues)) {
        const sum = scores.reduce((sum, v) => sum + v, 0);
        const average = sum / scores.length;

        if (!dimensionScores[dimension]) dimensionScores[dimension] = [];

        switch (assessment.operationType) {
          case "SUM":
            dimensionScores[dimension].push(sum);
            break;
          case "AVERAGE":
            dimensionScores[dimension].push(average);
            break;
        }
      }
    }

    // Obter os scores de cada dimensão como a média dos scores de cada usuário
    const message = Object.entries(dimensionScores)
      .map(([dimension, scores]) => {
        const average = scores.reduce((sum, v) => sum + v, 0) / scores.length;
        return `${dimension}: ${average.toFixed(2)}`;
      })
      .join(", ");

    if (!message) throw new Error("No values to send");

    console.log(`Generating company feedback for assessment ${assessmentId}`);

    const response = await sendMessage(assessment.companyFeedbackInstructions, message);

    const assessmentFeeedback = await prismaClient.companyAssessmentFeedback.create({
      data: {
        text: response.output_text,
        companyId: company.id,
        assessmentId,
      },
      select: {
        id: true,
        text: true,
        companyId: true,
        assessmentId: true,
      },
    });

    return assessmentFeeedback;
  }
}

export { GenerateCompanyFeedbackService };
