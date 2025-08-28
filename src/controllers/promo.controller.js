// ================================
// PROMO CONTROLLER
// ================================
// This file contains all route handlers for promo management

const {
  createPromo,
  getAllPromos,
  getActivePromos,
  getActivePromosByDevice,
  getPromoById,
  updatePromo,
  togglePromoStatus,
  reorderPromos,
  deletePromo,
  softDeletePromo,
  promoExists,
  getPromoStats,
} = require("../db/queries/promo.queries");

// ================================
// CREATE OPERATIONS
// ================================

/**
 * Create a new promo
 * POST /api/promos
 */
const createNewPromo = async (req, res) => {
  try {
    const { imageUrl, title, description, isActive, displayOrder, deviceType } =
      req.body;
    const userId = req.user?.id; // From auth middleware

    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Image URL is required",
        details: {
          field: "imageUrl",
          code: "REQUIRED",
        },
      });
    }

    // Validate image URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(imageUrl)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid image URL format",
        details: {
          field: "imageUrl",
          code: "INVALID_FORMAT",
        },
      });
    }

    // Validate device type if provided
    const validDeviceTypes = ["DESKTOP", "MOBILE", "BOTH"];
    if (deviceType && !validDeviceTypes.includes(deviceType)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid device type. Must be DESKTOP, MOBILE, or BOTH",
        details: {
          field: "deviceType",
          code: "INVALID_VALUE",
        },
      });
    }

    const promoData = {
      imageUrl,
      title,
      description,
      isActive,
      displayOrder,
      deviceType,
      createdById: userId,
    };

    const promo = await createPromo(promoData);

    res.status(201).json({
      data: promo,
    });
  } catch (error) {
    console.error("Error creating promo:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create promo",
    });
  }
};

// ================================
// READ OPERATIONS
// ================================

/**
 * Get all promos with pagination and filtering
 * GET /api/promos
 */
const getPromos = async (req, res) => {
  try {
    const {
      active,
      deviceType,
      limit = 10,
      offset = 0,
      orderBy = "displayOrder",
      order = "asc",
    } = req.query;

    // Validate device type if provided
    const validDeviceTypes = ["DESKTOP", "MOBILE", "BOTH"];
    if (deviceType && !validDeviceTypes.includes(deviceType)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid device type. Must be DESKTOP, MOBILE, or BOTH",
        details: {
          field: "deviceType",
          code: "INVALID_VALUE",
        },
      });
    }

    const options = {
      active: active !== undefined ? active === "true" : undefined,
      deviceType,
      limit: Math.min(parseInt(limit) || 10, 100), // Max 100 results
      offset: parseInt(offset) || 0,
      orderBy,
      order,
    };

    const result = await getAllPromos(options);

    res.json(result);
  } catch (error) {
    console.error("Error fetching promos:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch promos",
    });
  }
};

/**
 * Get active promos for public display
 * GET /api/promos/active
 */
const getActivePromosPublic = async (req, res) => {
  try {
    const { limit, deviceType } = req.query;

    // Validate device type if provided
    const validDeviceTypes = ["DESKTOP", "MOBILE", "BOTH"];
    if (deviceType && !validDeviceTypes.includes(deviceType)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid device type. Must be DESKTOP, MOBILE, or BOTH",
        details: {
          field: "deviceType",
          code: "INVALID_VALUE",
        },
      });
    }

    const promos = await getActivePromos(
      limit ? parseInt(limit) : undefined,
      deviceType
    );

    res.json({
      data: promos,
    });
  } catch (error) {
    console.error("Error fetching active promos:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch active promos",
    });
  }
};

/**
 * Get active promos by device type
 * GET /api/promos/device/:deviceType
 */
const getActivePromosByDeviceType = async (req, res) => {
  try {
    const { deviceType } = req.params;
    const { limit } = req.query;

    // Validate device type
    const validDeviceTypes = ["DESKTOP", "MOBILE", "BOTH"];
    if (!validDeviceTypes.includes(deviceType)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid device type. Must be DESKTOP, MOBILE, or BOTH",
        details: {
          field: "deviceType",
          code: "INVALID_VALUE",
        },
      });
    }

    const promos = await getActivePromosByDevice(
      deviceType,
      limit ? parseInt(limit) : undefined
    );

    res.json({
      data: promos,
    });
  } catch (error) {
    console.error("Error fetching active promos by device:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch active promos by device type",
    });
  }
};

/**
 * Get promo by ID
 * GET /api/promos/:id
 */
