/*
  Warnings:

  - The primary key for the `Person` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Person` table. All the data in the column will be lost.
  - Added the required column `identification` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "identification" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "identificationType" TEXT NOT NULL,
    "minimumMonthAmount" INTEGER NOT NULL,
    "maximumTotalAmount" INTEGER NOT NULL
);
INSERT INTO "new_Person" ("birthdate", "identificationType", "maximumTotalAmount", "minimumMonthAmount", "name") SELECT "birthdate", "identificationType", "maximumTotalAmount", "minimumMonthAmount", "name" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_identification_key" ON "Person"("identification");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
