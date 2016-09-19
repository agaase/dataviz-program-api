var express = require('express');
var exphbs  = require('express-handlebars');
var req = require('request');
var cors = require('cors');

var Bear     = require('./app/models/bear');

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

//Starting the server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
