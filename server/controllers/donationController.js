// controllers/donationController.js

const donationService = require("../services/donationService");

async function createDonation(req, res) {
  try {
    const donation = await donationService.createDonation(req.body);
    res.status(201).json(donation);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getDonations(req, res) {
  try {
    const donations = await donationService.getDonations();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDonationById(req, res) {
  try {
    const donation = await donationService.getDonationById(
      parseInt(req.params.id)
    );
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateDonation(req, res) {
  try {
    const donation = await donationService.updateDonation(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteDonation(req, res) {
  try {
    await donationService.deleteDonation(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};
