const allowCors = function (req, res, next) {
  res.append("access-control-allow-origin", "*");
  res.append("access-control-allow-headers", "*");
  next();
};

module.exports = { allowCors };
