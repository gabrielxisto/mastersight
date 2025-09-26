/*
  Warnings:

  - Added the required column `description` to the `companies_departments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companies_departments` ADD COLUMN `description` VARCHAR(191) NOT NULL;
