-- AlterTable
ALTER TABLE `NationalCampaign` ADD COLUMN `status` ENUM('PENDING', 'ACTIVE', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
