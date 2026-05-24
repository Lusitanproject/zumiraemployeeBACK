import { Request, Response } from "express";
import { z } from "zod";

import { ActService } from "../../services/act/ActService";

const RequestParams = z.object({
  id: z.string().cuid(),
});

class FindActChatbotController {
  async handle(req: Request, res: Response) {
    const data = RequestParams.parse(req.params);

    const service = new ActService();
    const result = await service.findById(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindActChatbotController };
