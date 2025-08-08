const express = require("express");
const router = express.Router();
const grainController = require("../controllers/grain.controller");

// GET /api/grains - Get all grains (for frontend)
router.get("/", grainController.getActiveGrains);

// GET /api/grains/all - Get all grains including inactive (for admin)
router.get("/all", grainController.getAllGrains);

// GET /api/grains/stats - Get grains statistics
router.get("/stats", grainController.getGrainsStats);

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

// PATCH /api/grains/:id/deactivate - Soft delete grain
router.patch("/:id/deactivate", grainController.softDeleteGrain);

module.exports = router;
