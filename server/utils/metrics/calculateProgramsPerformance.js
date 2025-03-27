/**
 * حساب مؤشرات أداء البرامج (Programs Performance)
 * @param {Object} data - البيانات المطلوبة لحساب المؤشرات
 * @param {number} data.totalDonations - إجمالي التبرعات لجميع البرامج
 * @param {number} data.totalDonationsPerProgram - كائن يحتوي على إجمالي التبرعات لكل برنامج
 * @param {number} data.totalPrograms - العدد الإجمالي للبرامج
 * @param {number} data.completedPrograms - عدد البرامج المكتملة
 * @param {number} data.newDonors - عدد المتبرعين الجدد خلال الفترة
 * @param {number} data.totalDonors - العدد الإجمالي للمتبرعين
 * @param {number} data.previousDonors - عدد المتبرعين في الفترة السابقة
 * @param {number} data.donorEngagement - عدد التبرعات والمشاركات التي تلقاها البرنامج
 * @param {number} data.totalBeneficiaries - العدد الإجمالي للأشخاص الذين استفادوا من البرامج
 * @returns {Object} - كائن يحتوي على القيم المحسوبة للمؤشرات
 */
module.exports = function calculateProgramsPerformance(data) {
  const {
    totalDonations, // إجمالي التبرعات لجميع البرامج
    totalDonationsPerProgram, // كائن يحتوي على إجمالي التبرعات لكل برنامج
    totalPrograms, // إجمالي عدد البرامج
    completedPrograms, // عدد البرامج المكتملة
    newDonors, // عدد المتبرعين الجدد خلال الفترة
    totalDonors, // إجمالي عدد المتبرعين
    previousDonors, // عدد المتبرعين في الفترة السابقة
    donorEngagement, // عدد التبرعات والتفاعل لكل برنامج
    totalBeneficiaries, // إجمالي عدد المستفيدين من البرامج
  } = data;

  /**
   * 1️⃣ حساب متوسط حجم التبرع لكل برنامج
   * الصيغة: إجمالي التبرعات لكل برنامج / عدد التبرعات للبرنامج
   * يتم إرجاع نتيجة لكل برنامج في كائن منفصل
   */
  const avgDonationPerProgram = {};
  for (const program in totalDonationsPerProgram) {
    avgDonationPerProgram[program] =
      totalDonationsPerProgram[program] > 0
        ? (totalDonationsPerProgram[program] / totalDonors).toFixed(2)
        : "0.00";
  }

  /**
   * 2️⃣ حساب معدل نمو المتبرعين لكل برنامج
   * الصيغة: ((عدد المتبرعين الجدد - عدد المتبرعين في الفترة السابقة) / عدد المتبرعين في الفترة السابقة) × 100
   */
  const growthRate =
    previousDonors > 0
      ? ((newDonors - previousDonors) / previousDonors) * 100
      : 0;

  /**
   * 3️⃣ حساب معدل إكمال البرامج
   * الصيغة: (عدد البرامج المكتملة / إجمالي عدد البرامج) × 100
   */
  const completionRate =
    totalPrograms > 0 ? (completedPrograms / totalPrograms) * 100 : 0;

  /**
   * 4️⃣ حساب تفاعل المتبرعين مع البرامج
   * يمثل عدد التبرعات أو المشاركات التي تلقاها البرنامج
   */
  const engagement = donorEngagement;

  /**
   * 5️⃣ حساب عدد المستفيدين من البرامج
   * العدد الإجمالي للأشخاص الذين استفادوا من جميع البرامج
   */
  const beneficiaries = totalBeneficiaries;

  /**
   * إرجاع القيم المحسوبة على شكل كائن
   */
  return {
    avgDonationPerProgram, // متوسط حجم التبرع لكل برنامج (كائن)
    growthRate: `${growthRate.toFixed(2)}%`, // معدل نمو المتبرعين كنسبة مئوية
    completionRate: `${completionRate.toFixed(2)}%`, // معدل إكمال البرامج كنسبة مئوية
    engagement, // عدد التبرعات والتفاعل مع البرامج
    beneficiaries, // عدد المستفيدين من البرامج
  };
};
