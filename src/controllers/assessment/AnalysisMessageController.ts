import { Request, Response } from "express";
import { z } from "zod";

import { PublicError } from "../../error";
import { OpenAiApi } from "../../external/openai";
import prismaClient from "../../prisma";
import { AssessmentAnalysisMessageSchema } from "../../schemas/assessment";

const ParamsSchema = z.object({
  assessmentId: z.string().cuid(),
});

class AnalysisMessageController {
  async handle(req: Request, res: Response) {
    const parsedParams = ParamsSchema.parse(req.params);

    const parsedBody = AssessmentAnalysisMessageSchema.parse(req.body);

    const { assessmentId } = parsedParams;
    const { messages } = parsedBody;

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id: req.user.id },
      select: { companyId: true },
    });

    if (!user.companyId) throw new PublicError("Usuário não está associado a uma empresa.");

    const analysis = await prismaClient.companyAssessmentAnalysis.findFirst({
      where: { companyId: user.companyId, assessmentId },
      orderBy: { createdAt: "desc" },
      include: { vectorStore: true },
    });

    if (!analysis?.vectorStore) throw new PublicError("Análise com RAG não disponível para este assessment.");

    const assessment = await prismaClient.assessment.findUniqueOrThrow({
      where: { id: assessmentId },
      select: { consultiveAiInstructions: true },
    });

    console.log(assessment);

    const openAiApi = new OpenAiApi();
    const response = await openAiApi.generateResponse({
      messages,
      instructions: assessment.consultiveAiInstructions,
      openaiVectorStoreId: analysis.vectorStore.openaiVectorStoreId,
    });

    return res.json({ status: "SUCCESS", data: { text: response.output_text } });
  }
}

export { AnalysisMessageController };
