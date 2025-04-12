/**
 * حساب معدل التفاعل (Engagement Rate)
 * @param {number} uniqueDonors - عدد المتبرعين الفريدين خلال الفترة
 * @param {number} totalDonations - إجمالي التبرعات خلال الفترة
 * @returns {number} معدل التفاعل كنسبة مئوية
 */
function engagementRate(uniqueDonors, totalDonations) {
  return uniqueDonors > 0 ? (totalDonations / uniqueDonors) * 100 : 0;
}
/**
 * حساب معدل النمو (Growth Rate)
 * @param {number} previousDonors - عدد المتبرعين في الفترة السابقة
 * @param {number} newDonors - عدد المتبرعين الجدد خلال الفترة
 * @returns {number} معدل النمو كنسبة مئوية
 */
function growthRate(previousDonors, newDonors) {
  // إذا لم يكن هناك تبرعات سابقة، سيكون النمو 0%
  if (previousDonors === 0 && newDonors === 0) {
    return 0;
  }

  // إذا كانت فترة المتبرعين السابقة هي 0 وكان هناك تبرع جديد، يتم اعتبار النمو 100%
  if (previousDonors === 0 && newDonors > 0) {
    return 100;
  }

  // إذا كانت القيمة السابقة أكبر من 0، نحسب معدل النمو
  const growth = ((newDonors - previousDonors) / previousDonors) * 100;

  // نحدد الحد الأعلى والأدنى
  return Math.max(-100, Math.min(100, growth)).toFixed(2);
}


/**
 * حساب معدل تحديث المحتوى (Update Frequency)
 * @param {number} daysInPeriod - عدد الأيام في الفترة المحددة
 * @param {number} recentUpdates - عدد التحديثات خلال آخر 30 يومًا
 * @returns {number} معدل تحديث المحتوى
 */
function updateFrequency(daysInPeriod, recentUpdates) {
  return daysInPeriod > 0 ? recentUpdates / daysInPeriod : 0;
}

/**
 * حساب درجة نشاط الحساب (Account Activity Score)
 * يتم احتسابها بناءً على عدة عوامل وفقًا للأوزان التالية:
 * W1 = 0.4 لمعدل التفاعل
 * W2 = 0.2 لعدد التحديثات الأخيرة
 * W3 = 0.3 لمعدل النمو
 * W4 = 0.1 لمستوى التحديث
 * @param {number} engagement - معدل التفاعل
 * @param {number} updates - عدد التحديثات الأخيرة
 * @param {number} growth - معدل النمو
 * @param {number} frequency - معدل تحديث المحتوى
 * @returns {number} درجة نشاط الحساب
 */
function accountActivityScore(engagement, updates, growth, frequency) {
  const W1 = 0.4,
    W2 = 0.2,
    W3 = 0.3,
    W4 = 0.1;
  return W1 * engagement + W2 * updates + W3 * growth + W4 * frequency;
}

/**
 * حساب معدل الاحتفاظ بالمتبرعين (Donor Retention Rate)
 * @param {number} previousTotalDonors - إجمالي عدد المتبرعين في الفترة السابقة
 * @param {number} returningDonors - عدد المتبرعين الذين تبرعوا مرة أخرى
 * @returns {number} معدل الاحتفاظ بالمتبرعين كنسبة مئوية
 */
function retentionRate(previousTotalDonors, returningDonors) {
  return previousTotalDonors > 0
    ? (returningDonors / previousTotalDonors) * 100
    : 0;
}

/**
 * حساب معدل نمو المتبرعين لكل برنامج (Program Donor Growth Rate)
 * @param {number} newDonors - عدد المتبرعين الجدد لبرنامج معين
 * @param {number} totalDonors - العدد الإجمالي للمتبرعين للبرنامج
 * @returns {number} معدل نمو المتبرعين لكل برنامج كنسبة مئوية
 */
function programDonorGrowthRate(newDonors, totalDonors) {
  return totalDonors > 0 ? (newDonors / totalDonors) * 100 : 0;
}

/**
 * حساب معدل إكمال البرامج (Program Completion Rate)
 * @param {number} completedPrograms - عدد البرامج المكتملة بنجاح
 * @param {number} totalPrograms - إجمالي عدد البرامج
 * @returns {number} معدل إكمال البرامج كنسبة مئوية
 */
