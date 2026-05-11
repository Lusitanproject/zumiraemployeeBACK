import cors from "cors";
import "express-async-errors";
import express, { RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
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

app.use("/docs", ...swaggerServeHandlers, swaggerSetupHandler);
app.get("/docs-json", (_req, res) => res.json(swaggerSpec));

app.use(router);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`\nServer hosted in localhost:${process.env.PORT}\n`);
});
