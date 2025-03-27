/**
 * حساب مؤشرات الأداء المالي (Financial Performance)
 * @param {Object} data - البيانات المطلوبة لحساب المؤشرات المالية
 * @param {number} data.totalDonations - إجمالي التبرعات المستلمة خلال الفترة
 * @param {number} data.previousDonations - إجمالي التبرعات في الفترة السابقة
 * @param {number} data.totalExpenses - إجمالي المصروفات خلال الفترة
 * @param {number} data.previousExpenses - إجمالي المصروفات في الفترة السابقة
 * @param {number} data.allocatedFunds - الأموال المخصصة للبرامج المختلفة
 * @param {number} data.availableFunds - الأموال المتاحة غير المخصصة بعد
 * @returns {Object} - كائن يحتوي على القيم المحسوبة للمؤشرات
 */
module.exports = function calculateFinancialPerformance(data) {
  const {
    totalDonations, // إجمالي التبرعات المستلمة خلال الفترة
    previousDonations, // إجمالي التبرعات في الفترة السابقة
    totalExpenses, // إجمالي المصروفات خلال الفترة
    previousExpenses, // إجمالي المصروفات في الفترة السابقة
    allocatedFunds, // الأموال المخصصة لبرامج محددة
    availableFunds, // الأموال المتاحة غير المخصصة بعد
  } = data;

  /**
   * 1️⃣ حساب صافي الإيرادات (Net Revenue)
   * الصيغة: إجمالي التبرعات - إجمالي المصروفات
   */
  const netRevenue = totalDonations - totalExpenses;

  /**
   * 2️⃣ حساب معدل نمو التبرعات (Donation Growth Rate)
   * الصيغة: ((التبرعات في الفترة الحالية - التبرعات في الفترة السابقة) / التبرعات في الفترة السابقة) × 100
   */
  const donationGrowthRate =
    previousDonations > 0
      ? ((totalDonations - previousDonations) / previousDonations) * 100
      : 0;

  /**
   * 3️⃣ حساب معدل نمو المصروفات (Expense Growth Rate)
   * الصيغة: ((المصروفات في الفترة الحالية - المصروفات في الفترة السابقة) / المصروفات في الفترة السابقة) × 100
   */
  const expenseGrowthRate =
    previousExpenses > 0
      ? ((totalExpenses - previousExpenses) / previousExpenses) * 100
      : 0;

  /**
   * 4️⃣ حساب نسبة المصروفات إلى التبرعات (Expense to Donation Ratio)
   * الصيغة: (إجمالي المصروفات / إجمالي التبرعات) × 100
   */
  const expenseToDonationRatio =
    totalDonations > 0 ? (totalExpenses / totalDonations) * 100 : 0;

  /**
   * 5️⃣ نسبة الأموال المتاحة إلى الأموال المخصصة
   * الصيغة: (الأموال المتاحة / إجمالي الأموال) × 100
   */
  const totalFunds = allocatedFunds + availableFunds;
  const availableFundsRatio =
    totalFunds > 0 ? (availableFunds / totalFunds) * 100 : 0;

  /**
   * إرجاع القيم المحسوبة على شكل كائن
   */
  return {
    totalDonations, // إجمالي التبرعات المستلمة
    totalExpenses, // إجمالي المصروفات
    netRevenue, // صافي الإيرادات
    donationGrowthRate: `${donationGrowthRate.toFixed(2)}%`, // معدل نمو التبرعات كنسبة مئوية
    expenseGrowthRate: `${expenseGrowthRate.toFixed(2)}%`, // معدل نمو المصروفات كنسبة مئوية
    expenseToDonationRatio: `${expenseToDonationRatio.toFixed(2)}%`, // نسبة المصروفات إلى التبرعات
    availableFundsRatio: `${availableFundsRatio.toFixed(2)}%`, // نسبة الأموال المتاحة إلى الأموال المخصصة
  };
};
