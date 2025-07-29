const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const { requireAdmin } = require("../middleware");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", requireAdmin, createOrder);
router.patch("/:id/status", requireAdmin, updateOrderStatus);
router.delete("/:id", requireAdmin, deleteOrder);

module.exports = router;
