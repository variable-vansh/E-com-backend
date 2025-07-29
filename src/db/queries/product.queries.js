const prisma = require("../../utils/prisma");

// ================================
// PRODUCT CRUD OPERATIONS
// ================================

const productQueries = {
  // CREATE - Create a new product
  async createProduct(data) {
    return await prisma.product.create({
      data: {
        ...data,
        price: data.price.toString(), // Convert to Decimal
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  },

  // READ - Get all products
  async getAllProducts() {
    return await prisma.product.findMany({
      include: {
        category: true,
        inventory: true,
      },
    });
  },

  // READ - Get active products only
  async getActiveProducts() {
    return await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  },

  // READ - Get product by ID
  async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
        orderItems: {
          include: {
            order: true,
          },
        },
      },
    });
  },

  // READ - Get products by category
  async getProductsByCategory(categoryId) {
    return await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  },

  // READ - Search products by name
  async searchProducts(searchTerm) {
    return await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
        isActive: true,
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  },

  // UPDATE - Update product
  async updateProduct(id, data) {
    const updateData = { ...data };
    if (data.price) {
      updateData.price = data.price.toString();
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        inventory: true,
      },
    });
  },

  // DELETE - Delete product
  async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id },
    });
  },
};

module.exports = productQueries;
