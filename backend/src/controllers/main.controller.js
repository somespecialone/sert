const { db } = require("../config/db.config");
const { RATES_PREFIX, HISTORY_PREFIX, CURRENCIES } = require("../constants");

const ratesQuery = { "key?pfx": RATES_PREFIX };
const historyQuery = { "key?pfx": HISTORY_PREFIX };

const getCurrencyRates = async (req, res) => {
  const querySet = await db.fetch(ratesQuery);
  res.status(200).json(
    querySet.items
      .sort(
        (a, b) => CURRENCIES[a.key.slice(RATES_PREFIX.length)] - CURRENCIES[b.key.slice(RATES_PREFIX.length)]
      )
      .reduce((resObj, v) => {
        resObj[v.key.slice(RATES_PREFIX.length)] = [v.rate, v.updated];
        return resObj;
      }, {})
  );
};

const getCurrenciesHistory = async (req, res) => {
  const { length = Number(process.env.HISTORY_LENGHT || 30), all = false } = req.query;
  let lengthHistory = Number(length);

  if (!lengthHistory || lengthHistory < 0) {
    res.status(400).json({ msg: "Invalid 'length' query param." });
    return;
  }
  all !== false && (lengthHistory = undefined);

  const querySet = await db.fetch(historyQuery);
  res.status(200).json(
    querySet.items
      .sort(
        (a, b) =>
          CURRENCIES[a.key.slice(HISTORY_PREFIX.length)] - CURRENCIES[b.key.slice(HISTORY_PREFIX.length)]
      )
      .reduce((resObj, v) => {
        resObj[v.key.slice(HISTORY_PREFIX.length)] = v.history.slice(0, lengthHistory);
        return resObj;
      }, {})
  );
};

module.exports = { getCurrencyRates, getCurrenciesHistory };
