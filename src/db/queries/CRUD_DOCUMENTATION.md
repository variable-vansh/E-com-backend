# CRUD Operations Quick Reference

## Setup

```javascript
const { userQueries, productQueries, orderQueries } = require("./index.js");
```

## User Operations

### Create User

```javascript
const user = await userQueries.createUser({
  username: "john_doe",
  password: "secure_password",
  email: "john@example.com",
  role: "CUSTOMER", // Optional: CUSTOMER, ADMIN, SHOPKEEPER
});
```

### Read Operations

```javascript
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

```javascript
const updatedUser = await userQueries.updateUser(1, {
  username: "new_username",
  role: "ADMIN",
});
```

### Delete User

```javascript
const deletedUser = await userQueries.deleteUser(1);
```

## Category Operations

### Create Category

```javascript
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

```javascript
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

```javascript
const updatedCategory = await categoryQueries.updateCategory(1, {
  name: "Updated Category Name",
  parentId: 2,
});
```

### Delete Category

```javascript
const deletedCategory = await categoryQueries.deleteCategory(1);
```

## Product Operations

### Create Product

```javascript
const product = await productQueries.createProduct({
  name: "iPhone 15 Pro",
  description: "The latest iPhone model.",
  price: 999.99,
  categoryId: 1,
  isActive: true,
});
```

### Read Operations

```javascript
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

```javascript
const updatedProduct = await productQueries.updateProduct(1, {
  name: "Updated Product Name",
  isActive: false,
});
```

### Delete Product

```javascript
const deletedProduct = await productQueries.deleteProduct(1);
```

## Inventory Operations

### Create Inventory

```javascript
const inventory = await inventoryQueries.createInventory({
  productId: 1,
  quantity: 100,
  lowStockAlert: 10,
});
```

### Read Operations

```javascript
// Get all inventory
const inventory = await inventoryQueries.getAllInventory();

// Get inventory by product ID
const productInventory = await inventoryQueries.getInventoryByProductId(1);

// Get low stock items
const lowStockItems = await inventoryQueries.getLowStockItems();
```

### Update Operations

```javascript
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

```javascript
const deletedInventory = await inventoryQueries.deleteInventory(1);
```

## Order Operations

### Create Order

```javascript
const order = await orderQueries.createOrder({
  orderNumber: "ORD-2025-001",
  userId: 1,
  totalAmount: 1999.98,
  customerName: "Jane Doe",
  customerEmail: "jane@example.com",
  shippingAddress: "456 Market St",
  city: "San Francisco",
  state: "CA",
  postalCode: "94105",
  orderItems: [{ productId: 1, quantity: 2, unitPrice: 999.99 }],
});
```

### Read Operations

```javascript
// Get all orders
const orders = await orderQueries.getAllOrders();

// Get order by ID
const order = await orderQueries.getOrderById(1);

// Get orders by user ID
const userOrders = await orderQueries.getOrdersByUserId(1);

// Get orders by status
const pendingOrders = await orderQueries.getOrdersByStatus("PENDING");
```

### Update Order

```javascript
// Update order status
const updatedOrder = await orderQueries.updateOrderStatus(1, "SHIPPED");

// Update payment status
const paidOrder = await orderQueries.updatePaymentStatus(1, "PAID");
```

### Delete Order

```javascript
const deletedOrder = await orderQueries.deleteOrder(1);
```

## Transaction Examples

### Create Order with Inventory Update

This example demonstrates a transaction where an order is created and the product inventory is updated atomically.

```javascript
const orderData = {
  orderNumber: "ORD-2025-002",
  userId: 1,
  totalAmount: 999.99,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  shippingAddress: "123 Main St",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  orderItems: [{ productId: 1, quantity: 1, unitPrice: 999.99 }],
};

const newOrder = await transactionExamples.createOrderWithInventoryUpdate(
  orderData
);
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

```javascript
try {
  const user = await userQueries.createUser(userData);
  console.log("User created:", user);
} catch (error) {
  console.error("Error creating user:", error);
}
```

## Cleanup

Always disconnect Prisma when your application shuts down:

```javascript
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
