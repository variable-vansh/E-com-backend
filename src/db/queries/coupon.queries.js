// ================================
// COUPON QUERIES
// ================================
// This file contains all database operations related to coupons

const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

/**
 * Get all coupons with optional filtering and pagination
 * @param {Object} options - Query options
 * @param {string} options.type - Filter by coupon type
 * @param {boolean} options.active - Filter by active status
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Items per page
 * @param {string} options.search - Search term for name, description, code
 * @returns {Promise<Object>} Paginated coupon results
 */
const getAllCoupons = async (options = {}) => {
  const { type, active, page = 1, limit = 10, search } = options;

  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  // Build where clause
  const where = {};

  if (type) {
    where.type = type.toUpperCase();
  }

  if (active !== undefined) {
    where.isActive = active === "true" || active === true;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get total count for pagination
  const total = await prisma.coupon.count({ where });

  // Get coupons with product details for additional_item type
  const coupons = await prisma.coupon.findMany({
    where,
    skip,
    take,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
        },
      },
      _count: {
        select: {
          couponUsages: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform response to match API specification
  const transformedCoupons = coupons.map((coupon) => ({
    id: coupon.id,
    type: coupon.type.toLowerCase(),
    name: coupon.name,
    description: coupon.description,
    isActive: coupon.isActive,
    // Additional item fields
    ...(coupon.type === "ADDITIONAL_ITEM" && {
      productId: coupon.productId,
      productName: coupon.product?.name,
      minOrderAmount: parseFloat(coupon.minOrderAmount),
    }),
    // Discount code fields
    ...(coupon.type === "DISCOUNT_CODE" && {
      code: coupon.code,
      discountAmount: parseFloat(coupon.discountAmount),
      minOrderAmountForDiscount: parseFloat(coupon.minOrderAmountForDiscount),
    }),
    usageCount: coupon._count.couponUsages,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
  }));

  return {
    data: transformedCoupons,
    pagination: {
      page: parseInt(page),
      limit: take,
      total,
      pages: Math.ceil(total / take),
    },
  };
};

/**
 * Get a single coupon by ID
 * @param {number} id - Coupon ID
 * @returns {Promise<Object|null>} Coupon object or null
 */
const getCouponById = async (id) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
        },
      },
      _count: {
        select: {
          couponUsages: true,
        },
      },
    },
  });

  if (!coupon) return null;

  // Transform response
  return {
    id: coupon.id,
    type: coupon.type.toLowerCase(),
    name: coupon.name,
    description: coupon.description,
    isActive: coupon.isActive,
    // Additional item fields
    ...(coupon.type === "ADDITIONAL_ITEM" && {
      productId: coupon.productId,
      productName: coupon.product?.name,
      minOrderAmount: parseFloat(coupon.minOrderAmount),
    }),
    // Discount code fields
    ...(coupon.type === "DISCOUNT_CODE" && {
      code: coupon.code,
      discountAmount: parseFloat(coupon.discountAmount),
      minOrderAmountForDiscount: parseFloat(coupon.minOrderAmountForDiscount),
    }),
    usageCount: coupon._count.couponUsages,
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
  };
};

/**
 * Create a new coupon
 * @param {Object} couponData - Coupon data
 * @returns {Promise<Object>} Created coupon
 */
const createCoupon = async (couponData) => {
  const {
    type,
    name,
    description,
    isActive = true,
    // Additional item fields
    productId,
    minOrderAmount,
    // Discount code fields
    code,
    discountAmount,
    minOrderAmountForDiscount,
  } = couponData;

  // Validate type-specific fields
  if (type === "additional_item") {
    if (!productId || !minOrderAmount) {
      throw new Error(
        "Product ID and minimum order amount are required for additional item coupons"
      );
    }

    // Verify product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      throw new Error("Product not found or inactive");
    }
  } else if (type === "discount_code") {
    if (!code || !discountAmount || !minOrderAmountForDiscount) {
      throw new Error(
        "Code, discount amount, and minimum order amount are required for discount code coupons"
      );
    }

    // Check if code already exists (case insensitive)
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        code: {
          equals: code,
          mode: "insensitive",
        },
      },
    });

    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }
  }

  const coupon = await prisma.coupon.create({
    data: {
      type: type.toUpperCase(),
      name,
      description,
      isActive,
      // Additional item fields
      ...(type === "additional_item" && {
        productId,
        minOrderAmount,
      }),
      // Discount code fields
      ...(type === "discount_code" && {
        code: code.toUpperCase(),
        discountAmount,
        minOrderAmountForDiscount,
      }),
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
        },
      },
    },
  });

  return getCouponById(coupon.id);
};

