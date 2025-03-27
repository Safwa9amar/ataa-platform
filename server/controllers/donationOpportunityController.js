const donationOpportunityService = require("../services/donationOpportunityService");

// Get all donation opportunities
exports.getAllDonationOpportunities = async (req, res) => {
  try {
    const donationOpportunities =
      await donationOpportunityService.getAllDonationOpportunities(req, res);
    res.json(donationOpportunities);
  } catch (error) {
    console.log("error", error, error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific donation opportunity by ID
exports.getDonationOpportunityById = async (req, res) => {
  const { id } = req.params;
  try {
    const donationOpportunity =
      await donationOpportunityService.getDonationOpportunityById(id);
    if (donationOpportunity) {
      res.json(donationOpportunity);
    } else {
      res.status(404).json({ error: "Donation opportunity not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a specific donation opportunity by ID
exports.getMyDonationOpportunities = async (req, res) => {
  const { id } = req.user;

  try {
    const donationOpportunity =
      await donationOpportunityService.getMyDonationOpportunities(
        id,
        req.query
      );
    if (donationOpportunity) {
      res.json(donationOpportunity);
    } else {
      res.status(404).json({ error: "my donation opportunities not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new donation opportunity
exports.createDonationOpportunity = async (req, res) => {
  try {
    const newDonationOpportunity =
      await donationOpportunityService.createDonationOpportunity(
        req.body,
        req.user
      );
    res.status(201).json(newDonationOpportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a donation opportunity by ID
exports.updateDonationOpportunity = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDonationOpportunity =
      await donationOpportunityService.updateDonationOpportunity(id, req.body);
    res.json(updatedDonationOpportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a donation opportunity by ID
exports.deleteDonationOpportunity = async (req, res) => {
  const { id } = req.params;
  try {
    await donationOpportunityService.deleteDonationOpportunity(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDonationOpportunitiesForHome = async (req, res) => {
  let role = req.query.role;

  try {
    const donationOpportunities =
      await donationOpportunityService.getAllDonationOpportunitiesForHome(role);
    res.json(donationOpportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
