
# dataviz-program-api

## About
This is a platform for MS, Data Visualization program at the New School. It enables students and faculty to post content related to data visualization and also provides an API to read. There is also a facility to post content on the data viz wall through email if one has a newschool email id set up.

## Code
This is a node project and managed through node. Its also a MVC implementation using nodejs express module. The folder structure reflects that implementation and is explained below

 - `index.js` - the main file which starts the server and also routes different requests
 
 - `core.js` - acts as the controller and has all the functions to interact with database and server. Exported as a module and used by the server file above.
 
- `models/`
tables.js - This file stores the schema for all the different tables using the Mongoose module for nodejs

- `views/` - directory which has all the views for different pages. Uses handlebars to create templates.
  - `layouts/` - all the parent templates for different pages
  - `partials/` - the parent pages uses these partials to create different pages. For e.g parent template items.handlebars uses events-items.handlebars to render events page.
  
- `scripts/` - scripts to directly populate data in database
  - `mailin.js` - checks for any incoming mail, parses it and store it as in the wallposts collection
  - `feed-parser.js` - requests and updates feeds from multiple sources at multiple times in a day
  - `db-populate.js` - populates old data into events and opportunities table
  
- `public/` - all static resources served up on the website are stored here 

## How it accepts mail?
To accept and parse mail it uses a few different implementations.
1. MAIL SERVER SETUP ON AWS -  The aws machine has a mail server setup and configured locally using which one can send emails. The instructions to do the same can be found [here](https://elprespufferfish.net/blog/aws,mail/2015/09/03/mail-server-ec2.html). Note that I use the same local mail serve to send mails too.
2. PARSING INCOMING MAIL - Once the mail server is up and running, the next step is to check for any incoming mail, parse it and store it in the database. This is done using [`mailin.io`](http://mailin.io/) node module. Using this module you can parse any incoming mail into its indiviual components (from, to, body etc). One needs to start this process and make it listen to the correct port where your mail server is running (in this case it is local at port 25 * ).

```* I also had to redirect all my traffic from 25 to 2525 because ports under number 80 are blocked for read for some reason.``` 

## How the feeds are generated from third party sources?
To read content from different third party source (like flowing data) I use their [RSS feed](http://www.whatisrss.com/) to get different articles. Once I have the RSS feed I use [feed-read](https://www.npmjs.com/package/feed-read) node module to read them and store it in the database. This is a scheduled job which runs multiple times in a day. So, everytime there's a new article posted on the website I update the local database with the new ones.
The task of scheduling the job itself is taken care of using the [node-schedule](https://github.com/node-schedule/node-schedule) node module.

