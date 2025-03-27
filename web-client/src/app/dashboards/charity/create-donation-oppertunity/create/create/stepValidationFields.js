// Define fields to validate per step
const stepValidationFields = [
  ["name", "email", "name", "phone", "title", "description"], // Step 1
  ["wilaya", "daira", "commune"], // Step 2
  [
    "campaignStatus",
    "fieldId",
    "categoryId",
    "numOfBeneficiaries",
    "CampaignType",
    "targetAmount",
    "numberOfUnits",
    "unitPrice",
    "bankAccount",
    "ownerName",
    "ownerID",
    "ownerPhone",
    "ownerEmail",
  ],
  ["images"], // Step 4 (optional fields)
  ["proofFiles"], // Step 5 (Final step, no validation)
];

export default stepValidationFields;
