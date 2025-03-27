/**
 * Merges the correct subcategory data into the main category object based on type.
 *
 * @param {Object} category - The category object to process.
 * @returns {Object} - The category object with the subcategory data merged.
 */
function processCategory(category) {
  // Define a mapping between category types and their corresponding subcategory fields
  const subcategoryMap = {
    Orphans: "OrphanCategory",
    Mosques: "MosqueCategory",
    Justice: "TayseerCategory",
    DisasterRelief: "FarajCategory",
    // Other category types that do not have a specific subcategory can simply remain unmapped.
    Housing: null,
    Sonalgaz: null,
    Ade: null,
    Education: null,
    Health: null,
    Emergencies: null,
    Community: null,
    Environment: null,
    Agriculture: null,
    Water: null,
    FoodRelief: null,
    Scholarships: null,
    Employment: null,
    WomenEmpowerment: null,
    DisabledSupport: null,
    AnimalWelfare: null,
    Technology: null,
    ArtsAndCulture: null,
    Sports: null,
    ElderlyCare: null,
    RuralDevelopment: null,
  };

  // Get the subcategory field based on the category type
  const subcategoryField = subcategoryMap[category.type];

  // If the subcategory field exists and contains data, merge it into the main object
  if (subcategoryField && category[subcategoryField]) {
    return {
      ...category,
      ...category[subcategoryField], // Merge subcategory data
      subcategoryType: subcategoryField, // Add the subcategory type for reference
    };
  }

  // If no subcategory data is present, return the category as is
  return category;
}

export default processCategory;
