// controllers/financialController.js

const {
  charityDashboardServices,
} = require("../../../services/dashboardsServices");

const getKpiData = async (req, res) => {
  let userID = req.user.id;

  try {
    const data = await charityDashboardServices.financialService.getKpiData(
      userID
    );
    res.json(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Error loading financial KPIs data" });
  }
};

const getMonthlyRevenueGrowth = async (req, res) => {
  const userId = req.user.id;
  try {
    const data =
      await charityDashboardServices.financialService.getMonthlyRevenueGrowth(
        userId
      );
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error loading monthly revenue growth data" });
  }
};

const getRevenueVsExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const data =
      await charityDashboardServices.financialService.getRevenueVsExpenses(
        userId
      );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error loading revenue vs expenses data" });
  }
};

const getExpenseDistributionByActivity = async (req, res) => {
  const userId = req.user.id;

  try {
    const data =
      await charityDashboardServices.financialService.getExpenseDistributionByActivity(
        userId
      );
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error loading expense distribution by activity" });
  }
};

module.exports = {
  getKpiData,
  getMonthlyRevenueGrowth,
  getRevenueVsExpenses,
  getExpenseDistributionByActivity,
};
