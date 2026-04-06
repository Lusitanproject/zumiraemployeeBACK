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

app.use("/docs", ...swaggerServeHandlers, swaggerSetupHandler);
app.get("/docs-json", (_req, res) => res.json(swaggerSpec));

app.use(router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(`${kleur.red(req.url)}: ${err.message}`);

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
