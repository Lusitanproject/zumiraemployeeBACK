/*
  Warnings:

  - You are about to drop the column `feedback_instructions` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the `assessment_feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assessment_feedback" DROP CONSTRAINT "assessment_feedback_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "assessment_feedback" DROP CONSTRAINT "assessment_feedback_user_id_fkey";

-- AlterTable
ALTER TABLE "assessments" DROP COLUMN "feedback_instructions",
ADD COLUMN     "company_feedback_instructions" TEXT,
ADD COLUMN     "user_feedback_instructions" TEXT;

ALTER TABLE "assessment_feedback" RENAME TO "user_assessment_feedback";
ALTER INDEX "assessment_feedback_pkey" RENAME TO "user_assessment_feedback_pkey";

-- CreateTable
CREATE TABLE "company_assessment_feedback" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_assessment_feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_assessment_feedback" ADD CONSTRAINT "user_assessment_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_assessment_feedback" ADD CONSTRAINT "user_assessment_feedback_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_assessment_feedback" ADD CONSTRAINT "company_assessment_feedback_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_assessment_feedback" ADD CONSTRAINT "company_assessment_feedback_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
