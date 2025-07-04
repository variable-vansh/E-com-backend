# E-Commerce Backend CRUD Operations

This document provides comprehensive CRUD (Create, Read, Update, Delete) operations for all tables in the e-commerce Prisma schema.

## Table of Contents

1. [Setup](#setup)
2. [User Operations](#user-operations)
3. [Category Operations](#category-operations)
4. [Product Operations](#product-operations)
5. [Inventory Operations](#inventory-operations)
6. [Order Operations](#order-operations)
7. [Order Item Operations](#order-item-operations)
8. [Utility Functions](#utility-functions)
9. [Advanced Queries](#advanced-queries)
10. [Transaction Examples](#transaction-examples)

## Setup

```typescript
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();
```

## User Operations

### Create User

```typescript
const user = await userQueries.createUser({
  username: "john_doe",
  password: "hashedPassword123",
  email: "john@example.com",
  role: "CUSTOMER", // Optional: CUSTOMER, ADMIN, SHOPKEEPER
});
```

### Read Operations

```typescript
// Get all users
const users = await userQueries.getAllUsers();

// Get user by ID
const user = await userQueries.getUserById(1);

// Get user by email
const user = await userQueries.getUserByEmail("john@example.com");

// Get user by username
const user = await userQueries.getUserByUsername("john_doe");
```

### Update User

```typescript
const updatedUser = await userQueries.updateUser(1, {
  username: "new_username",
  email: "newemail@example.com",
  role: "ADMIN",
});
```

### Delete User

```typescript
const deletedUser = await userQueries.deleteUser(1);
```

## Category Operations

### Create Category

```typescript
// Root category
const category = await categoryQueries.createCategory({
  name: "Electronics",
});

// Subcategory
const subcategory = await categoryQueries.createCategory({
  name: "Smartphones",
  parentId: 1,
});
```

### Read Operations

```typescript
// Get all categories
const categories = await categoryQueries.getAllCategories();

// Get category by ID
const category = await categoryQueries.getCategoryById(1);

// Get root categories (no parent)
const rootCategories = await categoryQueries.getRootCategories();

// Get subcategories
const subcategories = await categoryQueries.getSubcategories(1);
```

### Update Category

```typescript
const updatedCategory = await categoryQueries.updateCategory(1, {
  name: "Updated Category Name",
  parentId: 2,
});
```

### Delete Category

```typescript
const deletedCategory = await categoryQueries.deleteCategory(1);
```

## Product Operations

### Create Product

```typescript
const product = await productQueries.createProduct({
  name: "iPhone 15 Pro",
  description: "Latest iPhone model",
  price: 999.99,
  categoryId: 1,
  isActive: true,
});
```

### Read Operations

```typescript
// Get all products
const products = await productQueries.getAllProducts();

// Get active products only
const activeProducts = await productQueries.getActiveProducts();

// Get product by ID
const product = await productQueries.getProductById(1);

// Get products by category
const categoryProducts = await productQueries.getProductsByCategory(1);

// Search products
const searchResults = await productQueries.searchProducts("iPhone");
```

### Update Product

```typescript
const updatedProduct = await productQueries.updateProduct(1, {
  name: "Updated Product Name",
  price: 1099.99,
  isActive: false,
});
```

### Delete Product

```typescript
const deletedProduct = await productQueries.deleteProduct(1);
```

## Inventory Operations

### Create Inventory

```typescript
const inventory = await inventoryQueries.createInventory({
  productId: 1,
  quantity: 100,
  reservedQuantity: 0,
  lowStockAlert: 10,
});
```

### Read Operations

```typescript
// Get all inventory
const inventory = await inventoryQueries.getAllInventory();

// Get inventory by product ID
const productInventory = await inventoryQueries.getInventoryByProductId(1);

// Get low stock items
const lowStockItems = await inventoryQueries.getLowStockItems();
```

### Update Operations

```typescript
// Update inventory
const updatedInventory = await inventoryQueries.updateInventory(1, {
  quantity: 150,
  lowStockAlert: 15,
});

// Reserve stock
const reservedStock = await inventoryQueries.reserveStock(1, 5);

// Release reserved stock
const releasedStock = await inventoryQueries.releaseReservedStock(1, 3);
```

### Delete Inventory

```typescript
const deletedInventory = await inventoryQueries.deleteInventory(1);
```

## Order Operations

### Create Order

```typescript
const order = await orderQueries.createOrder({
  orderNumber: "ORD-2025-001",
  userId: 1,
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
      productId: 1,
      quantity: 1,
      unitPrice: 999.99,
    },
  ],
});
```

### Read Operations

```typescript
// Get all orders
const orders = await orderQueries.getAllOrders();

// Get order by ID
const order = await orderQueries.getOrderById(1);

// Get order by order number
const order = await orderQueries.getOrderByOrderNumber("ORD-2025-001");

// Get orders by user ID
const userOrders = await orderQueries.getOrdersByUserId(1);

// Get orders by status
const pendingOrders = await orderQueries.getOrdersByStatus("PENDING");
```

### Update Operations

```typescript
// Update order status
const updatedOrder = await orderQueries.updateOrderStatus(1, "SHIPPED");

// Update payment status
const updatedPayment = await orderQueries.updatePaymentStatus(1, "PAID");

// Update order details
const updatedOrder = await orderQueries.updateOrder(1, {
  customerName: "John Smith",
  phone: "+1987654321",
});
```

### Delete Order

```typescript
const deletedOrder = await orderQueries.deleteOrder(1);
```

## Order Item Operations

### Create Order Item

```typescript
const orderItem = await orderItemQueries.createOrderItem({
  orderId: 1,
  productId: 1,
  quantity: 2,
  unitPrice: 999.99,
});
```

### Read Operations

```typescript
// Get all order items
const orderItems = await orderItemQueries.getAllOrderItems();

// Get order item by ID
const orderItem = await orderItemQueries.getOrderItemById(1);

// Get order items by order ID
const orderItems = await orderItemQueries.getOrderItemsByOrderId(1);

// Get order items by product ID
const orderItems = await orderItemQueries.getOrderItemsByProductId(1);
```

### Update Order Item

```typescript
const updatedOrderItem = await orderItemQueries.updateOrderItem(1, {
  quantity: 3,
  unitPrice: 899.99,
});
```

### Delete Order Item

```typescript
const deletedOrderItem = await orderItemQueries.deleteOrderItem(1);
```

## Utility Functions

### Dashboard Statistics

```typescript
const stats = await utilityQueries.getDashboardStats();
// Returns: totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders, lowStockProducts
```

### Sales Report

```typescript
const startDate = new Date("2025-01-01");
const endDate = new Date("2025-12-31");
const salesReport = await utilityQueries.getSalesReport(startDate, endDate);
```

### Top Selling Products

```typescript
const topProducts = await utilityQueries.getTopSellingProducts(10);
```

## Advanced Queries

### Order Analytics

```typescript
const orderAnalytics = await advancedQueries.getOrderAnalytics();
// Or for specific user:
const userOrderAnalytics = await advancedQueries.getOrderAnalytics(userId);
```

### Products with Stock Status

```typescript
const productsWithStock = await advancedQueries.getProductsWithStockStatus();
```

### User Activity Summary

```typescript
const userActivity = await advancedQueries.getUserActivitySummary(userId);
```

### Inventory Alerts

```typescript
const inventoryAlerts = await advancedQueries.getInventoryAlerts();
```

## Transaction Examples

### Create Order with Inventory Update

```typescript
const orderWithInventory =
  await transactionExamples.createOrderWithInventoryUpdate({
    orderNumber: "ORD-2025-002",
    userId: 1,
    totalAmount: 1999.98,
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    shippingAddress: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90210",
    orderItems: [
      {
        productId: 1,
        quantity: 2,
        unitPrice: 999.99,
      },
    ],
  });
```

## Enums

### UserRole

- `CUSTOMER`
- `ADMIN`
- `SHOPKEEPER`

### OrderStatus

- `PENDING`
- `CONFIRMED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `REFUNDED`

### PaymentMethod

- `CASH_ON_DELIVERY`
- `CREDIT_CARD`
- `DEBIT_CARD`
- `UPI`
- `NET_BANKING`
- `WALLET`

### PaymentStatus

- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

## Error Handling

All CRUD operations should be wrapped in try-catch blocks:

```typescript
try {
  const user = await userQueries.createUser(userData);
  console.log("User created:", user);
} catch (error) {
  console.error("Error creating user:", error);
}
```

## Cleanup

Always disconnect Prisma when your application shuts down:

```typescript
await disconnectPrisma();
```

## Best Practices

1. **Use Transactions**: For operations that involve multiple tables (like creating orders with inventory updates)
2. **Validate Data**: Always validate input data before database operations
3. **Handle Errors**: Implement proper error handling for all database operations
4. **Use Indexes**: Ensure proper database indexes for frequently queried fields
5. **Pagination**: Implement pagination for large result sets
6. **Security**: Hash passwords, validate user permissions, sanitize inputs
7. **Logging**: Log important operations for debugging and auditing
