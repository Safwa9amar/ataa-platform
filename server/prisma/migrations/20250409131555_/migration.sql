-- AlterTable
ALTER TABLE `DonationOpportunity` MODIFY `status` ENUM('PENDING', 'ACTIVE', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `CharityAssociation` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `shareCount` INTEGER NOT NULL DEFAULT 0,
    `commentCount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
