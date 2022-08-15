const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const handleError = require('./middlewares/handle-error');

const { PORT = 3000 } = process.env;
const app = express();
const routes = require('./routes/index');

app.use(bodyParser.json());

app.use(express.json());
app.use(routes);

app.use(errors());
app.use(handleError);

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
