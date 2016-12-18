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
		saveOpp : function(opp,callback){
			var id  = "opp"+new Date().getTime()+parseInt(Math.random()*100);
			opp["opp_id"] = id;
			var dummyRes = models["opps"](opp);
			dummyRes.save(function(err){
		        if(err){
		          callback("error encountered - "+err);
		        }else{
		          callback(id);
		        }
		    });
		},
		saveWallpost : function(wp,callback){
			var id  = "wp"+new Date().getTime()+parseInt(Math.random()*100);
			wp["wp_id"] = id;
			var dummyRes = models["wallposts"](wp);
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
		verifyOpp : function(id,callback){
			var Opps = models["opps"]
			Opps.findOneAndUpdate({"opp_id" : id},{$set:{authentication:2}},{new: true}, function (err, opp) {
			  	if(err){
			        console.log("Something wrong when updating data!");
			    }
			    callback(opp);
			});
		},
		verifyWP : function(id,callback){
			var WPs = models["wallposts"]
			WPs.findOneAndUpdate({"wp_id" : id},{$set:{authentication:2}},{new: true}, function (err, wp) {
			  	if(err){
			        console.log("Something wrong when updating data!");
			    }
			    callback(wp);
			});
		},
		fetchEvents : function(callback,index){
		  var Events = models["events"];
		  index = index ? parseInt(index/10)+1 : 1;
		  Events.paginate({authentication:2}, { page: index, limit: 10,sort: { timestamp: -1 } }, function(err, result) {
		  	if(err)
		      console.log(err);
		    callback(result.docs);
		  });
		},
		fetchWallPosts : function(callback,index){
		  var wallposts = models["wallposts"];
		  index = index ? parseInt(index/10)+1 : 1;
		  wallposts.paginate({authentication:2}, { page: index, limit: 10,sort: { timestamp: -1 } }, function(err, result) {
		  	if(err)
		      console.log(err);
		    callback(result.docs);
		  });
		},
		fetchOpps : function(callback,index){
			var Opps = models["opps"];
			index = index ? parseInt(index/10)+1 : 1;
			Opps.paginate({authentication:2}, { page: index, limit: 10,sort: { timestamp: -1 } }, function(err, result) {
				if(err)
			    console.log(err);
			  callback(result.docs);
			});
		},
		fetchFeedResources : function(callback,index){
			var FR = models["feedresource"];
			index = index ? parseInt(index/10)+1 : 1;
			FR.paginate({}, { page: index, limit: 10,sort: { timestamp: -1 } }, function(err, result) {
			  if(err)
			    console.log(err);
			  var docs = result.docs;
			  
			  docs.forEach(function(entry){
			  		entry.content = striptags(entry.content).toString().substring(0,150);
			  		entry.timestamp = new Date(entry.timestamp).toString().substring(0,15);
			  		entry.sourceName = entry.sourceName.length > 15 ? entry.sourceName.substring(0,15) + ".." : entry.sourceName;
			  });
			  callback(docs);
			});
		}
	};
})();

module.exports = ApiCore;

