/*
  Warnings:

  - Added the required column `fist_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('admin', 'agent', 'user');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('apartment', 'house', 'commercial', 'land', 'townhouse', 'penthouse');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('for_sale', 'for_rent', 'sold');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'closed');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('scheduled', 'rescheduled', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('visit', 'lead', 'booking', 'system');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "fist_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "role" "AppRole" NOT NULL DEFAULT 'user';
