// zakatController.js
const zakatService = require("../services/zakatService");

const createZakat = async (req, res) => {
  try {
    const zakatData = req.body;
    const newZakat = await zakatService.createZakat(zakatData, req.user.email);
    res.status(201).json(newZakat);
  } catch (error) {
    console.log("Error creating zakat:", error);
    res.status(500).json({ error: "Failed to create zakat" });
  }
};

const getZakatById = async (req, res) => {
  try {
    const { id } = req.params;
    const zakat = await zakatService.getZakatById(Number(id));
    if (!zakat) return res.status(404).json({ error: "Zakat not found" });
    res.status(200).json(zakat);
  } catch (error) {
    res.status(500).json({ error: "Failed to get zakat" });
  }
};

const getAllZakat = async (req, res) => {
  try {
    const zakatList = await zakatService.getAllZakat();
    res.status(200).json(zakatList);
  } catch (error) {
    res.status(500).json({ error: "Failed to get zakat list" });
  }
};

const updateZakat = async (req, res) => {
  try {
    const { id } = req.params;
    const zakatData = req.body;
    const updatedZakat = await zakatService.updateZakat(Number(id), zakatData);
    res.status(200).json(updatedZakat);
  } catch (error) {
    res.status(500).json({ error: "Failed to update zakat" });
  }
};

const deleteZakat = async (req, res) => {
  try {
    const { id } = req.params;
    await zakatService.deleteZakat(Number(id));
    res.status(204).json({ message: "Zakat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete zakat" });
  }
};

module.exports = {
  createZakat,
  getZakatById,
  getAllZakat,
  updateZakat,
  deleteZakat,
};
