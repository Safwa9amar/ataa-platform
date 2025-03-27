const charityDashboards = require("../../../services/dashboardsServices/charity/index");

// **1️⃣ الحصول على بيانات توزيع البرامج النشطة مقابل غير النشطة**
async function activeProgramsDistribution(req, res) {
  try {
    const data =
      await charityDashboards.accountHealth.getActiveProgramsDistribution(
        req.user.id
      );
    res.json(data);
  } catch (error) {
    console.error("Error fetching active programs distribution:", error);
    res.status(500).json({ error: "فشل تحميل بيانات توزيع البرامج النشطة" });
  }
}

// **2️⃣ الحصول على بيانات توزيع البرامج الجارية مقابل غير المكتملة**
async function ongoingVsIncompletePrograms(req, res) {
  try {
    const data =
      await charityDashboards.accountHealth.getOngoingVsIncompletePrograms(
        req.user.id
      );
    res.json(data);
  } catch (error) {
    console.error("Error fetching ongoing vs incomplete programs:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات البرامج الجارية مقابل المكتملة" });
  }
}

// **3️⃣ الحصول على بيانات نمو المتبرعين عبر الزمن**
async function donorGrowthOverTime(req, res) {
  try {
    const data = await charityDashboards.accountHealth.getDonorGrowthOverTime(
      req.user.id,
      req.query
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching donor growth timeline:", error);
    res.status(500).json({ error: "فشل تحميل بيانات نمو المتبرعين" });
  }
}

// **4️⃣ الحصول على بيانات مقارنة معدلات التفاعل بين البرامج**
async function programsEngagementComparison(req, res) {
  try {
    const data =
      await charityDashboards.accountHealth.getProgramsEngagementComparison(
        req.user.id,
        req.query
      );
    res.json(data);
  } catch (error) {
    console.error("Error fetching programs engagement comparison:", error);
    res
      .status(500)
      .json({ error: "فشل تحميل بيانات معدلات التفاعل بين البرامج" });
  }
}

// **5️⃣ الحصول على مؤشرات الأداء الرئيسية (KPI Metrics)**
async function kpiMetrics(req, res) {
  try {
    const data = await charityDashboards.accountHealth.getKpiMetrics(
      req.user.id
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching KPI metrics:", error);
    res.status(500).json({ error: "فشل تحميل مؤشرات الأداء الرئيسية" });
  }
}

module.exports = {
  activeProgramsDistribution,
  ongoingVsIncompletePrograms,
  donorGrowthOverTime,
  programsEngagementComparison,
  kpiMetrics,
};
