const subcategoryStep0Fields = {
  // Additional fields for Step 0 per subcategory
  Project: [
    "gender",
    "maritalStatus",
    "age",
    "numberOfChildren",
    "specialNeeds",
  ],
  iskan: ["gender", "maritalStatus", "age", "numberOfChildren"],
  kafalat: ["gender", "age", "schoolLevel", "healthStatus"],
  masajed: ["requiredCare", "damageDegree"],
  justice: ["gender", "maritalStatus", "age", "casesNum", "duration"],
  DisasterRelief: ["prisonRegion", "caseDetails", "legalFees"],
  sonalgaz: ["gender", "maritalStatus", "status"],
  ade: ["gender", "maritalStatus", "status"],
};

const stepValidationFields = (subcategory) => {
  return [
    [
      // Step 1
      "field",
      "category",
      "donationScoop",
      ...(subcategoryStep0Fields[subcategory] || []),
    ],
    ["title", "description", "overview", "wilaya", "daira", "commune"], // Step 2
    ["targetType", "targetAmount", "unitPrice"],
    ["numOfBeneficiaries", "needs"],
    ["images"], // Step 3
    ["proofFiles"],
    [],
    [],
  ];
};

export default stepValidationFields;
