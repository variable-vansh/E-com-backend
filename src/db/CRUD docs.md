# CRUD Operations

## Setup

```javascript
const { userQueries, productQueries, orderQueries } = require("./index.js");
```

## Users

```javascript
// Create
await userQueries.createUser({
  username: "john_doe",
  password: "secure_password",
  email: "john@example.com",
  role: "CUSTOMER", // CUSTOMER, ADMIN, SHOPKEEPER
});

// Read
await userQueries.getAllUsers();
await userQueries.getUserById(1);
await userQueries.getUserByEmail("john@example.com");

// Update
await userQueries.updateUser(1, { username: "new_username" });

// Delete
await userQueries.deleteUser(1);
```

## Categories

```javascript
// Create
await categoryQueries.createCategory({ name: "Electronics" });
await categoryQueries.createCategory({ name: "Smartphones", parentId: 1 });

// Read
await categoryQueries.getAllCategories();
await categoryQueries.getCategoryById(1);

// Update
await categoryQueries.updateCategory(1, { name: "Updated Name" });

// Delete
await categoryQueries.deleteCategory(1);
```

## Products

```javascript
// Create
await productQueries.createProduct({
  name: "iPhone 15 Pro",
  description: "Latest iPhone model",
  price: 999.99,
  categoryId: 1,
  isActive: true,
});

// Read
await productQueries.getAllProducts();
await productQueries.getActiveProducts();
await productQueries.getProductById(1);
await productQueries.getProductsByCategory(1);
await productQueries.searchProducts("iPhone");

// Update
await productQueries.updateProduct(1, { name: "Updated Name" });

// Delete
await productQueries.deleteProduct(1);
```

## Inventory

```javascript
// Create
await inventoryQueries.createInventory({
  productId: 1,
  quantity: 100,
  lowStockAlert: 10,
});

// Read
await inventoryQueries.getAllInventory();
await inventoryQueries.getInventoryByProductId(1);
await inventoryQueries.getLowStockItems();

// Update
await inventoryQueries.updateInventory(1, { quantity: 150 });
await inventoryQueries.reserveStock(1, 5);
await inventoryQueries.releaseReservedStock(1, 3);

// Delete
await inventoryQueries.deleteInventory(1);
```

## Orders

```javascript
// Create
await orderQueries.createOrder({
  orderNumber: "ORD-2025-001",
  userId: 1,
  totalAmount: 999.99,
  customerName: "Jane Doe",
  customerEmail: "jane@example.com",
  shippingAddress: "456 Market St",
  city: "San Francisco",
  state: "CA",
  postalCode: "94105",
  orderItems: [{ productId: 1, quantity: 2, unitPrice: 999.99 }],
});

// Read
await orderQueries.getAllOrders();
await orderQueries.getOrderById(1);
await orderQueries.getOrdersByUserId(1);
await orderQueries.getOrdersByStatus("PENDING");

// Update
await orderQueries.updateOrderStatus(1, "SHIPPED");
await orderQueries.updatePaymentStatus(1, "PAID");

// Delete
await orderQueries.deleteOrder(1);
```

## Enums

- **UserRole**: CUSTOMER, ADMIN, SHOPKEEPER
- **OrderStatus**: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- **PaymentMethod**: CASH_ON_DELIVERY, CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET
- **PaymentStatus**: PENDING, PAID, FAILED, REFUNDED

## Error Handling

```javascript
try {
  const user = await userQueries.createUser(userData);
} catch (error) {
  console.error("Error:", error);
}
```
