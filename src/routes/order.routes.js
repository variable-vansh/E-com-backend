const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByPhone,
  getOrderStats,
} = require("../controllers/order.controller");
const { requireAdmin } = require("../middleware");

// Input validation middleware
const validateOrderData = (req, res, next) => {
  const { orderId, customerInfo, pricing } = req.body;

  if (!orderId || !/^\d{6}$/.test(orderId)) {
    return res.status(400).json({
      success: false,
      error: "Valid 6-digit order ID is required",
    });
  }

  if (!customerInfo?.fullName?.trim()) {
    return res.status(400).json({
      success: false,
      error: "Customer name is required",
    });
  }

  if (!customerInfo?.phone?.match(/^\d{10}$/)) {
    return res.status(400).json({
      success: false,
      error: "Valid 10-digit phone number is required",
    });
  }

  if (!pricing?.grandTotal || pricing.grandTotal <= 0) {
    return res.status(400).json({
      success: false,
      error: "Grand total must be greater than 0",
    });
  }

  next();
};

// Public routes (for frontend order submission)
router.post("/", validateOrderData, createOrder);

// Customer lookup routes
router.get("/customer/:phone", getOrdersByPhone);

// Admin routes
router.get("/", requireAdmin, getAllOrders);
router.get("/stats", requireAdmin, getOrderStats);
router.get("/:id", getOrderById); // Can be accessed by both admin and customers
router.patch("/:id/status", requireAdmin, updateOrderStatus);
router.delete("/:id", requireAdmin, deleteOrder);

module.exports = router;
