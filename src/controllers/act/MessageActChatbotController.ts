import { Request, Response } from "express";

import { MessageActChatbotSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class MessageActChatbotController {
  async handle(req: Request, res: Response) {
    const data = MessageActChatbotSchema.parse(req.body);

    const service = new ActService();
    const { stream, persist } = await service.messageStream({ userId: req.user.id, ...data });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullText = "";
    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        fullText += event.delta;
        res.write(`data: ${JSON.stringify({ delta: event.delta })}\n\n`);
      }
    }

    await persist(fullText);
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

export { MessageActChatbotController };
