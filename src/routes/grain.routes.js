const express = require("express");
const router = express.Router();
const grainController = require("../controllers/grain.controller");

// GET /api/grains - Get all grains (for frontend)
router.get("/", grainController.getAllGrains);

// GET /api/grains/search - Search grains
router.get("/search", grainController.searchGrains);

// GET /api/grains/:id - Get grain by ID
router.get("/:id", grainController.getGrainById);

// POST /api/grains - Create new grain
router.post("/", grainController.createGrain);

// PUT /api/grains/:id - Update grain
router.put("/:id", grainController.updateGrain);

// DELETE /api/grains/:id - Hard delete grain
router.delete("/:id", grainController.deleteGrain);

module.exports = router;
