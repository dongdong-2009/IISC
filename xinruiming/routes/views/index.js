var keystone = require('keystone');
var ProjectModel = keystone.list('Project').model;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	pm=ProjectModel.find().count()
	pm.exec(function(err,result){
		console.log(err)
		locals.projectCount = result
	})
	  

	console.log(locals.projectCount)
	
	// Render the view
	
	view.render('index');
	
};
