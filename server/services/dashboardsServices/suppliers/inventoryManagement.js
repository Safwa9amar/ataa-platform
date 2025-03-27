const { calculateStockOutRate } = require("../../../utils/metrics");
const prisma = require("../../../models/index");

/**
 * حساب مؤشرات الأداء الرئيسية (KPIs) للمخزون
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array<{description: string, title: string, value: string|number, currency: string}>>}
 */
const getKpis = async (userId) => {
  try {
    // حساب إجمالي المخزون
    const totalStock = await prisma.product.aggregate({
      where: {
        partner: {
          User: {
            id: userId,
          },
        },
      },
      _sum: {
        stock: true,
      },
    });

    // حساب المخزون النشط (المنتجات التي لديها مخزون أكبر من 0)
    const currentActiveStock = await prisma.product.aggregate({
      where: {
        partner: {
          User: {
            id: userId,
          },
        },
        stock: {
          gt: 0,
        },
      },
      _sum: {
        stock: true,
      },
    });

    // حساب المنتجات التي نفد مخزونها
    const stockOutItems = await prisma.product.count({
      where: {
        partner: {
          User: {
            id: userId,
          },
        },
        stock: {
          equals: 0,
        },
      },
    });

    // حساب معدل نفاد المخزون
    const stockOutRate = calculateStockOutRate(
      stockOutItems,
      totalStock._sum.stock || 0
    );

    return [
      {
        description: "النسبة المئوية للبضائع التي نفدت من المخزون",
        title: "معدل نفاد المخزون : (Stock Out Rate)",
        value: `${stockOutRate}%`,
        currency: "%",
      },
      // {
      //   description: "كمية البضائع المتاحة حالياً",
      //   title: "مستوى المخزون الحالي : (Current Stock Level)",
      //   value: currentActiveStock._sum.stock || 0,
      //   currency: "",
      // },
    ];
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    throw new Error("Failed to fetch KPIs.");
  }
};

/**
 * جلب بيانات المخزون حسب المنتج
 * @returns {Promise<Array<{product: string, inventoryLevel: number}>>}
 */
const getInventoryByProduct = async (userId) => {
  console.log(userId);

  try {
    const products = await prisma.product.findMany({
      where: {
        partner: {
          User: {
            id: userId,
          },
        },
      },
      select: {
        name: true,
        stock: true,
      },
    });

    return products.map((product) => ({
      product: product.name,
      inventoryLevel: product.stock,
    }));
  } catch (error) {
    console.error("Error fetching inventory by product:", error);
    throw new Error("Failed to fetch inventory by product.");
  }
};

/**
 * جلب بيانات المخزون حسب الفئة
 * @returns {Promise<Array<{category: string, inventoryLevel: number}>>}
 */
const inventoryByCategory = async (userId) => {
  try {
    const categories = await prisma.storeCategory.findMany({
      where: {
        products: {
          some: {
            partner: {
              User: {
                id: userId,
              },
            },
          },
        },
      },
      include: {
        products: {
          select: {
            stock: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      category: category.name,
      inventoryLevel: category.products.reduce(
        (sum, product) => sum + product.stock,
        0
      ),
    }));
  } catch (error) {
    console.error("Error fetching inventory by category:", error);
    throw new Error("Failed to fetch inventory by category.");
  }
};
/**
 * جلب سجل النقاط لكل منتج بمرور الوقت
 * @returns {Promise<Array<{productId: string, productName: string, stockHistory: Array<{date: string, inventoryLevel: number}>}>>}
 */
const inventoryDepletion = async (userId) => {
  try {
    const stockHistory = await prisma.stockHistory.findMany({
      where: {
        product: {
          partner: {
            User: {
              id: userId,
            },
          },
        },
      },
      orderBy: {
        changedAt: "asc",
      },
      select: {
        productId: true,
        product: {
          select: {
            name: true,
          },
        },
        changedAt: true,
        newStock: true,
      },
    });

    // تنظيم البيانات بحيث يكون لكل منتج سجل مخزون خاص به
    const productStockHistory = stockHistory.reduce((acc, entry) => {
      const { productId, product, changedAt, newStock } = entry;
      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName: product.name,
          stockHistory: [],
        };
      }
      acc[productId].stockHistory.push({
        date: changedAt.toISOString().split("T")[0], // تاريخ بدون وقت
        inventoryLevel: newStock,
      });
      return acc;
    }, {});

    console.log(Object.values(productStockHistory));

    return Object.values(productStockHistory);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    throw new Error("Failed to fetch stock history.");
  }
};

module.exports = {
  getKpis,
  getInventoryByProduct,
  inventoryByCategory,
  inventoryDepletion,
};
