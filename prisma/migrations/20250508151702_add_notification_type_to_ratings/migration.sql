/*
  Warnings:

  - Added the required column `notification_type_id` to the `assessment_result_ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assessment_result_ratings" ADD COLUMN     "notification_type_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "assessment_result_ratings" ADD CONSTRAINT "assessment_result_ratings_notification_type_id_fkey" FOREIGN KEY ("notification_type_id") REFERENCES "notification_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
