import { NextFunction, Request, Response } from "express";
import kleur from "kleur";

import { PublicError } from "../error";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(`${kleur.red(req.method)} ${kleur.red(req.url)}: ${err.stack}`);

  if ((err as { type?: string }).type === "entity.too.large" || err.name === "PayloadTooLargeError") {
    return res.status(413).json({
      status: "ERROR",
      message: "Payload muito grande",
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
