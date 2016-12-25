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
    ],
    helpers: {
        short_date: function (d) { return new Date(d.toString()).toString().substring(0,10); },
    }
});

// views is directory for all template files and the template engine is handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//rendering the home page
app.get("/",function(request, response) {
  core.fetchItems(function(events){
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"events" : events, feed : d});  
    })
  },"events")
});


app.post("/items/:model",function(request,response){
    core.fetchItems(function (events) {
      app.render('partials/'+request.params.model+"-items",events,function(err,html){
        response.send(html);
      });  
    },request.params.model,request.body.index);
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

app.post("/savedatasrc",function(request,response){
  request.body["authentication"] = 1;
  core.saveDatasrc(request.body,function(msg){
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

app.get("/datasrc/verify/:id",function(request,response){
  core.verifyDatasrc(request.params.id,function(ds){
    ds.timestamp = new Date(ds.timestamp).toString().substring(0,15);
    core.fetchFeedResources(function(d){
      response.render('layouts/items',{"wallposts" : [ds], feed : d, "verified" : true});  
    }) 
  })
});

app.get("/form/:type",function(request,response){
  core.fetchFeedResources(function(d){
      var type = request.params.type, obj = {};
      obj[type] = true;
      response.render('layouts/form',obj);  
  })
});

app.get("/:model",function(request,response){
  core.fetchItems(function (items) {
    core.fetchFeedResources(function(d){
      var obj = {};
      obj["feed"] = d;
      obj[request.params.model] = items;
      console.log(request.params.model + "--" + items.length);
      response.render('layouts/items',obj);  
    }) 
  },request.params.model);
});

app.get("/about/info",function(request,response){
  response.render('layouts/about');  
});

app.get("/api/info",function(request,response){
  response.render('layouts/api');  
});

app.get("/api/items/:model/:start",function(request,response){
  core.fetchItems(function (items) {
    response.end(JSON.stringify(items));
  },request.params.model,request.params.start);
});


//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
