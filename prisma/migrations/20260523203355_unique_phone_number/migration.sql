/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- Nullify duplicate phone numbers, keeping the earliest record (created_at ASC)
WITH ranked AS (
  SELECT "id",
    ROW_NUMBER() OVER (PARTITION BY "phone_number" ORDER BY "created_at" ASC) AS rn
  FROM "users"
  WHERE "phone_number" IS NOT NULL
)
UPDATE "users"
SET "phone_number" = NULL
WHERE "id" IN (SELECT "id" FROM ranked WHERE rn > 1);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
