import { Request, Response } from "express";

import { RequestParamsIdUUID } from "../../../definitions/common";
import { UserAdminService } from "../../../services/admin/UserAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParamsIdUUID.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const service = new UserAdminService();
    const result = await service.delete(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { DeleteUserController };
