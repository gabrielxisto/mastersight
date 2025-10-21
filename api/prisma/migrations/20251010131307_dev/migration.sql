/*
  Warnings:

  - You are about to drop the `companieschat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companiestasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `companies_users` ADD COLUMN `salary` DOUBLE NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `companieschat`;

-- DropTable
DROP TABLE `companiestasks`;

-- CreateTable
CREATE TABLE `companies_tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies_chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
