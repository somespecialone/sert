const { Deta } = require("deta");

const { DETA_BASE_NAME } = require("../constants");

const deta = Deta();
const db = deta.Base(DETA_BASE_NAME);

module.exports = { deta, db };
