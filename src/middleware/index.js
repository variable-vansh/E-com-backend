const { requireAdmin } = require("./auth.middleware");

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

const notFoundHandler = (req, res, next) => {
  res.status(404).send("Sorry, not found");
};

module.exports = {
  logger,
  errorHandler,
  notFoundHandler,
  requireAdmin,
};
