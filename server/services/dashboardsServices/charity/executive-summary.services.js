const { PrismaClient } = require("@prisma/client");
const { donationGrowthRate, retentionRate } = require("../../../utils/metrics");
const prisma = new PrismaClient();

// 🟢 قائمة الأشهر بالعربية
const monthNames = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const getTotalDonationsOverPeriods = async (
  userID,
  year = new Date().getFullYear(),
  viewType = "monthly", // "monthly" أو "daily"
  selectedMonths = [new Date().getMonth() + 1] // الأشهر المختارة، افتراضيًا الشهر الحالي
) => {
  // 🟢 تجهيز البيانات الافتراضية (لكل شهر أو يوم في الأشهر المختارة)
  const groupedData = {};

  selectedMonths
    .sort((a, b) => a - b)
    .forEach((month) => {
      if (viewType === "monthly") {
        groupedData[monthNames[month - 1]] = 0; // تعيين قيمة افتراضية لكل شهر
      } else {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          groupedData[`${monthNames[month - 1]} ${day}`] = 0; // تعيين قيمة افتراضية لكل يوم
        }
      }
    });

  // 🟢 جلب التبرعات من قاعدة البيانات
  const donations = await prisma.donation.findMany({
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 🟢 تنظيم البيانات بناءً على اختيار المستخدم (شهري أو يومي)
  donations.forEach((donation) => {
    const date = new Date(donation.createdAt);
    const month = date.getMonth() + 1; // الشهر من 1-12
    const day = date.getDate(); // اليوم من 1-31

    if (!selectedMonths.includes(month)) return; // تجاهل التبرعات خارج الأشهر المختارة

    let key;
    if (viewType === "monthly") {
      key = monthNames[month - 1];
    } else {
      key = `${monthNames[month - 1]} ${day}`;
    }

    groupedData[key] += donation.amount;
  });

  // 🟢 تحويل البيانات إلى مصفوفة قابلة للاستخدام
  const result = Object.keys(groupedData).map((key) => ({
    period: key,
    totalDonations: groupedData[key],
  }));

  return result;
};

// ✅ استرجاع بيانات البرامج المكتملة وغير المكتملة
const getSuccessfullyCompletedPrograms = async (userID) => {
  // 🟢 حساب إجمالي عدد البرامج
  const totalPrograms = await prisma.donationOpportunity.count({
    where: { createdByuserId: userID },
  });

  // 🟢 حساب عدد البرامج المكتملة
  const completed = await prisma.donationOpportunity.count({
    where: {
      createdByuserId: userID,
      progress: {
        rate: 100, // البرامج التي وصلت نسبة تقدمها إلى 100%
      },
    },
  });

  // 🟢 حساب عدد البرامج غير المكتملة
  const unCompleted = totalPrograms - completed; // الفرق بين الإجمالي والمكتمل

  return [
    { name: "البرامج المكتملة بنجاح", value: completed },
    { name: "البرامج الغير مكتملة", value: unCompleted },
  ];
};

const getDonationGrowthRate = async (
  userID,
  year = new Date().getFullYear(),
  viewType = "monthly",
  selectedMonths = [new Date().getMonth() + 1]
) => {
  if (!userID) throw new Error("userID is required");

  const donationData = {};

  if (viewType === "monthly") {
    for (let month = 1; month <= 12; month++) {
      if (selectedMonths.includes(month)) {
        donationData[`${year}-${month}`] = {
          period: monthNames[month - 1],
          totalDonations: 0,
        };
      }
    }
  } else {
    const selectedMonth = selectedMonths[0];
    const daysInMonth = new Date(year, selectedMonth, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      donationData[`${year}-${selectedMonth}-${day}`] = {
        period: `${monthNames[selectedMonth - 1]} ${day}`,
        totalDonations: 0,
      };
    }
  }

  const donations = await prisma.donation.findMany({
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
        lte: new Date(`${year}-12-31T23:59:59Z`),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  donations.forEach(({ amount, createdAt }) => {
    const date = new Date(createdAt);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const key =
      viewType === "monthly" ? `${year}-${month}` : `${year}-${month}-${day}`;

    if (donationData[key]) {
      donationData[key].totalDonations += amount || 0;
    }
  });

  const sortedPeriods = Object.keys(donationData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const growthRates = sortedPeriods.map((key, index) => {
    const current = donationData[key].totalDonations;
    const previous =
      index > 0 ? donationData[sortedPeriods[index - 1]].totalDonations : 0;

    return {
      period: donationData[key].period,
      totalDonations: current,
      growthRate: donationGrowthRate(previous, current),
    };
  });

  return growthRates;
};


const getNumberOfNewDonors = async (
  userID,
  year = new Date().getFullYear(),
  viewType = "monthly", // "daily" أو "monthly"
  selectedMonths = [new Date().getMonth() + 1] // الأشهر المختارة
) => {
  // 🟢 تحديد نطاق التاريخ بناءً على السنة
  const dateFilter = {
    gte: new Date(`${year}-01-01`),
    lte: new Date(`${year}-12-31`),
  };

  // 🟢 جلب أول تبرع لكل متبرع جديد خلال السنة
  const newDonors = await prisma.donation.groupBy({
    by: ["userId"],
    _min: { createdAt: true }, // جلب أول تاريخ تبرع لكل متبرع
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: dateFilter,
    },
    orderBy: { _min: { createdAt: "asc" } },
  });

  // 🟢 تجهيز بيانات عدد المتبرعين الجدد لكل فترة
  let donorData = {};

  newDonors.forEach((donor) => {
    const date = new Date(donor._min.createdAt);
    const month = date.getMonth() + 1; // الأشهر تبدأ من 1-12
    const day = date.getDate();
    const periodKey =
      viewType === "monthly"
        ? `${year}-${month}` // YYYY-MM
        : `${year}-${month}-${day}`; // YYYY-MM-DD

    if (!donorData[periodKey]) {
      donorData[periodKey] = 0;
    }

    donorData[periodKey] += 1; // احتساب عدد المتبرعين الجدد في كل فترة
  });

  // 🟢 تأكيد عرض كل الأشهر حتى وإن لم يكن بها بيانات
  if (viewType === "monthly") {
    donorData = Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => {
        const periodKey = `${year}-${i + 1}`;
        return [periodKey, donorData[periodKey] || 0];
      })
    );
  } else {
    // 🟢 تأكيد عرض كل الأيام عند العرض اليومي
    const month = selectedMonths[0]; // يجب أن يكون هناك شهر واحد فقط عند العرض اليومي
    const daysInMonth = new Date(year, month, 0).getDate(); // عدد الأيام في الشهر المحدد

    donorData = Object.fromEntries(
      Array.from({ length: daysInMonth }, (_, i) => {
        const periodKey = `${year}-${month}-${i + 1}`;
        return [periodKey, donorData[periodKey] || 0];
      })
    );
  }

  // 🟢 تصفية الأشهر المختارة فقط عند العرض الشهري
  if (viewType === "monthly" && selectedMonths.length > 0) {
    donorData = Object.fromEntries(
      Object.entries(donorData).filter(([key]) => {
        const month = parseInt(key.split("-")[1]); // استخراج الشهر من المفتاح YYYY-MM
        return selectedMonths.includes(month);
      })
    );
  }

  // 🟢 تحويل البيانات إلى مصفوفة قابلة للعرض
  const formattedData = Object.keys(donorData).map((period) => ({
    period,
    newDonors: donorData[period],
  }));
  console.log(formattedData);

  return formattedData;
};

// إعادة استخدام بيانات التبرعات للحسابات الأخرى
const getDonorRetentionRate = async (
  userID,
  year = new Date().getFullYear(),
  viewType = "monthly", // "daily" أو "monthly"
  selectedMonths = [new Date().getMonth() + 1] // الأشهر المختارة
) => {
  // 🟢 تحديد نطاق التاريخ بناءً على السنة
  const dateFilter = {
    gte: new Date(`${year}-01-01`),
    lte: new Date(`${year}-12-31`),
  };

  // 🟢 جلب جميع المتبرعين الفريدين الذين تبرعوا لأول مرة في الفترة المحددة
  const firstTimeDonors = await prisma.donation.groupBy({
    by: ["userId"],
    _min: { createdAt: true }, // جلب أول تاريخ تبرع لكل متبرع
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: dateFilter,
    },
    orderBy: { _min: { createdAt: "asc" } },
  });

  // 🟢 تجهيز قائمة المتبرعين لأول مرة
  let firstDonorsMap = {};
  firstTimeDonors.forEach((donor) => {
    const date = new Date(donor._min.createdAt);
    const month = date.getMonth() + 1;
    const periodKey =
      viewType === "monthly"
        ? `${year}-${month}`
        : `${year}-${month}-${date.getDate()}`;

    if (!firstDonorsMap[periodKey]) {
      firstDonorsMap[periodKey] = new Set();
    }
    firstDonorsMap[periodKey].add(donor.userId);
  });

  // 🟢 جلب جميع المتبرعين العائدين (تبرعوا بعد أول تبرع لهم)
  const returningDonors = await prisma.donation.groupBy({
    by: ["userId"],
    _count: { userId: true }, // عدد التبرعات لكل متبرع
    _min: { createdAt: true }, // تاريخ أول تبرع لكل متبرع
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: dateFilter,
    },
    orderBy: { _count: { userId: "desc" } },
  });

  // 🟢 تجهيز قائمة المتبرعين العائدين لكل فترة
  let returningDonorsMap = {};
  returningDonors.forEach((donor) => {
    if (donor._count.userId > 1) {
      // المتبرع لديه أكثر من تبرع، أي أنه عاد مرة أخرى
      const date = new Date(donor._min.createdAt);
      const month = date.getMonth() + 1;
      const periodKey =
        viewType === "monthly"
          ? `${year}-${month}`
          : `${year}-${month}-${date.getDate()}`;

      if (!returningDonorsMap[periodKey]) {
        returningDonorsMap[periodKey] = new Set();
      }
      returningDonorsMap[periodKey].add(donor.userId);
    }
  });

  // 🟢 تجهيز بيانات معدل الاحتفاظ بالمتبرعين لكل فترة
  let retentionData = {};

  Object.keys(firstDonorsMap).forEach((periodKey) => {
    const totalFirstTimeDonors = firstDonorsMap[periodKey].size || 1; // لتجنب القسمة على 0
    const returningDonorsCount = returningDonorsMap[periodKey]?.size || 0;

    retentionData[periodKey] = {
      period: periodKey,
      retentionRate: retentionRate(returningDonorsCount, totalFirstTimeDonors),
    };
  });

  // 🟢 التأكد من عرض جميع الأشهر/الأيام حتى ولو لم يكن هناك بيانات
  if (viewType === "monthly") {
    retentionData = Object.fromEntries(
      selectedMonths.map((month) => {
        const periodKey = `${year}-${month}`;
        return [
          periodKey,
          retentionData[periodKey] || { period: periodKey, retentionRate: 0 },
        ];
      })
    );
  } else {
    const month = selectedMonths[0]; // عند العرض اليومي يجب اختيار شهر واحد فقط
    const daysInMonth = new Date(year, month, 0).getDate();

    retentionData = Object.fromEntries(
      Array.from({ length: daysInMonth }, (_, i) => {
        const periodKey = `${year}-${month}-${i + 1}`;
        return [
          periodKey,
          retentionData[periodKey] || { period: periodKey, retentionRate: 0 },
        ];
      })
    );
  }

  // 🟢 تحويل البيانات إلى مصفوفة قابلة للعرض
  return Object.values(retentionData);
};

