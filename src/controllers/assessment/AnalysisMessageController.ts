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

    const t0 = Date.now();

    const openAiApi = new OpenAiApi();
    const stream = await openAiApi.generateResponse({
      messages,
      instructions: assessment.consultiveAiInstructions,
      openaiVectorStoreId: analysis.vectorStore.openaiVectorStoreId,
      stream: true,
    });

    const tStreamOpen = Date.now();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let firstToken = true;
    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        if (firstToken) {
          console.log(`[assessment/analysis] ttft=${Date.now() - tStreamOpen}ms db=${tStreamOpen - t0}ms`);
          firstToken = false;
        }
        res.write(`data: ${JSON.stringify({ delta: event.delta })}\n\n`);
      }
    }

    console.log(`[assessment/analysis] stream_total=${Date.now() - tStreamOpen}ms total=${Date.now() - t0}ms`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

export { AnalysisMessageController };
