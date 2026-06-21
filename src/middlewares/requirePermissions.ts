import { NextFunction, Request, Response } from "express";

import { Permission } from "../permissions";
import { hasPermission } from "../utils/permissions";

export function requirePermissions(permission: Permission | Permission[], options: { match?: "all" | "any" } = {}) {
  const match = options.match ?? "all";

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requirePermissions' should always be called after 'isAuthenticated'");

    if (req.user.role === "admin") return next();

    const required = Array.isArray(permission) ? permission : [permission];
    const granted = required.filter((p) => hasPermission(req.user, p));
    const allowed = match === "any" ? granted.length > 0 : granted.length === required.length;

    if (!allowed) {
      const missing = required.filter((p) => !granted.includes(p));
      console.log(`Usuário ${req.user.email} não tem permissão: ${missing.join(", ")}`);
      return res.status(403).json({ status: "ERROR", message: "Forbidden" });
    }

    next();
  };
}
