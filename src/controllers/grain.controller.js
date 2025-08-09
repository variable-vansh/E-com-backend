const { grainQueries } = require("../db/queries");

const getAllGrains = async (req, res) => {
  try {
    const grains = await grainQueries.getAllGrains();
    res.status(200).json(grains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActiveGrains = async (req, res) => {
  try {
    const grains = await grainQueries.getActiveGrains();
    res.status(200).json(grains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrainById = async (req, res) => {
  try {
    const grain = await grainQueries.getGrainById(parseInt(req.params.id));
    if (grain) {
      res.status(200).json(grain);
    } else {
      res.status(404).json({ message: "Grain not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGrain = async (req, res) => {
  try {
    console.log("Creating grain with data:", req.body);

    // Validate required fields
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({
        error: "Name and price are required fields",
        received: req.body,
      });
    }

    const newGrain = await grainQueries.createGrain(req.body);
    console.log("Grain created successfully:", newGrain);
    res.status(201).json(newGrain);
  } catch (error) {
    console.error("Error creating grain:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateGrain = async (req, res) => {
  try {
    const updatedGrain = await grainQueries.updateGrain(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(updatedGrain);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Grain not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const deleteGrain = async (req, res) => {
  try {
    await grainQueries.deleteGrain(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Grain not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const searchGrains = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const grains = await grainQueries.searchGrains(q);
    res.status(200).json(grains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGrains,
  getActiveGrains,
  getGrainById,
  createGrain,
  updateGrain,
  deleteGrain,
  searchGrains,
};