/**
 * Update a coupon
 * @param {number} id - Coupon ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated coupon
 */
const updateCoupon = async (id, updateData) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!existingCoupon) {
    throw new Error("Coupon not found");
  }

  const {
    name,
    description,
    isActive,
    // Additional item fields
    productId,
    minOrderAmount,
    // Discount code fields
    code,
    discountAmount,
    minOrderAmountForDiscount,
  } = updateData;

  // Validate type-specific updates
  if (existingCoupon.type === "ADDITIONAL_ITEM") {
    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: productId, isActive: true },
      });

      if (!product) {
        throw new Error("Product not found or inactive");
      }
    }
  } else if (existingCoupon.type === "DISCOUNT_CODE") {
    if (code && code !== existingCoupon.code) {
      const existingCodeCoupon = await prisma.coupon.findFirst({
        where: {
          code: {
            equals: code,
            mode: "insensitive",
          },
          id: {
            not: id,
          },
        },
      });

      if (existingCodeCoupon) {
        throw new Error("Coupon code already exists");
      }
    }
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
      // Additional item fields
      ...(existingCoupon.type === "ADDITIONAL_ITEM" && {
        ...(productId && { productId }),
        ...(minOrderAmount && { minOrderAmount }),
      }),
      // Discount code fields
      ...(existingCoupon.type === "DISCOUNT_CODE" && {
        ...(code && { code: code.toUpperCase() }),
        ...(discountAmount && { discountAmount }),
        ...(minOrderAmountForDiscount && { minOrderAmountForDiscount }),
      }),
    },
  });

  return getCouponById(id);
};

/**
 * Delete a coupon
 * @param {number} id - Coupon ID
 * @returns {Promise<void>}
 */
const deleteCoupon = async (id) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          couponUsages: true,
        },
      },
    },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  // Check if coupon has been used
  if (coupon._count.couponUsages > 0) {
    throw new Error(
      "Cannot delete coupon that has been used. Consider deactivating it instead."
    );
  }

  await prisma.coupon.delete({
    where: { id },
  });
};

/**
 * Find coupon by code (case insensitive)
 * @param {string} code - Coupon code
 * @returns {Promise<Object|null>} Coupon object or null
 */
const getCouponByCode = async (code) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code: {
        equals: code,
        mode: "insensitive",
      },
      isActive: true,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
        },
      },
    },
  });

  if (!coupon) return null;

  return {
    id: coupon.id,
    type: coupon.type.toLowerCase(),
    name: coupon.name,
    description: coupon.description,
    isActive: coupon.isActive,
    // Additional item fields
    ...(coupon.type === "ADDITIONAL_ITEM" && {
      productId: coupon.productId,
      productName: coupon.product?.name,
      minOrderAmount: parseFloat(coupon.minOrderAmount),
    }),
    // Discount code fields
    ...(coupon.type === "DISCOUNT_CODE" && {
      code: coupon.code,
      discountAmount: parseFloat(coupon.discountAmount),
      minOrderAmountForDiscount: parseFloat(coupon.minOrderAmountForDiscount),
    }),
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
  };
};

/**
 * Get active additional item coupons for order amount
 * @param {number} orderAmount - Order total amount
 * @returns {Promise<Array>} Array of applicable additional item coupons
 */
