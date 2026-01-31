/*
  Warnings:

  - You are about to drop the `self_monitoring_feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "self_monitoring_feedback" DROP CONSTRAINT "self_monitoring_feedback_self_monitoring_block_id_fkey";

-- DropForeignKey
ALTER TABLE "self_monitoring_feedback" DROP CONSTRAINT "self_monitoring_feedback_userId_fkey";

-- DropTable
DROP TABLE "self_monitoring_feedback";

-- CreateTable
CREATE TABLE "assessment_feedback" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assessment_feedback" ADD CONSTRAINT "assessment_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_feedback" ADD CONSTRAINT "assessment_feedback_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
