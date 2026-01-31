-- AlterTable
ALTER TABLE "act_chatbots" 
RENAME COLUMN "compilationInstructions" TO "compilation_instructions";

ALTER TABLE "act_chatbots" 
RENAME COLUMN "messageInstructions" TO "message_instructions";

ALTER TABLE "act_chatbots" 
ALTER COLUMN "index" DROP DEFAULT;
