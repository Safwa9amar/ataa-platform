// algeriaCitiesRouter.js

const express = require("express");
const router = express.Router();
const citiesController = require("../controllers/algeriaCitiesController");

// router.post('/algeria-cities/cities', citiesController.addCity);
router.get("/algeria-cities/", citiesController.getCities);
router.get("/algeria-cities/wilayas", citiesController.getWilayas);
router.get("/algeria-cities/:wilayaCode/dairas", citiesController.getDairas);
router.get(
  "/algeria-cities/:wilayaCode/dairas/:dairaName",
  citiesController.getCommunes
);

module.exports = router;
