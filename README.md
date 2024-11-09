# Steam Exchange Rate Tracker

*Stay updated on Steam market prices and convert currencies with easy!*

[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)
[![license](https://img.shields.io/github/license/somespecialone/sert)](https://github.com/somespecialone/sert/blob/master/LICENSE)
[![steam](https://shields.io/badge/steam-1b2838?logo=steam)](https://store.steampowered.com/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![API](https://github.com/somespecialone/sert/actions/workflows/api.yml/badge.svg)](https://github.com/somespecialone/sert/actions/workflows/api.yml)
[![Test](https://github.com/somespecialone/sert/actions/workflows/test.yml/badge.svg)](https://github.com/somespecialone/sert/actions/workflows/test.yml)
[![Converter](https://github.com/somespecialone/sert/actions/workflows/converter.yml/badge.svg)](https://github.com/somespecialone/sert/actions/workflows/converter.yml)
[![codecov](https://codecov.io/gh/somespecialone/sert/branch/master/graph/badge.svg?token=GM6IQU4U2K)](https://codecov.io/gh/somespecialone/sert)
[![CodeFactor](https://www.codefactor.io/repository/github/somespecialone/sert/badge)](https://www.codefactor.io/repository/github/somespecialone/sert)
---

> [!NOTE]
> 
> **Web converter [converter.somespecial.one](https://converter.somespecial.one) 🧮**
> 
> **API [sert.somespecial.one](https://sert.somespecial.one)**
>
> **Python API consumer [aiosteampy.converter](https://github.com/somespecialone/aiosteampy/blob/master/aiosteampy/ext/converter.py)**

## How it works

Every hour on **9 and 39 minute** app checks if rates data in db is expired (updated yesterday or even older)
and if true, _update currency rates_:

1. Get data of specified item on steammarket for each needed currency.
2. Calculate exchange rates by comparing item price in previously fetched currencies.
3. Save data to db 😎.

> [!WARNING]
> It is possible to get max 4 currencies for each schedule wake up due to `Steam` rate limit.

## API

All currency rates eval to 1 USD 💵.

> [!IMPORTANT]
> All routes have `Expires` ⌛ header
> So please consider using a caching mechanism to avoid unnecessary requests to the service as its resources are limited.

### Rates

> GET `/rates`

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

> GET `/history`

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

* https://sert.somespecial.one/history?length=20
* https://sert.ssomespecial.one/history?all


[//]: # (## Tests 🧪)
[//]: # ()
[//]: # (Copy repo, install deps, place filled `.env` in `api` dir and there run npm script:)
[//]: # ()
[//]: # (```shell)
[//]: # (npm run api:test)
[//]: # (```)
