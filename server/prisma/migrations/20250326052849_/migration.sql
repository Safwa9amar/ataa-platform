-- CreateTable
CREATE TABLE `Income` (
    `id` VARCHAR(191) NOT NULL,
    `source` ENUM('DONATION', 'SALES', 'GOVERNMENT_SUPPORT', 'GRANT', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `amount` DOUBLE NOT NULL,
    `receiptDate` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `charityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('PAID', 'PENDING', 'UNPAID') NOT NULL DEFAULT 'PENDING',
    `issuerBeneficiary` VARCHAR(191) NOT NULL,
    `invoiceAmount` DOUBLE NOT NULL,
    `issueDate` DATETIME(3) NOT NULL,
    `paymentDate` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `charityId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('OPERATIONAL', 'ADMINISTRATIVE', 'NON_OPERATIONAL') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `charityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `imgURL` VARCHAR(191) NOT NULL DEFAULT 'https://ataa-platform.com/images/200/10033520/fullLogo.png',
    `socialMediaLinks` VARCHAR(191) NULL,
    `additionalDetails` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `storeCategoryId` VARCHAR(191) NOT NULL,
    `partnerId` VARCHAR(191) NULL,
    `fileID` VARCHAR(191) NULL,
    `minimumStockLevel` INTEGER NULL DEFAULT 10,
    `soldQuantity` INTEGER NOT NULL DEFAULT 0,
    `lastStockUpdate` DATETIME(3) NULL,
    `restockDate` DATETIME(3) NULL,

    UNIQUE INDEX `Product_fileID_key`(`fileID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockHistory` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `oldStock` INTEGER NOT NULL,
    `newStock` INTEGER NOT NULL,
    `changeType` ENUM('SALE', 'RESTOCK', 'RESET', 'ADJUSTMENT', 'RETURN', 'CANCEL_SALE', 'CANCEL_RESTOCK', 'RESERVE', 'RELEASE_RESERVE', 'DAMAGE', 'INVENTORY_CHECK') NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL DEFAULT '#000',

    UNIQUE INDEX `StoreCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceProduct` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `priceAtInvoice` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierInvoice` (
    `id` VARCHAR(191) NOT NULL,
    `donationOpportunityId` VARCHAR(191) NULL,
    `issuedBySupplier` VARCHAR(191) NULL,
    `issuedToCharity` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `issueDate` DATETIME(3) NOT NULL,
    `paymentDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'PAID', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `invoicePDF` VARCHAR(191) NULL,
    `confirmationStatus` ENUM('PENDING_CHARITY', 'CONFIRMED_CHARITY', 'CONFIRMED_PLATFORM') NULL DEFAULT 'PENDING_CHARITY',
    `paymentStatus` ENUM('PAID', 'PENDING', 'UNPAID') NULL DEFAULT 'UNPAID',
    `confirmedByCharityAt` DATETIME(3) NULL,
    `confirmedByPlatformAt` DATETIME(3) NULL,
    `paidAt` DATETIME(3) NULL,
    `platformConfirmedBy` VARCHAR(191) NULL,
    `charityId` VARCHAR(191) NULL,
    `partnerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SupplierInvoice_status_idx`(`status`),
    INDEX `SupplierInvoice_confirmationStatus_idx`(`confirmationStatus`),
    INDEX `SupplierInvoice_paymentStatus_idx`(`paymentStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceTracking` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING_CHARITY', 'CONFIRMED_CHARITY', 'CONFIRMED_PLATFORM', 'PAID') NOT NULL,
    `changedBy` VARCHAR(191) NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `id` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `visitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `campiagnId` VARCHAR(191) NULL,
    `donationOppertunityID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zakat` (
    `id` VARCHAR(191) NOT NULL,
    `goldAmount` DOUBLE NULL DEFAULT 0,
    `silverAmount` DOUBLE NULL DEFAULT 0,
    `cashAmount` DOUBLE NULL DEFAULT 0,
    `stockAmount` DOUBLE NULL DEFAULT 0,
    `zakatTotal` DOUBLE NULL DEFAULT 0,
    `donatedZakat` DOUBLE NULL DEFAULT 0,
    `year` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointments` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `locationLink` VARCHAR(191) NULL,
    `status` ENUM('new', 'seen', 'completed') NOT NULL DEFAULT 'new',
    `isDone` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('USERCAMPAIGN', 'NATIONALCAMPAIGN') NOT NULL DEFAULT 'USERCAMPAIGN',
    `bloodType` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE') NOT NULL DEFAULT 'O_POSITIVE',
    `age` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `campaignId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `nationalCampaignID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GivingPartners` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `ActivityField` VARCHAR(191) NULL,
    `Headquarters` VARCHAR(191) NULL,
    `type` ENUM('Government', 'Private') NOT NULL DEFAULT 'Government',
    `PartnershipType` ENUM('Strategic', 'Marketing', 'Supervisory', 'Sponsor', 'DonationSolutions') NOT NULL DEFAULT 'DonationSolutions',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupervisoryAuthorities` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AlgeriaCities` (
    `id` VARCHAR(191) NOT NULL,
    `wilaya_code` VARCHAR(191) NOT NULL,
    `wilaya_name` VARCHAR(191) NOT NULL,
    `wilaya_name_ascii` VARCHAR(191) NOT NULL,
    `daira_name` VARCHAR(191) NOT NULL,
    `daira_name_ascii` VARCHAR(191) NOT NULL,
    `commune_name` VARCHAR(191) NOT NULL,
    `commune_name_ascii` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `screen` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('INFO', 'ALERT', 'SUCCESS', 'ERROR', 'REMINDER') NOT NULL DEFAULT 'INFO',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'LOW',
    `actionState` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `deliveryStatus` ENUM('SENT', 'DELIVERED', 'FAILED', 'VIEWED') NOT NULL DEFAULT 'SENT',
    `scope` ENUM('USER', 'GROUP', 'GLOBAL') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `package` ENUM('REGULAR', 'ADVANCED', 'PREMIUM') NOT NULL DEFAULT 'REGULAR',
    `for` ENUM('visitor', 'charity', 'donor', 'partner', 'blood_agency') NULL DEFAULT 'donor',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paymentLink` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` DOUBLE NULL,
    `tax` DOUBLE NULL,
    `totalPrice` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'CANCELED', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    `paymentDate` DATETIME(3) NULL,
    `paymentMethod` ENUM('CREDIT_CARD', 'BANK_TRANSFER', 'STRIPE', 'CHARGILY', 'OTHER') NOT NULL,
    `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    `isEdited` BOOLEAN NOT NULL DEFAULT false,
    `isTrial` BOOLEAN NOT NULL DEFAULT false,
    `billingCycle` ENUM('MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL DEFAULT 'YEARLY',
    `maxUsersAllowed` INTEGER NULL,
    `renewalReminder` BOOLEAN NOT NULL DEFAULT false,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `Testimonial_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeCarouselData` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `backgroundImage` VARCHAR(191) NOT NULL,
    `silderImage` VARCHAR(191) NULL,
    `actionBtnTitle` VARCHAR(191) NOT NULL,
    `webLink` VARCHAR(191) NOT NULL,
    `appLink` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `fieldname` VARCHAR(191) NULL,
    `originalname` VARCHAR(191) NULL,
    `encoding` VARCHAR(191) NULL,
    `mimetype` VARCHAR(191) NULL,
    `destination` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `path` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `userID` VARCHAR(191) NULL,
    `campaignId` VARCHAR(191) NULL,
    `donationOpportunityId` VARCHAR(191) NULL,
    `rechrgeID` VARCHAR(191) NULL,
    `producID` VARCHAR(191) NULL,
    `charityID` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Image_charityID_key`(`charityID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `fieldname` VARCHAR(191) NULL,
    `originalname` VARCHAR(191) NULL,
    `encoding` VARCHAR(191) NULL,
    `mimetype` VARCHAR(191) NULL,
    `destination` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `path` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `userID` VARCHAR(191) NULL,
    `campaignId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `donationOpportunityId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `ar_title` VARCHAR(191) NOT NULL,
    `type` ENUM('Projects', 'Orphans', 'Housing', 'Mosques', 'Sonalgaz', 'Ade', 'Justice', 'Education', 'Health', 'Emergencies', 'Community', 'Environment', 'Agriculture', 'Water', 'FoodRelief', 'Scholarships', 'Employment', 'WomenEmpowerment', 'DisabledSupport', 'DisasterRelief', 'AnimalWelfare', 'Technology', 'ArtsAndCulture', 'Sports', 'ElderlyCare', 'RuralDevelopment') NOT NULL DEFAULT 'Projects',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fieldId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orphans` (
    `id` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `age` VARCHAR(191) NULL,
    `orphanDuration` VARCHAR(191) NULL,
    `schoolLevel` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NULL,
    `guardianPhone` VARCHAR(191) NULL,
    `healthStatus` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `residence` VARCHAR(191) NULL,
    `financialNeeds` DOUBLE NULL,
    `psychologicalNeeds` VARCHAR(191) NULL,
    `educationSupport` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mosques` (
    `id` VARCHAR(191) NOT NULL,
    `wilaya` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `requiredCare` VARCHAR(191) NULL,
    `damageDegree` VARCHAR(191) NULL,
    `googleMapUrl` VARCHAR(191) NULL,
    `imamName` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `constructionYear` INTEGER NULL,
    `prayerCapacity` INTEGER NULL,
    `electricityNeeds` BOOLEAN NULL,
    `waterAvailability` BOOLEAN NULL,
    `maintenanceRequired` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projects` (
    `id` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `age` VARCHAR(191) NULL,
    `numberOfChildren` VARCHAR(191) NULL,
    `specialNeeds` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Housing` (
    `id` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `age` VARCHAR(191) NULL,
    `numberOfChildren` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sonalgaz` (
    `id` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ade` (
    `id` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Justice` (
    `id` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `maritalStatus` VARCHAR(191) NOT NULL,
    `age` VARCHAR(191) NOT NULL,
    `casesNum` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DisasterRelief` (
    `id` VARCHAR(191) NOT NULL,
    `prisonRegion` VARCHAR(191) NOT NULL,
    `caseDetails` VARCHAR(191) NOT NULL,
    `legalFees` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SharedLinks` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `linkType` ENUM('donationOpportunity', 'campaign') NOT NULL,
    `platform` ENUM('FACEBOOK', 'TWITTER', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP', 'Other') NOT NULL,
    `uniqueLink` VARCHAR(191) NOT NULL,
    `donationOpportunityId` VARCHAR(191) NULL,
    `campaignId` VARCHAR(191) NULL,
    `donationCount` INTEGER NOT NULL DEFAULT 0,
    `ambassadorPoints` INTEGER NOT NULL DEFAULT 0,
    `donationPoints` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SharedLinks_uniqueLink_key`(`uniqueLink`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `googleId` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `age` VARCHAR(191) NULL,
    `role` ENUM('visitor', 'charity', 'donor', 'partner', 'blood_agency') NULL,
    `registrationStatus` ENUM('CREATED', 'VERIFIED', 'COMPLETED') NOT NULL DEFAULT 'CREATED',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `trialEndDate` DATETIME(3) NULL,
    `canCreateCampaign` BOOLEAN NOT NULL DEFAULT true,
    `dateOfBirth` DATETIME(3) NULL,
    `photo` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `verificationCode` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `numberOfDonations` INTEGER NOT NULL DEFAULT 0,
    `totalDonatedAmount` DOUBLE NOT NULL DEFAULT 0.0,
    `currentBalance` DOUBLE NOT NULL DEFAULT 0.0,
    `ambassadorRank` INTEGER NULL DEFAULT 0,
    `topDonorRank` INTEGER NULL DEFAULT 0,
    `totalAmbassadorPoints` INTEGER NOT NULL DEFAULT 0,
    `redeemableAmbassadorPoints` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lastDonation` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `addressId` VARCHAR(191) NULL,
    `charityId` VARCHAR(191) NULL,
    `partnerId` VARCHAR(191) NULL,
    `bloodAgencyID` VARCHAR(191) NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_googleId_key`(`googleId`),
    UNIQUE INDEX `Users_phone_key`(`phone`),
    UNIQUE INDEX `Users_addressId_key`(`addressId`),
    UNIQUE INDEX `Users_charityId_key`(`charityId`),
    UNIQUE INDEX `Users_partnerId_key`(`partnerId`),
    UNIQUE INDEX `Users_bloodAgencyID_key`(`bloodAgencyID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FcmTokens` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AmbassadorPoints` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `totalPoints` INTEGER NOT NULL DEFAULT 0,
    `redeemablePoints` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donation` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `remainingAmount` DOUBLE NOT NULL DEFAULT 0,
    `usedBalance` DOUBLE NOT NULL DEFAULT 0,
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT '',
    `quarter` INTEGER NOT NULL DEFAULT 0,
    `donationType` ENUM('cart', 'store', 'campaign', 'donationOpportunity', 'zakat', 'fastDonation') NOT NULL DEFAULT 'donationOpportunity',
    `donationOpportunityId` VARCHAR(191) NULL,
    `campaignId` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NULL,
    `cartData` JSON NULL,
    `screenShootId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recharge` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `points` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoggedDevice` (
    `id` VARCHAR(191) NOT NULL,
    `device` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `lastLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ErrorLog` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stack` VARCHAR(191) NOT NULL DEFAULT '',
    `additionalInfo` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonationOpportunity` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('normalOpportunity', 'storeOpportunity') NOT NULL DEFAULT 'normalOpportunity',
    `status` ENUM('PENDING', 'ACTIVE', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `overview` TEXT NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `implementingPartner` VARCHAR(191) NOT NULL DEFAULT '',
    `donationScoop` ENUM('EDUCATIONAL', 'SOCIAL', 'HEALTH', 'NUTRITION', 'HOUSING', 'RELIGIOUS', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `lastDonation` DATETIME(3) NULL,
    `totalDonation` VARCHAR(191) NULL,
    `numOfBeneficiaries` INTEGER NOT NULL DEFAULT 0,
    `donationCount` INTEGER NOT NULL DEFAULT 0,
    `donationsType` ENUM('MONEY', 'GOODS') NULL DEFAULT 'MONEY',
    `numberOfUnits` INTEGER NULL,
    `donatedUnits` INTEGER NULL,
    `unitPrice` DOUBLE NULL,
    `cardImage` VARCHAR(191) NOT NULL DEFAULT '',
    `endAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByuserId` VARCHAR(191) NOT NULL,
    `wilayaId` VARCHAR(191) NULL,
    `charityId` VARCHAR(191) NULL,
    `fieldId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `partner_role` VARCHAR(191) NULL,
    `partner_name` VARCHAR(191) NULL,
    `needs` TEXT NOT NULL DEFAULT '',
    `targetType` VARCHAR(191) NOT NULL DEFAULT '',
    `targetAmount` VARCHAR(191) NOT NULL DEFAULT '',
    `partnershipContractID` VARCHAR(191) NULL,
    `approvalLetterID` VARCHAR(191) NULL,
    `commitmentTransparency` BOOLEAN NOT NULL DEFAULT false,
    `commitmentReporting` BOOLEAN NOT NULL DEFAULT false,
    `daira` VARCHAR(191) NULL,
    `commune` VARCHAR(191) NULL,
    `projectsID` VARCHAR(191) NULL,
    `housingID` VARCHAR(191) NULL,
    `mosquesID` VARCHAR(191) NULL,
    `orphansID` VARCHAR(191) NULL,
    `sonalgazID` VARCHAR(191) NULL,
    `adeID` VARCHAR(191) NULL,
    `justiceID` VARCHAR(191) NULL,
    `disasterReliefID` VARCHAR(191) NULL,

    UNIQUE INDEX `DonationOpportunity_charityId_key`(`charityId`),
    UNIQUE INDEX `DonationOpportunity_partnershipContractID_key`(`partnershipContractID`),
    UNIQUE INDEX `DonationOpportunity_approvalLetterID_key`(`approvalLetterID`),
    UNIQUE INDEX `DonationOpportunity_projectsID_key`(`projectsID`),
    UNIQUE INDEX `DonationOpportunity_housingID_key`(`housingID`),
    UNIQUE INDEX `DonationOpportunity_mosquesID_key`(`mosquesID`),
    UNIQUE INDEX `DonationOpportunity_orphansID_key`(`orphansID`),
    UNIQUE INDEX `DonationOpportunity_sonalgazID_key`(`sonalgazID`),
    UNIQUE INDEX `DonationOpportunity_adeID_key`(`adeID`),
    UNIQUE INDEX `DonationOpportunity_justiceID_key`(`justiceID`),
    UNIQUE INDEX `DonationOpportunity_disasterReliefID_key`(`disasterReliefID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Field` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `ar_title` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Field_title_key`(`title`),
    UNIQUE INDEX `Field_ar_title_key`(`ar_title`),
    UNIQUE INDEX `Field_color_key`(`color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Progress` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `rate` DOUBLE NOT NULL DEFAULT 0,
    `requiredAmount` INTEGER NULL,
    `totalAmount` INTEGER NULL,
    `campaignId` VARCHAR(191) NULL,
    `donationOpportunityId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Progress_campaignId_key`(`campaignId`),
    UNIQUE INDEX `Progress_donationOpportunityId_key`(`donationOpportunityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfoSectionsCard` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `show` BOOLEAN NOT NULL DEFAULT true,
    `image` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL DEFAULT '{}',
    `campaignId` VARCHAR(191) NULL,
    `donationOpportunityId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfoSection` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `show` BOOLEAN NOT NULL DEFAULT true,
    `campaignId` VARCHAR(191) NULL,
    `donationOpportunityId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfoBlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` INTEGER NOT NULL,
    `show` BOOLEAN NOT NULL DEFAULT true,
    `infoSectionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campaign` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `isAgreed` BOOLEAN NULL DEFAULT false,
    `rejected` BOOLEAN NULL DEFAULT false,
    `rejectedAt` DATETIME(3) NULL,
    `rejectedBy` VARCHAR(191) NULL,
    `rejectedWhy` VARCHAR(191) NULL,
    `lastDonation` DATETIME(3) NULL,
    `numOfBeneficiaries` INTEGER NULL DEFAULT 0,
    `numberOfUnits` INTEGER NULL DEFAULT 0,
    `unitPrice` DOUBLE NULL DEFAULT 0,
    `donatedUnits` INTEGER NULL DEFAULT 0,
    `donationCount` INTEGER NULL DEFAULT 0,
    `campaignStatus` ENUM('ONGOING', 'URGENT', 'NOT_URGENT') NOT NULL DEFAULT 'NOT_URGENT',
    `CampaignType` ENUM('BLOOD', 'MONEY', 'GOODS') NOT NULL DEFAULT 'MONEY',
    `bankAccount` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `ownerAddress` VARCHAR(191) NULL,
    `ownerEmail` VARCHAR(191) NULL,
    `ownerPhone` VARCHAR(191) NULL,
    `ownerID` VARCHAR(191) NULL,
    `ownerName` VARCHAR(191) NULL,
    `bloodBankName` VARCHAR(191) NULL,
    `selectedBloodType` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE') NULL,
    `googleMapLink` VARCHAR(191) NULL,
    `wilaya` VARCHAR(191) NULL,
    `commune` INTEGER NULL,
    `daira` VARCHAR(191) NULL,
    `cardImage` VARCHAR(191) NOT NULL DEFAULT '',
    `createdByuserId` VARCHAR(191) NOT NULL,
    `fieldId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `endAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Charity` (
    `id` VARCHAR(191) NOT NULL,
    `legalName` VARCHAR(191) NOT NULL,
    `commonName` VARCHAR(191) NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `establishmentDate` DATETIME(3) NOT NULL,
    `registrationCountry` VARCHAR(191) NOT NULL,
    `organizationType` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `addressId` VARCHAR(191) NULL,
    `missionStatement` VARCHAR(191) NOT NULL,
    `activitiesOverview` VARCHAR(191) NOT NULL,
    `targetedBeneficiaries` VARCHAR(191) NOT NULL,
    `activityAreas` VARCHAR(191) NOT NULL,
    `challenges` VARCHAR(191) NULL,
    `goals` VARCHAR(191) NULL,
    `numOfBeneficiaries` INTEGER NULL DEFAULT 0,
    `legalInfoId` VARCHAR(191) NULL,
    `bankDetailsId` VARCHAR(191) NULL,
    `additionalDocumentsId` VARCHAR(191) NULL,
    `digitalPresenceId` VARCHAR(191) NULL,
    `mainActivities` VARCHAR(191) NULL,
    `majorAchievements` VARCHAR(191) NULL,
    `mainGoals` VARCHAR(191) NULL,
    `currentChallenges` VARCHAR(191) NULL,
    `organizationalChart` VARCHAR(191) NULL,
    `financialManagement` VARCHAR(191) NULL,
    `aidDistribution` VARCHAR(191) NULL,
    `partnershipPrograms` INTEGER NULL,
    `volunteersCount` INTEGER NULL,
    `eventsCount` INTEGER NULL,
    `step2Completed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Charity_addressId_key`(`addressId`),
    UNIQUE INDEX `Charity_legalInfoId_key`(`legalInfoId`),
    UNIQUE INDEX `Charity_bankDetailsId_key`(`bankDetailsId`),
    UNIQUE INDEX `Charity_additionalDocumentsId_key`(`additionalDocumentsId`),
    UNIQUE INDEX `Charity_digitalPresenceId_key`(`digitalPresenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegalAndFinancialInfo` (
    `id` VARCHAR(191) NOT NULL,
    `fundingSource` VARCHAR(191) NOT NULL,
    `taxID` VARCHAR(191) NOT NULL,
    `registrationCertificateFileId` VARCHAR(191) NULL,
    `financialReportFileId` VARCHAR(191) NULL,
    `annualReportFileId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LegalAndFinancialInfo_registrationCertificateFileId_key`(`registrationCertificateFileId`),
    UNIQUE INDEX `LegalAndFinancialInfo_financialReportFileId_key`(`financialReportFileId`),
    UNIQUE INDEX `LegalAndFinancialInfo_annualReportFileId_key`(`annualReportFileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankDetails` (
    `id` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `IBAN` VARCHAR(191) NULL,
    `SWIFT` VARCHAR(191) NULL,
    `branchAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdditionalDocuments` (
    `id` VARCHAR(191) NOT NULL,
    `foundingContractFileId` VARCHAR(191) NULL,
    `boardMembersFileId` VARCHAR(191) NULL,
    `additionalCertificatesFileIds` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdditionalDocuments_foundingContractFileId_key`(`foundingContractFileId`),
    UNIQUE INDEX `AdditionalDocuments_boardMembersFileId_key`(`boardMembersFileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DigitalPresence` (
    `id` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `charityId` VARCHAR(191) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Like` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `charityId` VARCHAR(191) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharityShares` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `link` VARCHAR(191) NULL,
    `charityId` VARCHAR(191) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partner` (
    `id` VARCHAR(191) NOT NULL,
    `step1Completed` BOOLEAN NOT NULL DEFAULT false,
    `entityType` ENUM('INDIVIDUAL', 'COMPANY') NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `businessType` VARCHAR(191) NOT NULL,
    `mainAddress` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `contactPerson` VARCHAR(191) NULL,
    `jobTitle` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `registrationNumber` VARCHAR(191) NULL,
    `taxID` VARCHAR(191) NULL,
    `licenses` VARCHAR(191) NULL,
    `bankDetails` VARCHAR(191) NULL,
    `acceptedPaymentMethods` VARCHAR(191) NULL,
    `logoId` VARCHAR(191) NULL,
    `digitalPresenceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Partner_logoId_key`(`logoId`),
    UNIQUE INDEX `Partner_digitalPresenceId_key`(`digitalPresenceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodAgency` (
    `id` VARCHAR(191) NOT NULL,
    `agencyName` VARCHAR(191) NOT NULL,
    `officialEmail` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NOT NULL,
    `contactPhone` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BloodAgency_officialEmail_key`(`officialEmail`),
    UNIQUE INDEX `BloodAgency_contactEmail_key`(`contactEmail`),
    UNIQUE INDEX `BloodAgency_addressId_key`(`addressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NationalCampaign` (
    `id` VARCHAR(191) NOT NULL,
    `campaignName` VARCHAR(191) NOT NULL,
    `willayaCode` VARCHAR(191) NOT NULL,
    `targetUnit` INTEGER NOT NULL,
    `collectedUnit` INTEGER NOT NULL,
    `needyBlood` ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE') NOT NULL,
    `locationLink` VARCHAR(191) NOT NULL,
    `bloodAgencyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_storeCategoryId_fkey` FOREIGN KEY (`storeCategoryId`) REFERENCES `StoreCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_fileID_fkey` FOREIGN KEY (`fileID`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD CONSTRAINT `StockHistory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceProduct` ADD CONSTRAINT `InvoiceProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceProduct` ADD CONSTRAINT `InvoiceProduct_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `SupplierInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierInvoice` ADD CONSTRAINT `SupplierInvoice_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceTracking` ADD CONSTRAINT `InvoiceTracking_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `SupplierInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_campiagnId_fkey` FOREIGN KEY (`campiagnId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_donationOppertunityID_fkey` FOREIGN KEY (`donationOppertunityID`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zakat` ADD CONSTRAINT `Zakat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_nationalCampaignID_fkey` FOREIGN KEY (`nationalCampaignID`) REFERENCES `NationalCampaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature` ADD CONSTRAINT `feature_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_rechrgeID_fkey` FOREIGN KEY (`rechrgeID`) REFERENCES `Recharge`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_producID_fkey` FOREIGN KEY (`producID`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_charityID_fkey` FOREIGN KEY (`charityID`) REFERENCES `Charity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orphans` ADD CONSTRAINT `Orphans_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mosques` ADD CONSTRAINT `Mosques_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Projects` ADD CONSTRAINT `Projects_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Housing` ADD CONSTRAINT `Housing_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sonalgaz` ADD CONSTRAINT `Sonalgaz_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ade` ADD CONSTRAINT `Ade_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Justice` ADD CONSTRAINT `Justice_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DisasterRelief` ADD CONSTRAINT `DisasterRelief_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedLinks` ADD CONSTRAINT `SharedLinks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedLinks` ADD CONSTRAINT `SharedLinks_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedLinks` ADD CONSTRAINT `SharedLinks_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_bloodAgencyID_fkey` FOREIGN KEY (`bloodAgencyID`) REFERENCES `BloodAgency`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FcmTokens` ADD CONSTRAINT `FcmTokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AmbassadorPoints` ADD CONSTRAINT `AmbassadorPoints_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_screenShootId_fkey` FOREIGN KEY (`screenShootId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recharge` ADD CONSTRAINT `Recharge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoggedDevice` ADD CONSTRAINT `LoggedDevice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_createdByuserId_fkey` FOREIGN KEY (`createdByuserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_wilayaId_fkey` FOREIGN KEY (`wilayaId`) REFERENCES `AlgeriaCities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_partnershipContractID_fkey` FOREIGN KEY (`partnershipContractID`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_approvalLetterID_fkey` FOREIGN KEY (`approvalLetterID`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_projectsID_fkey` FOREIGN KEY (`projectsID`) REFERENCES `Projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_housingID_fkey` FOREIGN KEY (`housingID`) REFERENCES `Housing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_mosquesID_fkey` FOREIGN KEY (`mosquesID`) REFERENCES `Mosques`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_orphansID_fkey` FOREIGN KEY (`orphansID`) REFERENCES `Orphans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_sonalgazID_fkey` FOREIGN KEY (`sonalgazID`) REFERENCES `Sonalgaz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_adeID_fkey` FOREIGN KEY (`adeID`) REFERENCES `Ade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_justiceID_fkey` FOREIGN KEY (`justiceID`) REFERENCES `Justice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationOpportunity` ADD CONSTRAINT `DonationOpportunity_disasterReliefID_fkey` FOREIGN KEY (`disasterReliefID`) REFERENCES `DisasterRelief`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfoSectionsCard` ADD CONSTRAINT `InfoSectionsCard_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfoSectionsCard` ADD CONSTRAINT `InfoSectionsCard_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfoSection` ADD CONSTRAINT `InfoSection_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfoSection` ADD CONSTRAINT `InfoSection_donationOpportunityId_fkey` FOREIGN KEY (`donationOpportunityId`) REFERENCES `DonationOpportunity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InfoBlock` ADD CONSTRAINT `InfoBlock_infoSectionId_fkey` FOREIGN KEY (`infoSectionId`) REFERENCES `InfoSection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campaign` ADD CONSTRAINT `Campaign_createdByuserId_fkey` FOREIGN KEY (`createdByuserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campaign` ADD CONSTRAINT `Campaign_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campaign` ADD CONSTRAINT `Campaign_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charity` ADD CONSTRAINT `Charity_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charity` ADD CONSTRAINT `Charity_legalInfoId_fkey` FOREIGN KEY (`legalInfoId`) REFERENCES `LegalAndFinancialInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charity` ADD CONSTRAINT `Charity_bankDetailsId_fkey` FOREIGN KEY (`bankDetailsId`) REFERENCES `BankDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charity` ADD CONSTRAINT `Charity_additionalDocumentsId_fkey` FOREIGN KEY (`additionalDocumentsId`) REFERENCES `AdditionalDocuments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charity` ADD CONSTRAINT `Charity_digitalPresenceId_fkey` FOREIGN KEY (`digitalPresenceId`) REFERENCES `DigitalPresence`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegalAndFinancialInfo` ADD CONSTRAINT `LegalAndFinancialInfo_registrationCertificateFileId_fkey` FOREIGN KEY (`registrationCertificateFileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegalAndFinancialInfo` ADD CONSTRAINT `LegalAndFinancialInfo_financialReportFileId_fkey` FOREIGN KEY (`financialReportFileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegalAndFinancialInfo` ADD CONSTRAINT `LegalAndFinancialInfo_annualReportFileId_fkey` FOREIGN KEY (`annualReportFileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdditionalDocuments` ADD CONSTRAINT `AdditionalDocuments_foundingContractFileId_fkey` FOREIGN KEY (`foundingContractFileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdditionalDocuments` ADD CONSTRAINT `AdditionalDocuments_boardMembersFileId_fkey` FOREIGN KEY (`boardMembersFileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdditionalDocuments` ADD CONSTRAINT `AdditionalDocuments_additionalCertificatesFileIds_fkey` FOREIGN KEY (`additionalCertificatesFileIds`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharityShares` ADD CONSTRAINT `CharityShares_charityId_fkey` FOREIGN KEY (`charityId`) REFERENCES `Charity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharityShares` ADD CONSTRAINT `CharityShares_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_digitalPresenceId_fkey` FOREIGN KEY (`digitalPresenceId`) REFERENCES `DigitalPresence`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodAgency` ADD CONSTRAINT `BloodAgency_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NationalCampaign` ADD CONSTRAINT `NationalCampaign_bloodAgencyId_fkey` FOREIGN KEY (`bloodAgencyId`) REFERENCES `BloodAgency`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
