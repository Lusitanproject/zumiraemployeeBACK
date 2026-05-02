import { Request, Response } from "express";
import { z } from "zod";

import { ImportChatbaseChaptersSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({
  id: z.string().cuid(),
});

class ImportChatbaseChaptersController {
  async handle(req: Request, res: Response) {
    const parsedParams = RequestParams.safeParse(req.params);
    if (!parsedParams.success) throw new Error(parseZodError(parsedParams.error));

    const parsedBody = ImportChatbaseChaptersSchema.safeParse(req.body);
    if (!parsedBody.success) throw new Error(parseZodError(parsedBody.error));

    const service = new ActChatbotAdminService();
    const result = await service.importChatbaseChapters({ id: parsedParams.data.id, ...parsedBody.data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ImportChatbaseChaptersController };
