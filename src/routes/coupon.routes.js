// ================================
// COUPON ROUTES
// ================================
// This file defines all HTTP routes for coupon operations

const express = require("express");
const router = express.Router();
const {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getApplicableAdditionalItemCoupons,
  getCouponStats,
} = require("../controllers/coupon.controller");
const { requireAdmin } = require("../middleware");

// ================================
// PUBLIC ROUTES (for frontend order processing)
// ================================

/**
 * Validate a coupon code for order processing
 * POST /api/coupons/validate
 * Body: { code, orderAmount, userId?, items? }
 */
router.post("/validate", validateCoupon);

/**
 * Get applicable additional item coupons for order amount
 * GET /api/coupons/additional-items?orderAmount=1500
 */
router.get("/additional-items", getApplicableAdditionalItemCoupons);

/**
 * Apply a coupon to an order (record usage)
 * POST /api/coupons/apply
 * Body: { couponId, orderId, userId?, orderAmount }
 */
router.post("/apply", applyCoupon);

// ================================
// ADMIN ROUTES (for coupon management)
// ================================

/**
 * Get all coupons with filtering and pagination
 * GET /api/coupons?type=discount_code&active=true&page=1&limit=10&search=diwali
 */
router.get("/", getAllCoupons);

/**
 * Get a specific coupon by ID
 * GET /api/coupons/:id
 */
router.get("/:id", requireAdmin, getCouponById);

/**
 * Get coupon usage statistics
 * GET /api/coupons/:id/stats
 */
router.get("/:id/stats", requireAdmin, getCouponStats);

/**
 * Create a new coupon
 * POST /api/coupons
 * Body: { type, name, description?, isActive?, productId?, minOrderAmount?, code?, discountAmount?, minOrderAmountForDiscount? }
 */
router.post("/", requireAdmin, createCoupon);

/**
 * Update an existing coupon
 * PUT /api/coupons/:id
 * PATCH /api/coupons/:id
 * Body: { name?, description?, isActive?, productId?, minOrderAmount?, code?, discountAmount?, minOrderAmountForDiscount? }
 */
router.put("/:id", requireAdmin, updateCoupon);
router.patch("/:id", requireAdmin, updateCoupon);

/**
 * Delete a coupon
 * DELETE /api/coupons/:id
 */
router.delete("/:id", requireAdmin, deleteCoupon);

module.exports = router;
