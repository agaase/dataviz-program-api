var express = require('express');
var exphbs  = require('express-handlebars');
var cors = require('cors');
var core = require("./core.js");
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json());
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
      response.render('layouts/items',{"events" : events, feed : d});  
    })
  })
});


app.post("/events",function(request,response){
    core.fetchEvents(function (events) {
      for(var i=0;i<events.length;i++){
        events[i]["timestamp"] = new Date(events[i].timestamp).toString().substring(0,15);
      }
      app.render('partials/event-items',events,function(err,html){
        response.send(html);
      });  
    },request.body.index);
});


app.post("/opps",function(request,response){
    core.fetchOpps(function (opps) {
      for(var i=0;i<opps.length;i++){
        opps[i]["timestamp"] = new Date(opps[i].timestamp).toString().substring(0,15);
      }
      app.render('partials/opp-items',opps,function(err,html){
        response.send(html);
      });  
    },request.body.index);
});

app.post("/feed",function(request,response){
    core.fetchFeedResources(function (list) {
      app.render('partials/feed-items',list,function(err,html){
        response.send(html);
      });  
    },request.body.index);
});


app.post("/saveevent",function(request,response){
  request.body["authentication"] = 1;
  core.saveEvent(request.body,function(msg){
    response.send(msg);
  })
});


app.post("/saveopp",function(request,response){
  request.body["authentication"] = 1;
  request.body["timestamp"] = new Date();
  core.saveOpp(request.body,function(msg){
    response.send(msg);
  })
});

app.post("/savewallpost",function(request,response){
  request.body["authentication"] = 1;
  core.saveWallpost(request.body,function(msg){
    response.send(msg);
  })
});

app.get("/event/verify/:id",function(request,response){
  core.verifyEvent(request.params.id,function(ev){
    ev.timestamp = new Date(ev.timestamp).toString().substring(0,15);
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"events" : [ev], feed : d, "verified" : true});  
    }) 
  })
});


app.get("/opp/verify/:id",function(request,response){
  core.verifyOpp(request.params.id,function(opp){
    opp.timestamp = new Date(opp.timestamp).toString().substring(0,15);
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"opps" : [opp], feed : d, "verified" : true});  
    }) 
  })
});


app.get("/wallpost/verify/:id",function(request,response){
  core.verifyWP(request.params.id,function(wp){
    wp.timestamp = new Date(wp.timestamp).toString().substring(0,15);
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"wallposts" : [wp], feed : d, "verified" : true});  
    }) 
  })
});

app.get("/form/:type",function(request,response){
  core.fetchFeedResources(function(d){
      var type = request.params.type, obj = {};
      if(type == "events"){
        obj["events"] = true
      }
      if(type == "opps"){
        obj["opps"] = true
      }
      if(type == "wallposts"){
        obj["wallposts"] = true
      }
      response.render('layouts/form',obj);  
  })
});

app.get("/events",function(request,response){
  core.fetchEvents(function (events) {
    for(var i=0;i<events.length;i++){
      events[i]["timestamp"] = events[i].timestamp.toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"events" : events, feed : d});  
    }) 
  });
});

app.get("/opps",function(request,response){
  core.fetchOpps(function (opps) {
    for(var i=0;i<opps.length;i++){
        opps[i]["timestamp"] = opps[i].timestamp.toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"opps" : opps, feed : d});  
    }) 
  });
});

app.get("/wall",function(request,response){
  core.fetchWallPosts(function (wps) {
    for(var i=0;i<wps.length;i++){
        wps[i]["timestamp"] = new Date(wps[i].timestamp).toString().substring(0,15);
    }
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"wallposts" : (wps.length ? wps : [{"title" : "No Content"}]), feed : d});  
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
