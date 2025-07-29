const express = require("express");
const router = express.Router();

const healthRouter = require("./health.routes");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const categoryRouter = require("./category.routes");
const productRouter = require("./product.routes");
const inventoryRouter = require("./inventory.routes");
const orderRouter = require("./order.routes");

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/inventory", inventoryRouter);
router.use("/orders", orderRouter);

module.exports = router;
