// routes/fileUploadRouter.js

const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const {
  uploadFileController,
  deleteFileController,
} = require("../controllers/fileUploadController");
const upload = require("../middlewares/uploadImageMiddleware");

// Define the POST route for file uploads
router.post(
  "/file/upload",
  // authenticate,
  upload.single("file"),
  uploadFileController
);
router.delete("/file/delete/:filename", authenticate, deleteFileController);

module.exports = router;
