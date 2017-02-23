
# dataviz-program-api

## About
This is a platform for MS, Data Visualization program at the New School. It enables students and faculty to post content related to data visualization and also provides an API to read. There is also a facility to post content through email if upi have a newschool email id set up.

## Code
This is a MVC implementation using nodejs express module. The folder structure reflects that implementation and is explained below

`models`
tables.js - This file stores the schema for all the different tables using the Mongoose module for nodejs

`views` - directory which has all the views for different pages. Uses handlebars to create templates.
* `layouts` - all the parent templates for different pages
* `partials` - the parent pages uses these partials to create different pages. For e.g parent template items.handlebars uses events-items.handlebars to render events page.

