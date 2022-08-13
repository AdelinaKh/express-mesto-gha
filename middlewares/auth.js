const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/NotAuthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(NotAuthorized)
      .send({ message: 'Необходи авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (err) {
    return res
      .status(NotAuthorized)
      .send({ message: 'Необходима авторизация' });
  }

  return next();
};
