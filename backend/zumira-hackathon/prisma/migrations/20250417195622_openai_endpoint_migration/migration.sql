/*
  Warnings:

  - You are about to drop the column `openai_assistant_id` on the `assessments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assessments" DROP COLUMN "openai_assistant_id",
ADD COLUMN     "feedback_instructions" TEXT;
