const givingPartnersService = require('../services/givingPartnersService');

const getAllGivingPartners = async (req, res) => {
  try {
    const partners = await givingPartnersService.getAllGivingPartners();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Giving Partners' });
  }
};

const getGivingPartnerById = async (req, res) => {
  const { id } = req.params;
  try {
    const partner = await givingPartnersService.getGivingPartnerById(id);
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Giving Partner by ID' });
  }
};

const createGivingPartner = async (req, res) => {
  try {
    const partner = await givingPartnersService.createGivingPartner(req.body);
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Error creating Giving Partner' });
  }
};

const updateGivingPartner = async (req, res) => {
  const { id } = req.params;
  try {
    const partner = await givingPartnersService.updateGivingPartner(id, req.body);
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Giving Partner' });
  }
};

const deleteGivingPartner = async (req, res) => {
  const { id } = req.params;
  try {
    await givingPartnersService.deleteGivingPartner(id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Giving Partner' });
  }
};

module.exports = {
  getAllGivingPartners,
  getGivingPartnerById,
  createGivingPartner,
  updateGivingPartner,
  deleteGivingPartner,
};
