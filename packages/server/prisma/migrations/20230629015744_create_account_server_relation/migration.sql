-- AlterTable
ALTER TABLE "Account" ADD COLUMN "subscriptionId" TEXT;

-- CreateTable
CREATE TABLE "AccountServer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL
);
