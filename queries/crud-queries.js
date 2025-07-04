const prisma = require("../src/utils/prisma");

// ================================
// USER CRUD OPERATIONS
// ================================

const userQueries = {
  // CREATE - Create a new user
  async createUser(data) {
    return await prisma.user.create({
      data,
    });
  },

  // READ - Get all users
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        orders: true,
      },
    });
  },

  // READ - Get user by ID
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  },

  // READ - Get user by email
  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        orders: true,
      },
    });
  },

  // READ - Get user by username
  async getUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  },

  // UPDATE - Update user
  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  // DELETE - Delete user
  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};

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
};

// ================================
// TRANSACTION EXAMPLE
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
};

// Don't forget to disconnect Prisma when your application shuts down
const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

module.exports = {
  userQueries,
  categoryQueries,
  productQueries,
  inventoryQueries,
  orderQueries,
  orderItemQueries,
  utilityQueries,
  transactionExamples,
  disconnectPrisma,
};
