const {
  userQueries,
  categoryQueries,
  productQueries,
  inventoryQueries,
  orderQueries,
  transactionExamples,
  disconnectPrisma,
} = require("./index.js");

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

    // Create a new order using transaction
    const newOrder = await transactionExamples.createOrderWithInventoryUpdate({
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
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await disconnectPrisma();
  }
}

// Run examples
exampleUsage();
