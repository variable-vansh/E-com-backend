import {
  userQueries,
  categoryQueries,
  productQueries,
  inventoryQueries,
  orderQueries,
  orderItemQueries,
  utilityQueries,
  transactionExamples,
  disconnectPrisma,
} from "./queries/crud-queries";

// ================================
// EXAMPLE USAGE OF CRUD OPERATIONS
// ================================

async function exampleUsage() {
  try {
    // ================================
    // USER OPERATIONS EXAMPLES
    // ================================

    // Create a new user
    const newUser = await userQueries.createUser({
      username: "john_doe",
      password: "hashedPassword123",
      email: "john@example.com",
      role: "CUSTOMER",
    });
    console.log("Created user:", newUser);

    // Get user by email
    const userByEmail = await userQueries.getUserByEmail("john@example.com");
    console.log("User found by email:", userByEmail);

    // Update user
    const updatedUser = await userQueries.updateUser(newUser.id, {
      role: "ADMIN",
    });
    console.log("Updated user:", updatedUser);

    // ================================
    // CATEGORY OPERATIONS EXAMPLES
    // ================================

    // Create root category
    const electronicsCategory = await categoryQueries.createCategory({
      name: "Electronics",
    });

    // Create subcategory
    const smartphonesCategory = await categoryQueries.createCategory({
      name: "Smartphones",
      parentId: electronicsCategory.id,
    });

    // Get all categories
    const allCategories = await categoryQueries.getAllCategories();
    console.log("All categories:", allCategories);

    // ================================
    // PRODUCT OPERATIONS EXAMPLES
    // ================================

    // Create a new product
    const newProduct = await productQueries.createProduct({
      name: "iPhone 15 Pro",
      description: "Latest iPhone with advanced features",
      price: 999.99,
      categoryId: smartphonesCategory.id,
      isActive: true,
    });
    console.log("Created product:", newProduct);

    // Search products
    const searchResults = await productQueries.searchProducts("iPhone");
    console.log("Search results:", searchResults);

    // Get products by category
    const categoryProducts = await productQueries.getProductsByCategory(
      smartphonesCategory.id
    );
    console.log("Products in category:", categoryProducts);

    // ================================
    // INVENTORY OPERATIONS EXAMPLES
    // ================================

    // Create inventory for the product
    const inventory = await inventoryQueries.createInventory({
      productId: newProduct.id,
      quantity: 100,
      lowStockAlert: 10,
    });
    console.log("Created inventory:", inventory);

    // Update inventory
    const updatedInventory = await inventoryQueries.updateInventory(
      newProduct.id,
      {
        quantity: 150,
      }
    );
    console.log("Updated inventory:", updatedInventory);

    // Check low stock items
    const lowStockItems = await inventoryQueries.getLowStockItems();
    console.log("Low stock items:", lowStockItems);

    // ================================
    // ORDER OPERATIONS EXAMPLES
    // ================================

    // Create a new order
    const newOrder = await orderQueries.createOrder({
      orderNumber: "ORD-2025-001",
      userId: newUser.id,
      totalAmount: 999.99,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      phone: "+1234567890",
      shippingAddress: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      paymentMethod: "CREDIT_CARD",
      orderItems: [
        {
          productId: newProduct.id,
          quantity: 1,
          unitPrice: 999.99,
        },
      ],
    });
    console.log("Created order:", newOrder);

    // Update order status
    const updatedOrder = await orderQueries.updateOrderStatus(
      newOrder.id,
      "CONFIRMED"
    );
    console.log("Updated order status:", updatedOrder);

    // Get orders by user
    const userOrders = await orderQueries.getOrdersByUserId(newUser.id);
    console.log("User orders:", userOrders);

    // ================================
    // ORDER ITEM OPERATIONS EXAMPLES
    // ================================

    // Get order items for an order
    const orderItems = await orderItemQueries.getOrderItemsByOrderId(
      newOrder.id
    );
    console.log("Order items:", orderItems);

    // ================================
    // UTILITY FUNCTIONS EXAMPLES
    // ================================

    // Get dashboard statistics
    const dashboardStats = await utilityQueries.getDashboardStats();
    console.log("Dashboard stats:", dashboardStats);

    // Get sales report
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");
    const salesReport = await utilityQueries.getSalesReport(startDate, endDate);
    console.log("Sales report:", salesReport);

    // Get top selling products
    const topProducts = await utilityQueries.getTopSellingProducts(5);
    console.log("Top selling products:", topProducts);

    // ================================
    // TRANSACTION EXAMPLE
    // ================================

    // Create order with automatic inventory update
    const orderWithInventory =
      await transactionExamples.createOrderWithInventoryUpdate({
        orderNumber: "ORD-2025-002",
        userId: newUser.id,
        totalAmount: 1999.98,
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        shippingAddress: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90210",
        orderItems: [
          {
            productId: newProduct.id,
            quantity: 2,
            unitPrice: 999.99,
          },
        ],
      });
    console.log("Order created with inventory update:", orderWithInventory);
  } catch (error) {
    console.error("Error in example usage:", error);
  } finally {
    // Always disconnect Prisma when done
    await disconnectPrisma();
  }
}

// ================================
// ADVANCED QUERY EXAMPLES
// ================================

export const advancedQueries = {
  // Get orders with detailed analytics
  async getOrderAnalytics(userId?: number) {
    const { default: prisma } = await import("./generated/prisma");
    const client = new prisma.PrismaClient();

    return await client.order.findMany({
      where: userId ? { userId } : {},
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        orderItems: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                inventory: {
                  select: {
                    quantity: true,
                    lowStockAlert: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ orderDate: "desc" }, { totalAmount: "desc" }],
    });
  },

  // Get products with full details and stock status
  async getProductsWithStockStatus() {
    const { default: prisma } = await import("./generated/prisma");
    const client = new prisma.PrismaClient();

    return await client.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        inventory: true,
        orderItems: {
          select: {
            quantity: true,
            order: {
              select: {
                status: true,
                orderDate: true,
              },
            },
          },
          orderBy: {
            order: {
              orderDate: "desc",
            },
          },
          take: 5, // Last 5 orders
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Get user activity summary
  async getUserActivitySummary(userId: number) {
    const { default: prisma } = await import("./generated/prisma");
    const client = new prisma.PrismaClient();

    const [user, orderStats, recentOrders] = await Promise.all([
      client.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      client.order.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
      }),
      client.order.findMany({
        where: { userId },
        take: 10,
        orderBy: { orderDate: "desc" },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      user,
      stats: {
        totalOrders: orderStats._count.id,
        totalSpent: orderStats._sum.totalAmount,
        averageOrderValue: orderStats._avg.totalAmount,
      },
      recentOrders,
    };
  },

  // Get inventory alerts
  async getInventoryAlerts() {
    const { default: prisma } = await import("./generated/prisma");
    const client = new prisma.PrismaClient();

    return await client.inventory.findMany({
      where: {
        OR: [
          {
            quantity: {
              lte: client.inventory.fields.lowStockAlert,
            },
          },
          {
            quantity: 0,
          },
        ],
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        quantity: "asc",
      },
    });
  },
};

// Run examples (uncomment to test)
// exampleUsage();

export default exampleUsage;
