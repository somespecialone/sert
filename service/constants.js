const DETA_BASE_NAME = process.env.DETA_BASE_NAME || "SERT";
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

const DETA_PUT_MANY_MAX_COUNT = Number(process.env.DETA_PUT_MANY_MAX_COUNT || 25);
const HISTORY_LENGTH = Number(process.env.HISTORY_LENGHT || 30);

const LISTING_ID = process.env.LISTING_ID;
const ITEM_MARKET_NAME = process.env.ITEM_MARKET_NAME;
const LISTING_FILTER_PARAM = process.env.LISTING_FILTER_PARAM || "";
const LISTING_START_PARAM = process.env.LISTING_START_PARAM || 0;

// without USD. Count above 3 currencies without original listing currency may cause rate limit by Steam.
// Do not work if original currency is USD.
const CURRENCIES_TO_FETCH = process.env.CURRENCIES_TO_FETCH || "EUR,RUB,UAH";

const RATES_PREFIX = "rate-";
const HISTORY_PREFIX = "history-";

/**
 * @see https://partner.steamgames.com/doc/store/pricing/currencies
 */
const CURRENCIES = {
  // USD: 1, // UnitedStates Dollar
  GBP: 2, // United Kingdom Pound
  EUR: 3, // European Union Euro
  CHF: 4, // Swiss Francs
  RUB: 5, // Russian Rouble
  PLN: 6, // Polish Złoty
  BRL: 7, // Brazilian Reals
  JPY: 8, // Japanese Yen
  NOK: 9, // Norwegian Krone
  IDR: 10, // Indonesian Rupiah
  MYR: 11, // Malaysian Ringgit
  PHP: 12, // Philippine Peso
  SGD: 13, // Singapore Dollar
  THB: 14, // Thai Baht
  VND: 15, // Vietnamese Dong
  KRW: 16, // South KoreanWon
  TRY: 17, // Turkish Lira
  UAH: 18, // Ukrainian Hryvnia
  MXN: 19, // Mexican Peso
  CAD: 20, // Canadian Dollars
  AUD: 21, // Australian Dollars
  NZD: 22, // New Zealand Dollar
  CNY: 23, // Chinese Renminbi (yuan)
  INR: 24, // Indian Rupee
  CLP: 25, // Chilean Peso
  PEN: 26, // Peruvian Sol
  COP: 27, // Colombian Peso
  ZAR: 28, // South AfricanRand
  HKD: 29, // Hong KongDollar
  TWD: 30, // New TaiwanDollar
  SAR: 31, // Saudi Riyal
  AED: 32, // United ArabEmirates Dirham
  // SEK : 33,  // Swedish Krona
  ARS: 34, // Argentine Peso
  ILS: 35, // Israeli NewShekel
  // BYN : 36,  // Belarusian Ruble
  KZT: 37, // Kazakhstani Tenge
  KWD: 38, // Kuwaiti Dinar
  QAR: 39, // Qatari Riyal
  CRC: 40, // Costa Rican Colón
  UYU: 41, // Uruguayan Peso
  // BGN : 42,  // Bulgarian Lev
  // HRK : 43 , // Croatian Kuna
  // CZK : 44 , // Czech Koruna
  // DKK : 45 , // Danish Krone
  // HUF : 46 , // Hungarian Forint
  // RON : 47 , // Romanian Leu
};

module.exports = {
  DETA_BASE_NAME,
  ALLOW_ORIGIN,
  DETA_PUT_MANY_MAX_COUNT,
  HISTORY_LENGTH,
  LISTING_ID,
  ITEM_MARKET_NAME,
  LISTING_FILTER_PARAM,
  LISTING_START_PARAM,
  RATES_PREFIX,
  HISTORY_PREFIX,
  CURRENCIES,
  CURRENCIES_TO_FETCH,
};
