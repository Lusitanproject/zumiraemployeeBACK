-- DropIndex
DROP INDEX "alerts_id_key";

-- AlterTable
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "assessment_result_ratings" ALTER COLUMN "color" DROP DEFAULT,
ALTER COLUMN "profile" DROP DEFAULT,
ALTER COLUMN "risk" DROP DEFAULT;
