// create a model using the name of the DynamoDB table and a schema
var AWS = require("aws-sdk");
AWS.config.update({
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
var dynamoose = require('dynamoose');

// Create cat model with default options
module.exports  = {
  "events" : dynamoose.model('events', {
    event_id: String,
    timestamp : Number,
    name : String,
    type : String,
    focus : String,
    endDate : Number,
    location : String,
    url : String,
    notes : String
  }),
  "opps" : dynamoose.model('opportunities', {
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
    contactEmail : String})
};
