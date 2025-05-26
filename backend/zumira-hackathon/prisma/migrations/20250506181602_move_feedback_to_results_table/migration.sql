/*
  Warnings:

  - You are about to drop the `user_assessment_feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_assessment_feedback" DROP CONSTRAINT "user_assessment_feedback_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "user_assessment_feedback" DROP CONSTRAINT "user_assessment_feedback_user_id_fkey";

-- AlterTable
ALTER TABLE "assessment_results" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "resultRatingId" TEXT;

-- DropTable
DROP TABLE "user_assessment_feedback";
