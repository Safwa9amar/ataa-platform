/**
 * حساب مؤشرات أداء المصروفات (Expenses Dashboard)
 * @param {Object} data - البيانات المطلوبة لحساب المؤشرات
 * @param {number} data.totalExpenses - إجمالي المصروفات خلال الفترة
 * @param {number} data.previousExpenses - إجمالي المصروفات في الفترة السابقة
 * @param {number} data.totalDonations - إجمالي التبرعات خلال الفترة
 * @param {Object} data.expensesByCategory - كائن يحتوي على توزيع المصروفات حسب الفئات
 * @param {number} data.adminExpenses - المصروفات الإدارية
 * @param {number} data.operationalExpenses - المصروفات التشغيلية
 * @param {number} data.totalPrograms - إجمالي عدد البرامج
 * @returns {Object} - كائن يحتوي على القيم المحسوبة للمؤشرات
 */
module.exports = function calculateExpensesDashboard(data) {
  const {
    totalExpenses, // إجمالي المصروفات خلال الفترة
    previousExpenses, // إجمالي المصروفات في الفترة السابقة
    totalDonations, // إجمالي التبرعات خلال الفترة
    expensesByCategory, // توزيع المصروفات حسب الفئات
    adminExpenses, // المصروفات الإدارية
    operationalExpenses, // المصروفات التشغيلية
    totalPrograms, // إجمالي عدد البرامج
  } = data;

  /**
   * 1️⃣ حساب معدل نمو المصروفات (Expense Growth Rate)
   * الصيغة: ((المصروفات الحالية - المصروفات السابقة) / المصروفات السابقة) × 100
   */
  const expenseGrowthRate =
    previousExpenses > 0
      ? ((totalExpenses - previousExpenses) / previousExpenses) * 100
      : 0;

  /**
   * 2️⃣ حساب نسبة المصروفات إلى التبرعات (Expense to Donation Ratio)
   * الصيغة: (إجمالي المصروفات / إجمالي التبرعات) × 100
   */
  const expenseToDonationRatio =
    totalDonations > 0 ? (totalExpenses / totalDonations) * 100 : 0;

  /**
   * 3️⃣ حساب متوسط المصروفات لكل برنامج (Average Expense Per Program)
   * الصيغة: إجمالي المصروفات / إجمالي عدد البرامج
   */
  const avgExpensePerProgram =
    totalPrograms > 0 ? totalExpenses / totalPrograms : 0;

  /**
   * 4️⃣ حساب نسبة المصروفات الإدارية إلى المصروفات العامة
   * الصيغة: (المصروفات الإدارية / إجمالي المصروفات) × 100
   */
  const adminExpenseRatio =
    totalExpenses > 0 ? (adminExpenses / totalExpenses) * 100 : 0;

  /**
   * إرجاع القيم المحسوبة على شكل كائن
   */
  return {
    totalExpenses, // إجمالي المصروفات
    expenseGrowthRate: `${expenseGrowthRate.toFixed(2)}%`, // معدل نمو المصروفات كنسبة مئوية
    expenseToDonationRatio: `${expenseToDonationRatio.toFixed(2)}%`, // نسبة المصروفات إلى التبرعات
    avgExpensePerProgram: avgExpensePerProgram.toFixed(2), // متوسط المصروفات لكل برنامج
    adminExpenseRatio: `${adminExpenseRatio.toFixed(2)}%`, // نسبة المصروفات الإدارية
    expensesByCategory, // توزيع المصروفات حسب الفئات
  };
};
