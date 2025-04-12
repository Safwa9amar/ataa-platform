const { PrismaClient } = require("@prisma/client");
const {
  calculateAverageDonationSize,
  calculateDonorGrowthRate,
  calculateDonationPercentageByAgeGroup,
  growthRate,
} = require("../../../utils/metrics");
const prisma = new PrismaClient();

// 🔹 خدمة استرجاع متوسط حجم التبرع بمرور الوقت.
const getAverageDonationSize = async (
  userID,
  year = new Date().getFullYear(),
  viewType = "monthly", // "daily" أو "monthly"
  selectedMonths = [new Date().getMonth() + 1] // الأشهر المختارة
) => {
  // 🟢 تحديد نطاق التواريخ بناءً على السنة المحددة
  const dateFilter = {
    gte: new Date(`${year}-01-01`),
    lte: new Date(`${year}-12-31`),
  };

  // 🟢 جلب إجمالي التبرعات وعدد التبرعات لكل متبرع خلال الفترة الزمنية المحددة
  const donations = await prisma.donation.findMany({
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: dateFilter,
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 🟢 تجهيز بيانات متوسط التبرع لكل فترة (شهريًا أو يوميًا)
  let donationData = {};

  donations.forEach((donation) => {
    const date = new Date(donation.createdAt);
    const month = date.getMonth() + 1; // الأشهر تبدأ من 1-12
    const day = date.getDate();
    const periodKey =
      viewType === "monthly"
        ? `${year}-${month}` // YYYY-MM
        : `${year}-${month}-${day}`; // YYYY-MM-DD

    if (!donationData[periodKey]) {
      donationData[periodKey] = { totalAmount: 0, count: 0 };
    }

    donationData[periodKey].totalAmount += donation.amount;
    donationData[periodKey].count += 1;
  });

  // 🟢 التأكد من عرض جميع الفترات حتى ولو لم يكن هناك بيانات
  if (viewType === "monthly") {
    donationData = Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => {
        const periodKey = `${year}-${i + 1}`;
        return [
          periodKey,
          donationData[periodKey] || { totalAmount: 0, count: 0 },
        ];
      })
    );
  } else {
    const month = selectedMonths[0]; // عند العرض اليومي يجب اختيار شهر واحد فقط
    const daysInMonth = new Date(year, month, 0).getDate();

    donationData = Object.fromEntries(
      Array.from({ length: daysInMonth }, (_, i) => {
        const periodKey = `${year}-${month}-${i + 1}`;
        return [
          periodKey,
          donationData[periodKey] || { totalAmount: 0, count: 0 },
        ];
      })
    );
  }

  // 🟢 حساب متوسط حجم التبرع لكل فترة
  const formattedData = Object.keys(donationData).map((period) => ({
    period,
    averageDonation:
      donationData[period].count > 0
        ? calculateAverageDonationSize(
            donationData[period].totalAmount,
            donationData[period].count
          )
        : 0, // لتجنب القسمة على 0
  }));

  return formattedData;
};
// 🔹 خدمة استرجاع توزيع التبرعات حسب الفئات العمرية
const getDonationDistributionByAge = async (
  userID,
  year = new Date().getFullYear()
) => {
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
      user: {
        select: {
          age: true,
        },
      },
    },
  });

  // 🟢 تحديد الفئات العمرية
  const ageGroups = {
    "أقل من 18": 0,
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-60": 0,
    "أكبر من 60": 0,
  };

  let totalDonations = 0;
  const currentYear = new Date().getFullYear();

  donations.forEach((donation) => {
    if (!donation.user?.age) return;

    const age = donation.user.age;
    totalDonations += donation.amount;

    if (age < 18) ageGroups["أقل من 18"] += donation.amount;
    else if (age <= 25) ageGroups["18-25"] += donation.amount;
    else if (age <= 35) ageGroups["26-35"] += donation.amount;
    else if (age <= 45) ageGroups["36-45"] += donation.amount;
    else if (age <= 60) ageGroups["46-60"] += donation.amount;
    else ageGroups["أكبر من 60"] += donation.amount;
  });

  // 🟢 حساب نسبة التبرعات لكل فئة عمرية
  const data = Object.keys(ageGroups).map((group) => ({
    category: group,
    value: ageGroups[group],
    percentage:
      totalDonations > 0
        ? calculateDonationPercentageByAgeGroup(
            ageGroups[group],
            totalDonations
          ).toFixed(2)
        : 0,
  }));

  console.log(data);

  return data;
};

