/*
  Warnings:

  - You are about to drop the column `installmentQty` on the `loans` table. All the data in the column will be lost.
  - Added the required column `installmentsQty` to the `loans` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "installmentsQty" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paymentDate" DATETIME,
    CONSTRAINT "loans_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("identification") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("amount", "createdAt", "id", "personId", "status", "updatedAt") SELECT "amount", "createdAt", "id", "personId", "status", "updatedAt" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
