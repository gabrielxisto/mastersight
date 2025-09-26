/*
  Warnings:

  - You are about to alter the column `role` on the `companies_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `department` on the `companies_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `companies_users` MODIFY `role` INTEGER NOT NULL,
    MODIFY `department` INTEGER NOT NULL;
