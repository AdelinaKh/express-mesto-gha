const express = require('express');
const bodyParser = require('body-parser');
const { Joi, celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
// const user = require('./routes/users');
const card = require('./routes/cards');
const { login, createUsers } = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  AVATAR_VALIDATOR,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();
// app.use(express.json());
app.use(bodyParser.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(AVATAR_VALIDATOR),
  }),
}), createUsers);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

// app.use(user);
app.use(card);

app.use(errors());

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
main();
