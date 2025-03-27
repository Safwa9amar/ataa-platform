// services/fileUploadService.js
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define the directory to save the files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to avoid filename conflicts
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20MB
  fileFilter: (req, file, cb) => {
    // Allow only certain file types
    const filetypes = /jpeg|jpg|png|pdf|doc|docx|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Only .jpeg, .jpg, .png, .pdf, .doc, .docx, .mp4 files are allowed!"
        )
      );
    }
  },
}).array("files", 10); // 'files' is the name of the field in the form, allow up to 10 files

const uploadFile = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(400).json({ message: err.message });
    }
    if (!req.files) {
      return res.status(400).json({ message: "No file selected!" });
    }
    console.log("File uploaded successfully!", req.files);

    res.status(200).json({
      message: "File uploaded successfully!",
      file: req.files,
    });
  });
};

const deleteFile = (req, res) => {
  const { filename } = req.params;
  fs.unlink(`uploads/${filename}`, (err) => {
    if (err) {
      return res.status(400).json({ message: "Failed to delete file!" });
    }
    res.status(200).json({ message: "File deleted successfully!" });
  });
};

module.exports = { uploadFile, deleteFile };
