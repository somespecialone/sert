const express = require("express");

const { getCurrencyRates } = require("../controllers/main.controller");

const router = express.Router();

router.get("/currencies", getCurrencyRates);

module.exports = router;
