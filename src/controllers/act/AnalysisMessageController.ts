import { Request, Response } from "express";
import { z } from "zod";

import { ActAnalysisMessageSchema } from "../../schemas/actChatbot";
import { OpenAiApi } from "../../external/openai";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { parseZodError } from "../../utils/parseZodError";

const ParamsSchema = z.object({
  actChatbotId: z.string().cuid(),
});

class AnalysisMessageController {
  async handle(req: Request, res: Response) {
    const parsedParams = ParamsSchema.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedBody = ActAnalysisMessageSchema.safeParse(req.body);
    if (!parsedBody.success) throw new Error(parseZodError(parsedBody.error));

    const { actChatbotId } = parsedParams.data;
    const { messages } = parsedBody.data;

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
