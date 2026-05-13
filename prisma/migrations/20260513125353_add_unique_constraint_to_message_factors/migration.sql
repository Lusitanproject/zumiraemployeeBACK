/*
  Warnings:

  - You are about to drop the column `non_applicable` on the `act_messages_psychosocial_factors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[message_id,factor_id,analysis_batch_id,revision]` on the table `act_messages_psychosocial_factors` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "act_messages_psychosocial_factors" DROP CONSTRAINT "act_messages_psychosocial_factors_factor_id_fkey";

-- AlterTable
DELETE FROM "act_messages_psychosocial_factors";

ALTER TABLE "act_messages_psychosocial_factors" DROP COLUMN "non_applicable",
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "factor_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "act_messages_psychosocial_factors_message_id_factor_id_anal_key" ON "act_messages_psychosocial_factors"("message_id", "factor_id", "analysis_batch_id", "revision");

-- AddForeignKey
ALTER TABLE "act_messages_psychosocial_factors" ADD CONSTRAINT "act_messages_psychosocial_factors_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "psychosocial_factors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
