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
    endDate,
    selectedMonths = [],
  } = filters;
  // Validate interval type
  const validIntervals = ["days", "months"];
  if (!validIntervals.includes(intervalType.toLowerCase())) {
    throw new Error('Invalid interval type. Use "days" or "months"');
  }

  // Arabic month names configuration
  const arabicMonths = [
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
  const { startDate: normalizedStartDate, endDate: normalizedEndDate } =
    normalizeDateRange(startDate, endDate);
  // 1. Get donations with date filtering
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

  if (donations.length === 0) return [];

  // 2. Determine date range boundaries
  const dateRange = {
    start: startDate ? new Date(startDate) : new Date(donations[0].createdAt),
    end: endDate
      ? new Date(endDate)
      : new Date(donations[donations.length - 1].createdAt),
  };

  // 3. Generate time intervals based on selected type
  const intervals = [];
  const currentDate = new Date(dateRange.start);
  currentDate.setHours(0, 0, 0, 0); // Normalize time

  while (currentDate <= dateRange.end) {
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

  // 4. Aggregate donations into intervals
  const intervalMap = new Map(
    intervals.map((i) => [
      i.key,
      {
        ...i,
        donors: new Set(),
        count: 0,
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

  // 5. Process cumulative growth with proper axis labels
  let cumulativeDonors = 0;
  let previousDonors = 0;
  const results = intervals.map((interval) => {
    const data = intervalMap.get(interval.key);
    const newDonors = data ? data.donors.size : 0;
    cumulativeDonors += newDonors;

    // Calculate growth rate
    const growth = growthRate(previousDonors, cumulativeDonors);
    previousDonors = cumulativeDonors;

    return {
      // Common fields for all intervals
      donors: cumulativeDonors,
      isoDate: interval.isoDate,
      timestamp: interval.date.getTime(),
      growthRate: growth, // Add growth rate to the result

      // Type-specific labels
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
    };
  });

  // 6. Apply month filtering if specified
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
