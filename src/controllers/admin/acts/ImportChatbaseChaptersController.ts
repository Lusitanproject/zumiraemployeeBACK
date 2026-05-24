import { Request, Response } from "express";
import { z } from "zod";

import { ImportChatbaseChaptersSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

const RequestParams = z.object({
  id: z.string().cuid(),
});

class ImportChatbaseChaptersController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.parse(req.params);

    const parsedBody = ImportChatbaseChaptersSchema.parse(req.body);

    const service = new ActChatbotAdminService();
    const result = await service.importChatbaseChapters({ id: parsedParams.id, ...parsedBody });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ImportChatbaseChaptersController };
