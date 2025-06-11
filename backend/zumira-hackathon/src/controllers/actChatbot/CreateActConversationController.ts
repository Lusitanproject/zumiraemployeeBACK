import { Request, Response } from "express";

import { CreateActConversationSchema } from "../../definitions/actChatbot";
import { CreateActConversationService } from "../../services/actChatbot/CreateActConversationService";
import { parseZodError } from "../../utils/parseZodError";

class CreateActConversationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateActConversationSchema.safeParse(req.query);

    if (!success) throw Error(parseZodError(error));

    const service = new CreateActConversationService();
    const result = await service.execute({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActConversationController };
