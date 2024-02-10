const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser'); // body parser

app.use(bodyParser.json()); // parse application/json  //this will parse the incoming request body and convert it to JSON

app.use('/', userRoutes); // user routes
module.exports = app;