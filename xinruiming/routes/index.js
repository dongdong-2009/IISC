/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.set('signin redirect', function(user, req, res){
  var url = (user.isAdmin) ? '/keystone' : '/';
  res.redirect(url);
});

keystone.set('signout redirect', '/');


// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);

	// Project module
	app.get('/project', middleware.requireUser, routes.views.project.list);
	app.all('/project/edit/:prjid', middleware.requireUser, routes.views.project.edit);
	app.all('/project/create', middleware.requireUser, routes.views.project.create);
	app.get('/project/delete/:prjid', middleware.requireUser, routes.views.project.delete);

	app.all('/project/published/:prjid', middleware.requireUser, routes.views.project.status);
	app.all('/project/draft/:prjid', middleware.requireUser, routes.views.project.status);

	app.post('/project/uploadfile/:prjid', middleware.requireUser, routes.views.project.uploadfile);		
	app.get('/project/listfile/:prjid', middleware.requireUser, routes.views.project.listfile);
	app.get('/project/deletefile/:fileid', middleware.requireUser, routes.views.project.deletefile);
	//app.get('/project/downloadfile/:fileid', middleware.requireUser, routes.views.project.downloadfile);

	// ItemReview module
	app.get('/itemreview', middleware.requireUser, routes.views.itemreview.list);
	app.get('/itemreview/sort/:sorttype', middleware.requireUser, routes.views.itemreview.list)
	//app.get('/itemreview?page=number', middleware.requireUser, routes.views.itemreview.list);
	app.get('/itemreview/:category?', middleware.requireUser, routes.views.itemreview.list);
	app.get('/itemreview/:category?/sort/:sorttype', middleware.requireUser, routes.views.itemreview.list);
	app.all('/itemreview/detail/:prjid', middleware.requireUser, routes.views.itemreview.detail);
	app.all('/itemreview/deletecomment/:prjid/:commentid', middleware.requireUser, routes.views.itemreview.deletecomment);
	app.get('/itemreview/listfile/:prjid', middleware.requireUser, routes.views.itemreview.listfile);

	app.all('/contact', routes.views.contact);
	app.all('/visit', routes.views.visit);
	app.all('/register', routes.views.register);
	app.get('/calendar', routes.views.calendar);
	app.get('/template', routes.views.template);
        app.post('/template/uploadfile/:prjid', routes.views.template.uploadfile);
	app.get('/template/listfile/:prjid',routes.views.template.listfile);	
	app.get('/template/deletefile/:fileid', routes.views.template.deletefile);
	app.get('/result', routes.views.result);
	app.get('/notice', routes.views.notice);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	//app.get('/project', middleware.requireUser, routes.views.project);
	
};
