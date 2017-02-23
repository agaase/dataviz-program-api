var SMTPConnection = require('smtp-connection');
var connection = new SMTPConnection({ignoreTLS : true});

connection.connect(function(){
	console.log("connection established");
	connection.send({from : "ubuntu@aseemagarwal.in",to:"aseem@newschool.edu"}, "Hey! First mail", function(){
		console.log("message sent!");
	})
})

