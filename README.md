# <p align="center">Steam Exchange Rate Tracker</p>

[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)
[![license](https://img.shields.io/github/license/somespecialone/sert)](https://github.com/somespecialone/sert/blob/master/LICENSE)
[![steam](https://shields.io/badge/steam-1b2838?logo=steam)](https://store.steampowered.com/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![Tests](https://github.com/somespecialone/sert/actions/workflows/tests.yml/badge.svg)](https://github.com/somespecialone/sert/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/somespecialone/sert/branch/master/graph/badge.svg?token=GM6IQU4U2K)](https://codecov.io/gh/somespecialone/sert)
[![CodeFactor](https://www.codefactor.io/repository/github/somespecialone/sert/badge)](https://www.codefactor.io/repository/github/somespecialone/sert)
---

[![Install on Space](https://deta.space/buttons/dark.svg)](https://deta.space/discovery/r/8vmyujugt4s3617u)

---

> **Try web converter [sert.somespecial.one](https://sert.somespecial.one) 🧮**

## How it works

Every hour on [9 and 39 minute](./Spacefile) app checks if rates data in db is expired (updated yesterday or even older)
and if true, [do next](./backend/src/cron/main.cron.js):

1. Get data of specified item on steammarket for each needed currency.
2. Calculate exchange rates by comparing item price in previously fetched currencies.
3. Save data to db 😎.

> ⚠️ Possible to get max 4 currencies for each schedule wake up due to `Steam` rate limit.

## API

All routes under `/api` path.
All currency rates eval to 1 USD 💵.

All routes have `X-Expired-At` ⌛ header for caching purposes.

### Rates

> GET `/api/rates`

```json5
{
  "EUR": [
    0.91, // rate
    1683121141 // updated ts in seconds
  ],
  "UAH": [
    36.71,
    1683121141
  ]
}
```

### History

> GET `/api/history`

```json5
{
  "EUR": [
    [
      0.91,
      1683121141
    ],
    [
      0.91,
      1682986141
    ],
    // ...
  ],
  "UAH": [
    [
      36.71,
      1683121141
    ],
    [
      36.94,
      1682986141
    ],
    // ...
  ]
}
```

| Param    | Descr                               | Default |
|----------|-------------------------------------|---------|
| `length` | Max length of history entries array | 30      |
| `all`    | Show full list of entries           | `false` |

Examples:

* https://sert.somespecial.one/api/history?length=20
* https://sert.somespecial.one/api/history?all

> ⚠️ `Deta micro` have response size limit, so with `all` data can exceed this which leads to error.

## Space 🚀🌌

If you want other currencies just install this app on your `Deta space` with button above.

You need "stable" ❗ item listing on steammarket (preferable your own item).
Which means that this item will not walk from one market page to another.

> ❗ Tip: place your cheaper item on market with overprice big enough for last market page

All env variables listed in [Spacefile](./Spacefile)

## Tests 🧪

Copy repo, install deps, place filled `.env` in `backend` dir and there run npm script:

```shell
npm run test
```
