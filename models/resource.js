var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-west-2",
  accessKeyId : "AKIAI5VN2DDWXSSUMM6Q",
  secretAccessKey : "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",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
var DynamoDBModel = require('dynamodb-model');

var resourceSchema = new DynamoDBModel.Schema({
  resourceId: {
    type: Number,
    key: 'hash'     // indicates a Hash key
  },
  url : String,
  name: String,
  created: Date     // will be converted to a number with Date.getTime
});

// create a model using the name of the DynamoDB table and a schema
module.exports = new DynamoDBModel.Model('dynamo-resources', resourceSchema);
