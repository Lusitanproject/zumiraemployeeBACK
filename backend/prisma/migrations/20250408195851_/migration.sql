-- Drop old constraints
ALTER TABLE "assessment_feedback" DROP CONSTRAINT "assessment_feedback_userId_fkey";
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_nationalityId_fkey";

-- Rename columns
ALTER TABLE "assessment_feedback" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "assessments" RENAME COLUMN "nationalityId" TO "nationality_id";
ALTER TABLE "assessments" RENAME COLUMN "openaiAssistantId" TO "openai_assistant_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "nationality_id" TEXT,
ADD COLUMN     "occupation" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "assessments" ADD CONSTRAINT "assessments_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "nationalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "assessment_feedback" ADD CONSTRAINT "assessment_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
