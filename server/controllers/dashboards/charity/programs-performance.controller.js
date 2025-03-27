const {
  getDistributionDonationsProgramPeriod,
  getDistributionOfDonations,
  getDonorInteractions,
  getMonthlyProgramPerformance,
  getAverageDonationForAllPrograms,
  getProgramCompletionRate,
} = require("../../../services/dashboardsServices/charity/programs-performance.services");

const distributionDonationsProgramPeriod = async (req, res) => {
  const userID = req.user.id;
  const filters = req.query;

  try {
    const startDate = new Date("2025-01-01");
    const endDate = new Date();
    const data = await getDistributionDonationsProgramPeriod(
      userID,
      startDate,
      endDate,
      filters
    );
    res.json(data);
  } catch (error) {
    console.error("Error in distributionDonationsProgramPeriod:", error);
    res.status(500).json({
      error: "فشل تحميل توزيع التبرعات حسب الفترة الزمنية",
    });
  }
};

const distributionOfDonations = async (req, res) => {
  const userID = req.user.id;
  const { page = 1, pageSize = 10 } = req.query; // Get pagination parameters from query

  try {
    // Fetch paginated data
    const data = await getDistributionOfDonations(
      userID,
      parseInt(page),
      parseInt(pageSize)
    );
    res.json(data);
  } catch (error) {
    console.error("Error in distributionOfDonations:", error);
    res.status(500).json({
      error: "فشل تحميل توزيع التبرعات بين البرامج",
    });
  }
};

const donorInteractions = async (req, res) => {
  const userID = req.user.id;
  const filters = req.query;
  try {
    const data = await getDonorInteractions(userID, filters);
    res.json(data);
  } catch (error) {
    console.error("Error in donorInteractions:", error);
    res.status(500).json({
      error: "فشل تحميل بيانات تفاعلات المتبرعين",
    });
  }
};
const monthlyProgramPerformance = async (req, res) => {
  const userID = req.user.id;
  const programId = req.params.programId;
  const { year, month } = req.query; // استخراج السنة والشهر من query parameters
  try {
    // التحقق من وجود السنة والشهر
    if (!year || !month) {
      return res.status(400).json({
        error: "يجب تحديد السنة والشهر.",
      });
    }

    // تحويل السنة والشهر إلى أرقام
    const selectedYear = parseInt(year);
    const selectedMonth = parseInt(month);

    // التحقق من صحة السنة والشهر
    if (isNaN(selectedYear)) {
      return res.status(400).json({
        error: "السنة يجب أن تكون رقمًا صحيحًا.",
      });
    }
    if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({
        error: "الشهر يجب أن يكون رقمًا بين 1 و 12.",
      });
    }

    // جلب البيانات الشهرية
    const data = await getMonthlyProgramPerformance(
      programId,
      userID,
      selectedYear,
      selectedMonth
    );

    // إرجاع البيانات
    res.json(data);
  } catch (error) {
    console.error("Error in monthlyProgramPerformance:", error);
    res.status(500).json({
      error: "فشل تحميل أداء البرامج الشهري",
    });
  }
};

const getKpisData = async (req, res) => {
  const userID = req.user.id;
  try {
    const avg = await getAverageDonationForAllPrograms(userID);
    const rate = await getProgramCompletionRate(userID);
    res.json({
      avgDonation: avg,
      programCompletionRate: rate,
    });
  } catch (error) {
    console.error("Error in monthlyProgramPerformance:", error);
    res.status(500).json({
      error: "فشل تحميل kpis",
    });
  }
};

module.exports = {
  distributionDonationsProgramPeriod,
  monthlyProgramPerformance,
  distributionOfDonations,
  donorInteractions,
  getKpisData,
};
