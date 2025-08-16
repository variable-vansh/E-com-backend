const prisma = require("../../utils/prisma");

// ================================
// ORDER CRUD OPERATIONS
// ================================

const orderQueries = {
  // CREATE - Enhanced order creation for frontend
  async createEnhancedOrder(data) {
    const {
      customerInfo,
      cartItems = [],
      cartMix,
      pricing,
      orderTimestamp,
      paymentStatus = "PENDING",
      orderStatus = "CONFIRMED",
    } = data;

    return await prisma.$transaction(async (prisma) => {
      // Create the main order
      const newOrder = await prisma.order.create({
        data: {
          customerName: customerInfo.fullName,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email || null,
          houseNumber: customerInfo.address?.houseNumber || "",
          street: customerInfo.address?.street || "",
          pincode: customerInfo.address?.pincode || "",
          fullAddress: customerInfo.address?.fullAddress || "",
          itemTotal: pricing.itemTotal || 0,
          deliveryFee: pricing.deliveryFee || 0,
          discount: pricing.discount || 0,
          grandTotal: pricing.grandTotal,
          totalAmount: pricing.grandTotal, // For backwards compatibility
          orderTimestamp: orderTimestamp
            ? new Date(orderTimestamp)
            : new Date(),
          orderStatus: orderStatus.toUpperCase(),
          status: orderStatus.toUpperCase(), // For backwards compatibility
          paymentStatus: paymentStatus.toUpperCase(),
        },
      });

      // Create order items if they exist
      if (cartItems?.length > 0) {
        await prisma.orderItem.createMany({
          data: cartItems.map((item) => ({
            orderId: newOrder.id,
            productId: item.productId || null,
            productName: item.productName || "",
            quantity: item.quantity,
            price: item.price || 0,
            unitPrice: item.price || 0,
            totalPrice: item.totalPrice || 0,
          })),
        });
      }

      // Create order mix items if they exist
      if (cartMix?.grains?.length > 0) {
        await prisma.orderMixItem.createMany({
          data: cartMix.grains.map((grain) => ({
            orderId: newOrder.id,
            grainId: grain.grainId || null,
            grainName: grain.grainName || "",
            quantity: grain.quantity,
            price: grain.price,
            totalPrice: grain.totalPrice,
          })),
        });
      }

      // Return the complete order with related data
      return await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          orderItems: true,
          orderMixItems: true,
        },
      });
    });
  },

  // CREATE - Legacy create order (backwards compatibility)
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

  // READ - Get all orders (enhanced)
  async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        orderItems: true,
        orderMixItems: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // READ - Get order by ID or orderId (enhanced)
  async getOrderById(id) {
    return await prisma.order.findFirst({
      where: {
        OR: [{ id: parseInt(id) }, { orderId: id }],
      },
      include: {
        orderItems: true,
        orderMixItems: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
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
        orderMixItems: true,
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
        orderMixItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // READ - Get orders by phone number
  async getOrdersByPhone(phone) {
    return await prisma.order.findMany({
      where: {
        OR: [
          { customerPhone: phone },
          { phone: phone }, // Check old field too
        ],
      },
      include: {
        orderItems: true,
        orderMixItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // READ - Get orders by status
  async getOrdersByStatus(status) {
    return await prisma.order.findMany({
      where: {
        OR: [{ status }, { orderStatus: status }],
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        orderMixItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // READ - Get order statistics
  async getOrderStats() {
    const stats = await prisma.order.aggregate({
      _count: { id: true },
      _sum: {
        grandTotal: true,
        totalAmount: true,
      },
      _avg: {
        grandTotal: true,
        totalAmount: true,
      },
    });

    const statusCounts = await prisma.order.groupBy({
      by: ["orderStatus", "status"],
      _count: {
        id: true,
      },
    });

    return {
      ...stats,
      statusBreakdown: statusCounts,
    };
  },

  // UPDATE - Update order status (enhanced)
  async updateOrderStatus(id, status) {
    const updateData = {
      status: status.toUpperCase(),
      orderStatus: status.toUpperCase(), // Update both fields
      updatedAt: new Date(),
    };

    if (status.toUpperCase() === "SHIPPED") {
      updateData.shippedDate = new Date();
    } else if (status.toUpperCase() === "DELIVERED") {
      updateData.deliveredDate = new Date();
    }

    return await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        orderItems: true,
        orderMixItems: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  },

  // UPDATE - Update payment status
  async updatePaymentStatus(id, paymentStatus) {
    return await prisma.order.update({
      where: { id: parseInt(id) },
      data: { paymentStatus: paymentStatus.toUpperCase() },
    });
  },

  // UPDATE - Update order details
  async updateOrder(id, data) {
    return await prisma.order.update({
      where: { id: parseInt(id) },
      data,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        orderMixItems: true,
      },
    });
  },

  // DELETE - Delete order
  async deleteOrder(id) {
    return await prisma.order.delete({
      where: { id: parseInt(id) },
    });
  },

  // UTILITY - Calculate estimated delivery
  calculateEstimatedDelivery(pincode) {
    // Add your delivery estimation logic here
    // For now, return 3-5 business days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    return deliveryDate.toISOString().split("T")[0];
  },
};

module.exports = orderQueries;
