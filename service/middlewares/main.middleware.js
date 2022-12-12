const { ALLOW_ORIGIN } = require("../constants");

const allowCors = function (req, res, next) {
  res.append("access-control-allow-origin", ALLOW_ORIGIN);
  res.append("access-control-allow-headers", "*");
  next();
};

module.exports = { allowCors };
