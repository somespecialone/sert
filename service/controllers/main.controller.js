const { db } = require("../config/db.config");

const getCurrencyRates = async (req, res) => {
  const querySet = await db.fetch();

  const prepared = {};
  querySet.items.forEach((v) => {
    prepared[v.key] = [v.rate, v.updated];
  });

  res.status(200).json(prepared);
};

module.exports = { getCurrencyRates };
