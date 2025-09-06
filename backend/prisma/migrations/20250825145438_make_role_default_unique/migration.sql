/*
  Warnings:

  - A unique constraint covering the columns `[isDefault]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Role_isDefault_key" ON "Role"("isDefault");

-- CreateIndex
CREATE INDEX "Role_name_isDefault_idx" ON "Role"("name", "isDefault");
