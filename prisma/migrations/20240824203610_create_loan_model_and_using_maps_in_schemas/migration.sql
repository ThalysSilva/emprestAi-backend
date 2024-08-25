/*
  Warnings:

  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Person";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "persons" (
    "identification" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "identificationType" TEXT NOT NULL,
    "minimumMonthAmount" INTEGER NOT NULL,
    "maximumTotalAmount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "installmentQty" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loans_personId_fkey" FOREIGN KEY ("personId") REFERENCES "persons" ("identification") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_identification_key" ON "persons"("identification");
