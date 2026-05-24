/*
  Warnings:

  - The primary key for the `act_messages_psychosocial_factors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `author` to the `act_messages_psychosocial_factors` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `act_messages_psychosocial_factors` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "MessageFactorAuthor" AS ENUM ('HUMAN', 'AI');

-- AlterTable
ALTER TABLE "act_chapter_messages" ADD COLUMN     "anonymous_content" TEXT;

-- AlterTable
DELETE FROM "act_messages_psychosocial_factors";

ALTER TABLE "act_messages_psychosocial_factors" DROP CONSTRAINT "act_messages_psychosocial_factors_pkey",
ADD COLUMN     "author" "MessageFactorAuthor" NOT NULL,
ADD COLUMN     "effective" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "act_messages_psychosocial_factors_pkey" PRIMARY KEY ("id");
