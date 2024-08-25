/*
  Warnings:

  - You are about to drop the column `installmentsQty` on the `loans` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paymentDate" DATETIME,
    CONSTRAINT "installments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paymentDate" DATETIME,
    CONSTRAINT "loans_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("identification") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("amount", "createdAt", "id", "paymentDate", "personId", "status", "updatedAt") SELECT "amount", "createdAt", "id", "paymentDate", "personId", "status", "updatedAt" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
