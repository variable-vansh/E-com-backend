import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// ================================
// USER CRUD OPERATIONS
// ================================

export const userQueries = {
  // CREATE - Create a new user
  async createUser(data: {
    username: string;
    password: string;
    email: string;
    role?: "CUSTOMER" | "ADMIN" | "SHOPKEEPER";
  }) {
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
  async getUserById(id: number) {
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
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        orders: true,
      },
    });
  },

  // READ - Get user by username
  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
    });
  },

  // UPDATE - Update user
  async updateUser(
    id: number,
    data: {
      username?: string;
      password?: string;
      email?: string;
      role?: "CUSTOMER" | "ADMIN" | "SHOPKEEPER";
    }
  ) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  // DELETE - Delete user
  async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};

// ================================
// CATEGORY CRUD OPERATIONS
// ================================

export const categoryQueries = {
  // CREATE - Create a new category
  async createCategory(data: { name: string; parentId?: number }) {
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
  async getCategoryById(id: number) {
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
  async getSubcategories(parentId: number) {
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
  async updateCategory(
    id: number,
    data: {
      name?: string;
      parentId?: number;
    }
  ) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  // DELETE - Delete category
  async deleteCategory(id: number) {
    return await prisma.category.delete({
      where: { id },
    });
  },
};

// ================================
// PRODUCT CRUD OPERATIONS
// ================================

export const productQueries = {
  // CREATE - Create a new product
  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
    isActive?: boolean;
  }) {
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
  async getProductById(id: number) {
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
  async getProductsByCategory(categoryId: number) {
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
  async searchProducts(searchTerm: string) {
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
  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: number;
      isActive?: boolean;
    }
  ) {
    const updateData: any = { ...data };
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
  async deleteProduct(id: number) {
    return await prisma.product.delete({
      where: { id },
    });
  },
};

// ================================
// INVENTORY CRUD OPERATIONS
// ================================

export const inventoryQueries = {
  // CREATE - Create inventory for a product
  async createInventory(data: {
    productId: number;
    quantity?: number;
    reservedQuantity?: number;
    lowStockAlert?: number;
  }) {
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
  async getInventoryByProductId(productId: number) {
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
  async updateInventory(
    productId: number,
    data: {
      quantity?: number;
      reservedQuantity?: number;
      lowStockAlert?: number;
    }
  ) {
    return await prisma.inventory.update({
      where: { productId },
      data,
      include: {
        product: true,
      },
    });
  },

  // UPDATE - Reserve stock
  async reserveStock(productId: number, quantity: number) {
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
  async releaseReservedStock(productId: number, quantity: number) {
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
  async deleteInventory(productId: number) {
    return await prisma.inventory.delete({
      where: { productId },
    });
  },
};

// ================================
// ORDER CRUD OPERATIONS
// ================================

export const orderQueries = {
  // CREATE - Create a new order
  async createOrder(data: {
    orderNumber: string;
    userId: number;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    phone?: string;
    shippingAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    paymentMethod?:
      | "CASH_ON_DELIVERY"
      | "CREDIT_CARD"
      | "DEBIT_CARD"
      | "UPI"
      | "NET_BANKING"
      | "WALLET";
    notes?: string;
    orderItems: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
    }>;
  }) {
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
  async getOrderById(id: number) {
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
  async getOrderByOrderNumber(orderNumber: string) {
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
  async getOrdersByUserId(userId: number) {
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
  async getOrdersByStatus(
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
      | "REFUNDED"
  ) {
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
  async updateOrderStatus(
    id: number,
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
      | "REFUNDED"
  ) {
    const updateData: any = { status };

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
  async updatePaymentStatus(
    id: number,
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  ) {
    return await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
  },

  // UPDATE - Update order details
  async updateOrder(
    id: number,
    data: {
      customerName?: string;
      customerEmail?: string;
      phone?: string;
      shippingAddress?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      paymentMethod?:
        | "CASH_ON_DELIVERY"
        | "CREDIT_CARD"
        | "DEBIT_CARD"
        | "UPI"
        | "NET_BANKING"
        | "WALLET";
      notes?: string;
    }
  ) {
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
  async deleteOrder(id: number) {
    return await prisma.order.delete({
      where: { id },
    });
  },
};

// ================================
// ORDER ITEM CRUD OPERATIONS
// ================================

export const orderItemQueries = {
  // CREATE - Add item to order
  async createOrderItem(data: {
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
  }) {
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
  async getOrderItemById(id: number) {
    return await prisma.orderItem.findUnique({
      where: { id },
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

  // READ - Get order items by order ID
  async getOrderItemsByOrderId(orderId: number) {
    return await prisma.orderItem.findMany({
      where: { orderId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  },

  // READ - Get order items by product ID
  async getOrderItemsByProductId(productId: number) {
    return await prisma.orderItem.findMany({
      where: { productId },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  // UPDATE - Update order item
  async updateOrderItem(
    id: number,
    data: {
      quantity?: number;
      unitPrice?: number;
    }
  ) {
    const updateData: any = { ...data };

    if (data.unitPrice) {
      updateData.unitPrice = data.unitPrice.toString();
    }

    if (data.quantity || data.unitPrice) {
      // Recalculate total price
      const currentItem = await prisma.orderItem.findUnique({ where: { id } });
      if (currentItem) {
        const newQuantity = data.quantity || currentItem.quantity;
        const newUnitPrice =
          data.unitPrice || parseFloat(currentItem.unitPrice.toString());
        updateData.totalPrice = (newQuantity * newUnitPrice).toString();
      }
    }

    return await prisma.orderItem.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
        product: true,
      },
    });
  },

  // DELETE - Delete order item
  async deleteOrderItem(id: number) {
    return await prisma.orderItem.delete({
      where: { id },
    });
  },
};

// ================================
// UTILITY FUNCTIONS
// ================================

export const utilityQueries = {
  // Get dashboard statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.inventory.count({
        where: {
          quantity: { lte: 10 }, // Assuming 10 is low stock threshold
        },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      lowStockProducts,
    };
  },

  // Get sales report
  async getSalesReport(startDate: Date, endDate: Date) {
    return await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
          lte: endDate,
        },
        status: { not: "CANCELLED" },
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });
  },

  // Get top selling products
  async getTopSellingProducts(limit: number = 10) {
    return await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
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

export const transactionExamples = {
  // Example: Create order with inventory management
  async createOrderWithInventoryUpdate(orderData: {
    orderNumber: string;
    userId: number;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    phone?: string;
    shippingAddress: string;
    city: string;
    state: string;
    postalCode: string;
    orderItems: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
    }>;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Check inventory availability
      for (const item of orderData.orderItems) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId },
        });

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product ID: ${item.productId}`
          );
        }
      }

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: orderData.orderNumber,
          userId: orderData.userId,
          totalAmount: orderData.totalAmount.toString(),
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          phone: orderData.phone,
          shippingAddress: orderData.shippingAddress,
          city: orderData.city,
          state: orderData.state,
          postalCode: orderData.postalCode,
        },
      });

      // Create order items and update inventory
      for (const item of orderData.orderItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: (item.quantity * item.unitPrice).toString(),
          },
        });

        // Update inventory
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
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
