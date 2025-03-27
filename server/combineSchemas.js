const fs = require('fs');
const path = require('path');

// Define the directories
const schemasDir = path.join(__dirname, 'schemas');
const outputFilePath = path.join(__dirname, 'prisma', 'schema.prisma');

// Read all .prisma files from the schemas directory
const schemaFiles = fs
  .readdirSync(schemasDir)
  .filter((file) => file.endsWith(".prisma"));

// Sort the schema files alphabetically by the first letter of their content
const sortedSchemas = schemaFiles
  .map((file) => {
    const filePath = path.join(schemasDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    return { file, content };
  })
  .sort((a, b) => {
    const firstCharA = a.content.trim().charAt(0).toLowerCase();
    const firstCharB = b.content.trim().charAt(0).toLowerCase();
    return firstCharA.localeCompare(firstCharB);
  });

// Combine the sorted schemas
const combinedSchema = sortedSchemas.map(({ content }) => content).join("\n\n");

// Write the combined schema to the output file
fs.writeFileSync(outputFilePath, combinedSchema, "utf-8");

console.log(`Combined and sorted schema written to ${outputFilePath}`);
