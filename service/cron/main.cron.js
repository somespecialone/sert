const { db } = require("../config/db.config");
const { myRound, chunkArray } = require("../utils");
const {
  DETA_PUT_MANY_MAX_COUNT,
  LISTING_ID,
  ITEM_MARKET_NAME,
  LISTING_FILTER_PARAM,
  LISTING_START_PARAM,
  RATES_PREFIX,
  HISTORY_PREFIX,
  CURRENCIES,
  CURRENCIES_TO_FETCH,
} = require("../constants");

const listingURL = "https://steamcommunity.com/market/listings/730/" + encodeURIComponent(ITEM_MARKET_NAME);
const headers = { referer: listingURL };

const currenciesToFetch = CURRENCIES_TO_FETCH.split(",").reduce((targetArr, curName) => {
  const trimmed = curName.trim();
  trimmed in CURRENCIES && targetArr.push([CURRENCIES[trimmed], trimmed]);
  return targetArr;
}, []);

const updateCurrencies = async (event) => {
  const items = [];
  let originalToUSDRate = 1; // original currency rate to USD

  const querySet = await db.fetch();

  // all histories, even not omitted
  const histories = querySet.items.reduce((resObj, v) => {
    resObj[v.key] = v.history;
    return resObj;
  }, {});

  const nowLocal = new Date();
  const nowUTC = new Date(nowLocal.getTime() + nowLocal.getTimezoneOffset() * 60 * 1000);
  const toOmit = querySet.items.reduce((resArr, v) => {
    if (v.key.startsWith(RATES_PREFIX)) {
      const updated = new Date(v.updated * 1000);

      if (updated.toDateString() === nowUTC.toDateString()) {
        resArr.push(v.key.split(RATES_PREFIX)[1]); // omit
      }
    }
    return resArr;
  }, []);

  // if all updated in time there is no need to fetch something
  if (currenciesToFetch.every(([_, currName]) => toOmit.includes(currName))) return items;

  for (const [currencyId, currencyName] of [[1, "USD"], ...currenciesToFetch]) {
    if (toOmit.includes(currencyName)) continue;

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
      if (!Object.entries(listingData).length) continue;

      // UTC ts in seconds
      const updated = Math.round(nowUTC / 1000);

      if (currencyId === 1) {
        originalToUSDRate = myRound(listingData["price"] / listingData["converted_price"]);

        // original listing currency if she in to fetch list and not omitted due to update time
        const originalCurrency = currenciesToFetch.find((v) => v[0] === listingData["currencyid"] - 2000);
        if (originalCurrency.length && !toOmit.includes(originalCurrency[1])) {
          const ratesKey = RATES_PREFIX + originalCurrency[1];
          const historyKey = HISTORY_PREFIX + originalCurrency[1];
          const originalHistory = histories[historyKey] || [];
          originalHistory.unshift([originalToUSDRate, updated]);

          items.push({ key: ratesKey, updated, rate: originalToUSDRate });
          items.push({ key: historyKey, updated, history: originalHistory });

          toOmit.push(originalCurrency[1]);
        }
      } else {
        const ratesKey = RATES_PREFIX + currencyName;
        const historyKey = HISTORY_PREFIX + currencyName;
        const rate = myRound((listingData["converted_price"] / listingData["price"]) * originalToUSDRate);
        const history = histories[historyKey] || [];
        history.unshift([rate, updated]);

        items.push({ key: ratesKey, updated, rate });
        items.push({ key: historyKey, updated, history });
      }
    } else if (resp.status === 429) break;
  }

  // save chunks
  if (items.length) {
    for (const chunk of chunkArray(items, DETA_PUT_MANY_MAX_COUNT)) {
      await db.putMany(chunk);
    }
  }

  return items; // for deta visor
};

module.exports = { updateCurrencies };
