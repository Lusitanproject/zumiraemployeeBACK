import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";

import { router } from "./routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof Error) {
		return res.status(400).json({
			status: "ERROR",
			message: err.message,
		});
	}

	return res.status(500).json({
		status: "ERROR",
		message: "Internal server error.",
	});
});

app.listen(process.env.PORT, () => {
	console.log(`\nServer hosted in localhost:${process.env.PORT}\n`);
});
