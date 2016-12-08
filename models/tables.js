// // create a model using the name of the DynamoDB table and a schema
// var AWS = require("aws-sdk");
// AWS.config.update({
//   endpoint: "https://dynamodb.us-west-2.amazonaws.com",
//   region : "us-west-2"
// });
// var dynamoose = require('dynamoose');
var mongoose = require('mongoose');
require('mongoose-pagination');
mongoose.connect('mongodb://localhost/test');


var Schema = mongoose.Schema;

var eventSchema = new Schema( {
    event_id: String,
    timestamp : Number,
    name : String,
    type : String,
    focus : String,
    endDate : Number,
    location : String,
    url : String,
    notes : String,
    authentication : Number
  });

var oppSchema = new Schema({
    opp_id: String,
    timestamp : Number,
    organizationName : String,
    url : String,
    dataSource : String,
    dataResources : Boolean,
    dataCompetition : Boolean,
    newSchool : Boolean,
    position : Boolean,
    unpaidPosition : Boolean,
    parttimePosition : Boolean,
    fulltimePosition : Boolean,
    grantFellowship : Boolean,
    eligibleAcademic : Boolean,
    timeSensitive : Boolean,
    description : String,
    contactName : String,
    contactEmail : String,
    authentication : Number
  });

var feedResSchema = new Schema({
    _id: String,
    timestamp : Number,
    title : String,
    content : String,
    author : String,
    link : String,
    sourceFeedUrl : String,
    sourceName : String,
    sourceUrl : String,
  });

var wallPostSchema = new Schema({
    wp_id: String,
    timestamp : Number,
    title : String,
    content : String,
    from : String,
    fromEmail : String
  })
// Create cat model with default options
module.exports  = {
  "events" : mongoose.model('events', eventSchema),
  "opps" : mongoose.model('opportunities', oppSchema ),
  "feedresource" : mongoose.model('feedresource', feedResSchema),
   "wallposts" : mongoose.model('wallposts', wallPostSchema)
};
