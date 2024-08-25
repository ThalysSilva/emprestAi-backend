-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paymentDate" DATETIME,
    CONSTRAINT "installments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_installments" ("amount", "createdAt", "dueDate", "id", "loanId", "paymentDate", "status", "updatedAt") SELECT "amount", "createdAt", "dueDate", "id", "loanId", "paymentDate", "status", "updatedAt" FROM "installments";
DROP TABLE "installments";
ALTER TABLE "new_installments" RENAME TO "installments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
