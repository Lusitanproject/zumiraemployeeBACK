import { NextFunction, Request, Response } from "express";

export function requireCompany(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new Error("'requireCompany' should always be called after 'isAuthenticated'");

  if (!req.user.companyId) {
    return res.status(403).json({ status: "ERROR", message: "Forbidden" });
  }

  next();
}
