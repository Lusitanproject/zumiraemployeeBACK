-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('REGULAR', 'ADMIN_TEST');

-- AlterTable
ALTER TABLE "act_conversations" ADD COLUMN     "type" "ConversationType" NOT NULL DEFAULT 'REGULAR';
