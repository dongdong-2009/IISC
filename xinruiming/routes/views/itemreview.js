var keystone = require('keystone');
var ProjectModel = keystone.list('Project').model;
var CommentModel = keystone.list('Comment').model;
var ObjectId = require('mongodb').ObjectID;



exports.list = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'itemreview';
	locals.queryType = 'list';
	locals.sortType = "time-desc"
	locals.categories =[];
	locals.selectedCategory ="";


	view.on('init', function (next) {
		
		loadCategories(next,locals.categories);			
	});

	if (req.params.sorttype){
		if(req.params.sorttype=="-time"){
			sortobject = {'updateTime':-1}
		}
		if(req.params.sorttype=="-hot"){
			sortobject = {'count.count':-1}
		}
		
	}else{
		sortobject = {updateTime:-1}
	}

	if (req.params && req.params.category ) {

		if(req.params.category.length != 24){
			req.flash('error', "This Category is not existing");	
			return res.redirect('/itemreview');
		}

		locals.selectedCategory =req.params.category;
		CommentModel.aggregate([{$group:{_id:"$projectId",count:{$sum:1}}},{$out:"comment_group"}]).exec(function(err,item){})	
		porject = ProjectModel.aggregate({$match:{$and: [{status:'published'},{category:ObjectId(req.params.category)}]}},{ $lookup:{from: "users",localField: "author",foreignField: "_id",as: "user"}},{ $lookup:{from:"comment_group",localField:"_id",foreignField:"_id",as:"count"}})
			.sort(sortobject)		
		view.query('projects',porject );
		
	} else {
		if(req.params.sort){
			console.log(req.params.sort)
		}
		CommentModel.aggregate([{$group:{_id:"$projectId",count:{$sum:1}}},{$out:"comment_group"}]).exec(function(err,item){})
		view.query('projects', ProjectModel
			.aggregate([{$match:{status:'published'}},{ $lookup:{from: "users",localField: "author",foreignField: "_id",as: "user"}},{ $lookup:{from:"comment_group",localField:"_id",foreignField:"_id",as:"count"}}])		
			.sort(sortobject));		
	}

	// Render the view
	view.render('itemreview');
}


exports.detail = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'itemreview';
	locals.queryType = 'detail';
	locals.categories =[];	
	locals.validationErrors = {};

	view.on('init', function (next) {		
		loadCategories(next,locals.categories);
	});

	view.on('get', function(next) {
		
		if (req.params && req.params.prjid ) {

			if(req.params.prjid.length != 24){
				req.flash('error', "This Item is not existing");	
				return res.redirect('/itemreview');
			}

			ProjectModel.findOne({_id:req.params.prjid}).exec(function(err, prjitem) {

				if (err) {
					req.flash('error', "This Item is not existing");	
					return res.redirect('/itemreview');
				} else {
					locals.project=prjitem;								
					next();
				}
			});
		}
	});

	view.on('get', function(next) {

		if (req.params && req.params.prjid ) {

			if(req.params.prjid.length != 24){
				return;				
			}

			CommentModel
			.aggregate(	{$match:{projectId:ObjectId(req.params.prjid)}},
						{$lookup:{from: "users",localField: "fromUser",foreignField: "_id",as: "fromUserName"}})		
			.exec(function(err, comments) {

				if (err) {
					req.flash('error', "This Item is not existing");	
					return res.redirect('/itemreview');
				} else {
					var TotalRating=0;
					for(var i=0; i < comments.length; i++) {
						
						if( comments[i].fromUser.toString() == req.user._id ){
							comments[i].canDelete = true;
						}
						if(comments[i].rating){
							TotalRating+=comments[i].rating;	
						}
					}
					if(comments.length > 0) {
						locals.averageRating =TotalRating/comments.length;
					} else {
						locals.averageRating =0;
					}
					locals.comments=comments;					
					next();
				}
			});
		}
	});

	view.on('post',function(next) {

		if (req.params && req.params.prjid ) {

			var commentItem = new CommentModel;			
			req = prepareParam(req);
			
			updater = commentItem.getUpdateHandler(req);	
			updater.process(req.body, {
					flashErrors: true,
					fields: 'fromUser, content,rating,projectId',	
					errorMessage: 'There was a problem submitting your Comment:'
			}, function(err) {
				if (err) {
					locals.validationErrors = err.errors;
				}
				return res.redirect('/itemreview/detail/'+req.params.prjid);
			});
		}

	});
	// Render the view
	
	view.render('itemreview');
}

exports.deletecomment = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'itemreview';
	locals.queryType = 'delete';	

	CommentModel.remove({_id:req.params.commentid}).exec(function(err) {
		if (err) {
			req.flash('error', err.errors);
		}		
		return res.redirect('/itemreview/detail/'+req.params.prjid);
	});
}

exports.listfile = function(req, res) {
	
	if(!req.user || !req.params.prjid){
		res.status(400);
		res.end("URL File Error");
		return;
	}

	ProjectModel.findOne({_id:req.params.prjid}).exec(function(err, prjitem) {
		var url="";

		if (err) {			
			res.status(400);
			res.end("URL File Error");
			return;
		} else {	

			url = "/doc/user_"+prjitem.author+"/prj_"+req.params.prjid+"/filelist.json";				
			res.redirect(url);
		}
	});	



}



function prepareParam(req){

	if(req.user){
		req.body.fromUser=ObjectId(req.user._id);
		req.body.toUser='';
	}

	if(req.params.prjid) {
		req.body.projectId=ObjectId(req.params.prjid);
	}

	if(!req.body.rating){		
		req.body.rating=0;
	}

	
	return req;
}

function loadCategories(next, option_list){

	var PrjCategory = keystone.list('ProjectCategory').model;

	PrjCategory.find().exec(function(err,results){		
		if(err) {				
			return next(err);
		}else {				
			results.forEach(function(item,index,array){					
				option_list.push({value:item._id,label:item.name});
			});						
			next();
		}
	});
}