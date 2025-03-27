const prisma = require("./index");

// 1️⃣ حساب عدد المتبرعين الفريدين (MAU)
const getDonationsFromUserOpportunities = async (userID) => {
  let data = await prisma.donation.groupBy({
    by: ["userId"],
    where: {
      donationOpportunity: {
        user: {
          id: userID,
        },
      },
    },
  });
  return data;
};

// 2️⃣ حساب إجمالي التبرعات في الشهر
const getTotalDonations = async (month, year, userID) => {
  const total = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: {
      createdAt: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
      donationOpportunity: {
        user: {
          id: userID,
        },
      },
    },
  });

  return total._sum.amount || 0;
};

// 3️⃣ حساب عدد المتبرعين الجدد في الشهر
const getNewDonorsCount = async (month, year, userID) => {
  const newDonors = await prisma.users.count({
    where: {
      createdAt: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
      donations: {
        some: {
          donationOpportunity: {
            user: {
              id: userID,
            },
          },
        },
      },
    },
  });

  return newDonors;
};

// 4️⃣ حساب عدد المتبرعين في الفترة السابقة
const getPreviousDonorsCount = async (month, year, userID) => {
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;

  const data = await prisma.donation.groupBy({
    by: ["userId"],
    where: {
      createdAt: {
        gte: new Date(previousYear, previousMonth - 1, 1),
        lt: new Date(previousYear, previousMonth, 1),
      },
      donationOpportunity: {
        user: {
          id: userID,
        },
      },
    },
  });
  return data.length;
};

// 5️⃣ حساب عدد المتبرعين العائدين خلال الشهر
const getReturningDonorsCount = async (month, year, userID) => {
  // Get donors this month for user's opportunities
  const donorsThisMonth = await prisma.donation.findMany({
    where: {
      createdAt: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
      donationOpportunity: {
        user: {
          id: userID,
        },
      },
    },
    select: { userId: true },
    distinct: ["userId"],
  });

  const donorIds = donorsThisMonth.map((donor) => donor.userId);

  // Check if these donors had any previous donations to user's opportunities
  const returningDonors = await prisma.donation.groupBy({
    by: ["userId"],
    where: {
      userId: { in: donorIds },
      createdAt: {
        lt: new Date(year, month - 1, 1),
      },
      donationOpportunity: {
        user: {
          id: userID,
        },
      },
    },
  });

  return returningDonors.length;
};

// 6️⃣ حساب عدد التحديثات أو البرامج المضافة خلال 30 يومًا
const getRecentUpdatesCount = async (userID) => {
  const updates = await prisma.donationOpportunity.count({
    where: {
      user: {
        id: userID,
      },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return updates;
};

// 7️⃣ الحصول على تبرعات لفرص التبرع الخاصة بالمستخدم
const getDonationsForUserOpportunities = async (userID) => {
  let data = await prisma.donation.findMany({
    where: {
      donationOpportunity: {
        user: {
          id: userID,
        },
      },
    },
  });
  return data;
};
const getActiveVsInactiveOppertunities = async (userID) => {
  let data = await prisma.donationOpportunity.findMany({
    where: {
      user: {
        id: userID,
      },
    },
    include: { donations: true, progress: true },
  });
  let active = data.filter(
    (el) => el.progress.rate >= 20 && el.donations.length > 0
  );
  let inActive = data.filter((el) => el.progress.rate < 20);
  return {
    active,
    inActive,
  };
};
const getActiveVsCompletedOppertunities = async (userID) => {
  let data = await prisma.donationOpportunity.findMany({
    where: {
      user: {
        id: userID,
      },
    },
    include: { donations: true, progress: true },
  });
  let active = data.filter(
    (el) => el.progress.rate < 100 && el.donations.length > 0
  );
  let completed = data.filter((el) => el.progress.rate === 100);
  return {
    active,
    completed,
  };
};



module.exports = {
  getActiveVsCompletedOppertunities,
  getDonationsFromUserOpportunities,
  getActiveVsInactiveOppertunities,
  getDonationsForUserOpportunities,
  getReturningDonorsCount,
  getPreviousDonorsCount,
  getRecentUpdatesCount,
  getTotalDonations,
  getNewDonorsCount,
};