function programCompletionRate(completedPrograms, totalPrograms) {
  return totalPrograms > 0 ? (completedPrograms / totalPrograms) * 100 : 0;
}

/**
 * حساب إجمالي التبرعات (Total Donations)
 * @param {number[]} donations - مصفوفة تحتوي على مبالغ التبرعات المختلفة
 * @returns {number} إجمالي التبرعات
 */
function totalDonations(donations) {
  return donations.reduce((sum, donation) => sum + donation, 0);
}
/**
 * 📈 حساب معدل نمو التبرعات (Donation Growth Rate)
 *
 * يحسب معدل النمو بين فترتين كنسبة مئوية، ويحد النتيجة بين -100% و +100%.
 *
 * @param {number} previous - إجمالي التبرعات في الفترة السابقة
 * @param {number} current - إجمالي التبرعات في الفترة الحالية
 * @param {number} [precision=2] - عدد الأرقام بعد الفاصلة العشرية
 * @returns {number} معدل النمو بالنسبة المئوية
 */
function donationGrowthRate(previous, current, precision = 2) {
  if (typeof previous !== "number" || typeof current !== "number") return 0;

  // لا يمكن حساب معدل النمو إن لم توجد بيانات سابقة
  if (previous <= 0) return 0;

  const growth = ((current - previous) / previous) * 100;

  // تحديد الحد الأدنى والأقصى للقيمة
  const clampedGrowth = Math.max(-100, Math.min(100, growth));

  // تقريب النتيجة
  return parseFloat(clampedGrowth.toFixed(precision));
}


/**
 * حساب صافي الدخل (Net Income)
 * @param {number} revenue - إجمالي الإيرادات
 * @param {number} expenses - إجمالي النفقات
 * @returns {number} صافي الدخل
 */
function netIncome(revenue, expenses) {
  return revenue - expenses;
}

/**
 * Calculate the Gross Profit Margin (هامش الربح الإجمالي).
 * The formula used is:
 * هامش الربح الإجمالي = (صافي الربح الإجمالي / الإيرادات) × 100
 *
 * @param {number} netProfit - The net profit (صافي الربح الإجمالي).
 * @param {number} revenue - The total revenue (الإيرادات).
 * @returns {number|string} - The Gross Profit Margin in percentage, or an error message if revenue is 0.
 */
function calculateGrossProfitMargin(netProfit, revenue) {
  // Check if revenue is zero to avoid division by zero error
  if (revenue === 0) {
    return 0;
  }

  // Calculate the gross profit margin
  const grossProfitMargin = (netProfit / revenue) * 100;

  // Return the result as a percentage
  return grossProfitMargin;
}

/**
 * Calculate the Donation to Expense Ratio (نسبة التبرعات إلى النفقات).
 * The formula used is:
 * نسبة التبرعات إلى النفقات = (إجمالي التبرعات / إجمالي النفقات) × 100
 *
 * @param {number} totalDonations - The total donations (إجمالي التبرعات).
 * @param {number} totalExpenses - The total expenses (إجمالي النفقات).
 * @returns {number|string} - The Donation to Expense Ratio in percentage, or an error message if expenses is 0.
 */
function calculateDonationToExpenseRatio(totalDonations, totalExpenses) {
  // Check if total expenses is zero to avoid division by zero error
  if (totalExpenses === 0) {
    return 0;
  }

  // Calculate the donation to expense ratio
  const donationToExpenseRatio = (totalDonations / totalExpenses) * 100;

  // Return the result as a percentage
  return donationToExpenseRatio;
}

/**
 * Calculate the Revenue Growth Rate (معدل نمو الإيرادات).
 * The formula used is:
 * معدل نمو الإيرادات = ((الإيرادات في الفترة الحالية − الإيرادات في الفترة السابقة) / الإيرادات في الفترة السابقة) × 100
 *
 * @param {number} currentRevenue - The current period revenue (الإيرادات في الفترة الحالية).
 * @param {number} previousRevenue - The previous period revenue (الإيرادات في الفترة السابقة).
 * @returns {number|string} - The Revenue Growth Rate in percentage, or an error message if previous revenue is 0.
 */
function calculateRevenueGrowthRate(currentRevenue, previousRevenue) {
  // Check if previous revenue is zero to avoid division by zero error
  if (previousRevenue === 0) {
    return "Previous revenue cannot be zero";
  }

  // Calculate the revenue growth rate
  const revenueGrowthRate =
    ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  // Return the result as a percentage
  return revenueGrowthRate;
}

