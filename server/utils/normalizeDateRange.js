/**
 * ✅ ضبط نطاق التاريخ ليبدأ من بداية اليوم وينتهي بنهايته.
 * @param {string} startDate - تاريخ البداية بصيغة `YYYY-MM-DD`
 * @param {string} endDate - تاريخ النهاية بصيغة `YYYY-MM-DD`
 * @returns {Object} - كائن يحتوي على `startDate` و `endDate` مضبوطين بدقة
 */
function normalizeDateRange(startDate, endDate) {
    return {
      startDate: startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : undefined,
      endDate: endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : undefined,
    };
  }
  
  module.exports = normalizeDateRange;
  