# Step-by-Step Admin Dashboard Creation Prompts

## STEP 1: Basic Layout and Users Management

Create a React Admin Dashboard with basic layout and Users CRUD functionality.

### Setup Requirements:
- Create React app with modern UI library (Material-UI or Ant Design)
- Setup React Router for navigation
- Backend API Base URL: `http://localhost:3000/api`

### Layout Components:
1. **Sidebar Navigation** with links: Dashboard, Users, Categories, Products, Inventory, Orders
2. **Header** with title "E-commerce Admin"
3. **Main Content Area** for displaying pages

### Users Management (Complete CRUD):
**API Endpoints:**
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID  
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

**User Form Fields:**
```javascript
{
  username: "string (required)",
  email: "string (required)",
  password: "string (required for create only)", 
  role: "CUSTOMER | ADMIN | SHOPKEEPER (dropdown, defaults to CUSTOMER)"
}
```

**Features to implement:**
- Users table with columns: ID, Username, Email, Role, Created At, Actions
- Add User button opening a modal form
- Edit User functionality (inline or modal)
- Delete User with confirmation dialog
- Form validation (required fields, email format)
- Loading states and error handling
- Success/error toast notifications

Create the complete layout structure and fully functional Users management before proceeding to Step 2.


---

## STEP 2: Categories and Products Management

Add Categories and Products management to the existing dashboard.

### Categories Management:
**API Endpoints:**
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get category by ID
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

**Category Form Fields:**
```javascript
{
  name: "string (required)",
  parentId: "number (optional, dropdown of existing categories for subcategories)"
}
```

**Features:**
- Categories table: ID, Name, Parent Category, Actions
- Create/Edit category modal forms
- Delete with confirmation
- Show category hierarchy (parent-child relationships)

### Products Management:
**API Endpoints:**
- GET `/api/products` - Get all products
- GET `/api/products/search?q={query}` - Search products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

**Product Form Fields:**
```javascript
{
  name: "string (required)",
  description: "string (optional, textarea)",
  price: "number (required, decimal)",
  categoryId: "number (required, dropdown populated from categories API)",
  isActive: "boolean (checkbox, defaults to true)"
}
```

**Features:**
- Products table: ID, Name, Description, Price, Category Name, Status, Actions
- Search functionality for products
- Create/Edit product modal forms with category dropdown
- Price formatting (currency display)
- Active/Inactive status toggle

Add these two new sections to your existing dashboard with the same UI patterns as Users.

---

## STEP 3: Inventory Management

Add Inventory management functionality to track product stock levels.

### Inventory Management:
**API Endpoints:**
- GET `/api/inventory` - Get all inventory
- GET `/api/inventory/:productId` - Get inventory by product ID
- POST `/api/inventory` - Create inventory record
- PUT `/api/inventory/:productId` - Update inventory
- DELETE `/api/inventory/:productId` - Delete inventory

**Inventory Form Fields:**
```javascript
{
  productId: "number (required, dropdown populated from products API)",
  quantity: "number (required, current stock)",
  reservedQuantity: "number (optional, defaults to 0)", 
  lowStockAlert: "number (optional, defaults to 10)"
}
```

**Features:**
- Inventory table: Product Name, Current Stock, Reserved Stock, Available Stock (calculated), Low Stock Alert, Last Updated, Actions
- Create inventory for products that don't have inventory records
- Update stock quantities
- Visual indicators for low stock items (red highlighting when current stock <= low stock alert)
- Stock calculations: Available Stock = Current Stock - Reserved Stock
- Bulk stock update functionality (optional)

**Additional UI Enhancements:**
- Add stock status badges (In Stock, Low Stock, Out of Stock)
- Color-coded stock levels (green = good, yellow = low, red = out of stock)
- Quick stock adjustment buttons (+/-) for common operations

Ensure inventory data shows product names instead of just product IDs by joining with product data from the API response.

---

## STEP 4: Orders Management and Dashboard Polish

Add Orders management and final dashboard enhancements.

### Orders Management:
**API Endpoints:**
- GET `/api/orders` - Get all orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders` - Create order (optional for admin)
- PATCH `/api/orders/:id/status` - Update order status
- DELETE `/api/orders/:id` - Delete order

**Order Status Options:** PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED

**Order Display Features:**
- Orders table: Order Number, Customer Name, Customer Email, Total Amount, Status, Order Date, Actions
- Order status badges with color coding
- Order details modal/page showing:
  - Customer information
  - Shipping address
  - Order items list with product names, quantities, prices
  - Order timeline/history
- Quick status update dropdown in table
- Order filtering by status
- Date range filtering for orders

**Order Status Update:**
```javascript
// PATCH /api/orders/:id/status
{
  status: "SHIPPED" // or other status
}
```

### Dashboard Enhancements:
1. **Dashboard Homepage** with:
   - Summary cards: Total Users, Total Products, Total Orders, Revenue
   - Recent orders table
   - Low stock alerts
   - Order status distribution chart (optional)

2. **Final Polish:**
   - Consistent styling across all pages
   - Responsive design for mobile devices
   - Loading states for all API calls
   - Error boundaries for better error handling
   - Search and filter functionality where appropriate
   - Pagination for large data sets
   - Export functionality (CSV) for tables (optional)

3. **Navigation Improvements:**
   - Active state highlighting in sidebar
   - Breadcrumb navigation
   - Quick actions toolbar

Complete the Orders management and add these final touches to create a professional admin dashboard.

---

## Common Technical Guidelines for All Steps:

### API Integration:
```javascript
// Error handling format from backend
{
  "error": "Error message"
}

// Status codes: 200 (Success), 201 (Created), 204 (No Content), 404 (Not Found), 500 (Server Error)
```

### Sample API Service Pattern:
```javascript
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`http://localhost:3000/api${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }
    
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### Form Validation Requirements:
- Required field validation
- Email format validation for user emails
- Number validation for prices and quantities
- Custom error messages for better UX

### UI Consistency:
- Use the same modal pattern for all create/edit forms
- Consistent button styles and colors
- Same loading spinner design
- Uniform table styling
- Consistent toast notification positioning

Complete each step fully before moving to the next. Each step should be a working, testable increment of functionality.
