// src/routers/infoSectionsCardRouter.js
const express = require("express");
const router = express.Router();
const infoSectionsCardController = require("../controllers/infoSectionsCardController");

// Define routes
router.get(
  "/info-sections-cards/",
  infoSectionsCardController.getAllInfoSectionsCards
);
router.get(
  "/info-sections-cards/:id",
  infoSectionsCardController.getInfoSectionsCardById
);
router.post(
  "/info-sections-cards/",
  infoSectionsCardController.createInfoSectionsCard
);
router.put(
  "/info-sections-cards/:id",
  infoSectionsCardController.updateInfoSectionsCard
);
router.delete(
  "/info-sections-cards/:id",
  infoSectionsCardController.deleteInfoSectionsCard
);

module.exports = router;
