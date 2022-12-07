const { Deta } = require("deta");

const deta = Deta();
const db = deta.Base(process.env.DETA_BASE_NAME || "steam-exchange-rate-tracker");

module.exports = { deta, db };
