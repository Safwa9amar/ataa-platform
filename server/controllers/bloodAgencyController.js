const bloodAgencyService = require("../services/bloodAgencyService");

/**
 * Create a new Blood Agency
 */
exports.createBloodAgency = async (req, res) => {
  try {
    const bloodAgencyData = req.body;
    const bloodAgency = await bloodAgencyService.createBloodAgency(
      req.user.id,
      bloodAgencyData
    );
    res.status(201).json({
      message: "Blood Agency created successfully",
      data: bloodAgency,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Failed to create Blood Agency", error: error.message });
  }
};

/**
 * Get all Blood Agencies
 */
exports.getAllBloodAgencies = async (req, res) => {
  try {
    const bloodAgencies = await bloodAgencyService.getAllBloodAgencies();
    res.status(200).json(bloodAgencies);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Failed to fetch Blood Agencies",
      error: error.message,
    });
  }
};

/**
 * Get Blood Agency by ID
 */
exports.getBloodAgencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodAgency = await bloodAgencyService.getBloodAgencyById(id);
    if (!bloodAgency) {
      return res.status(404).json({ message: "Blood Agency not found" });
    }
    res.status(200).json(bloodAgency);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch Blood Agency", error: error.message });
  }
};

/**
 * Update Blood Agency by ID
 */
exports.updateBloodAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const bloodAgencyData = req.body;
    const updatedBloodAgency = await bloodAgencyService.updateBloodAgency(
      id,
      bloodAgencyData
    );
    res.status(200).json({
      message: "Blood Agency updated successfully",
      data: updatedBloodAgency,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Failed to update Blood Agency", error: error.message });
  }
};

/**
 * Delete Blood Agency by ID
 */
exports.deleteBloodAgency = async (req, res) => {
  try {
    const { id } = req.params;
    await bloodAgencyService.deleteBloodAgency(id);
    res.status(200).json({ message: "Blood Agency deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Failed to delete Blood Agency", error: error.message });
  }
};
