export const API_URL = import.meta.env.VITE_API_URL;

// proxy with default value
// https://stackoverflow.com/a/29723887/19419998
export const COLORS = new Proxy( // TODO hardcoded colors
  {
    EUR: "#4877ec",
    RUB: "#f31859",
    UAH: "#e1ea33",
    TRY: "#347028",
    KZT: "#23f3e2",
  },
  {
    get(t, n) {
      return t.hasOwnProperty(n) ? t[n] : "#ff8400";
    },
  }
);
