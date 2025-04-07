// Define fields to validate per step
const stepValidationFields = (subcategory) => {
  // Common fields for all subcategories (steps 0-2)
  const baseSteps = [
    ["field", "category", "donationScoop", "type"], // Step 0
    ["title", "description", "overview", "wilaya", "daira", "commune"], // Step 1
    [], // Step 2 will be populated with subcategory fields
    ["images"], // Step 3 (optional fields)
    ["proofFiles"], // Step 4 (Final step)
  ];

  // Get subcategory specific fields from your JSON
  const subcategoryFields = {
    Projects: ["gender", "maritalStatus", "age", "numberOfChildren", "specialNeeds"],
    Housing: ["gender", "maritalStatus", "age", "numberOfChildren"],
    Orphans: ["gender", "age", "schoolLevel", "healthStatus"],
    Mosques: ["requiredCare", "damageDegree"],
    Justice: ["gender", "maritalStatus", "age", "casesNum", "duration"],
    DisasterRelief: ["prisonRegion", "caseDetails", "legalFees"],
    Sonalgaz: ["gender", "maritalStatus", "status"],
    Ade: ["gender", "maritalStatus", "status"],
    // Add other subcategories as needed
  };

  // Insert the subcategory fields into step 2
  if (subcategory && subcategoryFields[subcategory]) {
    baseSteps[2] = subcategoryFields[subcategory];
  }

  return baseSteps;
};

export default stepValidationFields;