const express = require("express");

const app = express();

!process.env.DETA_SPACE_APP && require("dotenv").config(); // dev mode

const { allowCors } = require("./middlewares/main.middleware");
const mainRouter = require("./routes/main.route");
const { handleActionRequest } = require("./cron/main.cron");

app.use(express.json());
app.use(allowCors);
app.use("/", mainRouter);
app.post("/__space/v0/actions", handleActionRequest); // deta action path

const port = parseInt(process.env.PORT) || 3000;
app.listen(port);
