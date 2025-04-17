/*
  Warnings:

  - You are about to drop the column `campaignName` on the `NationalCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `collectedUnit` on the `NationalCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `locationLink` on the `NationalCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `needyBlood` on the `NationalCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `targetUnit` on the `NationalCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `willayaCode` on the `NationalCampaign` table. All the data in the column will be lost.
  - Added the required column `commune` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daira` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donationType` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overview` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetGroups` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckCount` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckLocations` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wilaya` to the `NationalCampaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `nationalCampaignId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `NationalCampaign` DROP COLUMN `campaignName`,
    DROP COLUMN `collectedUnit`,
    DROP COLUMN `locationLink`,
    DROP COLUMN `needyBlood`,
    DROP COLUMN `targetUnit`,
    DROP COLUMN `willayaCode`,
    ADD COLUMN `commune` VARCHAR(191) NOT NULL,
    ADD COLUMN `daira` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `donationType` VARCHAR(191) NOT NULL,
    ADD COLUMN `end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `overview` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_date` DATETIME(3) NOT NULL,
    ADD COLUMN `targetGroups` JSON NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `truckCount` INTEGER NOT NULL,
    ADD COLUMN `truckLocations` JSON NOT NULL,
    ADD COLUMN `wilaya` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_nationalCampaignId_fkey` FOREIGN KEY (`nationalCampaignId`) REFERENCES `NationalCampaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
