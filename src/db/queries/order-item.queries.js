const prisma = require("../../utils/prisma");

// ================================
// ORDER ITEM CRUD OPERATIONS
// ================================

const orderItemQueries = {
  // CREATE - Add item to order
  async createOrderItem(data) {
    return await prisma.orderItem.create({
      data: {
        ...data,
        unitPrice: data.unitPrice.toString(),
        totalPrice: (data.quantity * data.unitPrice).toString(),
      },
      include: {
        order: true,
        product: true,
      },
    });
  },

  // READ - Get all order items
  async getAllOrderItems() {
    return await prisma.orderItem.findMany({
      include: {
        order: {
          include: {
            user: true,
          },
        },
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  },

  // READ - Get order item by ID
  async getOrderItemById(id) {
    return await prisma.orderItem.findUnique({
      where: { id },
      include: {
        order: true,
        product: true,
      },
    });
  },

  // READ - Get order items by order ID
  async getOrderItemsByOrderId(orderId) {
    return await prisma.orderItem.findMany({
      where: { orderId },
      include: {
        product: true,
      },
    });
  },

  // READ - Get order items by product ID
  async getOrderItemsByProductId(productId) {
    return await prisma.orderItem.findMany({
      where: { productId },
      include: {
        order: true,
      },
    });
  },

  // UPDATE - Update order item
  async updateOrderItem(id, data) {
    const updateData = { ...data };
    if (data.unitPrice) {
      const item = await prisma.orderItem.findUnique({ where: { id } });
      updateData.unitPrice = data.unitPrice.toString();
      updateData.totalPrice = (item.quantity * data.unitPrice).toString();
    }
    return await prisma.orderItem.update({
      where: { id },
      data: updateData,
    });
  },

  // DELETE - Delete order item
  async deleteOrderItem(id) {
    return await prisma.orderItem.delete({
      where: { id },
    });
  },
};

module.exports = orderItemQueries;
