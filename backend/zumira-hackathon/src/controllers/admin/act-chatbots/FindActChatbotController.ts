import { Request, Response } from "express";
import { z } from "zod";

import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({
  id: z.string().cuid(),
});

class FindActChatbotController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParams.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActChatbotAdminService();
    const result = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindActChatbotController };
