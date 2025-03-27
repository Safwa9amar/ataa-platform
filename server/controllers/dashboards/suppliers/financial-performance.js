const financialServices = require("../../../services/dashboardsServices/suppliers/index");

/**
 * الحصول على إجمالي الإيرادات
 * @param {Object} req - الطلب
 * @param {Object} res - الرد
 */
const getKpis = async (req, res) => {
  const userId = req.user.id;
  try {
    const kpis = await financialServices.financialPerformance.getKpis(userId);
    res.json(kpis);
  } catch (err) {
    console.error("Error getting total revenue:", err);
    res.status(500).json({ error: "فشل تحميل إجمالي الإيرادات" });
  }
};

/**
 * الحصول على الإيرادات حسب المنتج
 * @param {Object} req - الطلب
 * @param {Object} res - الرد
 */
const getRevenueByProduct = async (req, res) => {
  const userId = req.user.id;
  try {
    const revenueByProduct =
      await financialServices.financialPerformance.getRevenueByProduct(userId);
    res.json(revenueByProduct);
  } catch (err) {
    console.error("Error getting revenue by product:", err);
    res.status(500).json({ error: "فشل تحميل الإيرادات حسب المنتج" });
  }
};

/**
 * الحصول على الإيرادات حسب الفئة
 * @param {Object} req - الطلب
 * @param {Object} res - الرد
 */
const getRevenueByCategory = async (req, res) => {
  const userId = req.user.id;
  try {
    const revenueByCategory =
      await financialServices.financialPerformance.getRevenueByCategory(userId);
    res.json(revenueByCategory);
  } catch (err) {
    console.error("Error getting revenue by category:", err);
    res.status(500).json({ error: "فشل تحميل الإيرادات حسب الفئة" });
  }
};

/**
 * الحصول على إجمالي الإيرادات بمرور الوقت
 * @param {Object} req - الطلب
 * @param {Object} res - الرد
 */
const getTotalRevenueOverTime = async (req, res) => {
  const userId = req.user.id; // الحصول على معرف المستخدم من الطلب
  const { period } = req.query; // الحصول على الفترة الزمنية من query parameters

  try {
    // استدعاء الدالة للحصول على البيانات
    const revenueOverTime =
      await financialServices.financialPerformance.getTotalRevenueOverTime(
        userId,
        period
      );

    // إرسال البيانات كرد
    res.json(revenueOverTime);
  } catch (err) {
    console.error("Error getting total revenue over time:", err);
    res.status(500).json({ error: "فشل تحميل إجمالي الإيرادات بمرور الوقت" });
  }
};

module.exports = {
  getKpis,
  getRevenueByProduct,
  getTotalRevenueOverTime,
  getRevenueByCategory,
};
