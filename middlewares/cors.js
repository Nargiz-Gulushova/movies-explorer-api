const { ALLOW_ORIGINS, ALLOW_METHODS } = require('../utils/config');

function cors(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (ALLOW_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', ALLOW_METHODS.join(','));
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
}

module.exports = cors;
