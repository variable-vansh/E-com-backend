const express = require("express");
const router = express.Router();
const {
  getAllInventory,
  getInventoryByProductId,
  createInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventory.controller");
const { requireAdmin } = require("../middleware");

router.get("/", getAllInventory);
router.get("/:productId", getInventoryByProductId);
router.post("/", requireAdmin, createInventory);
router.put("/:productId", requireAdmin, updateInventory);
router.delete("/:productId", requireAdmin, deleteInventory);

module.exports = router;
