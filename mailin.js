var mailin = require('mailin');
var farmhash = require('farmhash');
var models = require("./models/tables.js");

/* Start the Mailin server. The available options are:
 *  options = {
 *     port: 25,
 *     webhook: 'http://mydomain.com/mailin/incoming,
 *     disableWebhook: false,
 *     logFile: '/some/local/path',
 *     logLevel: 'warn', // One of silly, info, debug, warn, error
 *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
 *        SMTPBanner: 'Hi from a custom Mailin instance',
 *        // By default, the DNS validation of the sender and recipient domains is disabled so.
 *        // You can enable it as follows:
 *        disableDNSValidation: false
 *     }
 *  };
 * Here disable the webhook posting so that you can do what you want with the
 * parsed message. */
mailin.start({
  port: 2525,
  disableWebhook: true // Disable the webhook posting.
});


/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
  /* connection = {
      from: 'sender@somedomain.com',
      to: 'someaddress@yourdomain.com',
      id: 't84h5ugf',
      authentication: { username: null, authenticated: false, status: 'NORMAL' }
    }
  }; */
 // console.log(connection);
});

var saveToDb = function(obj){
  var dummyRes = new models["wallpost"](obj);
  // Save to DynamoDB
  dummyRes.save(function(err){
      if(err){
        console.log("error encountered - "+err);
      }else{
        console.log("saved");
      }
  });
}
/* Event emitted after a message was received and parsed. */
mailin.on('message', function (connection, data, content) {
  
  /* Do something useful with the parsed message here.
   * Use parsed message `data` directly or use raw message `content`. */
   var entrytime = new Date(data.date).getTime(), fromEmail = data.from[0].address;
   if(fromEmail.indexOf("newschool.edu")>-1){
     var dummyRes = new models["wallposts"]({
      wp_id : farmhash.hash32(""+entrytime+fromEmail),
      timestamp : entrytime,
      from : data.from[0].name,
      fromEmail : fromEmail,
      title : data.subject,
      content : data.html
     });
    // Save to DynamoDB
    dummyRes.save(function(err){
        if(err){
          console.log("error encountered - "+err);
        }else{
          console.log("saved");
        }
    });
  }
});


