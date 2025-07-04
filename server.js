const express = require("express");
const app = express();
const port = 3000;
const mainRouter = require("./src/routes");
const { logger, errorHandler, notFoundHandler } = require("./src/middleware");

app.use(express.json());
app.use(logger);

app.use("/api", mainRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