const getApplicableAdditionalItemCoupons = async (orderAmount) => {
  const coupons = await prisma.coupon.findMany({
    where: {
      type: "ADDITIONAL_ITEM",
      isActive: true,
      minOrderAmount: {
        lte: orderAmount,
      },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      minOrderAmount: "desc", // Highest minimum first
    },
  });

  return coupons.map((coupon) => ({
    id: coupon.id,
    type: coupon.type.toLowerCase(),
    name: coupon.name,
    description: coupon.description,
    productId: coupon.productId,
    productName: coupon.product?.name,
    minOrderAmount: parseFloat(coupon.minOrderAmount),
  }));
};

/**
 * Validate coupon for order
 * @param {Object} validationData - Validation data
 * @returns {Promise<Object>} Validation result
 */
const validateCoupon = async (validationData) => {
  const { code, orderAmount, userId, items = [] } = validationData;

  try {
    const coupon = await getCouponByCode(code);

    if (!coupon) {
      return {
        valid: false,
        error: "COUPON_NOT_FOUND",
        message: "Coupon code not found",
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        error: "COUPON_INACTIVE",
        message: "This coupon is no longer active",
      };
    }

    if (coupon.type === "discount_code") {
      if (orderAmount < coupon.minOrderAmountForDiscount) {
        return {
          valid: false,
          error: "MINIMUM_ORDER_NOT_MET",
          message: `Minimum order amount of ₹${coupon.minOrderAmountForDiscount} required for this coupon`,
        };
      }

      return {
        valid: true,
        coupon,
        discountAmount: Math.min(coupon.discountAmount, orderAmount),
        message: "Coupon applied successfully",
      };
    } else if (coupon.type === "additional_item") {
      if (orderAmount < coupon.minOrderAmount) {
        return {
          valid: false,
          error: "MINIMUM_ORDER_NOT_MET",
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
        };
      }

      // Check if product is available
      const product = await prisma.product.findFirst({
        where: { id: coupon.productId, isActive: true },
      });

      if (!product) {
        return {
          valid: false,
          error: "PRODUCT_NOT_AVAILABLE",
          message: "Free product is no longer available",
        };
      }

      return {
        valid: true,
        coupon,
        discountAmount: 0, // No direct discount, free item instead
        freeProduct: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
        },
        message: "Coupon applied successfully - free item will be added",
      };
    }

    return {
      valid: false,
      error: "INVALID_COUPON_TYPE",
      message: "Invalid coupon type",
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return {
      valid: false,
      error: "VALIDATION_ERROR",
      message: "Error validating coupon",
    };
  }
};

/**
 * Apply coupon to order (record usage)
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} Application result
 */
const applyCoupon = async (applicationData) => {
  const { couponId, orderId, userId, orderAmount } = applicationData;

  try {
    // Check if coupon is already applied to this order
    const existingUsage = await prisma.couponUsage.findUnique({
      where: {
        couponId_orderId: {
          couponId,
          orderId,
        },
      },
    });

    if (existingUsage) {
      throw new Error("Coupon already applied to this order");
    }

    const coupon = await getCouponById(couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    let discountApplied = 0;
    if (coupon.type === "discount_code") {
      discountApplied = Math.min(coupon.discountAmount, orderAmount);
    }

    // Record the usage
    await prisma.couponUsage.create({
      data: {
        couponId,
        orderId,
        userId,
        discountApplied,
      },
    });

    return {
      success: true,
      discountApplied,
      message: "Coupon applied successfully",
    };
  } catch (error) {
    console.error("Coupon application error:", error);
    throw error;
  }
};

/**
 * Get coupon usage statistics
 * @param {number} couponId - Coupon ID
 * @returns {Promise<Object>} Usage statistics
 */
const getCouponUsageStats = async (couponId) => {
  const stats = await prisma.couponUsage.aggregate({
    where: { couponId },
    _count: {
      id: true,
    },
    _sum: {
      discountApplied: true,
    },
  });

  return {
    totalUsages: stats._count.id || 0,
    totalDiscountGiven: parseFloat(stats._sum.discountApplied || 0),
  };
};

module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponByCode,
  getApplicableAdditionalItemCoupons,
  validateCoupon,
  applyCoupon,
  getCouponUsageStats,
};
