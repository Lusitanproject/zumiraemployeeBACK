-- AlterTable
ALTER TABLE "act_chatbots" ADD COLUMN     "trailId" TEXT;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "trailId" TEXT;

-- CreateTable
CREATE TABLE "trails" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "trails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_chatbots" ADD CONSTRAINT "act_chatbots_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
