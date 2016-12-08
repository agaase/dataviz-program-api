var models = require("./models/tables.js");
var striptags = require('striptags');
var ApiCore = (function(){
	return {
		saveEvent : function(event,callback){
			var id  = "ev"+new Date().getTime()+parseInt(Math.random()*100);
			event["event_id"] = id;
			var dummyRes = models["events"](event);
			dummyRes.save(function(err){
		        if(err){
		          callback("error encountered - "+err);
		        }else{
		          callback(id);
		        }
		    });
		},
		verifyEvent : function(id,callback){
			var Events = models["events"]
			Events.findOneAndUpdate({"event_id" : id},{$set:{authentication:2}},{new: true}, function (err, event) {
			  	if(err){
			        console.log("Something wrong when updating data!");
			    }
			    callback(event);
			});
		},
		fetchEvents : function(callback){
		  var Events = models["events"];
		  Events.find({authentication:2}).sort({'timestamp':-1}).lean().paginate(1,10).exec(function (err, events) {
		    if(err)
		      console.log(err);
		    callback(events);
		  });	
		},
		fetchWallPosts : function(callback){
		  var wallposts = models["wallposts"];
		  wallposts.find({}).sort({'timestamp':-1}).lean().paginate(1,10).exec(function (err, wps) {
		    if(err)
		      console.log(err);
		    callback(wps);
		  });	
		},
		fetchOpps : function(callback){
			var Opps = models["opps"];
			Opps.find({authentication:2}).sort({'timestamp':-1}).lean().paginate(1,10).exec(function (err, opps) {
			  if(err)
			    console.log(err);
			  callback(opps);
			});
		},
		fetchFeedResources : function(callback){
			var FR = models["feedresource"];
			FR.find({}).sort({'timestamp':-1}).lean().paginate(1,10).exec(function (err, frs){
			  if(err)
			    console.log(err);
			  var filtered = [];
			  frs.forEach(function(entry){
			  		entry.content = striptags(entry.content).toString().substring(0,150);
			  		entry.timestamp = new Date(entry.timestamp).toString().substring(0,15);
			  		entry.sourceName = entry.sourceName.length > 15 ? entry.sourceName.substring(0,15) + ".." : entry.sourceName;
			  });
			  callback(frs);
			});
		}
	};
})();

module.exports = ApiCore;

