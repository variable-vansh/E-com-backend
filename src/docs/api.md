# E-Commerce API Documentation

## Base URL

`http://localhost:3000/api`

## Health Check

- **GET /health**
  - Checks the server status.

## Users

- **GET /users**
  - Get all users.
- **GET /users/:id**
  - Get a user by ID.
- **POST /users**
  - Create a new user.
- **PUT /users/:id**
  - Update a user.
- **DELETE /users/:id**
  - Delete a user.

## Categories

- **GET /categories**
  - Get all categories.
- **GET /categories/:id**
  - Get a category by ID.
- **POST /categories**
  - Create a new category.
- **PUT /categories/:id**
  - Update a category.
- **DELETE /categories/:id**
  - Delete a category.

## Products

- **GET /products**
  - Get all products.
- **GET /products/search?q={query}**
  - Search for products.
- **GET /products/:id**
  - Get a product by ID.
- **POST /products**
  - Create a new product.
- **PUT /products/:id**
  - Update a product.
- **DELETE /products/:id**
  - Delete a product.

## Inventory

- **GET /inventory**
  - Get all inventory.
- **GET /inventory/:productId**
  - Get inventory by product ID.
- **POST /inventory**
  - Create inventory.
- **PUT /inventory/:productId**
  - Update inventory.
- **DELETE /inventory/:productId**
  - Delete inventory.

## Orders

- **GET /orders**
  - Get all orders.
- **GET /orders/:id**
  - Get an order by ID.
- **POST /orders**
  - Create a new order.
- **PATCH /orders/:id/status**
  - Update order status.
- **DELETE /orders/:id**
  - Delete an order.