/**
 * Calculate the Operating Expense to Revenue Ratio (نسبة نفقات التشغيل إلى الإيرادات).
 * The formula used is:
 * نسبة نفقات التشغيل إلى الإيرادات = (إجمالي الإيرادات / إجمالي النفقات التشغيلية) × 100
 *
 * @param {number} totalRevenue - The total revenue (إجمالي الإيرادات).
 * @param {number} totalOperatingExpenses - The total operating expenses (إجمالي النفقات التشغيلية).
 * @returns {number|string} - The Operating Expense to Revenue Ratio in percentage, or an error message if operating expenses is 0.
 */
function calculateOperatingExpenseToRevenueRatio(
  totalRevenue,
  totalOperatingExpenses
) {
  // Check if total operating expenses is zero to avoid division by zero error
  if (totalOperatingExpenses === 0) {
    return "Total operating expenses cannot be zero";
  }

  // Calculate the operating expense to revenue ratio
  const operatingExpenseToRevenueRatio =
    (totalRevenue / totalOperatingExpenses) * 100;

  // Return the result as a percentage
  return operatingExpenseToRevenueRatio;
}

/**
 * Calculate the Donations Per Program Ratio (نسبة التبرعات لكل برنامج).
 * The formula used is:
 * نسبة التبرعات لكل برنامج = (إجمالي التبرعات المستلمة / إجمالي التبرعات المخصصة للبرنامج) × 100
 *
 * @param {number} totalDonationsReceived - The total donations received (إجمالي التبرعات المستلمة).
 * @param {number} totalDonationsAllocated - The total donations allocated to the program (إجمالي التبرعات المخصصة للبرنامج).
 * @returns {number|string} - The Donations Per Program Ratio in percentage, or an error message if allocated donations is 0.
 */
function calculateDonationsPerProgramRatio(
  totalDonationsReceived,
  totalDonationsAllocated
) {
  // Check if total donations allocated is zero to avoid division by zero error
  if (totalDonationsAllocated === 0) {
    return "Total donations allocated to the program cannot be zero";
  }

  // Calculate the donations per program ratio
  const donationsPerProgramRatio =
    (totalDonationsReceived / totalDonationsAllocated) * 100;

  // Return the result as a percentage
  return donationsPerProgramRatio;
}
/**
 * Calculates the average donation size (متوسط حجم التبرع).
 * Formula:
 *   متوسط التبرع = إجمالي التبرعات / عدد التبرعات
 *
 * @param {number} totalAmount - إجمالي مبلغ التبرعات.
 * @param {number} donationCount - عدد عمليات التبرع.
 * @returns {number} متوسط قيمة التبرع (بدقة منزلتين عشريتين)، أو 0 إذا لم تكن هناك تبرعات.
 */
function calculateAverageDonationSize(totalAmount, donationCount) {
  if (!donationCount || donationCount <= 0) {
    return 0;
  }

  const average = totalAmount / donationCount;
  return parseFloat(average.toFixed(2)); // دقة منزلتين عشريتين
}

/**
 * Calculate the Recurring Donation Rate (معدل التبرعات المتكررة).
 * The formula used is:
 * معدل التبرعات المتكررة = (عدد المتبرعين المتكررين / إجمالي عدد المتبرعين) × 100
 *
 * @param {number} recurringDonors - The number of recurring donors (عدد المتبرعين المتكررين).
 * @param {number} totalDonors - The total number of donors (إجمالي عدد المتبرعين).
 * @returns {number|string} - The Recurring Donation Rate in percentage, or an error message if total donors is 0.
 */
function calculateRecurringDonationRate(recurringDonors, totalDonors) {
  // Check if total donors is zero to avoid division by zero error
  if (totalDonors === 0) {
    return "Total number of donors cannot be zero";
  }

  // Calculate the recurring donation rate
  const recurringDonationRate = (recurringDonors / totalDonors) * 100;

  // Return the result as a percentage
  return recurringDonationRate;
}

