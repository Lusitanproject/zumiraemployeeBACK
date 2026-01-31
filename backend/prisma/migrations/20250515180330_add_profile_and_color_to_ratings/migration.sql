/*
  Warnings:

  - You are about to drop the column `name` on the `assessment_result_ratings` table. All the data in the column will be lost.
  - You are about to drop the column `notification_type_id` on the `assessment_result_ratings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assessment_result_ratings" DROP CONSTRAINT "assessment_result_ratings_notification_type_id_fkey";

-- AlterTable
ALTER TABLE "assessment_result_ratings" DROP COLUMN "name",
DROP COLUMN "notification_type_id",
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "profile" TEXT NOT NULL DEFAULT 'Novo perfil',
ADD COLUMN     "risk" TEXT NOT NULL DEFAULT 'Novo risco';
