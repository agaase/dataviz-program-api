
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
  

