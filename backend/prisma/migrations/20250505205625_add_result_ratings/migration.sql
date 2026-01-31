-- AlterTable
ALTER TABLE "company_assessment_feedback" ALTER COLUMN "respondents" DROP DEFAULT;

-- AlterTable
ALTER TABLE "nationalities" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "result_ratings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "assessments_result_ratings" (
    "assessment_id" TEXT NOT NULL,
    "result_rating_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "result_ratings_id_key" ON "result_ratings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "result_ratings_name_key" ON "result_ratings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assessments_result_ratings_assessment_id_result_rating_id_key" ON "assessments_result_ratings"("assessment_id", "result_rating_id");

-- AddForeignKey
ALTER TABLE "assessments_result_ratings" ADD CONSTRAINT "assessments_result_ratings_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments_result_ratings" ADD CONSTRAINT "assessments_result_ratings_result_rating_id_fkey" FOREIGN KEY ("result_rating_id") REFERENCES "result_ratings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
