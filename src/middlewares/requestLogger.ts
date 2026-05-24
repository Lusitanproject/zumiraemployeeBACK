import { NextFunction, Request, Response } from "express";
import kleur from "kleur";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const PRINT_RESPONSE_BODY = process.env.PRINT_RESPONSE_BODY === "true";

  const startedAt = process.hrtime.bigint();

  console.log(`${kleur.cyan(req.method)} ${kleur.blue(req.originalUrl)} - incoming`);

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    res.locals.responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 500 ? kleur.red : statusCode >= 400 ? kleur.yellow : kleur.green;
    const errorMessage = (res.locals as { errorMessage?: string }).errorMessage;
    const errorLog = errorMessage ? ` ${kleur.red(`error="${errorMessage}"`)}` : "";
    const body = res.locals.responseBody;
    const bodyLog =
      body !== undefined && PRINT_RESPONSE_BODY ? `\n  ${kleur.yellow("body:")} ${JSON.stringify(body, null, 2)}` : "";

    console.log(
      `${kleur.cyan(req.method)} ${kleur.blue(req.originalUrl)} - ${statusColor(String(statusCode))} ${kleur.gray(
        `${durationMs.toFixed(1)}ms`,
      )}${errorLog}${bodyLog}`,
    );
  });

  next();
}
