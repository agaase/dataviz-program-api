var feed = require('feed-read');
var http = require('http');
var async = require('async');
var request = require('request');
var farmhash = require('farmhash');

var LIMIT = 10;
var UNABLE_TO_CONNECT = "Unable to connect.";
var URLS = ['http://feeds.feedburner.com/InformationIsBeautiful?format=xml',
            'http://feeds.feedburner.com/CoolInfographics?format=xml',
            'http://flowingdata.com/feed',
            'http://nytlabs.com/blog/feed.xml',
            'https://groups.google.com/forum/feed/data-vis-jobs/msgs/rss_v2_0.xml'];
var models = require("./models/tables.js");

var FR = models.feedresource;

function req() {
    var tasks = [];
    URLS.forEach(function(entry){
        tasks.push(function(callback) {
            feed(entry, onRssFetched);
        });
    });
    async.parallel(tasks, function done(err, results) {
        console.log("Done");
        if (err) {
            
        }
    });
}

function onRssFetched(err, articles) {
    var items = [];
   // console.log(articles);
    articles.forEach(function(entry) {
        var pubtime = entry.published ? new Date(entry.published).getTime() : new Date().getTime();
        var hash = farmhash.hash32(""+pubtime+entry.link);
        items.push({
           res_id: "fr_"+hash,
           timestamp : pubtime, 
           title : entry.title,
           content : entry.content,
           author : entry.author,
           link : entry.link,
           sourceFeedUrl : entry.feed.source,
           sourceName : entry.feed.name,
           sourceUrl : entry.feed.link,
        });
    });
    console.log("pushing - " +items.length);
    FR.collection.insert(items,function (err) {
        if (err) { return console.log(err); }
        console.log('Ta-da!');
    },{overwrite:true});
}   

req();