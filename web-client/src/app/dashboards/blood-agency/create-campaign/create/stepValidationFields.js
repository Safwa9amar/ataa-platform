const stepValidationFields = (subcategory) => {
  return [
    [
      "title",
      "description",
      "overview",
      "wilaya",
      "daira",
      "commune",
      "start_date",
      "end_date",
    ], // Step 2
    ["truckCount", "truckLocations"],
    [],
    ["donationType", "targetGroups", "mostNeededBlood", "targetUnits"],
    ["images"], // Step 3
  ];
};

export default stepValidationFields;
