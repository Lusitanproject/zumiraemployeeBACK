import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import kleur from "kleur";

import { router } from "./routes";
import { PublicError } from "./error";

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
