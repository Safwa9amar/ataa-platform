const {
  engagementRate,
  growthRate,
  updateFrequency,
  accountActivityScore,
  retentionRate,
} = require(".");

/**
 * حساب مؤشرات صحة الحساب (Account Health)
 * @param {Object} data - البيانات المطلوبة لحساب المؤشرات
 * @param {number} data.totalDonations - إجمالي التبرعات في الفترة المحددة
 * @param {number} data.uniqueDonors - عدد المتبرعين الفريدين الذين تبرعوا خلال الفترة
 * @param {number} data.newDonors - عدد المتبرعين الجدد خلال الفترة
 * @param {number} data.previousDonors - عدد المتبرعين في الفترة السابقة
 * @param {number} data.recentUpdates - عدد التحديثات أو البرامج التي تم إنشاؤها خلال آخر 30 يومًا
 * @param {number} data.returningDonors - عدد المتبرعين الذين تبرعوا مرة أخرى خلال الفترة
 * @param {number} data.daysInPeriod - عدد الأيام في الفترة المحددة (مثل 30 يومًا لشهر)
 * @returns {Object} - كائن يحتوي على القيم المحسوبة للمؤشرات
 */
module.exports = function calculateAccountHealth(data) {
  const {
    totalDonations, // إجمالي التبرعات في الفترة المحددة
    uniqueDonors, // عدد المتبرعين الفريدين خلال الفترة
    newDonors, // عدد المتبرعين الجدد خلال الفترة
    previousDonors, // عدد المتبرعين في الفترة السابقة
    recentUpdates, // عدد التحديثات أو البرامج خلال آخر 30 يومًا
    returningDonors, // عدد المتبرعين الذين تبرعوا مرة أخرى
    daysInPeriod, // عدد الأيام في الفترة المحددة (مثل 30 يومًا)
  } = data;

  const MAU = uniqueDonors;

  const _engagementRate = engagementRate(totalDonations, uniqueDonors);

  const _growthRate = growthRate(newDonors, previousDonors);

  const _updateFrequency = updateFrequency(daysInPeriod, recentUpdates);

  const _accountActivityScore = accountActivityScore(
    _engagementRate,
    recentUpdates,
    _growthRate,
    _updateFrequency
  );

  const _retentionRate = retentionRate(previousDonors, returningDonors);

  return {
    MAU, // عدد المتبرعين النشطين شهريًا
    engagementRate: `${_engagementRate.toFixed(2)}%`, // معدل التفاعل كنسبة مئوية
    growthRate: `${_growthRate.toFixed(2)}%`, // معدل النمو كنسبة مئوية
    updateFrequency: _updateFrequency.toFixed(2), // معدل تحديث المحتوى كعدد عشري
    accountActivityScore: `${_accountActivityScore.toFixed(2)}%`, // درجة نشاط الحساب
    retentionRate: `${_retentionRate.toFixed(2)}%`, // معدل الاحتفاظ بالمتبرعين كنسبة مئوية
  };
};
