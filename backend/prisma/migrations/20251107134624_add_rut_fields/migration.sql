/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "rutInvitado" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rut" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_rut_key" ON "User"("rut");
