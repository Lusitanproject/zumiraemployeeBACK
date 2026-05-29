import cors from "cors";
import "express-async-errors";
import express, { RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerApis, swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { router } from "./routes";

const app = express();
const swaggerServeHandlers = swaggerUi.serve as unknown as RequestHandler[];
const swaggerSetupHandler = swaggerUi.setup(swaggerSpec) as unknown as RequestHandler;
const requestBodyLimit = process.env.REQUEST_BODY_LIMIT ?? "100mb";

app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));
app.use(cors());

app.use(requestLogger);

app.get("/", (_req, res) => res.redirect("/docs"));
app.use("/docs", ...swaggerServeHandlers, swaggerSetupHandler);
app.get("/docs-json", (_req, res) => res.json(swaggerSpec));
app.get("/docs-debug", (_req, res) => {
  const spec = swaggerSpec as { paths?: Record<string, unknown> };
  res.json({
    __dirname: __dirname,
    apis: swaggerApis,
    pathsCount: spec.paths ? Object.keys(spec.paths).length : 0,
    paths: spec.paths ? Object.keys(spec.paths) : [],
  });
});

app.use(router);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`\nServer hosted in localhost:${process.env.PORT}\n`);
});
