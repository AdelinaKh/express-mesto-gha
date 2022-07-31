const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/users');
const card = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62dedea7dd5fa23d4325fb30',
  };

  next();
});

app.use(user);
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
