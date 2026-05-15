-- RenameTable
ALTER TABLE "company_assessment_feedback" RENAME TO "company_assessment_analysis";

-- RenamePrimaryKey
ALTER TABLE "company_assessment_analysis" RENAME CONSTRAINT "company_assessment_feedback_pkey" TO "company_assessment_analysis_pkey";

-- RenameForeignKey
ALTER TABLE "company_assessment_analysis" RENAME CONSTRAINT "company_assessment_feedback_company_id_fkey" TO "company_assessment_analysis_company_id_fkey";

-- RenameForeignKey
ALTER TABLE "company_assessment_analysis" RENAME CONSTRAINT "company_assessment_feedback_assessment_id_fkey" TO "company_assessment_analysis_assessment_id_fkey";
