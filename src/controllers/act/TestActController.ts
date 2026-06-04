import { Request, Response } from "express";

import { TestActSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class TestActController {
  async handle(req: Request, res: Response) {
    const actChatbotId = req.params.id;
    const data = TestActSchema.parse(req.body);

    const service = new ActService();
    const stream = await service.testMessage({
      actChatbotId,
      companyId: req.user.companyId!,
      ...data,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        res.write(`data: ${JSON.stringify({ delta: event.delta })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  }
}

export { TestActController };
