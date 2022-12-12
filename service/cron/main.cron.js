const { db } = require("../config/db.config");
const { myRound, chunkArray } = require("../utils");
const {
  DETA_PUT_MANY_MAX_COUNT,
  HISTORY_LENGTH,
  LISTING_ID,
  ITEM_MARKET_NAME,
  LISTING_FILTER_PARAM,
  LISTING_START_PARAM,
  ratesPrefix,
  historyPrefix,
  currenciesToFetch,
} = require("../constants");

const listingURL = "https://steamcommunity.com/market/listings/730/" + encodeURIComponent(ITEM_MARKET_NAME);
const headers = { referer: listingURL };

const USD = [1, "USD"];

const updateCurrencies = async (event) => {
  const items = [];
  let originalToUSDRate = 1; // original currency rate to USD
  let originalCurrencyId = 0;

  const querySet = await db.fetch();
  const prepared = querySet.items.reduce((resObj, v) => {
    resObj[v.key] = v;
    return resObj;
  }, {});

  for (const [currencyId, currencyName] of [USD, ...currenciesToFetch]) {
    const ratesKey = ratesPrefix + currencyName;
    const historyKey = historyPrefix + currencyName;

    if (originalCurrencyId === currencyId) {
      continue;
    } else if (
      !(new Date().getTime() / 1000 - (prepared[ratesKey] || { updated: 0 }).updated > 24 * 59 * 60)
    ) {
      continue;
    }

    const resp = await fetch(
      listingURL +
        `/render/?start=${LISTING_START_PARAM}&count=10&country=UA&language=english&` +
        `currency=${currencyId}&filter=${LISTING_FILTER_PARAM}`,
      {
        method: "GET",
        headers,
      }
    );
    if (resp.ok) {
      const resJson = await resp.json();
      const listingData = resJson["listinginfo"][LISTING_ID];
      if (!listingData) continue;

      const updated = Math.round(new Date().getTime() / 1000); // ts in seconds

      if (currencyId === 1) {
        originalToUSDRate = myRound(listingData["price"] / listingData["converted_price"]);
        const originalCurrency = currenciesToFetch.find((v) => v[0] === listingData["currencyid"] - 2000);
        if (originalCurrency) {
          const originalRateKey = ratesPrefix + originalCurrency[1];
          const originalHistoryKey = historyPrefix + originalCurrency[1];
          const originalHistory = (prepared[originalHistoryKey] || { history: [] }).history;
          originalHistory.unshift([originalToUSDRate, updated]);

          items.push({ key: originalRateKey, updated, rate: originalToUSDRate });
          items.push({
            key: originalHistoryKey,
            updated,
            history: chunkArray(originalHistory, HISTORY_LENGTH)[0],
          });

          originalCurrencyId = originalCurrency[0];
        }
      } else {
        const rate = myRound((listingData["converted_price"] / listingData["price"]) * originalToUSDRate);
        const history = (prepared[historyKey] || { history: [] }).history;
        history.unshift([rate, updated]);

        items.push({ key: ratesKey, updated, rate });
        items.push({ key: historyKey, updated, history: chunkArray(history, HISTORY_LENGTH)[0] });
      }
    } else if (resp.status === 429) break;
  }

  if (items.length) {
    for (const chunk of chunkArray(items, DETA_PUT_MANY_MAX_COUNT)) {
      await db.putMany(chunk);
    }
  }

  return items; // for visor
};

module.exports = { updateCurrencies };
