/*
  Warnings:

  - The `operation_type` column on the `assessments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AssessmentOperation" AS ENUM ('SUM', 'AVERAGE');

-- AlterTable
ALTER TABLE "assessments" DROP COLUMN "operation_type",
ADD COLUMN     "operation_type" "AssessmentOperation" NOT NULL DEFAULT 'AVERAGE';

-- DropEnum
DROP TYPE "Operation";
