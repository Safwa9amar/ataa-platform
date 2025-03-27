const prisma = require("../../../models/index");
/**
 * حساب إجمالي الإيرادات
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<number>} - إجمالي الإيرادات
 */
const getKpis = async (userId) => {
  // جلب معلومات الشريك المرتبط بالمستخدم
  const partner = await prisma.partner.findFirst({
    where: {
      User: { id: userId },
    },
  });

  if (!partner) {
    throw new Error("Partner not found for the given user.");
  }

  try {
    // حساب إجمالي الإيرادات بناءً على المنتجات والفواتير المدفوعة
    const totalRevenue = await prisma.invoiceProduct.aggregate({
      where: {
        product: {
          partnerId: partner.id,
        },
        invoice: {
          status: "PAID", // فقط الفواتير المدفوعة
        },
      },
      _sum: {
        priceAtInvoice: true,
        quantity: true,
      },
    });

    // حساب الإيرادات الكلية
    const revenue =
      (totalRevenue._sum.priceAtInvoice || 0) *
      (totalRevenue._sum.quantity || 0);

    return [
      {
        description: "مجموع الإيرادات من المبيعات",
        title: "إجمالي الإيرادات : (Total Revenue)",
        value: revenue,
        currency: "دينار",
        color: "text-green-400",
      },
    ];
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw new Error("Failed to calculate total revenue.");
  }
};

/**
 * تحليل الإيرادات حسب المنتج
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array<{product: string, revenue: number}>>} - الإيرادات حسب المنتج
 */
const getRevenueByProduct = async (userId) => {
  const partner = await prisma.partner.findFirst({
    where: {
      User: {
        id: userId,
      },
    },
  });
  try {
    const revenueByProduct = await prisma.invoiceProduct.groupBy({
      by: ["productId"],
      where: {
        product: {
          partnerId: partner.id,
        },
        invoice: {
          status: "PAID",
        },
      },
      _sum: {
        priceAtInvoice: true,
        quantity: true,
      },
    });

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: revenueByProduct.map((item) => item.productId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return revenueByProduct.map((item) => ({
      product: products.find((p) => p.id === item.productId)?.name || "Unknown",
      revenue: item._sum.priceAtInvoice * item._sum.quantity || 0,
    }));
  } catch (error) {
    console.error("Error calculating revenue by product:", error);
    throw new Error("Failed to calculate revenue by product.");
  }
};

/**
 * تحليل الإيرادات حسب الفئة
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array<{category: string, revenue: number}>>} - الإيرادات حسب الفئة
 */
const getRevenueByCategory = async (userId) => {
  const partner = await prisma.partner.findFirst({
    where: {
      User: {
        id: userId,
      },
    },
  });

  try {
    const revenueByCategory = await prisma.invoiceProduct.groupBy({
      by: ["productId"],
      where: {
        product: {
          partnerId: partner.id,
        },
        invoice: {
          status: "PAID",
        },
      },
      _sum: {
        priceAtInvoice: true,
        quantity: true,
      },
    });

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: revenueByCategory.map((item) => item.productId),
        },
      },
      select: {
        id: true,
        storeCategoryId: true,
      },
    });

    const categories = await prisma.storeCategory.findMany({
      where: {
        id: {
          in: products.map((p) => p.storeCategoryId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return revenueByCategory.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const category = categories.find(
        (c) => c.id === product?.storeCategoryId
      );
      return {
        category: category?.name || "Unknown",
        revenue: item._sum.priceAtInvoice * item._sum.quantity || 0,
      };
    });
  } catch (error) {
    console.error("Error calculating revenue by category:", error);
    throw new Error("Failed to calculate revenue by category.");
  }
};

/**
 * حساب إجمالي الإيرادات بمرور الوقت
 * @param {string} userId - معرف المستخدم
 * @param {string} period - الفترة الزمنية (daily, weekly, monthly)
 * @returns {Promise<Array<{date: string, revenue: number}>>} - الإيرادات بمرور الوقت
 */
const getTotalRevenueOverTime = async (userId, period = "daily") => {
  try {
    // تحديد الفترة الزمنية
    let dateFormat;
    switch (period) {
      case "daily":
        dateFormat = "%Y-%m-%d"; // يومي
        break;
      case "weekly":
        dateFormat = "%Y-%W"; // أسبوعي
        break;
      case "monthly":
        dateFormat = "%Y-%m"; // شهري
        break;
      default:
        throw new Error("Invalid period specified.");
    }
    const partner = await prisma.partner.findFirst({
      where: {
        User: {
          id: userId,
        },
      },
    });

    // جلب البيانات من قاعدة البيانات
    const revenueOverTime = await prisma.$queryRawUnsafe(`
      SELECT 
        DATE_FORMAT(invoice.paymentDate, '${dateFormat}') AS date,
        SUM(invoice.amount) AS revenue
      FROM SupplierInvoice AS invoice
      INNER JOIN InvoiceProduct AS product ON invoice.id = product.invoiceId
      WHERE 
        invoice.status = 'PAID'
        AND product.productId IN (
          SELECT id FROM Product WHERE partnerId = '${partner.id}'
        )
      GROUP BY date
      ORDER BY date ASC
    `);

    // تحويل البيانات إلى التنسيق المطلوب
    return revenueOverTime.map((item) => ({
      date: item.date,
      revenue: parseFloat(item.revenue) || 0,
    }));
  } catch (error) {
    console.error("Error calculating total revenue over time:", error);
    throw new Error("Failed to calculate total revenue over time.");
  }
};

module.exports = {
  getKpis,
  getTotalRevenueOverTime,
  getRevenueByProduct,
  getRevenueByCategory,
};
