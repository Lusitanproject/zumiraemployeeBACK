import { Router } from "express";

import { whatsappWebhookRouter } from "./whatsapp.router";

const webhooksRouter = Router();

webhooksRouter.use("/whatsapp", whatsappWebhookRouter);

export { webhooksRouter };
