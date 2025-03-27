// src/services/infoSectionsCardService.js
const prisma = require("../models");
/**
 * Get all InfoSectionsCards
 */
async function getAllInfoSectionsCards() {
  return await prisma.infoSectionsCard.findMany();
}

/**
 * Get an InfoSectionsCard by ID
 * @param {number} id - InfoSectionsCard ID
 */
async function getInfoSectionsCardById(id) {
  return await prisma.infoSectionsCard.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new InfoSectionsCard
 * @param {object} cardData - InfoSectionsCard data
 */
async function createInfoSectionsCard(cardData) {
  return await prisma.infoSectionsCard.create({
    data: cardData,
  });
}

/**
 * Update an InfoSectionsCard by ID
 * @param {number} id - InfoSectionsCard ID
 * @param {object} cardData - InfoSectionsCard data
 */
async function updateInfoSectionsCard(id, cardData) {
  return await prisma.infoSectionsCard.update({
    where: { id: parseInt(id, 10) },
    data: cardData,
  });
}

/**
 * Delete an InfoSectionsCard by ID
 * @param {number} id - InfoSectionsCard ID
 */
async function deleteInfoSectionsCard(id) {
  return await prisma.infoSectionsCard.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllInfoSectionsCards,
  getInfoSectionsCardById,
  createInfoSectionsCard,
  updateInfoSectionsCard,
  deleteInfoSectionsCard,
};