/**
 * حساب معدل إكمال البرامج لفترة زمنية محددة
 * @param {string} userId - معرف المستخدم
 * @param {Date} startDate - تاريخ البداية
 * @param {Date} endDate - تاريخ النهاية
 * @returns {Promise<{totalPrograms: number, completedPrograms: number, completionRate: number}>}
 */
const getProgramCompletionRate = async (userId, startDate, endDate) => {
  try {
    // حساب إجمالي عدد البرامج في الفترة الزمنية
    const totalPrograms = await prisma.donationOpportunity.count({
      where: {
        createdByuserId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // حساب عدد البرامج المكتملة في الفترة الزمنية
    const completedPrograms = await prisma.donationOpportunity.count({
      where: {
        createdByuserId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        progress: {
          rate: 100, // البرامج المكتملة بنسبة 100%
        },
      },
    });

    // حساب معدل إكمال البرامج
    const completionRate =
      totalPrograms > 0 ? (completedPrograms / totalPrograms) * 100 : 0;

    return {
      totalPrograms,
      completedPrograms,
      completionRate,
    };
  } catch (error) {
    console.error("Error calculating program completion rate:", error);
    throw new Error("Failed to calculate program completion rate.");
  }
};

/**
 * عرض معدل إكمال البرامج يوميًا خلال الشهر الحالي
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array<{day: number, completionRate: number}>>}
 */
const getDailyCompletionRateForCurrentMonth = async (userId) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // عدد أيام الشهر الحالي

  const results = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const startDate = new Date(currentYear, currentMonth, day);
    const endDate = new Date(currentYear, currentMonth, day + 1);

    const { completionRate } = await getProgramCompletionRate(
      userId,
      startDate,
      endDate
    );

    results.push({
      day,
      completionRate,
    });
  }

  return results;
};

/**
 * عرض معدل إكمال البرامج شهريًا خلال السنة الجارية
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array<{month: string, completionRate: number}>>}
 */
const getMonthlyCompletionRateForCurrentYear = async (userId) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const results = [];

  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0);

    const { completionRate } = await getProgramCompletionRate(
      userId,
      startDate,
      endDate
    );

    results.push({
      month: new Date(0, month).toLocaleString("ar", { month: "long" }), // اسم الشهر بالعربية
      completionRate,
    });
  }

  return results;
};

module.exports = {
  getTotalDonationsOverPeriods,
  getDonorRetentionRate,
  getDonationGrowthRate,
  getNumberOfNewDonors,
  getSuccessfullyCompletedPrograms,
  getProgramCompletionRate,
  getDailyCompletionRateForCurrentMonth,
  getMonthlyCompletionRateForCurrentYear,
};
