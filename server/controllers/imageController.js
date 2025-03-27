// src/controllers/imageController.js
const imageService = require('../services/imageService');

/**
 * Get all images
 */
async function getAllImages(req, res) {
  try {
    const images = await imageService.getAllImages();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error });
  }
}

/**
 * Get image by ID
 */
async function getImageById(req, res) {
  const { id } = req.params;
  try {
    const image = await imageService.getImageById(id);
    if (image) {
      res.status(200).json(image);
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error });
  }
}

/**
 * Create a new image
 */
async function createImage(req, res) {
  const imageData = req.body;
  console.log('imageData', imageData);
  // try {
    const newImage = await imageService.createImage(imageData);
    res.status(201).json(newImage);
  // } catch (error) {
    // res.status(500).json({ message: 'Error creating image', error });
  // }
}

/**
 * Update an image
 */
async function updateImage(req, res) {
  const { id } = req.params;
  const imageData = req.body;
  try {
    const updatedImage = await imageService.updateImage(id, imageData);
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating image', error });
  }
}

/**
 * Delete an image
 */
async function deleteImage(req, res) {
  const { id } = req.params;
  try {
    await imageService.deleteImage(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error });
  }
}

module.exports = {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
};
