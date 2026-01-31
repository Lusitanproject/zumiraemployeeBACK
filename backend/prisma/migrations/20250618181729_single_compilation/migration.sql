/*
  Warnings:

  - You are about to drop the `act_chatper_compilation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "act_chatper_compilation" DROP CONSTRAINT "act_chatper_compilation_actChapterId_fkey";

-- AlterTable
ALTER TABLE "act_chapters" ADD COLUMN     "compilation" TEXT;

-- DropTable
DROP TABLE "act_chatper_compilation";
