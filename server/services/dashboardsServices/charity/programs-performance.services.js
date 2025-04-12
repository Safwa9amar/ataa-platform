const prisma = require("../../../models");
const {
  getDonationDistribution,
} = require("../../../models/getDonationsFromUserOpportunities");
const { generateColorMap, formatDate } = require("../../../utils/getTimePart");
const {
  calculateAverageDonationSize,
  growthRate,
} = require("../../../utils/metrics");
const normalizeDateRange = require("../../../utils/normalizeDateRange");

async function getDistributionDonationsProgramPeriod(
  userID,
  startDate,
  endDate,
  filters
) {
  try {
    // 1. Input Validation
    const validPeriodTypes = new Set([
      "daily",
      "weekly",
      "monthly",
      "quarterly",
      "yearly",
    ]);
    if (!validPeriodTypes.has(filters.periodType)) {
      throw new Error(
        "نوع الفترة الزمنية غير صالح. الرجاء اختيار من: يومي، أسبوعي، شهري، ربع سنوي، سنوي"
      );
    }
    const { startDate: normalizedStartDate, endDate: normalizedEndDate } =
      normalizeDateRange(startDate, endDate);

    // 3. Fetch Data with Optimized Query
    const donationOpportunities = await prisma.donationOpportunity.findMany({
      where: {
        createdByuserId: userID,
        donationScoop: filters.programType
          ? {
              equals: filters.programType,
            }
          : undefined,
        donations: {
          some: filters.minAmount !== "all" ? { amount: { gt: 0 } } : undefined,
        },
      },
      include: {
        donations: {
          where: {
            createdAt: { gte: normalizedStartDate, lte: normalizedEndDate },
          },
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: filters.order || "desc",
      },
      take: filters.limit ? parseInt(filters.limit) : undefined,
    });

    // 4. Collect All Possible Periods
    const allPeriods = new Set();
    const periodMap = new Map();

    donationOpportunities.forEach((program) => {
      program.donations.forEach((donation) => {
        const period = formatDate(donation.createdAt, filters.periodType);
        allPeriods.add(period);
      });
    });

    // 5. Create Data Structure
    const barData = donationOpportunities.map((program) => {
      const programData = {
        program: program.title,
        total: 0,
        periods: {},
      };

      // Initialize all periods with 0
      allPeriods.forEach((period) => {
        programData.periods[period] = 0;
      });

      // Calculate amounts
      program.donations.forEach((donation) => {
        const period = formatDate(donation.createdAt, filters.periodType);
        programData.periods[period] += Number(donation.amount);
        programData.total += Number(donation.amount);
      });

      return programData;
    });
    // 6. Generate Final Output with Colors
    const sortedPeriods = Array.from(allPeriods).sort();
    const colorMap = generateColorMap(sortedPeriods, filters.periodType);

    // 6. Generate Final Output
    return {
      periods: sortedPeriods,
      colors: colorMap,
      programs: barData.map((program) => ({
        program: program.program,
        ...program.periods,
        total: program.total,
      })),
      meta: {
        periodType: filters.periodType,
        startDate,
        endDate,
        programType: filters.programType || "all",
      },
    };
  } catch (error) {
    console.error("Error in donation distribution report:", error);
    throw new Error(`فشل إنشاء التقرير: ${error.message}`);
  }
}
async function getDistributionOfDonations(userID, page = 1, pageSize = 10) {
  try {
    // Calculate the number of records to skip
    const skip = (page - 1) * pageSize;

    // Fetch paginated donation opportunities
    const pieData = await prisma.donationOpportunity.findMany({
      where: {
        user: {
          id: userID,
        },
      },
      include: {
        donations: true,
      },
      skip: skip, // Skip records for pagination
      take: pageSize, // Limit the number of records per page
    });

    // Transform the data for the pie chart
    const transformedData = pieData.map((el) => ({
      name: el.title,
      value: el.donations.length,
    }));

    // Get the total count of donation opportunities for the user
    const totalCount = await prisma.donationOpportunity.count({
      where: {
        user: {
          id: userID,
        },
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: transformedData,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching donation distribution:", error);
    throw new Error("Failed to fetch donation distribution.");
  }
}
async function getDonorInteractions(userID, filters) {
  const {
    orderBy = "donations",
    order = "desc",
    limit = 10,
    startDate,
    endDate,
    programType,
  } = filters;

  // ✅ ضبط نطاق التاريخ باستخدام الدالة المساعدة
  const { startDate: normalizedStartDate, endDate: normalizedEndDate } =
    normalizeDateRange(startDate, endDate);

  // ✅ تجهيز شروط البحث بناءً على الفلاتر
  let whereConditions = {
    createdByuserId: userID,
  };

  // ✅ تطبيق فلترة حسب التاريخ
  if (normalizedStartDate || normalizedEndDate) {
    whereConditions.donations = {
      some: {
        createdAt: {
          gte: normalizedStartDate,
          lte: normalizedEndDate,
        },
      },
    };
  }

  // ✅ فلترة حسب نوع البرنامج (إذا تم تحديده)
  if (programType) {
    whereConditions.title = { contains: programType };
  }

  // ✅ تحديد ترتيب البيانات بناءً على `orderBy`
  const orderByClause = {};
  if (orderBy === "donations" || orderBy === "sharedLinks") {
    orderByClause[orderBy] = {
      _count: order,
    };
  } else {
    orderByClause[orderBy] = order;
  }

  // ✅ جلب البيانات من `Prisma` بفرز مباشر
  let interactionData = await prisma.donationOpportunity.findMany({
    where: whereConditions,
    include: {
      donations: true,
      sharedLinks: true,
    },
    orderBy: orderByClause,
    take: parseInt(limit), // تحديد الحد الأقصى للنتائج
  });

  // ✅ تجهيز البيانات المسترجعة
  return interactionData.map((el) => ({
    program: el.title,
    donations: el.donations.length,
    sharedLinks: el.sharedLinks.length,
  }));
}

const getMonthlyProgramPerformance = async (
  programId,
  userId,
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  const program = await prisma.donationOpportunity.findFirst({
    where: {
      id: programId,
      createdByuserId: userId,
    },
    select: {
      title: true,
      numOfBeneficiaries: true,
      createdAt: true,
      progress: {
        select: {
          rate: true,
          totalAmount: true,
          requiredAmount: true,
        },
      },
      donations: {
        select: {
          amount: true,
          createdAt: true,
          userId: true,
        },
      },
    },
  });

  if (!program) return null;

  const filteredDonations = program.donations.filter((donation) => {
    const donationDate = new Date(donation.createdAt);
    return (
      donationDate.getFullYear() === year &&
      donationDate.getMonth() === month - 1
    );
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    beneficiaries: 0,
    donations: 0,
  }));

  const uniqueDonors = new Set();
  const donorFirstDonationDay = new Map();

  filteredDonations.forEach((donation) => {
    const date = new Date(donation.createdAt);
    const dayIndex = date.getDate() - 1;
    const rate = donation.amount / program.progress.requiredAmount;
    const beneficiaries = Math.ceil(rate * program.numOfBeneficiaries);

    dailyData[dayIndex].beneficiaries += beneficiaries;
    dailyData[dayIndex].donations += donation.amount;

    if (!uniqueDonors.has(donation.userId)) {
      uniqueDonors.add(donation.userId);
      donorFirstDonationDay.set(donation.userId, dayIndex);
    }
  });

  const totalDonations = filteredDonations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  const averageDonationAmount = calculateAverageDonationSize(
    totalDonations,
    filteredDonations.length
  );

  const newDonorsByDay = Array(daysInMonth).fill(0);
  donorFirstDonationDay.forEach((dayIndex) => {
    newDonorsByDay[dayIndex]++;
  });
  console.log(newDonorsByDay);

  let cumulativeDonors = 0;

  const donorGrowthRateByDay = newDonorsByDay.map((newDonors, dayIndex) => {
    const previousCumulative = cumulativeDonors;
    cumulativeDonors += newDonors;

    return {
      day: dayIndex + 1,
      growthRate: growthRate(previousCumulative, cumulativeDonors),
    };
  });

  return {
    program: program.title,
    dailyData,
    averageDonationAmount,
    donorGrowthRateByDay,
    totalDonations,
  };
};

const getAverageDonationForAllPrograms = async (userID) => {
  try {
    const result = await prisma.donation.aggregate({
      where: {
        donationOpportunity: {
          createdByuserId: userID,
        },
      },
      _avg: {
        amount: true,
      },
    });

    // Extract the average donation amount
    const averageDonation = result._avg.amount || 0;
    return averageDonation;
  } catch (error) {
    console.error("Error calculating average donation:", error);
    throw new Error("Failed to calculate average donation.");
  }
};

const getProgramCompletionRate = async (userID) => {
  try {
    // Step 1: Get the total number of programs created by the user
    const totalPrograms = await prisma.donationOpportunity.count({
      where: {
        createdByuserId: userID, // Filter programs by the user ID
      },
    });

    // Step 2: Get the number of successfully completed programs
    const completedPrograms = await prisma.donationOpportunity.count({
      where: {
        createdByuserId: userID, // Filter programs by the user ID
        progress: {
          rate: 100, // Programs with 100% completion rate
        },
      },
    });

    // Step 3: Calculate the completion rate
    const completionRate =
      totalPrograms > 0 ? (completedPrograms / totalPrograms) * 100 : 0;
    return completionRate;
  } catch (error) {
    console.error("Error calculating program completion rate:", error);
    throw new Error("Failed to calculate program completion rate.");
  }
};

module.exports = {
  getDistributionDonationsProgramPeriod,
  getMonthlyProgramPerformance,
  getDistributionOfDonations,
  getDonorInteractions,
  getAverageDonationForAllPrograms,
  getProgramCompletionRate,
};
