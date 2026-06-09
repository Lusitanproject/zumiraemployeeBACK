-- AlterTable: rename columns to new names and add allow_individual_analysis
ALTER TABLE "act_chatbots"
  RENAME COLUMN "report_instructions" TO "report_generation_instructions";

ALTER TABLE "act_chatbots"
  RENAME COLUMN "constultive_ai_instructions" TO "report_lookup_instructions";

ALTER TABLE "act_chatbots"
  RENAME COLUMN "bioanalysis_instructions" TO "individual_analysis_instructions";

ALTER TABLE "act_chatbots"
  ADD COLUMN "allow_individual_analysis" BOOLEAN NOT NULL DEFAULT false;
