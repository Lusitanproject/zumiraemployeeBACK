import cors from "cors";
import "express-async-errors";
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import kleur from "kleur";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import { PublicError } from "./error";
import { router } from "./routes";

const app = express();
const swaggerServeHandlers = swaggerUi.serve as unknown as RequestHandler[];
const swaggerSetupHandler = swaggerUi.setup(swaggerSpec) as unknown as RequestHandler;

app.use(express.json());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = process.hrtime.bigint();

  console.log(`${kleur.cyan(req.method)} ${kleur.blue(req.originalUrl)} - incoming`);

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 500 ? kleur.red : statusCode >= 400 ? kleur.yellow : kleur.green;
    const errorMessage = (res.locals as { errorMessage?: string }).errorMessage;
    const errorLog = errorMessage ? ` ${kleur.red(`error=\"${errorMessage}\"`)}` : "";

    console.log(
      `${kleur.cyan(req.method)} ${kleur.blue(req.originalUrl)} - ${statusColor(String(statusCode))} ${kleur.gray(
        `${durationMs.toFixed(1)}ms`,
      )}${errorLog}`,
    );
  });

  next();
});

app.use("/docs", ...swaggerServeHandlers, swaggerSetupHandler);
app.get("/docs-json", (_req, res) => res.json(swaggerSpec));

app.use(router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(`${kleur.red(req.url)}: ${err.stack}`);

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
});

app.listen(process.env.PORT, () => {
  console.log(`\nServer hosted in localhost:${process.env.PORT}\n`);
});
