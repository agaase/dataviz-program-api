var request = require("request");
var feed = require('feed-read');
var async = require('async');
var farmhash = require('farmhash');
var schedule = require('node-schedule');
var scrape;

var LIMIT = 10;
var UNABLE_TO_CONNECT = "Unable to connect.";
var URLS = ['http://feeds.feedburner.com/InformationIsBeautiful?format=xml',
            'http://feeds.feedburner.com/CoolInfographics?format=xml',
            'http://flowingdata.com/feed',
            'http://nytlabs.com/blog/feed.xml',
            'https://groups.google.com/forum/feed/data-vis-jobs/msgs/rss_v2_0.xml'];
var models = require("./models/tables.js");


 
var FR = models.feedresource, items = [];

function req() {
    var tasks = [];
    URLS.forEach(function(entry){
        tasks.push(function(callback) {
            feed(entry, function(err,ites){
              onRssFetched(err,ites);
              callback(null);
            });
        });
    });
    async.parallel(tasks, function done(err, results) {
        scrape = require('html-metadata');
        articleInfo(items,0,[])
    });
}

var articleInfo = function(items, ct, entries){
    if(ct==items.length){
        updateDB(entries);
    }else{
        var item = items[ct];
        scrape(item.link,function(err,metadata){
           try{
            console.log(metadata.openGraph.image.url);
            item["image"] = metadata.openGraph.image.url; 
            console.log(item.image);
           }catch(err){
           }
           entries.push(item);
           ct++;
           console.log(entries.length +"/"+items.length);
           articleInfo(items,ct,entries);
        });
    }
}

var updateDB = function(items){
  console.log(items[0].image);
  console.log("inserting - "+items.length);
  FR.collection.insert(items, { ordered: false },function (err) {
    if (err) {  console.log("cont."); }
    console.log('Ta-da!');
  });
}


function onRssFetched(err, articles) {
    if(articles){
      console.log(articles.length);
      articles.forEach(function(entry){
          var pubtime = entry.published ? new Date(entry.published) : new Date();
          var hash = farmhash.hash32(""+pubtime+entry.link);
          items.push({
           _id: "fr_"+hash,
           timestamp : pubtime, 
           title : entry.title,
           content : entry.content,
           author : entry.author,
           link : entry.link,
           sourceFeedUrl : entry.feed.source,
           sourceName : entry.feed.name,
           sourceUrl : entry.feed.link,
         });
      })
    }
}   
var j = schedule.scheduleJob({hour: [10,15,21], minute: 0}, function(){
  req();
});
req();
