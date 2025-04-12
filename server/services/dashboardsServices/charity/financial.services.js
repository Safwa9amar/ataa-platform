// services/financialService.js
const { PrismaClient } = require("@prisma/client");
const {
  netIncome,
  calculateGrossProfitMargin,
  calculateDonationToExpenseRatio,
  calculateRevenueGrowthRate,
  growthRate,
} = require("../../../utils/metrics");
const prisma = new PrismaClient();
const getKpiData = async (userID) => {
  try {
    // 🟢 جلب معرف الجمعية الخيرية الخاصة بالمستخدم
    const charity = await prisma.charity.findFirst({
      where: {
        User: {
          id: userID,
        },
      },
      select: { id: true },
    });

    // 🔴 التحقق من أن الجمعية موجودة، وإلا إرجاع خطأ
    if (!charity) {
      throw new Error("لم يتم العثور على الجمعية الخاصة بالمستخدم.");
    }

    // 🟢 تنفيذ جميع الاستعلامات بالتوازي باستخدام `Promise.all`
    const [incomeData, invoiceData, expenseData, donationData] =
      await Promise.all([
        prisma.income.aggregate({
          where: { charityId: charity.id },
          _sum: { amount: true },
        }),
        prisma.invoice.aggregate({
          where: { charityId: charity.id },
          _sum: { invoiceAmount: true },
        }),
        prisma.expense.aggregate({
          where: { charityId: charity.id },
          _sum: { amount: true },
        }),
        prisma.donation.aggregate({
          where: { donationOpportunity: { createdByuserId: userID } },
          _sum: { amount: true },
        }),
      ]);

    // 🟢 استخراج القيم والتحقق من وجودها لتجنب `undefined`
    const totalIncome = incomeData._sum.amount ?? 0;
    const totalDonations = donationData._sum.amount ?? 0;
    const totalInvoices = invoiceData._sum.invoiceAmount ?? 0;
    const totalExpenses = expenseData._sum.amount ?? 0;

    // 🟢 حساب إجمالي الدخل والصافي
    const totalRevenue = totalIncome + totalDonations;
    const totalLiabilities = totalExpenses + totalInvoices;
    const netIncomeValue = netIncome(totalRevenue, totalLiabilities);

    console.log(totalDonations, totalLiabilities);

    // 🟢 حساب مؤشرات الأداء الرئيسية (KPIs)
    return {
      netIncome: netIncomeValue.toFixed(2),
      grossProfitMargin: calculateGrossProfitMargin(
        netIncomeValue,
        totalRevenue
      ).toFixed(2),
      donationExpenseRatio: calculateDonationToExpenseRatio(
        totalDonations,
        totalLiabilities
      ).toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      totalLiabilities: totalLiabilities.toFixed(2),
    };
  } catch (error) {
    console.error("❌ خطأ أثناء جلب بيانات KPI:", error);
    throw new Error("فشل في استرجاع بيانات KPI");
  }
};
/**
 * 🔢 حساب نمو الإيرادات الشهرية (يشمل التبرعات + الإيرادات الأخرى)
 * @param {string} userId - معرف المستخدم
 * @param {number} [year] - السنة المطلوبة (افتراضي: السنة الحالية)
 * @returns {Promise<Array<{month: string, revenue: number, growthRate: number}>>}
 */
