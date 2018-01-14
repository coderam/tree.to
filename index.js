// Import the library
const server = require('server');
const express = require('express');
var nano = require('nano')('http://localhost:5984');

const app = express;
const { get, post } = server.router;
const { render, json } = server.reply;

const nunjucks = require('nunjucks');
var env = nunjucks.configure('views');

const options = {
    public: 'static',
    port: 3636
};

nano.db.create('eternities');
var eternitites = nano.db.use('eternities');
eternitites.insert({ tite: "hi" }, 'eternity', function(err, body, header) {
  if (err) {
    console.log('[.insert] ', err.message);
    return;
  }
  console.log('you have added to the eternity.')
});

server(options,[
  get('/', ctx => nunjucks.render('index_home.hbs', Object.assign({}, ctx.locals, { chai: "chai" }))),
  post('/', ctx => json(ctx.data)), 
  get(ctx => status(404))
]);

// Answers to any request
server(options);
