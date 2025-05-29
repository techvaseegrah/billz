/*
  Warnings:

  - You are about to drop the column `billingCity` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `billingDistrict` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `billingFlatNo` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `billingPincode` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `billingState` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `billingStreet` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `sameAsShipping` on the `customers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `customersubmission` DROP FOREIGN KEY `customersubmission_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customersubmission` DROP FOREIGN KEY `customersubmission_organisationId_fkey`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `billingCity`,
    DROP COLUMN `billingDistrict`,
    DROP COLUMN `billingFlatNo`,
    DROP COLUMN `billingPincode`,
    DROP COLUMN `billingState`,
    DROP COLUMN `billingStreet`,
    DROP COLUMN `sameAsShipping`;

-- AlterTable
ALTER TABLE `organisation` ADD COLUMN `wa_access_token` TEXT NULL,
    ADD COLUMN `wa_key` TEXT NULL,
    ADD COLUMN `waba_token` TEXT NULL;

-- CreateTable
CREATE TABLE `transaction_billing_address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` INTEGER NOT NULL,
    `flatNo` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pincode` VARCHAR(191) NULL,

    UNIQUE INDEX `transaction_billing_address_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerSubmission` ADD CONSTRAINT `CustomerSubmission_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubmission` ADD CONSTRAINT `CustomerSubmission_organisationId_fkey` FOREIGN KEY (`organisationId`) REFERENCES `organisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_billing_address` ADD CONSTRAINT `transaction_billing_address_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction_record`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `customersubmission` RENAME INDEX `customersubmission_organisationId_idx` TO `CustomerSubmission_organisationId_idx`;

-- RenameIndex
ALTER TABLE `customersubmission` RENAME INDEX `customersubmission_token_key` TO `CustomerSubmission_token_key`;

-- RenameIndex
ALTER TABLE `mandate_notifications` RENAME INDEX `mandate_notifications_organisationId_idx` TO `mandate_notifications_organisationId_fkey`;

-- RenameIndex
ALTER TABLE `transaction_record` RENAME INDEX `transaction_record_bill_no_key` TO `bill_no`;
