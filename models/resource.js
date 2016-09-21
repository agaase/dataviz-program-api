// create a model using the name of the DynamoDB table and a schema

var AWS = require("aws-sdk");
AWS.config.update({
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
var dynamoose = require('dynamoose');

// Create cat model with default options
module.exports  = dynamoose.model('Resource', { id: Number, name: String, url: String });
