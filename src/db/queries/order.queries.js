const prisma = require("../../utils/prisma");

// ================================
// ORDER CRUD OPERATIONS
// ================================

const orderQueries = {
  // CREATE - Create a new order
  async createOrder(data) {
    const { orderItems, ...orderData } = data;

    return await prisma.order.create({
      data: {
        ...orderData,
        totalAmount: orderData.totalAmount.toString(),
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
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  // READ - Get all orders
  async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // READ - Get order by ID
  async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                inventory: true,
              },
            },
          },
        },
      },
    });
  },

  // READ - Get order by order number
  async getOrderByOrderNumber(orderNumber) {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  // READ - Get orders by user ID
  async getOrdersByUserId(userId) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // READ - Get orders by status
  async getOrdersByStatus(status) {
    return await prisma.order.findMany({
      where: { status },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // UPDATE - Update order status
  async updateOrderStatus(id, status) {
    const updateData = { status };

    if (status === "SHIPPED") {
      updateData.shippedDate = new Date();
    } else if (status === "DELIVERED") {
      updateData.deliveredDate = new Date();
    }

    return await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  // UPDATE - Update payment status
  async updatePaymentStatus(id, paymentStatus) {
    return await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
  },

  // UPDATE - Update order details
  async updateOrder(id, data) {
    return await prisma.order.update({
      where: { id },
      data,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  // DELETE - Delete order
  async deleteOrder(id) {
    return await prisma.order.delete({
      where: { id },
    });
  },
};

module.exports = orderQueries;
