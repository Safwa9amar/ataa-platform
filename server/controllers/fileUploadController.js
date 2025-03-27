// controllers/fileUploadController.js

const { uploadFile, deleteFile } = require("../services/fileUploadService");

const uploadFileController = (req, res) => {
  res.status(200).json({
    message: "File uploaded successfully!",
    file: req.file,
  });
  // uploadFile(req, res);
};
const deleteFileController = (req, res) => {
  deleteFile(req, res);
};

module.exports = { uploadFileController, deleteFileController };
