/*
  Warnings:

  - The values [USER,SYSTEM] on the enum `ConversationRole` will be removed. If these variants are still used in the database, this will fail.

*/

-- Limpa todos os registros antes de alterar o enum
DELETE FROM "act_conversation_messages";

-- AlterEnum
BEGIN;
CREATE TYPE "ConversationRole_new" AS ENUM ('user', 'assistant');
ALTER TABLE "act_conversation_messages" ALTER COLUMN "role" TYPE "ConversationRole_new" USING ("role"::text::"ConversationRole_new");
ALTER TYPE "ConversationRole" RENAME TO "ConversationRole_old";
ALTER TYPE "ConversationRole_new" RENAME TO "ConversationRole";
DROP TYPE "ConversationRole_old";
COMMIT;
