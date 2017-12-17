/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8001;
var notFound = require('./utils/404')();

var environment = process.env.NODE_ENV;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api', require('./routes'));

console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    // Quaisquer chamadas inválidas para templateUrls estão sob o aplicativo 
    // e devem retornar 404
    app.use('/app/*', function (req, res, next) {
      notFound.send404(req, res);
    });
    // Chamadas inválidas  devem retornar o objeto de erro.
    // contra ataques XSS refletidos
    app.use('/js/*', function (req, res, next) {
      notFound.send404(req, res);
    });
    app.use('/images/*', function (req, res, next) {
      notFound.send404(req, res);
    });
    app.use('/styles/*', function (req, res, next) {
      notFound.send404(req, res);
    });
    // Quaisque chamada devem retornar index.html
    app.use('/*', express.static('./build/index.html'));
    break;
  default:
    console.log('** DEV **');
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    // Quaisquer chamadas inválidas para templateUrls estão sob o aplicativo 
    // e devem retornar 404
    app.use('/app/*', function (req, res, next) {
      notFound.send404(req, res);
    });
    // Quaisquer ligações devem retornar index.html
    app.use('/*', express.static('./src/client/index.html'));
    break;
}

app.listen(port, function () {
  console.log('Servidor Express que escuta na porta ' + port);
  console.log('env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});
