require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const mainRouter = require("./src/routes");
const { logger, errorHandler, notFoundHandler } = require("./src/middleware");

app.use(express.json());
app.use(logger);

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use("/api", mainRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`E-commerce backend listening on port ${port}`);
});
