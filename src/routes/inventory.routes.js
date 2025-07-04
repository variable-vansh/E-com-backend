const express = require("express");
const router = express.Router();
const {
  getAllInventory,
  getInventoryByProductId,
  createInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventory.controller");

router.get("/", getAllInventory);
router.get("/:productId", getInventoryByProductId);
router.post("/", createInventory);
router.put("/:productId", updateInventory);
router.delete("/:productId", deleteInventory);

module.exports = router;
