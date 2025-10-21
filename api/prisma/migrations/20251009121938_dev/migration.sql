/*
  Warnings:

  - Added the required column `creator_id` to the `companies_feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `CompaniesTasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companies_feedbacks` ADD COLUMN `creator_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `companiestasks` ADD COLUMN `creator_id` INTEGER NOT NULL;
