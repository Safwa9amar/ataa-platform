const fs = require("fs");
const path = require("path");

// Function to create a directory if it doesn't exist
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Function to create a file if it doesn't exist
const createFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log(`Created file: ${filePath}`);
  }
};

// Base project directory
const baseDir = path.join(__dirname);

// Define directory and file structure
const structure = {
  controllers: [
    "donationOpportunityController.js",
    "fieldController.js",
    "categoryController.js",
    "progressController.js",
    "infoSectionsCardController.js",
    "infoSectionController.js",
    "imageController.js",
    "errorLogController.js",
    "userController.js",
    "donationController.js",
    "rechargeController.js",
    "currentBalanceUsesController.js",
  ],
  routers: [
    "donationOpportunityRouter.js",
    "fieldRouter.js",
    "categoryRouter.js",
    "progressRouter.js",
    "infoSectionsCardRouter.js",
    "infoSectionRouter.js",
    "imageRouter.js",
    "errorLogRouter.js",
    "userRouter.js",
    "donationRouter.js",
    "rechargeRouter.js",
    "currentBalanceUsesRouter.js",
  ],
  models: ["index.js"],
  middlewares: [
    "authMiddleware.js",
    "errorHandlingMiddleware.js",
    "validationMiddleware.js",
  ],
  services: [
    "donationOpportunityService.js",
    "fieldService.js",
    "categoryService.js",
    "progressService.js",
    "infoSectionsCardService.js",
    "infoSectionService.js",
    "imageService.js",
    "errorLogService.js",
    "userService.js",
    "donationService.js",
    "rechargeService.js",
    "currentBalanceUsesService.js",
  ],
  utils: ["logger.js", "helperFunctions.js"],
};

// Function to create the entire structure
const createStructure = (base, structure) => {
  Object.keys(structure).forEach((key) => {
    const currentPath = path.join(base, key);
    createDir(currentPath);

    const filesOrDirs = structure[key];
    if (Array.isArray(filesOrDirs)) {
      // Create files in the current directory
      filesOrDirs.forEach((file) => createFile(path.join(currentPath, file)));
    } else {
      // Recursively create subdirectories and files
      createStructure(currentPath, filesOrDirs);
    }
  });
};

// Create the structure starting from the base directory
createStructure(baseDir, structure);

console.log("Project structure created successfully.");
