var keystone = require('keystone');
var Visitor = keystone.list('Visitor');
var VisitorModel = keystone.list('Visitor').model;

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var ifExist = false
	
	// Set locals
	locals.section = 'menu';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.visitorSubmitted = false;
	locals.v_id = 000000
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'menu' }, function(next) {
		var newVisitor = new Visitor.model(),
			updater = newVisitor.getUpdateHandler(req);
		if (req.body && req.body.email) {
			console.log(3)
			console.log(req.body.email)
			Visitor.model.findOne().where("email",req.body.email.toLowerCase()).exec(function(err, vistorItem) {
				console.log(4)
				if (err) {
					locals.validationErrors = err.errors;
					next();
				} else {	
					console.log(vistorItem)
					if(vistorItem) {
						req.flash('error', "This Email is existing and the visitor id is :" + vistorItem.v_id);
						ifExist = true
					} 
				}
			}).then(function(){
				if(ifExist){
					console.log(1)
					next();
				}
				else{
					console.log(2)
					vc = VisitorModel.count()
					vc.exec(function(err,result){
						if (err){
							locals.validationErrors = err.errors;
							next();
						}
						req.body.v_id = result+100000
						locals.v_id = req.body.v_id
					}).then(function(){
						updater.process(req.body, {
							flashErrors: true,
							fields: 'name, email, depart, location, v_id',
							errorMessage: 'There was a problem submitting your information:'
						}, function(err) {
							if (err) {
								locals.validationErrors = err.errors;
							} else {
								locals.visitorSubmitted = true;
							}
							next();
						});
					})
					
				}
			});	
		}
	});
	
	view.render('menu');
	
};
