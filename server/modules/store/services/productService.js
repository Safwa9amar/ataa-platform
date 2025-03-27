const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
class ProductService {
  async createProduct(data, userID) {
    let user = await prisma.users.findUnique({
      where: {
        id: userID,
      },
    });
    let qualityCertificates = data.qualityCertificates
      ? {
          qualityCertificates: {
            create: data.qualityCertificates[0],
          },
        }
      : undefined;

    return await prisma.product.create({
      data: {
        name: data.name,
        category: {
          connect: {
            id: data.category,
          },
        },
        partner: {
          connect: {
            id: user.partnerId,
          },
        },
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.quantity, 10), // الكمية الأولية للمخزون
        additionalDetails: data?.additionalDetails || "",
        socialMediaLinks: data?.socialMediaLinks || "",
        productImages: {
          createMany: { data: data.productImages }, // تحميل صور المنتج
        },

        ...qualityCertificates,
        // الحقول الجديدة
        minimumStockLevel: parseInt(data.minimumStockLevel, 10) || 10, // الحد الأدنى للمخزون (افتراضي: 10)
        soldQuantity: 0, // الكمية المباعة (تبدأ من 0)
        lastStockUpdate: new Date(), // تاريخ آخر تحديث للمخزون
        restockDate: new Date(), // تاريخ إعادة التخزين (يتم تعيينه الآن)
        stockHistory: {
          create: {
            oldStock: 0, // الكمية القديمة (قبل الإضافة)
            newStock: parseInt(data.quantity, 10), // الكمية الجديدة (بعد الإضافة)
            changeType: "ADJUSTMENT", // نوع التغيير (إضافة أولية)
            changedAt: new Date(), // تاريخ التغيير
          },
        },
      },
    });
  }
  async getAllProducts(keywords, page, limit) {
    try {
      const offset = (Number(page) - 1) * limit;
      let parsedValue = keywords === "undefined" ? undefined : keywords;

      const searchFilter =
        parsedValue !== undefined && !validator.isEmpty(keywords)
          ? {
              OR: [
                {
                  name: {
                    contains: keywords,
                  },
                },

                {
                  description: {
                    contains: keywords,
                  },
                },
              ],
            }
          : undefined;
      return await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ...searchFilter,
        },
        include: {
          category: true,
          productImages: true,
        },
        skip: offset,
        take: Number(limit),
      });
    } catch (error) {
      console.log("error white getting all products", error);
    }
  }
  async getMyProducts(keywords, page, limit, userID) {
    try {
      const offset = (Number(page) - 1) * limit;
      let parsedValue = keywords === "undefined" ? undefined : keywords;

      const searchFilter =
        parsedValue !== undefined && !validator.isEmpty(keywords)
          ? {
              OR: [
                {
                  name: {
                    contains: keywords,
                  },
                },

                {
                  description: {
                    contains: keywords,
                  },
                },
              ],
            }
          : undefined;
      return await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ...searchFilter,
          partner: {
            User: {
              id: userID,
            },
          },
        },
        include: {
          category: true,
          productImages: true,
        },
        skip: offset,
        take: Number(limit),
      });
    } catch (error) {
      console.log("error white getting all products", error);
    }
  }

  async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
        productImages: true,
      },
    });
  }
  async searchProductsInCategory(id, keywords, page = 1, limit = 10) {
    try {
      // تحويل المدخلات إلى أرقام صحيحة وتجنب الأخطاء
      const currentPage = Math.max(Number(page) || 1, 1);
      const perPage = Math.max(Number(limit) || 10, 1);

      // إعداد الفلاتر للبحث
      const searchFilter = keywords?.trim()
        ? {
            OR: [
              { name: { contains: keywords } },
              { description: { contains: keywords } },
            ],
          }
        : {};

      const categoryFilter = id && id !== "all" ? { storeCategoryId: id } : {};

      // تشغيل الطلبين بشكل متزامن لتحسين الأداء
      const [totalCount, products] = await Promise.all([
        prisma.product.count({ where: { ...categoryFilter, ...searchFilter } }),
        prisma.product.findMany({
          where: { ...categoryFilter, ...searchFilter },
          include: { category: true, productImages: true },
          orderBy: { createdAt: "desc" },
          skip: (currentPage - 1) * perPage,
          take: perPage,
        }),
      ]);

      // حساب عدد الصفحات والمعلومات الإضافية
      const totalPages = Math.ceil(totalCount / perPage);
      const hasNextPage = currentPage < totalPages;
      const hasPreviousPage = currentPage > 1;

      return {
        products,
        totalCount,
        totalPages,
        currentPage,
        perPage,
        hasNextPage,
        hasPreviousPage,
      };
    } catch (error) {
      console.error("Error while fetching products:", error);
      return {
        success: false,
        message: "حدث خطأ أثناء جلب المنتجات، يرجى المحاولة لاحقًا.",
      };
    }
  }

  async addStockToProduct(productId, quantity, changeType) {
    // 1. العثور على المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("المنتج غير موجود");

    let newStock = product.stock;

    switch (String(changeType).toLowerCase()) {
      case "restock": // إعادة تخزين
        newStock += quantity;
        break;

      case "sale": // بيع منتج
        if (newStock < quantity) throw new Error("المخزون غير كافٍ للبيع");
        newStock -= quantity;
        break;

      case "reset": // تصفير المخزون
        newStock = 0;
        break;

      case "adjustment": // تعديل يدوي
        newStock = quantity;
        break;

      case "return": // إرجاع منتج
        newStock += quantity;
        break;

      case "cancel_sale": // إلغاء عملية بيع (استرجاع المخزون)
        newStock += quantity;
        break;

      case "cancel_restock": // إلغاء عملية شراء (إنقاص المخزون)
        if (newStock < quantity)
          throw new Error("لا يمكن إلغاء كمية غير موجودة بالمخزون");
        newStock -= quantity;
        break;

      case "reserve": // حجز مخزون
        if (newStock < quantity) throw new Error("المخزون غير كافٍ للحجز");
        newStock -= quantity;
        break;

      case "release_reserve": // إلغاء حجز المخزون
        newStock += quantity;
        break;

      case "damage": // خصم تالف
        if (newStock < quantity) throw new Error("لا يمكن خصم كمية غير موجودة");
        newStock -= quantity;
        break;

      case "inventory_check": // جرد المخزون (لا يغير الكمية، مجرد تسجيل العملية)
        break;

      default:
        throw new Error("نوع العملية غير مدعوم");
    }

    // 2. تحديث المخزون في قاعدة البيانات
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock, lastStockUpdate: new Date() },
    });

    // 3. تسجيل العملية في `StockHistory`
    await prisma.stockHistory.create({
      data: {
        productId,
        oldStock: product.stock,
        newStock,
        changeType,
        changedAt: new Date(),
      },
    });

    return updatedProduct;
  }

  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: id },
      data,
    });
  }
  async deleteMyProduct(id, userId) {
    // البحث عن الشريك المرتبط بالمستخدم
    const partner = await prisma.partner.findFirst({
      where: {
        User: {
          id: userId,
        },
      },
      include: {
        products: true, // تضمين قائمة المنتجات الخاصة بالشريك
      },
    });

    // إذا لم يتم العثور على الشريك
    if (!partner) {
      throw new Error("لم يتم العثور على الشريك المرتبط بالمستخدم.");
    }

    // التحقق من أن المنتج ينتمي إلى الشريك
    const productBelongsToPartner = partner.products.some(
      (product) => product.id === id
    );

    if (!productBelongsToPartner) {
      throw new Error("المنتج غير موجود في قائمة منتجات الشريك.");
    }
    console.log(id);

    // حذف المنتج
    return await prisma.product.delete({
      where: {
        id: id,
        partnerId: partner.id, // التأكد من أن المنتج ينتمي إلى الشريك
      },
    });
  }
  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id: id },
    });
  }
}

module.exports = new ProductService();
