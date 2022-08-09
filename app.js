const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const user = require('./routes/users');
const card = require('./routes/cards');
const { login, createUsers } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
// app.use(express.json());
app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUsers);

app.use(auth);

// app.use(user);
app.use(card);

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
