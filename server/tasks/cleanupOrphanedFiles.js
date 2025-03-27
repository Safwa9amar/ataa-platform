const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const uploadDirectory = path.join("./uploads");

const cleanupOrphanedFiles = async () => {
  return "";
  try {
    // Get all files in the upload directory
    const filesInDirectory = fs.readdirSync("./uploads");

    // Get all image and file paths stored in the database
    const imagesInDatabase = await prisma.image.findMany({
      select: { filename: true },
    });

    const filesInDatabase = await prisma.file.findMany({
      select: { filename: true },
    });

    // Combine image and file paths
    const filePathsInDatabase = [
      ...imagesInDatabase.map(
        (file) => file.filename !== null && path.basename(file.filename)
      ),
      ...filesInDatabase.map(
        (file) => file.filename !== null && path.basename(file.filename)
      ),
    ];

    // Filter files that are not in the database
    const orphanedFiles = filesInDirectory.filter(
      (file) =>
        !filePathsInDatabase.includes(file) &&
        file !== "blank-profile-picture.jpg"
    );
    // Delete orphaned files
    for (const file of orphanedFiles) {
      const filePath = path.join(uploadDirectory, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted orphaned file: ${file}`);
    }
  } catch (error) {
    console.error("Error cleaning up orphaned files:", error);
  }
};

// Schedule the job to run every 15 minutes
cron.schedule("*/10 * * * *", cleanupOrphanedFiles);

module.exports = cleanupOrphanedFiles;
