const { db } = require("../config/db.config");
const { myRound, chunkArray } = require("../utils");
const { RATES_PREFIX, HISTORY_PREFIX, CURRENCIES } = require("../constants");

const updateCurrencyRates = async () => {
  // constants
  const LISTING_ID = process.env.LISTING_ID;
  const ITEM_MARKET_NAME = process.env.ITEM_MARKET_NAME;
  const LISTING_FILTER_PARAM = process.env.LISTING_FILTER_PARAM || "";
  const LISTING_START_PARAM = process.env.LISTING_START_PARAM || 0;
  const CURRENCIES_TO_FETCH = process.env.CURRENCIES_TO_FETCH || "EUR,RUB,UAH";
  const RATE_LIMIT = Number(process.env.RATE_LIMIT || 4);

  const listingURL = "https://steamcommunity.com/market/listings/730/" + encodeURIComponent(ITEM_MARKET_NAME);

  const currenciesToFetch = CURRENCIES_TO_FETCH.split(",").reduce((targetArr, curName) => {
    const trimmed = curName.trim();
    trimmed in CURRENCIES && targetArr.push([CURRENCIES[trimmed], trimmed]);
    return targetArr;
  }, []);

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

  let i = 0;
  for (const [currencyId, currencyName] of [[1, "USD"], ...currenciesToFetch]) {
    if (toOmit.includes(currencyName)) continue;
    if (i === RATE_LIMIT) break;

    const resp = await fetch(
      listingURL +
        `/render/?start=${LISTING_START_PARAM}&count=10&country=UA&language=english&` +
        `currency=${currencyId}&filter=${LISTING_FILTER_PARAM}`,
      {
        method: "GET",
        headers: { referer: listingURL },
      }
    );
    i++;

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
    for (const chunk of chunkArray(items, 25)) {
      await db.putMany(chunk);
    }
  }

  return items; // for deta visor
};

const handleActionRequest = async (req, res) => {
  const event = req.body.event;
  if (event.id === "update-prices") {
    const items = await updateCurrencyRates();
    res.status(200).json(items);
    return;
  }

  res.sendStatus(400);
};

module.exports = { handleActionRequest };