/**
 * Calculate the Donation Percentage by Age Group (نسبة التبرعات حسب الفئة العمرية).
 * The formula used is:
 * نسبة التبرعات حسب الفئة العمرية = (عدد التبرعات في فئة عمرية معينة / إجمالي التبرعات) × 100
 *
 * @param {number} donationsInAgeGroup - The number of donations in a specific age group (عدد التبرعات في فئة عمرية معينة).
 * @param {number} totalDonations - The total number of donations (إجمالي التبرعات).
 * @returns {number|string} - The Donation Percentage by Age Group in percentage, or an error message if total donations is 0.
 */
function calculateDonationPercentageByAgeGroup(
  donationsInAgeGroup,
  totalDonations
) {
  // Check if total donations is zero to avoid division by zero error
  if (totalDonations === 0) {
    return "Total donations cannot be zero";
  }

  // Calculate the donation percentage by age group
  const donationPercentage = (donationsInAgeGroup / totalDonations) * 100;

  // Return the result as a percentage
  return donationPercentage;
}

/**
 * Calculate the Donor Growth Rate (معدل النمو).
 * The formula used is:
 * معدل النمو = ((عدد المتبرعين في نهاية الفترة − عدد المتبرعين في بداية الفترة) / عدد المتبرعين في بداية الفترة) × 100
 *
 * @param {number} donorsAtEndOfPeriod - The number of donors at the end of the period (عدد المتبرعين في نهاية الفترة).
 * @param {number} donorsAtStartOfPeriod - The number of donors at the start of the period (عدد المتبرعين في بداية الفترة).
 * @returns {number|string} - The Donor Growth Rate in percentage, or an error message if donors at the start of the period is 0.
 */
function calculateDonorGrowthRate(donorsAtEndOfPeriod, donorsAtStartOfPeriod) {
  // Check if donors at the start of the period is zero to avoid division by zero error
  if (donorsAtStartOfPeriod === 0) {
    return 0;
  }

  // Calculate the donor growth rate
  const donorGrowthRate =
    ((donorsAtEndOfPeriod - donorsAtStartOfPeriod) / donorsAtStartOfPeriod) *
    100;

  // Return the result as a percentage
  return donorGrowthRate;
}

/**
 * Calculate the Stock Out Rate (معدل نفاد المخزون).
 * The formula used is:
 * معدل نفاد المخزون = (عدد عناصر المنتج التي نفدت / إجمالي عدد العناصر المتاحة) × 100
 *
 * @param {number} stockOutItems - The number of out-of-stock items (عدد عناصر المنتج التي نفدت).
 * @param {number} totalAvailableItems - The total number of available items (إجمالي عدد العناصر المتاحة).
 * @returns {number|string} - The Stock Out Rate in percentage, or an error message if total available items is 0.
 */
function calculateStockOutRate(stockOutItems, totalAvailableItems) {
  // Check if total available items is zero to avoid division by zero error
  if (totalAvailableItems === 0) {
    return 0;
  }

  // Calculate the stock out rate
  const stockOutRate = (stockOutItems / totalAvailableItems) * 100;

  // Return the result as a percentage
  return stockOutRate;
}

/**
 * Calculate the Current Stock Level (مستوى المخزون الحالي).
 * This is the quantity of available stock for a specific product.
 *
 * @param {number} availableStock - The available stock quantity for a product (كمية المخزون المتاحة في الوقت الحالي).
 * @returns {number} - The current stock level.
 */
function calculateCurrentStockLevel(availableStock) {
  // Return the current stock level
  return availableStock;
}

/**
 * Calculate the Weekly Donor Growth Rate (معدل النمو الأسبوعي للمتبرعين).
 * The formula used is:
 * معدل النمو الأسبوعي للمتبرعين = (عدد المتبرعين هذا الأسبوع - عدد المتبرعين الأسبوع الماضي) / عدد المتبرعين الأسبوع الماضي × 100
 *
 * @param {number} donorsThisWeek - The number of donors this week (عدد المتبرعين هذا الأسبوع).
 * @param {number} donorsLastWeek - The number of donors last week (عدد المتبرعين الأسبوع الماضي).
 * @returns {number|string} - The Weekly Donor Growth Rate in percentage, or an error message if donors last week is 0.
 */
function calculateWeeklyDonorGrowthRate(donorsThisWeek, donorsLastWeek) {
  // Check if donors last week is zero to avoid division by zero error
  if (donorsLastWeek === 0) {
    return "Number of donors last week cannot be zero";
  }

  // Calculate the weekly donor growth rate
  const weeklyDonorGrowthRate =
    ((donorsThisWeek - donorsLastWeek) / donorsLastWeek) * 100;

  // Return the result as a percentage
  return weeklyDonorGrowthRate;
}

