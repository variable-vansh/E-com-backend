const prisma = require("../../utils/prisma");

// ================================
// CATEGORY CRUD OPERATIONS
// ================================

const categoryQueries = {
  // CREATE - Create a new category
  async createCategory(data) {
    return await prisma.category.create({
      data,
    });
  },

  // READ - Get all categories
  async getAllCategories() {
    return await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        products: true,
      },
    });
  },

  // READ - Get category by ID
  async getCategoryById(id) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            inventory: true,
          },
        },
      },
    });
  },

  // READ - Get root categories (no parent)
  async getRootCategories() {
    return await prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: true,
      },
    });
  },

  // READ - Get subcategories of a category
  async getSubcategories(parentId) {
    return await prisma.category.findMany({
      where: {
        parentId,
      },
      include: {
        children: true,
        products: true,
      },
    });
  },

  // UPDATE - Update category
  async updateCategory(id, data) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  // DELETE - Delete category
  async deleteCategory(id) {
    return await prisma.category.delete({
      where: { id },
    });
  },
};

module.exports = categoryQueries;
