-- AlterTable
ALTER TABLE `NationalCampaign` ADD COLUMN `mostNeededBlood` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE') NULL,
    ADD COLUMN `targetUnits` INTEGER NOT NULL DEFAULT 0;
