/**
 * حساب مؤشرات أداء المتبرعين (Donor Dashboard)
 * @param {Object} data - البيانات المطلوبة لحساب المؤشرات
 * @param {number} data.totalDonors - إجمالي عدد المتبرعين
 * @param {number} data.newDonors - عدد المتبرعين الجدد خلال الفترة
 * @param {number} data.previousDonors - عدد المتبرعين في الفترة السابقة
 * @param {number} data.returningDonors - عدد المتبرعين الذين عادوا للتبرع مجددًا
 * @param {number} data.totalDonations - إجمالي عدد التبرعات خلال الفترة
 * @param {number} data.totalDonationAmount - إجمالي المبلغ المتبرع به خلال الفترة
 * @returns {Object} - كائن يحتوي على القيم المحسوبة للمؤشرات
 */
module.exports = function calculateDonorDashboard(data) {
  const {
    totalDonors, // إجمالي عدد المتبرعين
    newDonors, // عدد المتبرعين الجدد خلال الفترة
    previousDonors, // عدد المتبرعين في الفترة السابقة
    returningDonors, // عدد المتبرعين الذين عادوا للتبرع مجددًا
    totalDonations, // إجمالي عدد التبرعات خلال الفترة
    totalDonationAmount, // إجمالي قيمة التبرعات خلال الفترة
  } = data;

  /**
   * 1️⃣ حساب معدل نمو المتبرعين (Donor Growth Rate)
   * الصيغة: ((المتبرعين الجدد - المتبرعين السابقين) / المتبرعين السابقين) × 100
   */
  const donorGrowthRate =
    previousDonors > 0
      ? ((newDonors - previousDonors) / previousDonors) * 100
      : 0;

  /**
   * 2️⃣ حساب معدل الاحتفاظ بالمتبرعين (Donor Retention Rate)
   * الصيغة: (عدد المتبرعين العائدين / إجمالي عدد المتبرعين) × 100
   */
  const retentionRate =
    totalDonors > 0 ? (returningDonors / totalDonors) * 100 : 0;

  /**
   * 3️⃣ حساب متوسط عدد التبرعات لكل متبرع (Average Donations Per Donor)
   * الصيغة: إجمالي عدد التبرعات / إجمالي عدد المتبرعين
   */
  const avgDonationsPerDonor =
    totalDonors > 0 ? totalDonations / totalDonors : 0;

  /**
   * 4️⃣ حساب متوسط قيمة التبرع لكل متبرع (Average Donation Amount Per Donor)
   * الصيغة: إجمالي المبلغ المتبرع به / إجمالي عدد المتبرعين
   */
  const avgDonationAmountPerDonor =
    totalDonors > 0 ? totalDonationAmount / totalDonors : 0;

  /**
   * إرجاع القيم المحسوبة على شكل كائن
   */
  return {
    totalDonors, // إجمالي عدد المتبرعين
    newDonors, // عدد المتبرعين الجدد
    donorGrowthRate: `${donorGrowthRate.toFixed(2)}%`, // معدل نمو المتبرعين كنسبة مئوية
    retentionRate: `${retentionRate.toFixed(2)}%`, // معدل الاحتفاظ بالمتبرعين كنسبة مئوية
    avgDonationsPerDonor: avgDonationsPerDonor.toFixed(2), // متوسط عدد التبرعات لكل متبرع
    totalDonations, // إجمالي عدد التبرعات
    avgDonationAmountPerDonor: avgDonationAmountPerDonor.toFixed(2), // متوسط قيمة التبرع لكل متبرع
  };
};