const getMonthlyRevenueGrowth = async (userId, year = new Date().getFullYear()) => {
  try {
    // 1️⃣ الحصول على المؤسسة الخيرية الخاصة بالمستخدم
    const charity = await prisma.charity.findFirst({
      where: { User: { id: userId } },
      select: { id: true },
    });

    if (!charity) throw new Error("المؤسسة الخيرية غير موجودة.");

    // 2️⃣ تحديد الفترة الزمنية (سنة كاملة)
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31`);

    // 3️⃣ جلب الإيرادات الشهرية
    const incomes = await prisma.income.groupBy({
      by: ["receiptDate"],
      _sum: { amount: true },
      where: {
        charityId: charity.id,
        receiptDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    // 4️⃣ جلب التبرعات الشهرية
    const donations = await prisma.donation.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      where: {
        donationOpportunity: { createdByuserId: userId },
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    // 5️⃣ دمج التبرعات مع الإيرادات في مصفوفة موحدة
    const allRevenues = [...incomes.map(i => ({
      date: i.receiptDate,
      amount: i._sum.amount || 0,
    })), ...donations.map(d => ({
      date: d.createdAt,
      amount: d._sum.amount || 0,
    }))];

    // 6️⃣ أسماء الأشهر بالعربية
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    // 7️⃣ تهيئة مصفوفة النتائج بـ 12 شهرًا
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: months[i],
      revenue: 0,
      growthRate: 0,
    }));

    // 8️⃣ توزيع الإيرادات والتبرعات حسب الشهر
    allRevenues.forEach(({ date, amount }) => {
      const monthIndex = new Date(date).getMonth();
      result[monthIndex].revenue += amount;
    });

    // 9️⃣ حساب معدل النمو الشهري
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1].revenue;
      const curr = result[i].revenue;

      // معدل النمو = ((الحالي - السابق) ÷ السابق) × 100
      result[i].growthRate = growthRate(prev, curr);  
    }

    return result;
  } catch (error) {
    console.error("❌ خطأ أثناء جلب نمو الإيرادات الشهرية:", error);
    throw new Error("فشل في تحميل بيانات نمو الإيرادات");
  }
};

const getRevenueVsExpenses = async (
  userId,
  year = new Date().getFullYear()
) => {
  try {
    const charityId = await prisma.charity.findFirst({
      where: {
        User: {
          id: userId,
        },
      },
      select: { id: true },
    });
    // Fetch total revenue per month
    const revenues = await prisma.income.groupBy({
      by: ["receiptDate"],
      _sum: { amount: true },
      where: {
        charityId: charityId.id,
        receiptDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });
    let donations = await prisma.donation.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      where: {
        donationOpportunity: {
          createdByuserId: userId,
        },
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    donations.forEach((d) => {
      revenues.push({
        _sum: { amount: d._sum.amount },
        receiptDate: d.createdAt,
      });
    });

    // Fetch total expenses per month
    const expenses = await prisma.expense.groupBy({
      by: ["paymentDate"],
      _sum: { amount: true },
      where: {
        charityId: charityId.id,
        paymentDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });
    const invoices = await prisma.invoice.groupBy({
      by: ["paymentDate"],
      _sum: { invoiceAmount: true },
      where: {
        charityId: charityId.id,
        paymentDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    invoices.map((invoice) =>
      expenses.push({
        _sum: { amount: invoice._sum.invoiceAmount },
        paymentDate: invoice.paymentDate,
      })
    );

    // Initialize 12 months data with default values
    const months = [
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

    let result = Array.from({ length: 12 }, (_, i) => ({
      month: months[i],
      revenue: 0,
      expenses: 0,
    }));

    // Populate revenue data
    revenues.forEach(({ _sum, receiptDate }) => {
      const monthIndex = new Date(receiptDate).getMonth();
      result[monthIndex].revenue += _sum.amount || 0;
    });

    // Populate total expenses
    expenses.forEach(({ _sum, paymentDate }) => {
      const monthIndex = new Date(paymentDate).getMonth();
      result[monthIndex].expenses += _sum.amount || 0;
    });

    return result;
  } catch (error) {
    console.error("Error fetching revenue vs expenses:", error);
    throw new Error("Failed to retrieve financial data");
  }
};

const getExpenseDistributionByActivity = async (
  userId,
  year = new Date().getFullYear()
) => {
  try {
    const charityId = await prisma.charity.findFirst({
      where: {
        User: {
          id: userId,
        },
      },
      select: { id: true },
    });
    // Fetch expenses grouped by month and type
    const expenses = await prisma.expense.groupBy({
      by: ["paymentDate", "type"], // Group by month and expense type (Enum)
      _sum: { amount: true },
      where: {
        charityId: charityId.id,
        paymentDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    const invoices = await prisma.invoice.groupBy({
      by: ["paymentDate"],
      _sum: { invoiceAmount: true },
      where: {
        charityId: charityId.id,
        paymentDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    invoices.map((invoice) =>
      expenses.push({
        _sum: { amount: invoice._sum.invoiceAmount },
        paymentDate: invoice.paymentDate,
        type: "NON_OPERATIONAL",
      })
    );

    // Define Arabic month names
    const months = [
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

    // Initialize result with all months and categories
    let result = Array.from({ length: 12 }, (_, i) => ({
      period: `${months[i]} ${year}`,
      تشغيلية: 0, // OPERATIONAL
      إدارية: 0, // ADMINISTRATIVE
      "غير تشغيلية": 0, // NON_OPERATIONAL
    }));

    // Populate expenses dynamically
    expenses.forEach(({ _sum, paymentDate, type }) => {
      const monthIndex = new Date(paymentDate).getMonth();
      if (type === "OPERATIONAL")
        result[monthIndex]["تشغيلية"] += _sum.amount || 0;
      if (type === "ADMINISTRATIVE")
        result[monthIndex]["إدارية"] += _sum.amount || 0;
      if (type === "NON_OPERATIONAL")
        result[monthIndex]["غير تشغيلية"] += _sum.amount || 0;
    });

    return result;
  } catch (error) {
    console.error("Error fetching expense distribution by activity:", error);
    throw new Error("Failed to retrieve expense data");
  }
};

module.exports = {
  getKpiData,
  getMonthlyRevenueGrowth,
  getRevenueVsExpenses,
  getExpenseDistributionByActivity,
};
