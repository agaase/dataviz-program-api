var mongoose = require('mongoose');
require('mongoose-pagination'); 
var mongoosePaginate = require('mongoose-paginate');    
mongoose.connect('mongodb://localhost/test');


var Schema = mongoose.Schema;

var eventSchema = new Schema( {
    event_id: String,
    timestamp: { type: Date},
    name : String,
    type : String,
    focus : String,
    endDate : { type: Date},
    location : String,
    url : String,
    notes : String,
    authentication : Number,
    from : String,
    fromEmail : String
  });
eventSchema.plugin(mongoosePaginate);

var oppSchema = new Schema({
    opp_id: String,
    timestamp: { type: Date, default: Date.now },
    organizationName : String,
    url : String,
    dataSource : Boolean,
    dataResources : Boolean,
    dataCompetition : Boolean,
    newSchool : Boolean,
    position : Boolean,
    unpaidPosition : Boolean,
    parttimePosition : Boolean,
    fulltimePosition : Boolean,
    grantFellowship : Boolean,
    eligibleAcademic : Boolean,
    description : String,
    contactName : String,
    contactEmail : String,
    authentication : Number,
    from : String,
    fromEmail : String
  });
oppSchema.plugin(mongoosePaginate);

var feedResSchema = new Schema({
    _id: String,
    timestamp : Date,
    title : String,
    content : String,
    author : String,
    link : String,
    sourceFeedUrl : String,
    sourceName : String,
    sourceUrl : String,
    image: String
  });
feedResSchema.plugin(mongoosePaginate);

var wallPostSchema = new Schema({
    wp_id: String,
    timestamp: { type: Date, default: Date.now },
    title : String,
    content : String,
    from : String,
    authentication : Number,
    fromEmail : String,
  })
wallPostSchema.plugin(mongoosePaginate);

// Create cat model with default options
module.exports  = {
  "events" : mongoose.model('events', eventSchema),
  "opps" : mongoose.model('opportunities', oppSchema ),
  "feedresource" : mongoose.model('feedresource', feedResSchema),
   "wallposts" : mongoose.model('wallposts', wallPostSchema)
};
