var models = require("./models/tables.js");
var ApiCore = (function(){
	return {
		fetchEvents : function(callback){
		  var Events = models["events"];
		  Events.scan().exec(function (err, events) {
		    if(err)
		      console.log(err);
		  	for(var i=0;i<events.length;i++){
		  		events[i]["timestamp"] = new Date(events[i].timestamp).toString().substring(0,15);
		  	}
		    callback(events);
		  });	
		},
		fetchOpps : function(callback){
			var Opps = models["opps"];
			Opps.scan().exec(function (err, opps) {
			  if(err)
			    console.log(err);
		 	  for(var i=0;i<opps.length;i++){
			  	opps[i]["timestamp"] = new Date(opps[i].timestamp).toString().substring(0,15);
			  }
			  callback(opps);
			});
		}
	};
})();

module.exports = ApiCore;

