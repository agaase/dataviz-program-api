var models = require("./models/tables.js");
var striptags = require('striptags');
var ApiCore = (function(){
	return {
		fetchEvents : function(callback){
		  var Events = models["events"];
		  Events.find({}).sort({'timestamp':-1}).lean().exec(function (err, events) {
		    if(err)
		      console.log(err);
		    callback(events);
		  });	
		},
		fetchWallPosts : function(callback){
		  var wallposts = models["wallposts"];
		  wallposts.find({}).sort({'timestamp':-1}).lean().exec(function (err, wps) {
		    if(err)
		      console.log(err);
		    callback(wps);
		  });	
		},
		fetchOpps : function(callback){
			var Opps = models["opps"];
			Opps.find({}).sort({'timestamp':-1}).lean().exec(function (err, opps) {
			  if(err)
			    console.log(err);
			  callback(opps);
			});
		},
		fetchFeedResources : function(callback){
			var FR = models["feedresource"];
			FR.find({}).sort({'timestamp':-1}).lean().exec(function (err, frs){
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

