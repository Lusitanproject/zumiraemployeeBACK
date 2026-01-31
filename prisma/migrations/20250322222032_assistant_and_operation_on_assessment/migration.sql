/*
  Warnings:

  - You are about to drop the column `openaiAssistantId` on the `self_monitoring_blocks` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('SUM', 'AVERAGE');

-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "openaiAssistantId" TEXT,
ADD COLUMN     "operation_type" "Operation" NOT NULL DEFAULT 'AVERAGE';

-- AlterTable
ALTER TABLE "self_monitoring_blocks" DROP COLUMN "openaiAssistantId";
