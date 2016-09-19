var resourceModel = require("./models/resource.js");

resourceModel.createTable(function(err,response){
  if(err){
    console.log(err);
  }else if(response){
    console.log(response);
  }

});
