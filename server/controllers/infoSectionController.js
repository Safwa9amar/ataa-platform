// src/controllers/infoSectionController.js
const infoSectionService = require('../services/infoSectionService');

/**
 * Get all InfoSections
 */
async function getAllInfoSections(req, res) {
  try {
    const sections = await infoSectionService.getAllInfoSections();
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching InfoSections', error });
  }
}

/**
 * Get InfoSection by ID
 */
async function getInfoSectionById(req, res) {
  const { id } = req.params;
  try {
    const section = await infoSectionService.getInfoSectionById(id);
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ message: 'InfoSection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching InfoSection', error });
  }
}

/**
 * Create a new InfoSection
 */
async function createInfoSection(req, res) {
  const sectionData = req.body;
  try {
    const newSection = await infoSectionService.createInfoSection(sectionData);
    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating InfoSection', error });
  }
}

/**
 * Update an InfoSection
 */
async function updateInfoSection(req, res) {
  const { id } = req.params;
  const sectionData = req.body;
  try {
    const updatedSection = await infoSectionService.updateInfoSection(id, sectionData);
    res.status(200).json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: 'Error updating InfoSection', error });
  }
}

/**
 * Delete an InfoSection
 */
async function deleteInfoSection(req, res) {
  const { id } = req.params;
  try {
    await infoSectionService.deleteInfoSection(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting InfoSection', error });
  }
}

module.exports = {
  getAllInfoSections,
  getInfoSectionById,
  createInfoSection,
  updateInfoSection,
  deleteInfoSection,
};
