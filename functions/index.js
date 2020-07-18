const functions = require('firebase-functions');
const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/routes')(app);
require('./startup/db') ;
require('./startup/config')();
require('./startup/validation')();


exports.app  = functions.https.onRequest(app);
