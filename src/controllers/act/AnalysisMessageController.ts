import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisMessageSchema } from "../../schemas/actChatbot";
import { OpenAiApi } from "../../external/openai";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

const ParamsSchema = z.object({
  actChatbotId: z.string().cuid(),
});

class AnalysisMessageController {
  async handle(req: Request, res: Response) {
    const parsedParams = ParamsSchema.parse(req.params);

    const parsedBody = ActAnalysisMessageSchema.parse(req.body);

    const { actChatbotId } = parsedParams;
    const { messages } = parsedBody;

    const user = await prismaClient.user.findUniqueOrThrow({
      where: { id: req.user.id },
      select: { companyId: true },
    });

    if (!user.companyId) throw new PublicError("Usuário não está associado a uma empresa.");

    const analysis = await prismaClient.companyActAnalysis.findFirst({
      where: { companyId: user.companyId, actChatbotId },
      orderBy: { createdAt: "desc" },
      include: { vectorStore: true },
    });

    if (!analysis?.vectorStore) throw new PublicError("Análise com RAG não disponível para este ato.");

    const actChatbot = await prismaClient.actChatbot.findUniqueOrThrow({
      where: { id: actChatbotId },
      select: { consultiveAiInstructions: true },
    });

    const openAiApi = new OpenAiApi();
    const response = await openAiApi.generateResponse({
      messages,
      instructions: actChatbot.consultiveAiInstructions,
      openaiVectorStoreId: analysis.vectorStore.openaiVectorStoreId,
    });

    return res.json({ status: "SUCCESS", data: { text: response.output_text } });
  }
}

export { AnalysisMessageController };
