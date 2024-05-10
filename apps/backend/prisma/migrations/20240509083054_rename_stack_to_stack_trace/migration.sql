/*
  Warnings:

  - You are about to drop the column `name` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `stack` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "name",
DROP COLUMN "stack",
ADD COLUMN     "stackTrace" TEXT;
