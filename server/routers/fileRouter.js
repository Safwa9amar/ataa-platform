const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

// Define routes
router.get("/file/", fileController.getAllFiles);
router.get("/file/:id", fileController.getfileById);
router.post("/file/", fileController.createFile);
router.put("/file/:id", fileController.updateFile);
router.delete("/file/:id", fileController.deleteFile);

module.exports = router;
