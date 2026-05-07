/*
  Warnings:

  - The primary key for the `roles_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permission_id` on the `roles_permissions` table. All the data in the column will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `permission` to the `roles_permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DeleteAll
DELETE FROM "roles_permissions";

-- DropForeignKey
ALTER TABLE "roles_permissions" DROP CONSTRAINT "roles_permissions_permission_id_fkey";

-- AlterTable
ALTER TABLE "roles_permissions" DROP CONSTRAINT "roles_permissions_pkey",
DROP COLUMN "permission_id",
ADD COLUMN     "permission" TEXT NOT NULL,
ADD CONSTRAINT "roles_permissions_pkey" PRIMARY KEY ("role_id", "permission");

-- DropTable
DROP TABLE "permissions";
