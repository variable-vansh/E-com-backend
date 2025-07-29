const prisma = require("../../utils/prisma");

// ================================
// TRANSACTION EXAMPLES
// ================================

const transactionExamples = {
  // Example: Create order with inventory management
  async createOrderWithInventoryUpdate(orderData) {
    const { orderItems, ...rest } = orderData;

    return prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          ...rest,
          orderItems: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice.toString(),
              totalPrice: (item.quantity * item.unitPrice).toString(),
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // 2. Update inventory for each order item
      for (const item of order.orderItems) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  },

  // Example: Transfer stock between products
  async transferStock(fromProductId, toProductId, quantity) {
    return prisma.$transaction(async (tx) => {
      // 1. Decrease stock from source product
      await tx.inventory.update({
        where: { productId: fromProductId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // 2. Increase stock for destination product
      await tx.inventory.update({
        where: { productId: toProductId },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    });
  },

  // Example: Cancel order and restore inventory
  async cancelOrderWithInventoryRestore(orderId) {
    return prisma.$transaction(async (tx) => {
      // 1. Get order details
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // 2. Update order status to cancelled
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
        },
      });

      // 3. Restore inventory for each order item
      for (const item of order.orderItems) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }

      return order;
    });
  },
};

module.exports = transactionExamples;
