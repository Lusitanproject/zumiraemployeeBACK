/*
  Warnings:

  - The values [ADMIN_TEST] on the enum `ChapterType` will be removed. If these variants are still used in the database, this will fail.

*/
-- Delete chapters created as ADMIN_TEST (messages deleted by cascade)
DELETE FROM "act_chapters" WHERE "type" = 'ADMIN_TEST';

-- AlterEnum
BEGIN;
CREATE TYPE "ChapterType_new" AS ENUM ('REGULAR', 'WHATSAPP');
ALTER TABLE "act_chapters" ALTER COLUMN "type" TYPE "ChapterType_new" USING ("type"::text::"ChapterType_new");
ALTER TYPE "ChapterType" RENAME TO "ChapterType_old";
ALTER TYPE "ChapterType_new" RENAME TO "ChapterType";
DROP TYPE "ChapterType_old";
COMMIT;
