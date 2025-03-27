// src/controllers/imageController.js
const FileService = require("../services/FileService");

/**
 * Get all images
 */
async function getAllFiles(req, res) {
  try {
    const images = await FileService.getAllFiles();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
}

/**
 * Get image by ID
 */
async function getfileById(req, res) {
  const { id } = req.params;
  try {
    const image = await FileService.getFileById(id);
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error });
  }
}

/**
 * Create a new image
 */
async function createFile(req, res) {
  const imageData = req.body;
  console.log("imageData", imageData);
  // try {
  const newImage = await FileService.createFile(imageData);
  res.status(201).json(newImage);
  // } catch (error) {
  // res.status(500).json({ message: 'Error creating image', error });
  // }
}

/**
 * Update an image
 */
async function updateFile(req, res) {
  const { id } = req.params;
  const imageData = req.body;
  try {
    const updatedImage = await FileService.updateFile(id, imageData);
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: "Error updating image", error });
  }
}

/**
 * Delete an image
 */
async function deleteFile(req, res) {
  const { id } = req.params;
  try {
    await FileService.deleteFile(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
}

module.exports = {
  getAllFiles,
  getfileById,
  createFile,
  updateFile,
  deleteFile,
};
