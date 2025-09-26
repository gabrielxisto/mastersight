/*
  Warnings:

  - Added the required column `department_id` to the `companies_roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companies_roles` ADD COLUMN `department_id` INTEGER NOT NULL;
