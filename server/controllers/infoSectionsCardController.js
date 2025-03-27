// src/controllers/infoSectionsCardController.js
const infoSectionsCardService = require('../services/infoSectionsCardService');

/**
 * Get all InfoSectionsCards
 */
async function getAllInfoSectionsCards(req, res) {
  try {
    const cards = await infoSectionsCardService.getAllInfoSectionsCards();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching InfoSectionsCards', error });
  }
}

/**
 * Get InfoSectionsCard by ID
 */
async function getInfoSectionsCardById(req, res) {
  const { id } = req.params;
  try {
    const card = await infoSectionsCardService.getInfoSectionsCardById(id);
    if (card) {
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: 'InfoSectionsCard not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching InfoSectionsCard', error });
  }
}

/**
 * Create a new InfoSectionsCard
 */
async function createInfoSectionsCard(req, res) {
  const cardData = req.body;
  try {
    const newCard = await infoSectionsCardService.createInfoSectionsCard(cardData);
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating InfoSectionsCard', error });
  }
}

/**
 * Update an InfoSectionsCard
 */
async function updateInfoSectionsCard(req, res) {
  const { id } = req.params;
  const cardData = req.body;
  try {
    const updatedCard = await infoSectionsCardService.updateInfoSectionsCard(id, cardData);
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating InfoSectionsCard', error });
  }
}

/**
 * Delete an InfoSectionsCard
 */
async function deleteInfoSectionsCard(req, res) {
  const { id } = req.params;
  try {
    await infoSectionsCardService.deleteInfoSectionsCard(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting InfoSectionsCard', error });
  }
}

module.exports = {
  getAllInfoSectionsCards,
  getInfoSectionsCardById,
  createInfoSectionsCard,
  updateInfoSectionsCard,
  deleteInfoSectionsCard,
};
