import { Request, Response } from "express";

import { MessageActChatbotSchema } from "../../../definitions/actChatbot";
import { UserIdSchema } from "../../../definitions/common";
import { MessageActChatbotService } from "../../../services/act/MessageActChatbotService";
import { parseZodError } from "../../../utils/parseZodError";

class IntegrationMessageActChatbotController {
  async handle(req: Request, res: Response) {
    const { success: userIdSuccess, data: userIdData, error: userIdError } = UserIdSchema.safeParse(req.query);

    if (!userIdSuccess) throw Error(parseZodError(userIdError));

    const { success, data, error } = MessageActChatbotSchema.safeParse(req.body);

    if (!success) throw Error(parseZodError(error));

    const { userId } = userIdData;

    const service = new MessageActChatbotService();
    const result = await service.execute({ ...data, userId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { IntegrationMessageActChatbotController };
