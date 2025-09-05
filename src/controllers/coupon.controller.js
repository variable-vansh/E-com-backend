// ================================
// COUPON CONTROLLER
// ================================
// This file contains all HTTP request handlers for coupon operations

const { couponQueries } = require("../db/queries");

/**
 * Get all coupons with optional filtering and pagination
 * GET /api/coupons?type=discount_code&active=true&page=1&limit=10&search=diwali
 */
const getAllCoupons = async (req, res) => {
  try {
    const options = {
      type: req.query.type,
      active: req.query.active,
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      search: req.query.search,
    };

    const result = await couponQueries.getAllCoupons(options);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get all coupons error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch coupons",
        details: error.message,
      },
    });
  }
};

/**
 * Get a single coupon by ID
 * GET /api/coupons/:id
 */
const getCouponById = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid coupon ID",
        },
      });
    }

    const coupon = await couponQueries.getCouponById(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COUPON_NOT_FOUND",
          message: "Coupon not found",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("Get coupon by ID error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch coupon",
        details: error.message,
      },
    });
  }
};

/**
 * Create a new coupon
 * POST /api/coupons
 */
const createCoupon = async (req, res) => {
  try {
    const couponData = req.body;

    // Basic validation
    if (!couponData.type || !couponData.name) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_REQUIRED_FIELDS",
          message: "Coupon type and name are required",
        },
      });
    }

    // Validate coupon type
    const validTypes = ["additional_item", "discount_code"];
    if (!validTypes.includes(couponData.type)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_COUPON_TYPE",
          message:
            "Coupon type must be either additional_item or discount_code",
        },
      });
    }

    const newCoupon = await couponQueries.createCoupon(couponData);

    res.status(201).json({
      success: true,
      data: newCoupon,
      message: "Coupon created successfully",
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    // Handle specific error cases
    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        error: {
          code: "DUPLICATE_COUPON_CODE",
          message: error.message,
        },
      });
    }

    if (error.message.includes("required")) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_REQUIRED_FIELDS",
          message: error.message,
        },
      });
    }

    if (error.message.includes("not found")) {
      return res.status(400).json({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: error.message,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create coupon",
        details: error.message,
      },
    });
  }
};

/**
 * Update an existing coupon
 * PUT /api/coupons/:id
 * PATCH /api/coupons/:id
 */
const updateCoupon = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);
    const updateData = req.body;

    if (isNaN(couponId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid coupon ID",
        },
      });
    }

    const updatedCoupon = await couponQueries.updateCoupon(
      couponId,
      updateData
    );

    res.status(200).json({
      success: true,
      data: updatedCoupon,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COUPON_NOT_FOUND",
          message: error.message,
        },
      });
    }

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        error: {
          code: "DUPLICATE_COUPON_CODE",
          message: error.message,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update coupon",
        details: error.message,
      },
    });
  }
};

/**
 * Delete a coupon
 * DELETE /api/coupons/:id
 */
const deleteCoupon = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid coupon ID",
        },
      });
    }

    await couponQueries.deleteCoupon(couponId);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COUPON_NOT_FOUND",
          message: error.message,
        },
      });
    }

    if (error.message.includes("has been used")) {
      return res.status(400).json({
        success: false,
        error: {
          code: "COUPON_IN_USE",
          message: error.message,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to delete coupon",
        details: error.message,
      },
    });
  }
};

/**
 * Validate a coupon for order processing
 * POST /api/coupons/validate
 */
const validateCoupon = async (req, res) => {
  try {
    const validationData = req.body;

    if (!validationData.code) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_COUPON_CODE",
          message: "Coupon code is required",
        },
      });
    }

    if (!validationData.orderAmount) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_ORDER_AMOUNT",
          message: "Order amount is required",
        },
      });
    }

    const validation = await couponQueries.validateCoupon(validationData);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: {
          code: validation.error,
          message: validation.message,
        },
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      coupon: {
        id: validation.coupon.id,
        type: validation.coupon.type,
        name: validation.coupon.name,
        ...(validation.coupon.type === "discount_code" && {
          discountAmount: validation.coupon.discountAmount,
        }),
        ...(validation.coupon.type === "additional_item" && {
          productId: validation.coupon.productId,
          productName: validation.coupon.productName,
        }),
      },
      discountAmount: validation.discountAmount,
      ...(validation.freeProduct && { freeProduct: validation.freeProduct }),
      message: validation.message,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to validate coupon",
        details: error.message,
      },
    });
  }
};

/**
 * Apply a coupon to an order
 * POST /api/coupons/apply
 */
const applyCoupon = async (req, res) => {
  try {
    const applicationData = req.body;

    if (!applicationData.couponId || !applicationData.orderId) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_REQUIRED_FIELDS",
          message: "Coupon ID and Order ID are required",
        },
      });
    }

    const result = await couponQueries.applyCoupon(applicationData);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);

    if (error.message.includes("already applied")) {
      return res.status(400).json({
        success: false,
        error: {
          code: "COUPON_ALREADY_APPLIED",
          message: error.message,
        },
      });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COUPON_NOT_FOUND",
          message: error.message,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to apply coupon",
        details: error.message,
      },
    });
  }
};

/**
 * Get applicable additional item coupons for an order amount
 * GET /api/coupons/additional-items?orderAmount=1500
 */
const getApplicableAdditionalItemCoupons = async (req, res) => {
  try {
    const orderAmount = parseFloat(req.query.orderAmount);

    if (isNaN(orderAmount) || orderAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ORDER_AMOUNT",
          message: "Valid order amount is required",
        },
      });
    }

    const coupons = await couponQueries.getApplicableAdditionalItemCoupons(
      orderAmount
    );

    res.status(200).json({
      success: true,
      data: coupons,
      message:
        coupons.length > 0
          ? `Found ${coupons.length} applicable additional item coupons`
          : "No additional item coupons available for this order amount",
    });
  } catch (error) {
    console.error("Get applicable additional item coupons error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch applicable coupons",
        details: error.message,
      },
    });
  }
};

/**
 * Get coupon usage statistics
 * GET /api/coupons/:id/stats
 */
const getCouponStats = async (req, res) => {
  try {
    const couponId = parseInt(req.params.id);

    if (isNaN(couponId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: "Invalid coupon ID",
        },
      });
    }

    const stats = await couponQueries.getCouponUsageStats(couponId);

    res.status(200).json({
      success: true,
      data: {
        couponId,
        ...stats,
      },
    });
  } catch (error) {
    console.error("Get coupon stats error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch coupon statistics",
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getApplicableAdditionalItemCoupons,
  getCouponStats,
};
