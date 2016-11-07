var models = require("./models/tables.js");
var ApiCore = (function(){
	return {
		fetchEvents : function(callback){
		  var Events = models["events"];
		  Events.scan().exec(function (err, events) {
		    if(err)
		      console.log(err);
		    callback(events);
		  });	
		},
		fetchOpps : function(callback){
			var Opps = models["opps"];
			Opps.scan().exec(function (err, opps) {
			  if(err)
			    console.log(err);
			  callback(opps);
			});
		}
	};
})();

module.exports = ApiCore;

