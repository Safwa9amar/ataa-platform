const statisticsService = require("../services/statisticsService");

// Controller for fetching statistics
const getStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.fetchStatistics();
    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getStatistics,
};
