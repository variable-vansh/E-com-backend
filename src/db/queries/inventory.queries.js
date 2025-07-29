const prisma = require("../../utils/prisma");

// ================================
// INVENTORY CRUD OPERATIONS
// ================================

const inventoryQueries = {
  // CREATE - Create inventory for a product
  async createInventory(data) {
    return await prisma.inventory.create({
      data,
      include: {
        product: true,
      },
    });
  },

  // READ - Get all inventory
  async getAllInventory() {
    return await prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  },

  // READ - Get inventory by product ID
  async getInventoryByProductId(productId) {
    return await prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  },

  // READ - Get low stock items
  async getLowStockItems() {
    return await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.lowStockAlert,
        },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  },

  // UPDATE - Update inventory
  async updateInventory(productId, data) {
    return await prisma.inventory.update({
      where: { productId },
      data,
      include: {
        product: true,
      },
    });
  },

  // UPDATE - Reserve stock
  async reserveStock(productId, quantity) {
    return await prisma.inventory.update({
      where: { productId },
      data: {
        quantity: {
          decrement: quantity,
        },
        reservedQuantity: {
          increment: quantity,
        },
      },
    });
  },

  // UPDATE - Release reserved stock
  async releaseReservedStock(productId, quantity) {
    return await prisma.inventory.update({
      where: { productId },
      data: {
        quantity: {
          increment: quantity,
        },
        reservedQuantity: {
          decrement: quantity,
        },
      },
    });
  },

  // DELETE - Delete inventory
  async deleteInventory(productId) {
    return await prisma.inventory.delete({
      where: { productId },
    });
  },
};

module.exports = inventoryQueries;
