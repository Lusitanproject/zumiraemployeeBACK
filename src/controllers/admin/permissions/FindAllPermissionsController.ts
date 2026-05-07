import { Request, Response } from "express";

import { ALL_PERMISSIONS } from "../../../permissions";

class FindAllPermissionsController {
  async handle(_req: Request, res: Response) {
    return res.json({ status: "SUCCESS", data: { permissions: ALL_PERMISSIONS } });
  }
}

export { FindAllPermissionsController };
