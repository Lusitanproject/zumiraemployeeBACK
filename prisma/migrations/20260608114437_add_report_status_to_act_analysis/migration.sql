-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OUTDATED', 'GENERATING', 'READY');

-- AlterTable
ALTER TABLE "company_act_analyses" ADD COLUMN     "report_status" "ReportStatus" NOT NULL DEFAULT 'OUTDATED';
