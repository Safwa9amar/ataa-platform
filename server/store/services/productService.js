const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
class ProductService {
  async createProduct(data) {
    return await prisma.product.create({
      data,
    });
  }

  async getAllProducts(keywords, page, limit) {
    try {
      const offset = (Number(page) - 1) * limit;
      let parsedValue = keywords === "undefined" ? undefined : keywords;
      console.log("page", page, "limit", limit, "keywords", keywords);

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
      },
    });
  }

  async searchProductsInCategory(id, keywords, page, limit) {
    try {
      const searchFilter =
        keywords !== undefined && !validator.isEmpty(keywords)
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
        where: {
          storeCategoryId: id,
          ...searchFilter,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });
    } catch (error) {
      console.log("error while get products in category", error);
    }
  }
  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: id },
      data,
    });
  }

  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id: id },
    });
  }
}

module.exports = new ProductService();
