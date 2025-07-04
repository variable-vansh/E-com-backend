const { orderQueries } = require("../../queries/crud-queries");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderQueries.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderQueries.getOrderById(parseInt(req.params.id));
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = await orderQueries.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await orderQueries.updateOrderStatus(
      parseInt(req.params.id),
      req.body.status
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await orderQueries.deleteOrder(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
