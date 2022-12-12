const express = require("express");

let app;

if (process.env.DETA_RUNTIME) {
  app = require("deta").App(express());
  const { updateCurrencies } = require("./cron/main.cron");
  app.lib.cron(updateCurrencies);
} else {
  // dev mode
  require("dotenv").config();
  const { updateCurrencies } = require("./cron/main.cron");
  app = express();
  app.get("/update", async (req, res) => {
    const data = await updateCurrencies({});
    res.status(200).json(data);
  });
}

const mainRouter = require("./routes/main.route");
const { allowCors } = require("./middlewares/main.middleware");

// app.use(express.json());
app.use(allowCors);

app.use("/", mainRouter);

module.exports = app;

// dev mode
!process.env.DETA_RUNTIME && app.listen(3000, () => console.info("Listen on http://localhost:3000"));
