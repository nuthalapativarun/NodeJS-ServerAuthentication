//Imports
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//DB Setup
// const MongoClient = require('mongodb').MongoClient;
// mongoose.Promise = global.Promise;
// Connect to the db
mongoose.connect('mongodb://localhost:27017/test', function (err, db) {
  if (err) {
      throw err;
  } else {
      console.log("successfully connected to the database");
  }
});
//App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

//Server Setup
const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:",port);