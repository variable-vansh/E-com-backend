const express = require("express");
const router = express.Router();

const healthRouter = require("./health.routes");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const categoryRouter = require("./category.routes");
const productRouter = require("./product.routes");
const grainRouter = require("./grain.routes");
const inventoryRouter = require("./inventory.routes");
const orderRouter = require("./order.routes");
const promoRouter = require("./promo.routes");
const couponRouter = require("./coupon.routes");

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/grains", grainRouter);
router.use("/inventory", inventoryRouter);
router.use("/orders", orderRouter);
router.use("/promos", promoRouter);
router.use("/coupons", couponRouter);

module.exports = router;
