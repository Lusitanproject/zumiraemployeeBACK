/*
  Warnings:

  - The values [OUTDATED] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `report_status` on the `company_act_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `company_act_analyses` table. All the data in the column will be lost.

*/

-- AlterTable: drop columns first to remove all references to OUTDATED before enum change
ALTER TABLE "company_act_analyses" DROP COLUMN "report_status",
DROP COLUMN "text";

-- AlterEnum: safe now — no columns reference ReportStatus anymore
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('PENDING', 'GENERATING', 'READY');
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
COMMIT;

-- CreateTable: uses the updated ReportStatus enum directly, no re-cast needed
CREATE TABLE "act_analysis_reports" (
    "id" TEXT NOT NULL,
    "company_act_analysis_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "assessment_period" TEXT,
    "assessment_type" TEXT,
    "description" TEXT,
    "total_participants" INTEGER NOT NULL,
    "technical_responsible" TEXT,
    "professional_registration" TEXT,
    "issued_at" TIMESTAMP(3),
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_analysis_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "act_analysis_reports" ADD CONSTRAINT "act_analysis_reports_company_act_analysis_id_fkey" FOREIGN KEY ("company_act_analysis_id") REFERENCES "company_act_analyses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
