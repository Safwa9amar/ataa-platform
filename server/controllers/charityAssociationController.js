const charityAssociationService = require('../services/charityAssociationService');

// Get all charity associations
exports.getAllCharityAssociations = async (req, res) => {
  try {
    const charityAssociations = await charityAssociationService.getAllCharityAssociations();
    res.json(charityAssociations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific charity association by ID
exports.getCharityAssociationById = async (req, res) => {
  const { id } = req.params;
  try {
    const charityAssociation = await charityAssociationService.getCharityAssociationById(id);
    if (charityAssociation) {
      res.json(charityAssociation);
    } else {
      res.status(404).json({ error: 'Charity association not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new charity association
exports.createCharityAssociation = async (req, res) => {
  try {
    const newCharityAssociation = await charityAssociationService.createCharityAssociation(req.body);
    res.status(201).json(newCharityAssociation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a charity association by ID
exports.updateCharityAssociation = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCharityAssociation = await charityAssociationService.updateCharityAssociation(id, req.body);
    res.json(updatedCharityAssociation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a charity association by ID
exports.deleteCharityAssociation = async (req, res) => {
  const { id } = req.params;
  try {
    await charityAssociationService.deleteCharityAssociation(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
