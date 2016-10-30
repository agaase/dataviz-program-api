var express = require('express');
var exphbs  = require('express-handlebars');
var req = require('request');
var cors = require('cors');
var models = require("./models/tables.js");

var app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

//The public directory where all the static resources are served from
app.use(express.static(__dirname + '/public'));

// views is directory for all template files and the template engine is handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//rendering the home page
app.get("/",function(request, response) {
  response.render('home');
});

app.get("/events",function(request,response){
  var Events = models["events"];
  console.log("request received");
  Events.scan().exec(function (err, events) {
    if(err)
      console.log(err);
    response.end(JSON.stringify(events));
  });
});

app.get("/opportunities",function(request,response){
  var Opportunities = models["opportunities"];
  console.log("request received");
  Opportunities.scan().exec(function (err, opps) {
    if(err)
      console.log(err);
    response.end(JSON.stringify(opps));
  });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
