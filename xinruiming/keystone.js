// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');


// Customize Your Library
var express = require('express');
var app = express();




/*
app.use(multer({
  dest : './public/doc/',
  onFileUploadStart : function (file) {
    console.log('Starting ' + file.name);
  },
  onFileUploadData : function (file, data) {
    console.log('Recieving Data');
  },
  onFileUploadComplete : function (file) {
    console.log('Completed file!');
  },
  onError : function (err, next) {
    if (err) {
      console.log(err.stack);
    }
    next();
  }
}));
*/


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
keystone.init({

	'name': 'inova',
	'brand': 'inova',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',	
	'auto update': true,
	'session': true,
	'auth': true,
	'cookie secret' : 'Secret Code',
	'user model': 'User'

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	//'posts': ['posts', 'post-categories'],
	'galleries': 'galleries',
	'enquiries': 'enquiries',
	'users': 'users',	
	'projects': 'projects'
});

// Start Keystone to connect to your database and initialise the web server

keystone.app=app;
keystone.start();
