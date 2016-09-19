var express = require('express');
var exphbs  = require('express-handlebars');
var req = require('request');
var cors = require('cors');

var Bear     = require('./app/models/bear');

var app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get("/",function(request, response) {
  response.render('home');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post("/get",function(request,response){

});
