var models = require("./models/tables.js");
var striptags = require('striptags');
var nodemailer = require('nodemailer');

var ApiCore = (function(){
	var smtpConfig = {
	    host: 'localhost',
	    port: 25,
	   ignoreTLS : true
	};

	var sendMail = function(email,itemUrl,callback){
		if(email && itemUrl){
			var link = "http://35.161.122.132:8080/"+itemUrl;
			var transporter = nodemailer.createTransport(smtpConfig);
			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: '<noreply@newschool-dataviz.com>',
			    to: email,
			    subject: "Verify your added post",
			    text: "Please click on this link below to verify your post.\n"+link,
			    html: "Please click on this link below to verify your post.\n<a href='"+link+"'>"+link+"</a"
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			    console.log('Message sent: ' + info.response);
			    callback();
			});

		}
	};

	return {
		saveEvent : function(event,callback){
			var id  = "ev"+new Date().getTime()+parseInt(Math.random()*100);
			event["event_id"] = id;
			var dummyRes = models["events"](event);
			dummyRes.save(function(err){
		        if(err){
		          callback("error encountered - "+err);
		        }else{
		          sendMail(event.fromEmail,"event/verify/"+id,function(){
		          	callback("success");	
		          })	
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
		          sendMail(opp.fromEmail,"opp/verify/"+id,function(){
		          	callback("success");	
		          })	
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
		          sendMail(wp.fromEmail,"wallpost/verify/"+id,function(){
		          	callback("success");	
		          })	
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
		
		fetchItems : function(callback,modelKey,index){
			var model = models[modelKey];
			if(model){
				index = typeof(index) !== "undefined" ? parseInt(index/10)+1 : 1;
				model.paginate({authentication:2}, { page: index, limit: 10,sort: { timestamp: -1 } }, function(err, result) {
					if(err)
				    console.log(err);
				  	callback(result.docs.length ? result.docs : [{"nocontent" : true}]);
				});	
			}else{
				callback([{"error" : true,"msg" : "invalid request, please try again"}]);
			}
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

