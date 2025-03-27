// algeriaCitiesController.js

const citiesService = require("../services/algeriaCitiesService");

const getCities = async (req, res) => {
  console.log("GET /cities");
  try {
    const cities = await citiesService.getAllCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cities" });
  }
};

const getWilayas = async (req, res) => {
  try {
    const wilayas = await citiesService.getWilayas();
    res.json(wilayas);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve wilayas" });
  }
};

const getDairas = async (req, res) => {
  try {
    const { wilayaCode } = req.params;
    const dairas = await citiesService.getDairas(wilayaCode);
    res.json(dairas);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve dairas" });
  }
};


const getCommunes = async (req, res) => {
  try {
    const { dairaName } = req.params;
    const communes = await citiesService.getCommunes(dairaName);
    res.json(communes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve communes" });
  }
};

const addCity = async (req, res) => {
  try {
    const cityData = req.body;
    const newCity = await citiesService.addCity(cityData);
    res.status(201).json(newCity);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add city", details: error.message });
  }
};
module.exports = {
  getCities,
  getWilayas,
  getDairas,
  getCommunes,
  addCity,
};
