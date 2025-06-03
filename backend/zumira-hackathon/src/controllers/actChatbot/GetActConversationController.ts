import { Request, Response } from "express";
import { GetActConversationSchema } from "../../definitions/actChatbot";
import { parseZodError } from "../../utils/parseZodError";
import { GetActConversationService } from "../../services/actChatbot/GetActConversationService";

class GetActConversationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = GetActConversationSchema.safeParse(req.query);

    if (!success) throw Error(parseZodError(error));

    const service = new GetActConversationService();
    const result = await service.execute({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetActConversationController };
