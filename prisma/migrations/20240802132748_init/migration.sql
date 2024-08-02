/*
  Warnings:

  - You are about to drop the column `photoId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_photoId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "photoId";

-- DropTable
DROP TABLE "Photo";
