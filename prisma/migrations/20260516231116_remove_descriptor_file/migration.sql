/*
  Warnings:

  - You are about to drop the column `openai_file_id` on the `act_chatbots` table. All the data in the column will be lost.
  - You are about to drop the column `openai_file_synced_at` on the `act_chatbots` table. All the data in the column will be lost.
  - You are about to drop the column `openai_file_id` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `openai_file_synced_at` on the `assessments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "act_chatbots" DROP COLUMN "openai_file_id",
DROP COLUMN "openai_file_synced_at";

-- AlterTable
ALTER TABLE "assessments" DROP COLUMN "openai_file_id",
DROP COLUMN "openai_file_synced_at";
