import { NextFunction, Request, Response } from "express";
import kleur from "kleur";
import { ZodError } from "zod";

import { PublicError } from "../error";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(`${kleur.red(req.method)} ${kleur.red(req.url)}: ${err.stack}`);

  if ((err as { type?: string }).type === "entity.too.large" || err.name === "PayloadTooLargeError") {
    return res.status(413).json({
      status: "ERROR",
      message: "Payload muito grande",
    });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      status: "ERROR",
      message: "Erro de validação",
      issues: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  if (err instanceof PublicError) {
    return res.status(400).json({
      status: "ERROR",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "ERROR",
    message: "Erro interno",
  });
}
