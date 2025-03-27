const supervisoryAuthoritiesService = require('../services/supervisoryAuthoritiesService');

const getAllSupervisoryAuthorities = async (req, res) => {
  try {
    const authorities = await supervisoryAuthoritiesService.getAllSupervisoryAuthorities();
    res.json(authorities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Supervisory Authorities' });
  }
};

const getSupervisoryAuthorityById = async (req, res) => {
  const { id } = req.params;
  try {
    const authority = await supervisoryAuthoritiesService.getSupervisoryAuthorityById(id);
    res.json(authority);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Supervisory Authority by ID' });
  }
};

const createSupervisoryAuthority = async (req, res) => {
  try {
    const authority = await supervisoryAuthoritiesService.createSupervisoryAuthority(req.body);
    res.status(201).json(authority);
  } catch (error) {
    res.status(500).json({ error: 'Error creating Supervisory Authority' });
  }
};

const updateSupervisoryAuthority = async (req, res) => {
  const { id } = req.params;
  try {
    const authority = await supervisoryAuthoritiesService.updateSupervisoryAuthority(id, req.body);
    res.json(authority);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Supervisory Authority' });
  }
};

const deleteSupervisoryAuthority = async (req, res) => {
  const { id } = req.params;
  try {
    await supervisoryAuthoritiesService.deleteSupervisoryAuthority(id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Supervisory Authority' });
  }
};

module.exports = {
  getAllSupervisoryAuthorities,
  getSupervisoryAuthorityById,
  createSupervisoryAuthority,
  updateSupervisoryAuthority,
  deleteSupervisoryAuthority,
};
