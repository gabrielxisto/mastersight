/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `Companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companies` ADD COLUMN `domain` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `companies_users` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX `Companies_domain_key` ON `Companies`(`domain`);
