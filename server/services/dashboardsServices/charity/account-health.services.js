const calculateAccountHealth = require("../../../utils/metrics/calculateAccountHealth");
const {
  getDonationsFromUserOpportunities,
  getTotalDonations,
  getNewDonorsCount,
  getPreviousDonorsCount,
  getReturningDonorsCount,
  getRecentUpdatesCount,
  getActiveVsInactiveOppertunities,
  getActiveVsCompletedOppertunities,
} = require("../../../models/getDonationsFromUserOpportunities");
const {
  engagementRate: calcEngagementRate,
  growthRate,
} = require("../../../utils/metrics");
const prisma = require("../../../models");
const dayjs = require("dayjs");
const normalizeDateRange = require("../../../utils/normalizeDateRange");
// **1️⃣ إحضار بيانات الحساب الصحية العامة**
async function getAccountHealth(userID) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [
    uniqueDonors,
    totalDonations,
    newDonors,
    previousDonors,
    returningDonors,
    recentUpdates,
  ] = await Promise.all([
    getDonationsFromUserOpportunities(userID),
    getTotalDonations(currentMonth, currentYear, userID),
    getNewDonorsCount(currentMonth, currentYear, userID),
    getPreviousDonorsCount(currentMonth, currentYear, userID),
    getReturningDonorsCount(currentMonth, currentYear, userID),
    getRecentUpdatesCount(userID),
  ]);

  const daysInPeriod = new Date(currentYear, currentMonth, 0).getDate();

  return calculateAccountHealth({
    totalDonations,
    uniqueDonors: uniqueDonors.length,
    newDonors,
    previousDonors,
    recentUpdates,
    returningDonors,
    daysInPeriod,
  });
}

// **2️⃣ إحضار بيانات توزيع البرامج النشطة مقابل غير النشطة**
async function getActiveProgramsDistribution(userID) {
  const activeInactive = await getActiveVsInactiveOppertunities(userID);
  return [
    { name: "برامج نشطة", value: activeInactive.active.length },
    { name: "برامج غير نشطة", value: activeInactive.inActive.length },
  ];
}

// **3️⃣ إحضار بيانات توزيع البرامج الجارية مقابل المكتملة**
async function getOngoingVsIncompletePrograms(userID) {
  const activeCompleted = await getActiveVsCompletedOppertunities(userID);
  return [
    { name: "برامج جارية", value: activeCompleted.active.length },
    { name: "برامج مكتملة", value: activeCompleted.completed.length },
  ];
}

// **4️⃣ إحضار بيانات نمو المتبرعين عبر الزمن**
async function getDonorGrowthOverTime(userID, filters) {
  let {
    intervalType = "days",
    startDate,
    endDate = new Date(),
    selectedMonths = [],
  } = filters;

  const validIntervals = ["days", "months"];
  if (!validIntervals.includes(intervalType.toLowerCase())) {
    throw new Error('Invalid interval type. Use "days" or "months"');
  }

  const arabicMonths = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  const { startDate: normalizedStartDate, endDate: normalizedEndDate } =
    normalizeDateRange(startDate, endDate);

  const donations = await prisma.donation.findMany({
    where: {
      donationOpportunity: { user: { id: userID } },
      createdAt: {
        ...(startDate && { gte: normalizedStartDate }),
        ...(endDate && { lte: normalizedEndDate }),
      },
    },
    select: { createdAt: true, userId: true },
    orderBy: { createdAt: "asc" },
  });

  const actualStart = startDate
    ? new Date(startDate)
    : donations[0]
    ? new Date(donations[0].createdAt)
    : new Date();

  const actualEnd = endDate
    ? new Date(endDate)
    : donations[donations.length - 1]
    ? new Date(donations[donations.length - 1].createdAt)
    : new Date();

  const intervals = [];
  const currentDate = new Date(actualStart);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= actualEnd) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const isoDate = currentDate.toISOString().split("T")[0];

    if (intervalType === "months") {
      intervals.push({
        key: `${year}-${month}`,
        label: `${arabicMonths[month]} ${year}`,
        type: "month",
        date: new Date(currentDate),
        isoDate,
      });
      currentDate.setMonth(month + 1);
    } else {
      intervals.push({
        key: isoDate,
        label: `${day} ${arabicMonths[month]} ${year}`,
        type: "day",
        date: new Date(currentDate),
        isoDate,
      });
      currentDate.setDate(day + 1);
    }
  }

  // 🔁 Group donations by interval
  const intervalMap = new Map(
    intervals.map((i) => [
      i.key,
      {
        ...i,
        donors: new Set(),
      },
    ])
  );

  donations.forEach(({ createdAt, userId }) => {
    const date = new Date(createdAt);
    const key =
      intervalType === "months"
        ? `${date.getFullYear()}-${date.getMonth()}`
        : date.toISOString().split("T")[0];

    if (intervalMap.has(key)) {
      intervalMap.get(key).donors.add(userId);
    }
  });

  // ✅ Start from zero
  let cumulativeDonors = 0;
  let previousCumulative = 0;

  const results = [];

  intervals.forEach((interval, index) => {
    const data = intervalMap.get(interval.key);
    const newDonors = data ? data.donors.size : 0;

    if (index === 0) {
      // First point: zero donors
      results.push({
        donors: 0,
        newDonors: 0,
        isoDate: interval.isoDate,
        timestamp: interval.date.getTime(),
        growthRate: 0,
        ...(intervalType === "months"
          ? {
              label: interval.label,
              granularity: "month",
              month: arabicMonths[interval.date.getMonth()],
              year: interval.date.getFullYear(),
            }
          : {
              label: interval.label,
              granularity: "day",
              day: interval.date.getDate(),
              fullDate: interval.date.toLocaleDateString("ar-EG"),
            }),
      });
    }

    // From second interval onward
    cumulativeDonors += newDonors;
    const growth = growthRate(previousCumulative, cumulativeDonors);
    previousCumulative = cumulativeDonors;

    results.push({
      donors: cumulativeDonors,
      newDonors,
      isoDate: interval.isoDate,
      timestamp: interval.date.getTime(),
      growthRate: growth,
      ...(intervalType === "months"
        ? {
            label: interval.label,
            granularity: "month",
            month: arabicMonths[interval.date.getMonth()],
            year: interval.date.getFullYear(),
          }
        : {
            label: interval.label,
            granularity: "day",
            day: interval.date.getDate(),
            fullDate: interval.date.toLocaleDateString("ar-EG"),
          }),
    });
  });

  return intervalType === "months" && selectedMonths.length > 0
    ? results.filter((r) => selectedMonths.includes(r.month))
    : results;
}