/**
 * Calculate the Average Donation Time (متوسط وقت التبرع).
 * The formula used is:
 * متوسط وقت التبرع = مجموع الوقت المستغرق للتبرع / عدد المتبرعين
 *
 * @param {number} totalTimeSpent - The total time spent on donations (مجموع الوقت المستغرق للتبرع).
 * @param {number} numberOfDonors - The number of donors (عدد المتبرعين).
 * @returns {number|string} - The Average Donation Time, or an error message if the number of donors is 0.
 */
function calculateAverageDonationTime(totalTimeSpent, numberOfDonors) {
  // Check if the number of donors is zero to avoid division by zero error
  if (numberOfDonors === 0) {
    return "Number of donors cannot be zero";
  }

  // Calculate the average donation time
  const averageDonationTime = totalTimeSpent / numberOfDonors;

  // Return the result
  return averageDonationTime;
}

/**
 * Calculate the Donation Rate per Region (نسبة التبرع لكل منطقة).
 * The formula used is:
 * نسبة التبرع لكل منطقة = (عدد المتبرعين في منطقة / عدد السكان في المنطقة) × 1000
 *
 * @param {number} donorsInRegion - The number of donors in the region (عدد المتبرعين في المنطقة).
 * @param {number} populationInRegion - The population of the region (عدد السكان في المنطقة).
 * @returns {number|string} - The Donation Rate per 1000 people in the region, or an error message if the population is 0.
 */
function calculateDonationRatePerRegion(donorsInRegion, populationInRegion) {
  // Check if population is zero to avoid division by zero error
  if (populationInRegion === 0) {
    return "Population in the region cannot be zero";
  }

  // Calculate the donation rate per 1000 people
  const donationRate = (donorsInRegion / populationInRegion) * 1000;

  // Return the result as the donation rate per 1000 people
  return donationRate;
}

/**
 * Calculate the Monthly Donor Growth per Region (معدل النمو الشهري للمتبرعين في المناطق).
 * The formula used is:
 * معدل النمو الشهري للمتبرعين في المناطق = (عدد المتبرعين هذا الشهر - عدد المتبرعين الشهر الماضي) / عدد المتبرعين الشهر الماضي × 100
 *
 * @param {number} donorsThisMonth - The number of donors this month (عدد المتبرعين هذا الشهر).
 * @param {number} donorsLastMonth - The number of donors last month (عدد المتبرعين الشهر الماضي).
 * @returns {number|string} - The Monthly Donor Growth Rate per Region in percentage, or an error message if donors last month is 0.
 */
function calculateMonthlyDonorGrowthPerRegion(
  donorsThisMonth,
  donorsLastMonth
) {
  // Check if donors last month is zero to avoid division by zero error
  if (donorsLastMonth === 0) {
    return "Number of donors last month cannot be zero";
  }

  // Calculate the monthly donor growth rate per region
  const monthlyDonorGrowthRate =
    ((donorsThisMonth - donorsLastMonth) / donorsLastMonth) * 100;

  // Return the result as a percentage
  return monthlyDonorGrowthRate;
}

// تصدير الدوال لاستخدامها في أماكن أخرى
module.exports = {
  engagementRate,
  growthRate,
  updateFrequency,
  accountActivityScore,
  retentionRate,
  programDonorGrowthRate,
  programCompletionRate,
  totalDonations,
  donationGrowthRate,
  //   finanlcial
  calculateOperatingExpenseToRevenueRatio,
  calculateDonationPercentageByAgeGroup,
  calculateDonationsPerProgramRatio,
  calculateDonationToExpenseRatio,
  calculateRecurringDonationRate,
  calculateAverageDonationSize,
  calculateRevenueGrowthRate,
  calculateGrossProfitMargin,
  calculateDonorGrowthRate,
  netIncome,

  //   suplier
  calculateCurrentStockLevel,
  calculateStockOutRate,

  //   blood agency
  calculateMonthlyDonorGrowthPerRegion,
  calculateDonationRatePerRegion,
  calculateWeeklyDonorGrowthRate,
  calculateAverageDonationTime,
};
