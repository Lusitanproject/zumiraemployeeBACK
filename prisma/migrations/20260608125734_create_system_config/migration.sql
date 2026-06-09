-- CreateTable
CREATE TABLE "system_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "reportUnavailableInstructions" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);
