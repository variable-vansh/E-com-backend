// ================================
// MAIN QUERIES INDEX
// ================================
// This file aggregates all query modules for easy importing

const userQueries = require("./user.queries");
const categoryQueries = require("./category.queries");
const productQueries = require("./product.queries");
const grainQueries = require("./grain.queries");
const inventoryQueries = require("./inventory.queries");
const orderQueries = require("./order.queries");
const orderItemQueries = require("./order-item.queries");
const promoQueries = require("./promo.queries");
const couponQueries = require("./coupon.queries");
const utilityQueries = require("./utility.queries");
const transactionExamples = require("./transaction.queries");

// Export all queries grouped by entity
module.exports = {
  // Individual query modules
  userQueries,
  categoryQueries,
  productQueries,
  grainQueries,
  inventoryQueries,
  orderQueries,
  orderItemQueries,
  promoQueries,
  couponQueries,
  utilityQueries,
  transactionExamples,

  // Convenience methods for backwards compatibility
  ...userQueries,
  ...categoryQueries,
  ...productQueries,
  ...grainQueries,
  ...inventoryQueries,
  ...orderQueries,
  ...orderItemQueries,
  ...promoQueries,
  ...utilityQueries,
  ...transactionExamples,

  // Utility function
  disconnectPrisma: utilityQueries.disconnectPrisma,
};
