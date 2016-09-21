var express = require('express');
var exphbs  = require('express-handlebars');
var req = require('request');
var cors = require('cors');
var resourceModel = require("./models/resource.js");

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
//Just a dummy function to test that the whole things works!
app.post("/pleasesavethis",function(request,response){
  // Create a new cat object
  var dummyRes = new resourceModel({id: 3, name: 'z' , url : "www.123.com"});
  // Save to DynamoDB
  dummyRes.save(function(err){
      if(err){
          response.end("it didn't work");
      }else{
          response.end("it worked");
      }
  });
});

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
