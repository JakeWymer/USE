const express = require('express');
const {json} = require('body-parser');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(json());

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});