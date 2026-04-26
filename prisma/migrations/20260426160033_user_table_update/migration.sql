/*
  Warnings:

  - You are about to drop the column `fist_name` on the `user` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "fist_name",
ADD COLUMN     "first_name" TEXT NOT NULL;
