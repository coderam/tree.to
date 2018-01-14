// Import the library
const server = require('server');
const express = require('express');
const nano = require('nano')('http://localhost:5984');

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
var eternities = nano.use('eternities');
eternities.insert({ title: "hi", uplifting: "uplifting", how: "areyouhi" }, function(err, body, header) {
  if (err) {
    console.log('[.insert] ', err.message);
  }
  console.log('you have added to the eternity.', body)
});

var eternities_each = [];

eternities.list(function(err, body) {
  if (!err) {
    //eternities_each = body.rows;
      
    body.rows.forEach(function(doc) {
      //console.log(doc);
        console.log(doc.id);
        eternities.get(doc.id, function(err,eternity) {
            eternities_each.push(eternity);
           console.log(eternity); 
        });
    });
  } else {
      
      console.log("error", err);
  }
});

/* 
{% set length = eternities.length if images.length < 13 else 13 %} 
        {% for i in range(0, length) %}
            {{eternities[i] | dump}}
            {{eternities[i]["id"]}} {{eternities[i]._id}}
        {% endfor %}
        */

server(options,[
  get('/', ctx => nunjucks.render('index_home.hbs', Object.assign({}, ctx.locals, 
                                                                  { chai: "chai", 
                                                                    eternities: eternities_each
                                                                  }))),
  post('/', ctx => json(ctx.data)), 
  get(ctx => status(404))
]);

// Answers to any request
server(options);
