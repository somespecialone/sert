const express = require("express");

let app;

if (process.env.DETA_RUNTIME) {
  const { App } = require("deta");

  const { updateCurrencies } = require("./cron/main.cron");

  app = App(express());
  app.lib.cron(updateCurrencies);
} else {
  require("dotenv").config();
  app = express();
}

const mainRouter = require("./routes/main.route");
const { allowCors } = require("./middlewares/main.middleware");

app.use(express.json());
app.use(allowCors);

app.use("/", mainRouter);

module.exports = app;

// dev mode
!process.env.DETA_RUNTIME && app.listen(3000, () => console.info("Listen on http://localhost:3000"));