const getPromo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid promo ID",
        details: {
          field: "id",
          code: "INVALID",
        },
      });
    }

    const promo = await getPromoById(id);

    if (!promo) {
      return res.status(404).json({
        error: "Not found",
        message: "Promo not found",
      });
    }

    res.json({
      data: promo,
    });
  } catch (error) {
    console.error("Error fetching promo:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch promo",
    });
  }
};

/**
 * Get promo statistics
 * GET /api/promos/stats
 */
const getStats = async (req, res) => {
  try {
    const stats = await getPromoStats();

    res.json({
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching promo stats:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch promo statistics",
    });
  }
};

// ================================
// UPDATE OPERATIONS
// ================================

/**
 * Update a promo
 * PUT /api/promos/:id
 * PATCH /api/promos/:id
 */
const updateExistingPromo = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, title, description, isActive, displayOrder, deviceType } =
      req.body;
    const userId = req.user?.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid promo ID",
        details: {
          field: "id",
          code: "INVALID",
        },
      });
    }

    // Check if promo exists
    const exists = await promoExists(id);
    if (!exists) {
      return res.status(404).json({
        error: "Not found",
        message: "Promo not found",
      });
    }

    // Validate image URL if provided
    if (imageUrl) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(imageUrl)) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Invalid image URL format",
          details: {
            field: "imageUrl",
            code: "INVALID_FORMAT",
          },
        });
      }
    }

    // Validate device type if provided
    const validDeviceTypes = ["DESKTOP", "MOBILE", "BOTH"];
    if (deviceType && !validDeviceTypes.includes(deviceType)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid device type. Must be DESKTOP, MOBILE, or BOTH",
        details: {
          field: "deviceType",
          code: "INVALID_VALUE",
        },
      });
    }

    const updateData = {
      updatedById: userId,
    };

    // Only update provided fields
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (deviceType !== undefined) updateData.deviceType = deviceType;

    const promo = await updatePromo(id, updateData);

    res.json({
      data: promo,
    });
  } catch (error) {
    console.error("Error updating promo:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update promo",
    });
  }
};

/**
 * Toggle promo active status
 * PATCH /api/promos/:id/toggle
 */
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const userId = req.user?.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid promo ID",
        details: {
          field: "id",
          code: "INVALID",
        },
      });
    }

    if (is_active === undefined) {
      return res.status(400).json({
        error: "Validation failed",
        message: "is_active field is required",
        details: {
          field: "is_active",
          code: "REQUIRED",
        },
      });
    }

    // Check if promo exists
    const exists = await promoExists(id);
    if (!exists) {
      return res.status(404).json({
        error: "Not found",
        message: "Promo not found",
      });
    }

    const promo = await togglePromoStatus(id, is_active, userId);

    res.json({
      data: promo,
    });
  } catch (error) {
    console.error("Error toggling promo status:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to toggle promo status",
    });
  }
};

/**
 * Reorder promos
 * PUT /api/promos/reorder
 */
const reorderPromosHandler = async (req, res) => {
  try {
    const { promos } = req.body;
    const userId = req.user?.id;

    if (!promos || !Array.isArray(promos)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "promos array is required",
        details: {
          field: "promos",
          code: "REQUIRED",
        },
      });
    }

    // Validate each promo in the array
    for (const promo of promos) {
      if (!promo.id || !promo.order || isNaN(promo.id) || isNaN(promo.order)) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Each promo must have valid id and order fields",
          details: {
            field: "promos",
            code: "INVALID_FORMAT",
          },
        });
      }
    }

    const updatedPromos = await reorderPromos(promos, userId);

    res.json({
      data: updatedPromos,
    });
  } catch (error) {
    console.error("Error reordering promos:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to reorder promos",
    });
  }
};

// ================================
// DELETE OPERATIONS
// ================================

/**
 * Delete a promo
 * DELETE /api/promos/:id
 */
const removePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const { soft = false } = req.query; // Support soft delete

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Invalid promo ID",
        details: {
          field: "id",
          code: "INVALID",
        },
      });
    }

    // Check if promo exists
    const exists = await promoExists(id);
    if (!exists) {
      return res.status(404).json({
        error: "Not found",
        message: "Promo not found",
      });
    }

    if (soft === "true") {
      const userId = req.user?.id;
      await softDeletePromo(id, userId);
    } else {
      await deletePromo(id);
    }

    res.json({
      message: "Promo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting promo:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete promo",
    });
  }
};

module.exports = {
  // Create
  createNewPromo,

  // Read
  getPromos,
  getActivePromosPublic,
  getActivePromosByDeviceType,
  getPromo,
  getStats,

  // Update
  updateExistingPromo,
  toggleStatus,
  reorderPromosHandler,

  // Delete
  removePromo,
};
