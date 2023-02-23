const express = require("express");

const { getCurrencyRates, getCurrenciesHistory } = require("../controllers/main.controller");

const router = express.Router();

router.get("/rates", getCurrencyRates);
router.get("/history", getCurrenciesHistory);

module.exports = router;
