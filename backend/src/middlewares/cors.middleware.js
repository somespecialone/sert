const allowCors = (req, res, next) => {
  res.append("access-control-allow-origin", process.env.ALLOW_ORIGIN || "*");
  res.append("access-control-allow-headers", "*");
  next();
};

module.exports = { allowCors };
