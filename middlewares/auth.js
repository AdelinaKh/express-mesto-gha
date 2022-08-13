const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/NotAuthorized');

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new NotAuthorized('Необходима авторизация');
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (err) {
//     throw new NotAuthorized('Необходима авторизация');
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса
//   return next(); // пропускаем запрос дальше
// };

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
