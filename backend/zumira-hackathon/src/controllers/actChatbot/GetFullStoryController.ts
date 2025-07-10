import { Request, Response } from "express";

import { GetFullStoryService } from "../../services/actChatbot/GetFullStoryService";

class GetFullStoryController {
  async handle(req: Request, res: Response) {
    const service = new GetFullStoryService();
    const result = await service.execute(req.user.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetFullStoryController };
