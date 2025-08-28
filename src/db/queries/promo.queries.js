// ================================
// PROMO QUERIES
// ================================
// This file contains all Prisma queries related to promo management

const prisma = require("../../utils/prisma");

// ================================
// CREATE OPERATIONS
// ================================

/**
 * Create a new promo
 * @param {Object} promoData - The promo data
 * @param {string} promoData.imageUrl - Image URL for the promo
 * @param {string} [promoData.title] - Optional title
 * @param {string} [promoData.description] - Optional description
 * @param {boolean} [promoData.isActive=true] - Active status
 * @param {number} [promoData.displayOrder] - Display order (auto-set if not provided)
 * @param {string} [promoData.deviceType='BOTH'] - Device type (DESKTOP, MOBILE, BOTH)
 * @param {number} [promoData.createdById] - ID of user creating the promo
 * @returns {Promise<Object>} Created promo
 */
const createPromo = async (promoData) => {
  try {
    // Get the highest display order if not provided
    let displayOrder = promoData.displayOrder;
    if (displayOrder === undefined) {
      const maxOrderPromo = await prisma.promo.findFirst({
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });
      displayOrder = maxOrderPromo ? maxOrderPromo.displayOrder + 1 : 1;
    }

    const promo = await prisma.promo.create({
      data: {
        imageUrl: promoData.imageUrl,
        title: promoData.title,
        description: promoData.description,
        isActive: promoData.isActive ?? true,
        displayOrder,
        deviceType: promoData.deviceType || "BOTH",
        createdById: promoData.createdById,
        updatedById: promoData.createdById,
      },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        updatedBy: {
          select: { id: true, username: true },
        },
      },
    });

    return promo;
  } catch (error) {
    console.error("Error creating promo:", error);
    throw error;
  }
};

// ================================
// READ OPERATIONS
// ================================

/**
 * Get all promos with pagination and filtering
 * @param {Object} options - Query options
 * @param {boolean} [options.active] - Filter by active status
 * @param {string} [options.deviceType] - Filter by device type (DESKTOP, MOBILE, BOTH)
 * @param {number} [options.limit=10] - Number of results to return
 * @param {number} [options.offset=0] - Number of results to skip
 * @param {string} [options.orderBy='displayOrder'] - Field to order by
 * @param {string} [options.order='asc'] - Order direction
 * @returns {Promise<Object>} Paginated promos with metadata
 */
const getAllPromos = async (options = {}) => {
  try {
    const {
      active,
      deviceType,
      limit = 10,
      offset = 0,
      orderBy = "displayOrder",
      order = "asc",
    } = options;

    // Build where clause
    const where = {};
    if (active !== undefined) {
      where.isActive = active;
    }
    if (deviceType !== undefined) {
      where.deviceType = deviceType;
    }

    // Build order clause
    const orderClause = {};
    orderClause[orderBy] = order;

    const [promos, total] = await Promise.all([
      prisma.promo.findMany({
        where,
        orderBy: orderClause,
        take: limit,
        skip: offset,
        include: {
          createdBy: {
            select: { id: true, username: true },
          },
          updatedBy: {
            select: { id: true, username: true },
          },
        },
      }),
      prisma.promo.count({ where }),
    ]);

    return {
      data: promos,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
};

/**
 * Get active promos ordered by display order
 * @param {number} [limit] - Maximum number of promos to return
 * @param {string} [deviceType] - Filter by device type (DESKTOP, MOBILE, BOTH)
 * @returns {Promise<Array>} Array of active promos
 */
const getActivePromos = async (limit, deviceType) => {
  try {
    const where = { isActive: true };

    // If deviceType is specified, filter by it or include BOTH
    if (deviceType && deviceType !== "BOTH") {
      where.OR = [{ deviceType: deviceType }, { deviceType: "BOTH" }];
    } else if (deviceType === "BOTH") {
      where.deviceType = "BOTH";
    }

    const promos = await prisma.promo.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      take: limit,
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    return promos;
  } catch (error) {
    console.error("Error fetching active promos:", error);
    throw error;
  }
};

/**
 * Get active promos by device type
 * @param {string} deviceType - Device type (DESKTOP, MOBILE, BOTH)
 * @param {number} [limit] - Maximum number of promos to return
 * @returns {Promise<Array>} Array of active promos for device type
 */
const getActivePromosByDevice = async (deviceType, limit) => {
  try {
    const where = {
      isActive: true,
      OR: [{ deviceType: deviceType }, { deviceType: "BOTH" }],
    };

    const promos = await prisma.promo.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      take: limit,
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    return promos;
  } catch (error) {
    console.error("Error fetching active promos by device:", error);
    throw error;
  }
};

/**
 * Get promo by ID
 * @param {number} id - Promo ID
 * @returns {Promise<Object|null>} Promo object or null if not found
 */
const getPromoById = async (id) => {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        updatedBy: {
          select: { id: true, username: true },
        },
      },
    });

    return promo;
  } catch (error) {
    console.error("Error fetching promo by ID:", error);
    throw error;
  }
};

// ================================
// UPDATE OPERATIONS
// ================================

/**
 * Update a promo
 * @param {number} id - Promo ID
 * @param {Object} updateData - Data to update
 * @param {number} [updateData.updatedById] - ID of user updating the promo
 * @returns {Promise<Object>} Updated promo
 */
const updatePromo = async (id, updateData) => {
  try {
    const promo = await prisma.promo.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        updatedById: updateData.updatedById,
      },
      include: {
        createdBy: {
          select: { id: true, username: true },
        },
        updatedBy: {
          select: { id: true, username: true },
        },
      },
    });

    return promo;
  } catch (error) {
    console.error("Error updating promo:", error);
    throw error;
  }
};

/**
 * Toggle promo active status
 * @param {number} id - Promo ID
 * @param {boolean} isActive - New active status
 * @param {number} [updatedById] - ID of user updating the promo
 * @returns {Promise<Object>} Updated promo
 */
const togglePromoStatus = async (id, isActive, updatedById) => {
  try {
    const promo = await prisma.promo.update({
      where: { id: parseInt(id) },
      data: {
        isActive,
        updatedById,
      },
      select: {
        id: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return promo;
  } catch (error) {
    console.error("Error toggling promo status:", error);
    throw error;
  }
};

/**
 * Reorder promos
 * @param {Array} promosOrder - Array of {id, order} objects
 * @param {number} [updatedById] - ID of user updating the promos
 * @returns {Promise<Array>} Updated promos with new order
 */
const reorderPromos = async (promosOrder, updatedById) => {
  try {
    const updatePromises = promosOrder.map(({ id, order }) =>
      prisma.promo.update({
        where: { id: parseInt(id) },
        data: {
          displayOrder: order,
          updatedById,
        },
        select: {
          id: true,
          displayOrder: true,
        },
      })
    );

    const updatedPromos = await Promise.all(updatePromises);
    return updatedPromos;
  } catch (error) {
    console.error("Error reordering promos:", error);
    throw error;
  }
};

// ================================
// DELETE OPERATIONS
// ================================

/**
 * Delete a promo
 * @param {number} id - Promo ID
 * @returns {Promise<Object>} Deleted promo
 */
const deletePromo = async (id) => {
  try {
    const promo = await prisma.promo.delete({
      where: { id: parseInt(id) },
    });

    return promo;
  } catch (error) {
    console.error("Error deleting promo:", error);
    throw error;
  }
};

/**
 * Soft delete a promo (set isActive to false)
 * @param {number} id - Promo ID
 * @param {number} [updatedById] - ID of user updating the promo
 * @returns {Promise<Object>} Updated promo
 */
const softDeletePromo = async (id, updatedById) => {
  try {
    const promo = await prisma.promo.update({
      where: { id: parseInt(id) },
      data: {
        isActive: false,
        updatedById,
      },
    });

    return promo;
  } catch (error) {
    console.error("Error soft deleting promo:", error);
    throw error;
  }
};

// ================================
// UTILITY OPERATIONS
// ================================

/**
 * Check if promo exists
 * @param {number} id - Promo ID
 * @returns {Promise<boolean>} True if promo exists
 */
const promoExists = async (id) => {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id: parseInt(id) },
      select: { id: true },
    });

    return !!promo;
  } catch (error) {
    console.error("Error checking promo existence:", error);
    throw error;
  }
};

/**
 * Get promo statistics
 * @returns {Promise<Object>} Promo statistics
 */
const getPromoStats = async () => {
  try {
    const [total, active, inactive] = await Promise.all([
      prisma.promo.count(),
      prisma.promo.count({ where: { isActive: true } }),
      prisma.promo.count({ where: { isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  } catch (error) {
    console.error("Error fetching promo stats:", error);
    throw error;
  }
};

module.exports = {
  // Create
  createPromo,

  // Read
  getAllPromos,
  getActivePromos,
  getActivePromosByDevice,
  getPromoById,

  // Update
  updatePromo,
  togglePromoStatus,
  reorderPromos,

  // Delete
  deletePromo,
  softDeletePromo,

  // Utility
  promoExists,
  getPromoStats,
};
