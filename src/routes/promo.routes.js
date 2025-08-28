const express = require("express");
const router = express.Router();
const {
  createNewPromo,
  getPromos,
  getActivePromosPublic,
  getActivePromosByDeviceType,
  getPromo,
  getStats,
  updateExistingPromo,
  toggleStatus,
  reorderPromosHandler,
  removePromo,
} = require("../controllers/promo.controller");
const { requireAdmin } = require("../middleware");

// ================================
// PUBLIC ROUTES
// ================================
// Get active promos (no authentication required)
router.get("/active", getActivePromosPublic);

// Get active promos by device type (no authentication required)
router.get("/device/:deviceType", getActivePromosByDeviceType);

// ================================
// PROTECTED ROUTES (Admin only)
// ================================
// All other routes require admin authentication

// Get all promos with pagination and filtering
router.get("/", requireAdmin, getPromos);

// Get promo statistics
router.get("/stats", requireAdmin, getStats);

// Reorder promos (must come before /:id routes)
router.put("/reorder", requireAdmin, reorderPromosHandler);

// Get single promo by ID
router.get("/:id", requireAdmin, getPromo);

// Create new promo
router.post("/", requireAdmin, createNewPromo);

// Update promo (supports both PUT and PATCH)
router.put("/:id", requireAdmin, updateExistingPromo);
router.patch("/:id", requireAdmin, updateExistingPromo);

// Toggle promo active status
router.patch("/:id/toggle", requireAdmin, toggleStatus);

// Delete promo (supports both hard and soft delete via query parameter)
router.delete("/:id", requireAdmin, removePromo);

module.exports = router;
