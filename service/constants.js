const DETA_BASE_NAME = process.env.DETA_BASE_NAME || "SERT";
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

const DETA_PUT_MANY_MAX_COUNT = Number(process.env.DETA_PUT_MANY_MAX_COUNT || 25);
const HISTORY_LENGTH = Number(process.env.HISTORY_LENGHT || 30);

const LISTING_ID = process.env.LISTING_ID;
const ITEM_MARKET_NAME = process.env.ITEM_MARKET_NAME;
const LISTING_FILTER_PARAM = process.env.LISTING_FILTER_PARAM || "";
const LISTING_START_PARAM = process.env.LISTING_START_PARAM || 0;

const ratesPrefix = "rate-";
const historyPrefix = "history-";

// without USD. Count above 3 currencies without original listing currency in array may cause rate limit by Steam.
// Do not work if original currency is USD.
const currenciesToFetch = [
  [3, "EUR"],
  [5, "RUB"],
  [18, "UAH"],
];

module.exports = {
  DETA_BASE_NAME,
  ALLOW_ORIGIN,
  DETA_PUT_MANY_MAX_COUNT,
  HISTORY_LENGTH,
  LISTING_ID,
  ITEM_MARKET_NAME,
  LISTING_FILTER_PARAM,
  LISTING_START_PARAM,
  ratesPrefix,
  historyPrefix,
  currenciesToFetch,
};
