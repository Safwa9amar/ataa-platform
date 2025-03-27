const executiveSummaryService = require("../../../services/dashboardsServices/charity/executive-summary.services");

const getTotalDonationsOverPeriods = async (req, res) => {
  let userID = req.user.id;
  let filters = req.query;
  let selectedMonths = filters.selectedMonths.split(",").map(Number);

  try {
    let data = await executiveSummaryService.getTotalDonationsOverPeriods(
      userID,
      filters.year,
      filters.viewType,
      selectedMonths
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching Total Donations Over Periods:", error);
    res.status(500).json({ error: "فشل تحميل بيانات إجمالي التبرعات" });
  }
};

const getDonorRetentionRate = async (req, res) => {
  let userID = req.user.id;
  let filters = req.query;

  try {
    let data = await executiveSummaryService.getDonorRetentionRate(
      userID,
      filters.year,
      filters.viewType,
      filters.selectedMonths.split(",").map(Number)
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching Donor Retention Rate:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات معدل الاحتفاظ بالمتبرعين" });
  }
};

const getDonationGrowthRate = async (req, res) => {
  let userID = req.user.id;
  let filters = req.query;
  let selectedMonths = filters.selectedMonths
    .split(",")
    .map(Number)
    .filter((e) => e)
    .sort((a, b) => a - b);

  try {
    let data = await executiveSummaryService.getDonationGrowthRate(
      userID,
      filters.year,
      filters.viewType,
      selectedMonths
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching Donation Growth Rate:", error);
    res.status(500).json({ error: "فشل تحميل بيانات معدل نمو التبرعات" });
  }
};

const getNumberOfNewDonors = async (req, res) => {
  try {
    let userID = req.user.id;
    let filters = req.query;
    let selectedMonths = filters.selectedMonths.split(",").map(Number);
    let data = await executiveSummaryService.getNumberOfNewDonors(
      userID,
      filters.year || new Date().getFullYear(),
      filters.viewType,
      selectedMonths
    );

    res.json(data);
  } catch (error) {
    console.error("Error fetching Number of New Donors:", error);
    res.status(500).json({ error: "فشل تحميل بيانات عدد المتبرعين الجدد" });
  }
};

const getSuccessfullyCompletedPrograms = async (req, res) => {
  try {
    let userID = req.user.id;
    let data = await executiveSummaryService.getSuccessfullyCompletedPrograms(
      userID
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching Successfully Completed Programs:", error);
    res.status(500).json({ error: "فشل تحميل بيانات البرامج المكتملة" });
  }
};

const getRateOfCompletedPrograms = async (req, res) => {
  const displayType = req.query.displayType;
  let userID = req.user.id;
  try {
    let data =
      displayType === "daily"
        ? await executiveSummaryService.getDailyCompletionRateForCurrentMonth(
            userID
          )
        : await executiveSummaryService.getMonthlyCompletionRateForCurrentYear(
            userID
          );
    res.json(data);
  } catch (error) {
    console.error("Error fetching Percentage of Completed Programs:", error);
    res.status(500).json({ error: "فشل تحميل بيانات معدل البرامج المكتملة" });
  }
};

module.exports = {
  getTotalDonationsOverPeriods,
  getDonorRetentionRate,
  getDonationGrowthRate,
  getNumberOfNewDonors,
  getSuccessfullyCompletedPrograms,
  getRateOfCompletedPrograms,
};
