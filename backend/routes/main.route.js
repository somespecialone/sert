const express = require("express");

const { getCurrencyRates, getCurrenciesHistory } = require("../controllers/main.controller");

const mainRouter = express.Router();

mainRouter.get("/rates", getCurrencyRates);
mainRouter.get("/history", getCurrenciesHistory);

module.exports = mainRouter;
