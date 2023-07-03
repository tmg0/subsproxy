/*
  Warnings:

  - You are about to drop the column `serverId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Account` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "AccountSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Account" ("createdAt", "id", "updatedAt", "username") SELECT "createdAt", "id", "updatedAt", "username" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
