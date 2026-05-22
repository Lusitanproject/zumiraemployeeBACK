import { Request, Response } from "express";

import { RequestParamsIdUUID } from "../../schemas/common";
import { UserService } from "../../services/user/UserService";

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const data = RequestParamsIdUUID.parse(req.params);

    const service = new UserService();
    const result = await service.delete(data.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { DeleteUserController };
