import { NextFunction, Request, Response } from "express";

export function requirePermissions(permission: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requirePermissions' should always be called after 'isAuthenticated'");

    if (req.user.role === "admin") return next();

    const required = Array.isArray(permission) ? permission : [permission];
    const missing = required.filter((p) => !req.user.permissions.includes(p));

    if (missing.length > 0) {
      console.log(`Usuário ${req.user.id} (${req.user.name}) não tem permissão: ${missing.join(", ")}`);
      return res.status(403).json({ status: "ERROR", message: "Forbidden" });
    }

    next();
  };
}
