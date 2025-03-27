const donorsService = require("../../../services/dashboardsServices/charity/donors.services");

// 🔹 استرجاع متوسط حجم التبرع بمرور الوقت
const getDonationMetrics = async (req, res) => {
  let userID = req.user.id;
  try {
    const data = await donorsService.getDonationMetrics(userID);
    res.json(data);
  } catch (error) {
    console.error("Error fetching kpis:", error);
    res.status(500).json({ error: "فشل تحميل بيانات kpis" });
  }
};

// 🔹 استرجاع متوسط حجم التبرع بمرور الوقت
const getAverageDonationSize = async (req, res) => {
  let userID = req.user.id;
  let year = req.query.year || new Date().getFullYear();
  let viewType = req.query.viewType || "monthly"; // "daily" أو "monthly"
  let selectedMonths = req.query.selectedMonth; // الأشهر المختارة
  try {
    const data = await donorsService.getAverageDonationSize(
      userID,
      year,
      viewType,
      selectedMonths.split(",").map(Number) || [new Date().getMonth() + 1]
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching average donation size:", error);
    res.status(500).json({ error: "فشل تحميل بيانات متوسط حجم التبرع" });
  }
};

// 🔹 استرجاع توزيع التبرعات حسب الفئات العمرية
const getDonationDistributionByAge = async (req, res) => {
  let userID = req.user.id;
  let year = req.query.year || new Date().getFullYear();
  try {
    const data = await donorsService.getDonationDistributionByAge(userID, year);
    res.json(data);
  } catch (error) {
    console.error("Error fetching donation distribution by age:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات توزيع التبرعات حسب الفئات العمرية" });
  }
};

// 🔹 استرجاع توزيع التبرعات حسب المناطق الجغرافية
const getDonationDistributionByLocation = async (req, res) => {
  let userID = req.user.id;
  let year = req.query.year || new Date().getFullYear();
  let groupBy = req.query.groupBy || "city"; // يمكن أن يكون "city" أو "country"

  try {
    const data = await donorsService.getDonationDistributionByLocation(
      userID,
      year,
      groupBy
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching donation distribution by location:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات توزيع التبرعات حسب المناطق الجغرافية" });
  }
};

// 🔹 استرجاع معدل نمو قاعدة المتبرعين
const getDonorGrowthRate = async (req, res) => {
  let userID = req.user.id;
  let startDate = req.query.startDate || "2025-01-01";
  let endDate = req.query.endDate || "2025-12-31";
  let viewType = req.query.viewType || "monthly";
  try {
    const data = await donorsService.getDonorGrowthRate(
      userID,
      startDate,
      endDate,
      viewType
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching donor growth rate:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات معدل نمو قاعدة المتبرعين" });
  }
};

// 🔹 استرجاع مقارنة المتبرعين الجدد مقابل العائدين
const getNewVsReturningDonors = async (req, res) => {
  const userID = req.user.id;
  const filters = req.query;
  try {
    const data = await donorsService.getNewVsReturningDonors(
      userID,
      filters.year || new Date().getFullYear(),
      filters.viewType,
      filters.selectedMonths.split(",").map(Number)
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching new vs returning donors:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات مقارنة المتبرعين الجدد والعائدين" });
  }
};

module.exports = {
  getAverageDonationSize,
  getDonationDistributionByAge,
  getDonationDistributionByLocation,
  getDonorGrowthRate,
  getNewVsReturningDonors,
  getDonationMetrics
};
