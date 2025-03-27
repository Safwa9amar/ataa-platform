const partnerService = require("../services/partnerService");

// Create a new partner
exports.createPartner = async (req, res) => {
  try {
    const { id } = req.user; // Assuming the authenticated user is available in the request
    const partnerData = req.body;
    const partner = await partnerService.createPartner(id, partnerData);
    res.status(201).json({
      message: "Partner created successfully",
      partner,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: error.message });
  }
};

// Get a partner by ID
exports.getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await partnerService.getPartnerById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a partner
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerData = req.body;
    const updatedPartner = await partnerService.updatePartner(id, partnerData);
    res.status(200).json({
      message: "Partner updated successfully",
      updatedPartner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a partner
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    await partnerService.deletePartner(id);
    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