// 🔹 خدمة استرجاع توزيع التبرعات حسب المناطق الجغرافية
const getDonationDistributionByLocation = async (
  userID,
  year = new Date().getFullYear(),
  groupBy = "city" // يمكن أن يكون "city" أو "country"
) => {
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
      user: {
        select: {
          address: {
            select: {
              city: true, // اسم المدينة
              country: true, // اسم الدولة
            },
          },
        },
      },
    },
  });

  let locationData = {};

  donations.forEach((donation) => {
    if (!donation.user?.address) return;
    const location = donation.user.address[groupBy];

    if (!location) return;

    if (!locationData[location]) {
      locationData[location] = 0;
    }

    locationData[location] += donation.amount;
  });

  return Object.keys(locationData).map((location) => ({
    category: location,
    value: locationData[location],
  }));
};

// 🔹 خدمة استرجاع مقارنة المتبرعين الجدد مقابل العائدين
const getNewVsReturningDonors = async (
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

  // 🟢 جلب جميع المتبرعين الفريدين الذين تبرعوا لأول مرة
  const firstTimeDonors = await prisma.donation.groupBy({
    by: ["userId"],
    _min: { createdAt: true }, // أول تبرع لكل متبرع
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
    if (!selectedMonths.includes(month)) return; // ✅ تصفية الأشهر غير المحددة

    const periodKey =
      viewType === "monthly"
        ? `${year}-${month}`
        : `${year}-${month}-${date.getDate()}`;

    if (!firstDonorsMap[periodKey]) {
      firstDonorsMap[periodKey] = new Set();
    }
    firstDonorsMap[periodKey].add(donor.userId);
  });

  // 🟢 جلب جميع المتبرعين العائدين
  const returningDonors = await prisma.donation.groupBy({
    by: ["userId"],
    _count: { userId: true }, // عدد التبرعات لكل متبرع
    _min: { createdAt: true }, // أول تبرع
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
      const date = new Date(donor._min.createdAt);
      const month = date.getMonth() + 1;
      if (!selectedMonths.includes(month)) return; // ✅ تصفية الأشهر غير المحددة

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
  // 🟢 تجهيز بيانات المقارنة بين المتبرعين الجدد والعائدين لكل فترة
  let donorsComparisonData = {};

  // ✅ معالجة البيانات الشهرية
  selectedMonths.forEach((month) => {
    const periodKey = `${year}-${month}`;
    const newDonorsCount = firstDonorsMap[periodKey]?.size || 0;
    const returningDonorsCount = returningDonorsMap[periodKey]?.size || 0;

    donorsComparisonData[periodKey] = {
      period: periodKey,
      newDonors: newDonorsCount,
      returningDonors: returningDonorsCount,
    };
  });

  // ✅ التأكد من عرض جميع الفترات حتى لو لم تكن موجودة في `firstDonorsMap` أو `returningDonorsMap`
  if (viewType === "monthly") {
    for (let month = 1; month <= 12; month++) {
      const periodKey = `${year}-${month}`;
      if (!donorsComparisonData[periodKey]) {
        donorsComparisonData[periodKey] = {
          period: periodKey,
          newDonors: 0,
          returningDonors: 0,
        };
      }
    }
  }

  // ✅ معالجة البيانات اليومية عند اختيار `daily`
  if (viewType === "daily") {
    const month = selectedMonths[0]; // ✅ يجب اختيار شهر واحد فقط عند العرض اليومي
    const daysInMonth = new Date(year, month, 0).getDate();

    let dailyData = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const periodKey = `${year}-${month}-${day}`;
      dailyData[periodKey] = {
        period: periodKey,
        newDonors: firstDonorsMap[periodKey]?.size || 0,
        returningDonors: returningDonorsMap[periodKey]?.size || 0,
      };
    }

    donorsComparisonData = dailyData;
  }

  // ✅ تحويل البيانات إلى مصفوفة قابلة للعرض
  return Object.values(donorsComparisonData);
};

const getDonorGrowthRate = async (userID, startDate, endDate, viewType = "monthly") => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
  }

  // 🔹 عدد المتبرعين قبل الفترة المحددة
  const initialDonorsCount = await prisma.donation.count({
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: { lt: start }, // فقط ما قبل الفترة
    },
  });

  // 🔹 جلب التبرعات خلال الفترة
  const donations = await prisma.donation.findMany({
    where: {
      donationOpportunity: { createdByuserId: userID },
      createdAt: { gte: start, lte: end },
    },
    select: { createdAt: true },
  });

  // 🔹 توزيع التبرعات حسب الفترة (شهرية أو يومية)
  const donorCountsByPeriod = {};

  for (const { createdAt } of donations) {
    const date = new Date(createdAt);
    const key =
      viewType === "monthly"
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
        : date.toISOString().slice(0, 10); // YYYY-MM-DD

    donorCountsByPeriod[key] = (donorCountsByPeriod[key] || 0) + 1;
  }

  // 🔹 التأكد من تغطية كامل الفترة
  const currentDate = new Date(start);
  while (currentDate <= end) {
    const key =
      viewType === "monthly"
        ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`
        : currentDate.toISOString().slice(0, 10);

    if (!donorCountsByPeriod[key]) {
      donorCountsByPeriod[key] = 0;
    }

    // الانتقال إلى الشهر أو اليوم التالي
    if (viewType === "monthly") {
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // 🔹 ترتيب الفترات زمنياً
  const sortedPeriods = Object.keys(donorCountsByPeriod).sort();

  // 🔹 حساب معدل النمو لكل فترة
  let previousDonors = initialDonorsCount;
  const result = sortedPeriods.map((period) => {
    const added = donorCountsByPeriod[period];
    const currentDonors = previousDonors + added;

    return {
      period,
      growthRate: growthRate(previousDonors, currentDonors), // تقريبه إلى رقم عشري من رقمين
    };
  });

  return result;
};


async function getDonationMetrics(
  userID,
  periodType = "yearly",
  selectedPeriod = new Date().getFullYear()
) {
  try {
    // 🟢 تحديد نطاق التاريخ بناءً على اختيار المستخدم
    let dateFilter;
    if (periodType === "monthly") {
      dateFilter = {
        gte: new Date(`${selectedPeriod}-01`),
        lt: new Date(`${selectedPeriod}-31`),
      };
    } else {
      dateFilter = {
        gte: new Date(`${selectedPeriod}-01-01`),
        lt: new Date(`${selectedPeriod}-12-31`),
      };
    }

    // 🟢 تنفيذ جميع الاستعلامات بشكل متزامن باستخدام Promise.all
    const [totalDonors, newDonors, returningDonors, donationStats] =
      await Promise.all([
        prisma.donation.groupBy({
          by: ["userId"],
          where: {
            donationOpportunity: { createdByuserId: userID },
            createdAt: dateFilter,
          },
        }),

        prisma.donation.groupBy({
          by: ["userId"],
          _min: { createdAt: true },
          where: {
            donationOpportunity: { createdByuserId: userID },
            createdAt: dateFilter,
          },
        }),

        prisma.donation.groupBy({
          by: ["userId"],
          _count: { userId: true },
          where: {
            donationOpportunity: { createdByuserId: userID },
            createdAt: dateFilter,
          },
          having: {
            userId: { _count: { gt: 1 } },
          },
        }),

        prisma.donation.aggregate({
          where: {
            donationOpportunity: { createdByuserId: userID },
            createdAt: dateFilter,
          },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

    // 🟢 حساب متوسط حجم التبرع
    const totalAmount = donationStats._sum.amount || 0;
    const totalDonations = donationStats._count.id || 1; // تجنب القسمة على صفر
    const averageDonation = totalAmount / totalDonations;

    // 🟢 حساب معدل التبرعات المتكررة
    const totalDonorsCount = totalDonors.length || 1; // تجنب القسمة على صفر
    const recurringDonationRate =
      (returningDonors.length / totalDonorsCount) * 100;

    // 🟢 إرجاع النتائج
    return {
      totalDonors: totalDonors.length,
      newDonors: newDonors.length,
      returningDonors: returningDonors.length,
      recurringDonationRate: `${recurringDonationRate.toFixed(2)}%`,
      totalDonationAmount: totalAmount,
      totalDonations: totalDonations,
      averageDonation: parseFloat(averageDonation.toFixed(2)), // تقريب القيمة
    };
  } catch (error) {
    console.error("❌ Error fetching donation metrics:", error);
    throw new Error("Failed to retrieve donation metrics.");
  }
}

module.exports = {
  getAverageDonationSize,
  getDonationDistributionByAge,
  getDonationDistributionByLocation,
  getDonorGrowthRate,
  getNewVsReturningDonors,
  getDonationMetrics,
};
