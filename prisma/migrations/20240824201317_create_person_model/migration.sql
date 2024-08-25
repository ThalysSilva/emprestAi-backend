-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "identificationType" TEXT NOT NULL,
    "minimumMonthAmount" INTEGER NOT NULL,
    "maximumTotalAmount" INTEGER NOT NULL
);
