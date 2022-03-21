"use strict";

var express = require('express');

var app = express();

var path = require('path');

app.use(express["static"](__dirname + '/public'));
app.use('/build/', express["static"](path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express["static"](path.join(__dirname, 'node_modules/three/examples/jsm')));
app.listen(3000, function () {
  return console.log('Visit http://127.0.0.1:3000');
});
