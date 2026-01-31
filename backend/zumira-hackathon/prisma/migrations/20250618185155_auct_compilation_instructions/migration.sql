-- AlterTable
ALTER TABLE "act_chatbots"
RENAME COLUMN "instructions" TO "messageInstructions";

ALTER TABLE "act_chatbots"
ALTER COLUMN "messageInstructions" DROP NOT NULL;

ALTER TABLE "act_chatbots"
ADD COLUMN "compilationInstructions" TEXT;
