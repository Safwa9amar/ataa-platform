const planService = require("../services/planService");

const getAllPlans = async (req, res) => {
  try {
    const plans = await planService.getAllPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await planService.getPlanById(req.params.id);
    if (plan) {
      res.json(plan);
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const newPlan = await planService.createPlan(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const updatedPlan = await planService.updatePlan(req.params.id, req.body);
    if (updatedPlan) {
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await planService.deletePlan(req.params.id);
    if (deletedPlan) {
      res.json({ message: "Plan deleted successfully" });
    } else {
      res.status(404).json({ message: "Plan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};
