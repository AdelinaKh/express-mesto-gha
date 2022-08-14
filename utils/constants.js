const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;
const ERROR_NOT_AUTHORIZED = 401;
const AVATAR_VALIDATOR = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

module.exports = {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  ERROR_NOT_AUTHORIZED,
  AVATAR_VALIDATOR,
};
