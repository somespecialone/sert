const { db } = require("../config/db.config");
const { ratesPrefix, historyPrefix } = require("../constants");

const ratesQuery = { "key?pfx": ratesPrefix };
const historyQuery = { "key?pfx": historyPrefix };

const getCurrencyRates = async (req, res) => {
  const querySet = await db.fetch(ratesQuery);
  res.status(200).json(
    querySet.items.reduce((resObj, v) => {
      resObj[v.key.slice(ratesPrefix.length)] = [v.rate, v.updated];
      return resObj;
    }, {})
  );
};

const getCurrenciesHistory = async (req, res) => {
  const querySet = await db.fetch(historyQuery);
  res.status(200).json(
    querySet.items.reduce((resObj, v) => {
      resObj[v.key.slice(historyPrefix.length)] = v.history;
      return resObj;
    }, {})
  );
};

module.exports = { getCurrencyRates, getCurrenciesHistory };
