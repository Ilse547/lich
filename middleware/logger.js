function logger(req, res, next) {
  const ip =
    req.ip ||
    (req.connection && req.connection.remoteAddress) ||
    (req.socket && req.socket.remoteAddress) ||
    'unknown';

  const now = new Date().toUTCString();
  console.log(`[${now}] ${ip} ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = { logger };