const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the directory for file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes =
    /\.(jpeg|jpg|png|gif|pdf|docx|doc|vnd.openxmlformats-officedocument.wordprocessingml.document)$/i; // Case-insensitive
  const mimeType = allowedFileTypes.test(`.${file.mimetype.split("/")[1]}`);
  const extName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extName) {
    return cb(null, true); // Accept the file
  }

  return cb(
    new Error("Only image files (jpeg, jpg, png, gif) are allowed."),
    false // Reject the file
  );
};

// Set up multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

// Export the configured multer instance
module.exports = upload;
