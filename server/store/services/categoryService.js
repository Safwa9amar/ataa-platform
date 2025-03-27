const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CategoryService {
  async createCategory(data) {
    return await prisma.storeCategory.create({
      data,
    });
  }

  async getAllCategories() {
    return await prisma.storeCategory.findMany({
      include: {
        products: true,
      },
    });
  }

  async getCategoryById(id) {
    return await prisma.storeCategory.findUnique({
      where: {
        id: id,
      },
      include: {
        products: true,
      },
    });
  }

  async updateCategory(id, data) {
    return await prisma.storeCategory.update({
      where: { id: id },
      data,
    });
  }

  async deleteCategory(id) {
    return await prisma.storeCategory.delete({
      where: { id: id },
    });
  }
}

module.exports = new CategoryService();
