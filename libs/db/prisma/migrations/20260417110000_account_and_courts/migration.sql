-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Court" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserAccountBackfill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "_UserAccountBackfill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserAccountBackfill_userId_key" ON "_UserAccountBackfill"("userId");

-- Seed one account per existing user so the new required relation can be added safely.
INSERT INTO "Account" ("name", "createdAt", "updatedAt")
SELECT CONCAT("name", ' Account ', "id"), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User";

INSERT INTO "_UserAccountBackfill" ("userId", "accountId")
SELECT "User"."id", "Account"."id"
FROM "User"
JOIN "Account" ON "Account"."name" = CONCAT("User"."name", ' Account ', "User"."id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN "accountId" INTEGER;

UPDATE "User"
SET "accountId" = "_UserAccountBackfill"."accountId"
FROM "_UserAccountBackfill"
WHERE "User"."id" = "_UserAccountBackfill"."userId";

ALTER TABLE "User" ALTER COLUMN "accountId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "User_accountId_idx" ON "User"("accountId");

-- CreateIndex
CREATE INDEX "Court_accountId_idx" ON "Court"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Court_accountId_name_key" ON "Court"("accountId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Court_accountId_sortOrder_key" ON "Court"("accountId", "sortOrder");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE "_UserAccountBackfill";
