/**
This script just populates the database with the existence events and opportunities data.
Its a pretty custom script and hence cannot be used generically.
*/

var req = require('request');
var models = require("./models/tables.js");


var eventsUrl = "http://visualizedata.github.io/data/events.json";
var oppUrl = "http://visualizedata.github.io/data/datawork.json";

var saveOpportunities = function(opps,ct){
  if(ct>=opps.length){
    return;
  }
  var opp = opps[ct];
  console.log("saving - "+opp.organizationName);
  if(opp.dateAdded){
      opp["timestamp"] = new Date(opp.dateAdded).getTime();
  }else{
     opp["timestamp"] = 0;
  }
  opp["opp_id"] = "opp_"+parseInt(Math.random()*100000);
  // Create a new cat object
  var dummyRes = new models["opps"](opp);
  // Save to DynamoDB
  dummyRes.save(function(err){
      if(err){
        console.log("error encountered - "+err);
      }else{
        console.log("saved");
      }
      saveOpportunities(opps,++ct);
  });
};

var saveEvents = function(events,ct){
    if(ct>=events.length){
      return;
    }

    var event = events[ct];
    console.log("saving - "+event.name);
    if(event.startDate){
        event["timestamp"] = new Date(event.startDate).getTime();
    }else{
       event["timestamp"] = 0;
    }
    if(event.endDate){
        event["endDate"] = new Date(event.endDate).getTime();
    }else{
        event["endDate"] = 0;
    }
    event["event_id"] = "ev_"+parseInt(Math.random()*100000);
    // Create a new cat object
    var dummyRes = new models["events"](event);
    // Save to DynamoDB
    dummyRes.save(function(err){
        if(err){

          console.log("error encountered - "+err);
        }else{
          console.log("saved");
        }
        saveEvents(events,++ct);
    });
};

function request(url,callback){
  req(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var events = JSON.parse(response.body);
      callback(events, 0);
    }
    else {
      console.error('request failed; exiting');
    }
  });
}
//request(eventsUrl,saveEvents);
request(oppUrl,saveOpportunities);
