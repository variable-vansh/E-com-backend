const { orderQueries } = require("../db/queries");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderQueries.getAllOrders();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderQueries.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Enhanced order creation for frontend
const createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      cartItems = [],
      cartMix,
      pricing,
      orderTimestamp,
      paymentStatus = "PENDING",
      orderStatus = "CONFIRMED",
    } = req.body;

    // Validate required fields
    if (!customerInfo?.fullName || !customerInfo?.phone) {
      return res.status(400).json({
        success: false,
        error: "Customer name and phone are required",
      });
    }

    if (!customerInfo?.address) {
      return res.status(400).json({
        success: false,
        error: "Customer address information is required",
      });
    }

    if (!cartItems?.length && !cartMix?.grains?.length) {
      return res.status(400).json({
        success: false,
        error: "At least one cart item or mix item is required",
      });
    }

    if (!pricing?.grandTotal || pricing.grandTotal <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid grand total is required",
      });
    }

    const order = await orderQueries.createEnhancedOrder({
      customerInfo,
      cartItems,
      cartMix,
      pricing,
      orderTimestamp,
      paymentStatus,
      orderStatus,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.orderId,
        orderNumber: order.id,
        status: order.orderStatus || order.status,
        grandTotal: order.grandTotal,
        estimatedDelivery: orderQueries.calculateEstimatedDelivery(
          order.pincode
        ),
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Get orders by phone number (for customer lookup)
const getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const orders = await orderQueries.getOrdersByPhone(phone);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const updatedOrder = await orderQueries.updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderQueries.deleteOrder(id);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting order:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const stats = await orderQueries.getOrderStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByPhone,
  getOrderStats,
};
