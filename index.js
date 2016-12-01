var express = require('express');
var exphbs  = require('express-handlebars');
var cors = require('cors');
var core = require("./core.js");

var app = express();
app.use(cors());

app.set('port', 8080);

//The public directory where all the static resources are served from
app.use(express.static('./public'));


// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/partials/'
    ]
});

// views is directory for all template files and the template engine is handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//rendering the home page
app.get("/",function(request, response) {
  core.fetchEvents(function(events){
    for(var i=0;i<events.length;i++){
      events[i]["timestamp"] = new Date(events[i].timestamp).toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/events',{"events" : events, feed : d});  
    })
  })
});


app.get("/form",function(request,response){
  core.fetchFeedResources(function(d){
      response.render('layouts/form',{feed : d});  
    })
});

app.get("/events",function(request,response){
  core.fetchEvents(function (events) {
    for(var i=0;i<events.length;i++){
      events[i]["timestamp"] = new Date(events[i].timestamp).toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/events',{"events" : events, feed : d});  
    }) 
  });
});

app.get("/opps",function(request,response){
  core.fetchOpps(function (opps) {
    for(var i=0;i<opps.length;i++){
        opps[i]["timestamp"] = new Date(opps[i].timestamp).toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/opps',{"opps" : opps, feed : d});  
    }) 
  });
});

app.get("/wall",function(request,response){
  core.fetchWallPosts(function (wps) {
    for(var i=0;i<wps.length;i++){
        wps[i]["timestamp"] = new Date(wps[i].timestamp).toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/wall',{"wallposts" : wps, feed : d});  
    }) 
  });
});

app.get("/api",function(request,response){
  response.render('layouts/api');  
});

app.get("/api/events",function(request,response){
  core.fetchEvents(function (events) {
    response.end(JSON.stringify(events));
  });
});

app.get("/api/opps",function(request,response){
  core.fetchOpps(function (opps) {
    response.end(JSON.stringify(opps));
  });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
