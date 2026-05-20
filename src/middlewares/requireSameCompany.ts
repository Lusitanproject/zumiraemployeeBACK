import { NextFunction, Request, Response } from "express";

export function requireSameCompany(source: "params" | "query" = "query", paramName = "companyId") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requireSameCompany' should always be called after 'isAuthenticated'");

    if (req.user.role === "admin") return next();

    if (!req.user.companyId) {
      return res.status(403).json({ status: "ERROR", message: "Forbidden" });
    }

    const provided = source === "params" ? req.params[paramName] : (req.query[paramName] as string | undefined);

    if (provided && provided !== req.user.companyId) {
      return res.status(403).json({ status: "ERROR", message: "Forbidden" });
    }

    if (!provided) {
      if (source === "params") req.params[paramName] = req.user.companyId;
      else req.query[paramName] = req.user.companyId;
    }

    next();
  };
}
