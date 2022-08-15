const Default = require('../errors/Default');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || Default;
  const message = statusCode === Default ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
