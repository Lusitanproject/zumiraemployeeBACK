/*
  Warnings:

  - You are about to drop the column `notification_type_id` on the `assessment_result_ratings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assessment_result_ratings" DROP COLUMN "notification_type_id";
