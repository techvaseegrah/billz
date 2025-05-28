/*
  Warnings:

  - You are about to alter the column `lastAttemptAt` on the `active_mandates` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastNotificationAttempt` on the `active_mandates` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `end_date` on the `organisation` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `transaction_billing_address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `customersubmission` DROP FOREIGN KEY `CustomerSubmission_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customersubmission` DROP FOREIGN KEY `CustomerSubmission_organisationId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_billing_address` DROP FOREIGN KEY `transaction_billing_address_transactionId_fkey`;

-- AlterTable
ALTER TABLE `active_mandates` MODIFY `lastAttemptAt` TIMESTAMP NULL,
    MODIFY `lastNotificationAttempt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `billingCity` VARCHAR(191) NULL,
    ADD COLUMN `billingDistrict` VARCHAR(191) NULL,
    ADD COLUMN `billingFlatNo` VARCHAR(191) NULL,
    ADD COLUMN `billingPincode` VARCHAR(191) NULL,
    ADD COLUMN `billingState` VARCHAR(191) NULL,
    ADD COLUMN `billingStreet` VARCHAR(191) NULL,
    ADD COLUMN `sameAsShipping` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `organisation` MODIFY `end_date` DATETIME NOT NULL;

-- DropTable
DROP TABLE `transaction_billing_address`;

-- AddForeignKey
ALTER TABLE `customersubmission` ADD CONSTRAINT `customersubmission_organisationId_fkey` FOREIGN KEY (`organisationId`) REFERENCES `organisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customersubmission` ADD CONSTRAINT `customersubmission_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `customersubmission` RENAME INDEX `CustomerSubmission_organisationId_idx` TO `customersubmission_organisationId_idx`;

-- RenameIndex
ALTER TABLE `customersubmission` RENAME INDEX `CustomerSubmission_token_key` TO `customersubmission_token_key`;

-- RenameIndex
ALTER TABLE `mandate_notifications` RENAME INDEX `mandate_notifications_organisationId_fkey` TO `mandate_notifications_organisationId_idx`;

-- RenameIndex
ALTER TABLE `transaction_record` RENAME INDEX `bill_no` TO `transaction_record_bill_no_key`;
