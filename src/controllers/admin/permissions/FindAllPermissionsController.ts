import { Request, Response } from "express";

import { PERMISSION_DOMAINS } from "../../../permissions";
import { PermissionDomainResponse } from "../../../schemas/admin/permission";

class FindAllPermissionsController {
  async handle(_req: Request, res: Response) {
    const data: PermissionDomainResponse[] = PERMISSION_DOMAINS.map((domain) => ({
      domain: domain.domain,
      label: domain.label,
      permissions: domain.permissions.map((p) => ({
        key: p.key,
        label: p.label,
      })),
    }));
    return res.json({ status: "SUCCESS", data: { permissions: data } });
  }
}

export { FindAllPermissionsController };
