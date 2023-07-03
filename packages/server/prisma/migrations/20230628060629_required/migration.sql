/*
  Warnings:

  - Made the column `subscriptionId` on table `Server` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Server" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Server" ("address", "createdAt", "id", "subscriptionId", "updatedAt") SELECT "address", "createdAt", "id", "subscriptionId", "updatedAt" FROM "Server";
DROP TABLE "Server";
ALTER TABLE "new_Server" RENAME TO "Server";
CREATE UNIQUE INDEX "Server_address_key" ON "Server"("address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
