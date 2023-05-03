const express = require("express");

const app = express();

// dev mode
let mainRoutePath = "/";
if (!process.env.DETA_SPACE_APP) {
  require("dotenv").config();
  mainRoutePath = "/api";
}

const { allowCors } = require("./middlewares/cors.middleware");
const mainRouter = require("./routes/main.route");
const { handleActionRequest } = require("./cron/main.cron");

app.use(express.json()); // for deta action POST data
app.use(allowCors);
app.use(mainRoutePath, mainRouter);
app.post("/__space/v0/actions", handleActionRequest); // deta action path

module.exports = app;
