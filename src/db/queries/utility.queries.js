const prisma = require("../../utils/prisma");

// ================================
// UTILITY FUNCTIONS
// ================================

const utilityQueries = {
  // Get dashboard statistics
  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);
    return { totalUsers, totalProducts, totalOrders };
  },

  // Get sales report
  async getSalesReport(startDate, endDate) {
    return await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
          lte: endDate,
        },
        status: "DELIVERED",
      },
      include: {
        orderItems: true,
      },
    });
  },

  // Get top selling products
  async getTopSellingProducts(limit = 10) {
    return await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });
  },

  // Disconnect Prisma when application shuts down
  async disconnectPrisma() {
    await prisma.$disconnect();
  },
};

module.exports = utilityQueries;