// **📊 تحسين تجربة المستخدم عبر التصفية والفرز**
async function getProgramsEngagementComparison(userID, filters = {}) {
  const {
    orderBy = "donations",
    order = "desc",
    limit = 10,
    startDate,
    endDate,
    donationScoop,
  } = filters;

  // **🔹 شروط الفلترة (Filter Options)**
  let whereCondition = { createdByuserId: userID };
  const { startDate: normalizedStartDate, endDate: normalizedEndDate } =
    normalizeDateRange(startDate, endDate);
  // ✅ **تصفية حسب التاريخ** (إذا تم تحديد نطاق زمني)
  if (startDate && endDate) {
    whereCondition.createdAt = {
      gte: normalizedStartDate,
      lte: normalizedEndDate,
    };
  }

  // ✅ **تصفية حسب نوع البرنامج** (مثلاً: برامج صحية، تعليمية...)
  if (donationScoop) {
    whereCondition.donationScoop = donationScoop;
  }

  // **🔹 فرز البيانات حسب الطلب (Sorting Options)**
  let orderByCondition = {};
  if (orderBy === "donations") {
    orderByCondition = { donations: { _count: order } };
  } else if (orderBy === "engagementRate") {
    orderByCondition = { donations: { _count: order } }; // مبدئيًا، يمكن تحسينه لاحقًا
  } else if (orderBy === "uniqueDonors") {
    orderByCondition = { donations: { _count: order } };
  }

  // **🔹 جلب البيانات من قاعدة البيانات**
  let programs = await prisma.donationOpportunity.findMany({
    where: whereCondition,
    orderBy: orderByCondition,
    include: {
      donations: { include: { user: true } },
    },
    take: Number(limit), // ✅ **تحديد عدد النتائج**
  });

  // **🔹 تجهيز البيانات وإرجاعها**
  return programs.map((el) => {
    const uniqueUsers = new Set(
      el.donations.filter((d) => d.user?.id).map((d) => d.user.id)
    );

    return {
      program: el.title,
      engagement: el.donations.length
        ? calcEngagementRate(uniqueUsers.size, el.donations.length)
        : 0,
      totalDonations: el.donations.length,
      uniqueDonors: uniqueUsers.size,
    };
  });
}

// **6️⃣ إحضار بيانات مؤشرات الأداء الرئيسية (KPI Metrics)**
async function getKpiMetrics(userID) {
  return await getAccountHealth(userID);
}

module.exports = {
  getAccountHealth,
  getActiveProgramsDistribution,
  getOngoingVsIncompletePrograms,
  getDonorGrowthOverTime,
  getProgramsEngagementComparison,
  getKpiMetrics,
};
