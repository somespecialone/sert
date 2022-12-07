const { db } = require("../config/db.config");

const LISTING_ID = process.env.LISTING_ID;
const ITEM_MARKET_NAME = process.env.ITEM_MARKET_NAME;
const LISTING_FILTER_PARAM = process.env.LISTING_FILTER_PARAM || "";

const listingURL = "https://steamcommunity.com/market/listings/730/" + encodeURIComponent(ITEM_MARKET_NAME);
const headers = {
  referer: listingURL,
};

// must starts with USD
const currencies = [
  [1, "USD"],
  [3, "EUR"],
  [5, "RUB"],
  [18, "UAH"],
];

const updateCurrencies = async (event) => {
  const items = [];
  let originalUSDRate = 1; // original currency rate to USD
  let originalCurrencyId = 0;

  const querySet = await db.fetch();
  const prepared = {};
  querySet.items.forEach((v) => {
    prepared[v.key] = [v.rate, v.updated];
  });

  for (const [currencyId, currencyName] of currencies) {
    if (originalCurrencyId === currencyId) {
      continue;
    } else if (!(new Date().getTime() / 1000 - (prepared[currencyName] || [0, 0])[1] > 24 * 59 * 60)) {
      continue;
    }

    const resp = await fetch(
      listingURL +
        "/render/?query=&start=0&count=10&country=UA&language=english&" +
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
        originalUSDRate = Math.round((listingData["price"] / listingData["converted_price"]) * 100) / 100;
        const originalCurrency = currencies.find((v) => v[0] === listingData["currencyid"] - 2000);
        if (originalCurrency) {
          items.push({ key: originalCurrency[1], updated, rate: originalUSDRate });
          originalCurrencyId = originalCurrency[0];
        }
      }

      const key = currencyName;
      const rate =
        Math.round((listingData["converted_price"] / listingData["price"]) * originalUSDRate * 100) / 100;
      items.push({ key, updated, rate });
    } else if (resp.status === 429) {
      break;
    }
  }

  items.length && (await db.putMany(items));
};

module.exports = { updateCurrencies };
