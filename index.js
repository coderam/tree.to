// Import the library
const server = require('server');
const express = require('express');
const nano = require('nano')('http://localhost:5984');

const settings = require('settings');

const app = express;
const { get, post } = server.router;
const { render, json, redirect, status } = server.reply;

const nunjucks = require('nunjucks');
var env = nunjucks.configure('views'); 

var options = {
    public: 'static',
    port: 3636,
    session: {
        activated: false,
    }
}; 


nano.db.get(settings.COUCHDB_PREFIX+'treeternities', function(err, hi) {
   if (err) {
       nano.db.create(settings.COUCHDB_PREFIX+'treeternities', function(err, hi) {
            if (err)
                console.log('db already hi')
            else
                console.log('db hi')
        });
       
   }
       
});

var treeternities = nano.use(settings.COUCHDB_PREFIX+'treeternities');

if (settings.LOCAL) {
treeternities.insert({ title: "hi", uplifting: "uplifting", how: "areyouhi" }, function(err, body, header) {
  if (err) {
    console.log('[.insert] ', err.message);
  } else {
      console.log('you have added to the treeternity.', body)
  }
});
}

var treeternities_each = [];

treeternities.list(function(err, body) {
  if (!err) {
    //windriders_each = body.rows;
    console.log('hi')
    body.rows.forEach(function(doc) {
      //console.log(doc);
        console.log(doc.id);
        treeternities.get(doc.id, function(err,eternity) {
            treeternities_each.push(eternity);
           console.log(eternity); 
        });
    });
  } else {
      
      console.log("error", err);
  }
});

/* 
{% set length = windriders.length if images.length < 13 else 13 %} 
        {% for i in range(0, length) %}
            {{windriders[i] | dump}}
            {{windriders[i]["id"]}} {{windriders[i]._id}}
        {% endfor %}
        */

if (options.session.activated)
    settings.HTML_ONLY = false;

server(options,[
  get('/index.html', ctx => nunjucks.render('home.hbs', Object.assign({}, ctx.locals, 
                                                                  { chai: "chai", 
                                                                    settings: settings,
                                                                    options: options,
                                                                    treeternities: treeternities_each
                                                                  }))),

    
  get('/left-sidebar.html', ctx => nunjucks.render('left-sidebar.hbs', Object.assign({}, ctx.locals, 
                                                                  { chai: "chai", 
                                                                    settings: settings,
                                                                    options: options,
                                                                    treeternities: treeternities_each
                                                                  }))),
  get('/right-sidebar.html', ctx => nunjucks.render('right-sidebar.hbs', Object.assign({}, ctx.locals, 
                                                                  { chai: "chai", 
                                                                    settings: settings,
                                                                    options: options,
                                                                    treeternities: treeternities_each
                                                                  }))),
    
  get('/no-sidebar.html', ctx => nunjucks.render('no-sidebar.hbs', Object.assign({}, ctx.locals, 
                                                                  { chai: "chai", 
                                                                    settings: settings,
                                                                    options: options,
                                                                    treeternities: treeternities_each
                                                                  }))),  
  get('/contact.html', ctx => nunjucks.render('contact.hbs', Object.assign({}, ctx.locals, 
                                                                  { chai: "chai", 
                                                                    settings: settings,
                                                                    options: options,
                                                                    treeternities: treeternities_each
                                                                  }))),
    /* email katherine at 
    walter passmore, get contact info from katherine to walter.  
    lots of organizations in texas and elsewhere 
    alliance for community trees.  arbor day foundation, dana karcher
    putting all orgs on a Map
    california relief maps.
    tree folks
    when we plant where we plant is localized
    who are the partners
    davids birthday 
    
    
    
    small non-profit organizations */
  get('/', ctx => {
    return redirect('/index.html');
  }), 
  get('/activated.html', ctx => {
    options.session.activated = true;
    return redirect('/index.html?activated');
  }),
  post('/', ctx => json(ctx.data)), 
  get(ctx => status(404))
]);

// Answers to any request
server(options);
