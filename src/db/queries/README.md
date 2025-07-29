# Database Queries Module

This directory contains all database query functions organized by entity for better maintainability and modularity.

## File Structure

```
queries/
├── index.js                    # Main export file - imports all query modules
├── user.queries.js            # User CRUD operations
├── category.queries.js         # Category CRUD operations
├── product.queries.js          # Product CRUD operations
├── inventory.queries.js        # Inventory CRUD operations
├── order.queries.js            # Order CRUD operations
├── order-item.queries.js       # Order Item CRUD operations
├── utility.queries.js          # Utility functions and dashboard stats
├── transaction.queries.js      # Transaction examples and complex operations
├── CRUD_DOCUMENTATION.md       # Detailed CRUD documentation
└── README.md                   # This file
```

## Usage

### Option 1: Import specific query modules

```javascript
const userQueries = require("./queries/user.queries");
const productQueries = require("./queries/product.queries");

// Use specific queries
const user = await userQueries.getUserById(1);
const products = await productQueries.getAllProducts();
```

### Option 2: Import all queries from index

```javascript
const queries = require("./queries");

// Access by module
const user = await queries.userQueries.getUserById(1);
const products = await queries.productQueries.getAllProducts();

// Direct access (backwards compatibility)
const user = await queries.getUserById(1);
const products = await queries.getAllProducts();
```

### Option 3: Import specific functions

```javascript
const {
  getUserById,
  getAllProducts,
  createOrder,
  getDashboardStats,
} = require("./queries");

const user = await getUserById(1);
const products = await getAllProducts();
```

## Query Modules

### User Queries (`user.queries.js`)

- `createUser(data)` - Create new user
- `getAllUsers()` - Get all users with orders
- `getUserById(id)` - Get user by ID with full order details
- `getUserByEmail(email)` - Get user by email
- `getUserByUsername(username)` - Get user by username
- `updateUser(id, data)` - Update user information
- `deleteUser(id)` - Delete user

### Category Queries (`category.queries.js`)

- `createCategory(data)` - Create new category
- `getAllCategories()` - Get all categories with hierarchy
- `getCategoryById(id)` - Get category with products and inventory
- `getRootCategories()` - Get top-level categories
- `getSubcategories(parentId)` - Get child categories
- `updateCategory(id, data)` - Update category
- `deleteCategory(id)` - Delete category

### Product Queries (`product.queries.js`)

- `createProduct(data)` - Create new product
- `getAllProducts()` - Get all products with category and inventory
- `getActiveProducts()` - Get only active products
- `getProductById(id)` - Get product with full details
- `getProductsByCategory(categoryId)` - Get products by category
- `searchProducts(searchTerm)` - Search products by name/description
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

### Inventory Queries (`inventory.queries.js`)

- `createInventory(data)` - Create inventory record
- `getAllInventory()` - Get all inventory with product details
- `getInventoryByProductId(productId)` - Get inventory for specific product
- `getLowStockItems()` - Get products with low stock
- `updateInventory(productId, data)` - Update inventory
- `reserveStock(productId, quantity)` - Reserve stock for orders
- `releaseReservedStock(productId, quantity)` - Release reserved stock
- `deleteInventory(productId)` - Delete inventory record

### Order Queries (`order.queries.js`)

- `createOrder(data)` - Create new order with items
- `getAllOrders()` - Get all orders with full details
- `getOrderById(id)` - Get order by ID
- `getOrderByOrderNumber(orderNumber)` - Get order by order number
- `getOrdersByUserId(userId)` - Get user's orders
- `getOrdersByStatus(status)` - Get orders by status
- `updateOrderStatus(id, status)` - Update order status
- `updatePaymentStatus(id, paymentStatus)` - Update payment status
- `updateOrder(id, data)` - Update order details
- `deleteOrder(id)` - Delete order

### Order Item Queries (`order-item.queries.js`)

- `createOrderItem(data)` - Add item to order
- `getAllOrderItems()` - Get all order items
- `getOrderItemById(id)` - Get order item by ID
- `getOrderItemsByOrderId(orderId)` - Get items for specific order
- `getOrderItemsByProductId(productId)` - Get order history for product
- `updateOrderItem(id, data)` - Update order item
- `deleteOrderItem(id)` - Delete order item

### Utility Queries (`utility.queries.js`)

- `getDashboardStats()` - Get dashboard statistics
- `getSalesReport(startDate, endDate)` - Get sales report
- `getTopSellingProducts(limit)` - Get top selling products
- `disconnectPrisma()` - Disconnect Prisma client

### Transaction Examples (`transaction.queries.js`)

- `createOrderWithInventoryUpdate(orderData)` - Create order and update inventory atomically
- `transferStock(fromProductId, toProductId, quantity)` - Transfer stock between products
- `cancelOrderWithInventoryRestore(orderId)` - Cancel order and restore inventory

## Benefits of This Structure

1. **Modularity**: Each entity has its own file, making it easier to find and maintain specific functionality
2. **Separation of Concerns**: Related operations are grouped together
3. **Reusability**: Individual modules can be imported where needed
4. **Maintainability**: Easier to add new features or modify existing ones
5. **Testing**: Each module can be tested independently
6. **Backwards Compatibility**: The index file ensures existing imports continue to work

## Migration from Old Structure

If you're migrating from the old `crud-queries.js` file:

### Before:

```javascript
const { userQueries, productQueries, orderQueries } = require("./crud-queries");
```

### After:

```javascript
// Option 1: Import from index (recommended)
const { userQueries, productQueries, orderQueries } = require("./queries");

// Option 2: Import individual modules
const userQueries = require("./queries/user.queries");
const productQueries = require("./queries/product.queries");
const orderQueries = require("./queries/order.queries");
```

## Adding New Queries

When adding new queries:

1. Add them to the appropriate entity file
2. If creating a new entity, create a new `.queries.js` file
3. Export the new module in `index.js`
4. Update this README with the new functionality

## Error Handling

All query functions use Prisma's built-in error handling. Make sure to wrap calls in try-catch blocks in your controllers:

```javascript
try {
  const user = await userQueries.getUserById(id);
  return user;
} catch (error) {
  console.error("Error fetching user:", error);
  throw error;
}
```
