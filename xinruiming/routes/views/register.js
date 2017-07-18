var keystone = require('keystone');
var session = require('keystone/lib/session');
var User = keystone.list('User');
var Project = keystone.list('Project');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var User = keystone.list('User').model;
	// Set locals
	locals.section = 'register';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.userSubmitted = false;

	if (req.user){
		return res.redirect("/project");
	}

	view.on('post', { action: 'register' }, function(next) {

		if(!req.body.email) {
			req.flash('error', "Email is required");
			next();
		}
		
		if (req.body && req.body.email) {

			User.findOne({email:req.body.email}).exec(function(err, userItem) {

				if (err) {
					req.flash('error', "DB Query Error");	
					next();
				} else {	
					if(userItem) {
						req.flash('error', "This Email is existing");
						next();
					} else {
						registerUser(next,req,res,locals);
					}
				}
			});	
		}
	});

	view.render('register');	
};

function registerUser(next,req,res,locals)	{

	var newUser = new User.model(),
	updater = newUser.getUpdateHandler(req);
		
	if (req.body) {
			req.body.password_confirm=req.body.password;	
	}
				
	updater.process(req.body, {
		flashErrors: true,
		fields: 'name, email,depart,password',
		errorMessage: 'There was a problem submitting your register:'
	}, function(err) {
		if (err) {
			locals.validationErrors = err.errors;
			next();
		} else {	
			locals.userSubmitted = true;	
			session.signin(req.body, req, res,onSuccess,onFail);
		}
	});

	var onSuccess = function (user) {
		console.log("onSuccess");
		res.redirect('/');
	};


	var onFail = function (err) {		
		console.log("onFail");
		console.log(err);	
		res.redirect('/');
	};
}
