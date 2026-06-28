-- CreateEnum
CREATE TYPE "DressStyle" AS ENUM ('casual', 'formal', 'party', 'gym');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "dressStyle" "DressStyle" NOT NULL DEFAULT 'casual';
