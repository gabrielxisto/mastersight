/*
  Warnings:

  - Added the required column `lastAccess` to the `companies_users` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `companies_users` ADD COLUMN `lastAccess` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `image` VARCHAR(191) NOT NULL DEFAULT '';
