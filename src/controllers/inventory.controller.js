const { inventoryQueries } = require("../../queries/crud-queries");

const getAllInventory = async (req, res) => {
  try {
    const inventory = await inventoryQueries.getAllInventory();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInventoryByProductId = async (req, res) => {
  try {
    const inventory = await inventoryQueries.getInventoryByProductId(
      parseInt(req.params.productId)
    );
    if (inventory) {
      res.status(200).json(inventory);
    } else {
      res.status(404).json({ message: "Inventory not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInventory = async (req, res) => {
  try {
    const newInventory = await inventoryQueries.createInventory(req.body);
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const updatedInventory = await inventoryQueries.updateInventory(
      parseInt(req.params.productId),
      req.body
    );
    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    await inventoryQueries.deleteInventory(parseInt(req.params.productId));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllInventory,
  getInventoryByProductId,
  createInventory,
  updateInventory,
  deleteInventory,
};
