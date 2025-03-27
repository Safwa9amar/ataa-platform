// src/controllers/fieldController.js
const fieldService = require("../services/fieldService");

// Get all fields
const getAllFields = async (req, res) => {
  try {
    const fields = await fieldService.getAllFields();
    res.status(200).json(fields);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving fields" });
  }
};

// Get a field by ID
const getFieldById = async (req, res) => {
  try {
    const field = await fieldService.getFieldById(req.params.id);
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }
    res.status(200).json(field);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving field" });
  }
};

// Create a new field
const createField = async (req, res) => {
  try {
    const field = await fieldService.createField(req.body);
    res.status(201).json(field);
  } catch (error) {
    res.status(500).json({ error: "Error creating field" });
  }
};

// Update a field by ID
const updateField = async (req, res) => {
  try {
    const field = await fieldService.updateField(req.params.id, req.body);
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ error: "Error updating field" });
  }
};

// Delete a field by ID
const deleteField = async (req, res) => {
  try {
    await fieldService.deleteField(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting field", error });
  }
};

module.exports = {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
};
