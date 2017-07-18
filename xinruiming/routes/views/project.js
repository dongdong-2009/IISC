var keystone = require('keystone');
//var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var jsonfile = require('jsonfile');
var _ = require("underscore");

// Public Method
exports.list = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	initLocals(locals,'project','list',req.body);
	
	if (req.user._id)
		view.query('projects', keystone.list('Project').model.find({"author":req.user._id}).sort('sortOrder'));

	// Render the view
	view.render('project');
}

exports.create = function(req, res) {

	var view = new keystone.View(req, res);
	var PrjModel = keystone.list('Project').model;
	var locals = res.locals;

	initLocals(locals,'project','create',req.body);

	//Load Category Data
	view.on('init', function (next) {

		loadCategories(next,locals.option_list);	
	});

	//Load Status List
	view.on('init', function (next) {

		loadStatusList(next,locals.status_list);	
	});

	//Create Init Project Folder
	view.on('init', function (next) {
		createUserFolder(req.user._id);
		createUploadFolder(req.user._id,"create");
		next();
	});


	view.on('post', { action: 'project' }, function(next) {	
		
		var prjitem = new PrjModel;
		req= prepareParam(req);		
		updatePrjItem(next,req,locals,prjitem,res);
	});
	// Render the view
	view.render('project');
}

exports.edit = function(req, res) {

	var view = new keystone.View(req, res);
	var PrjModel = keystone.list('Project').model;
	var locals = res.locals;

	initLocals(locals,'project','edit',req.body);

	//Load Category Data
	view.on('init', function (next) {

		loadCategories(next,locals.option_list);		
	});

	//Load Status List
	view.on('init', function (next) {

		loadStatusList(next,locals.status_list);	
	});


	view.on('get', function(next) {
		
		if (req.params && req.params.prjid ) {

			PrjModel.findOne({_id:req.params.prjid}).exec(function(err, prjitem) {

				if (err) {
					req.flash('error', "This Item is not existing");	
					return res.redirect('/project');
				} else {
					showItem(next,locals,prjitem);
				}
			});	
		}
	});


	view.on('post', { action: 'project' }, function(next) {		
		
		if (req.params && req.params.prjid ) {

			PrjModel.findOne({_id:req.params.prjid}).exec(function(err, prjitem) {

				if (err) {
					req.flash('error', "This Item is not existing");
					return res.redirect('/project');

				} else {	
					req= prepareParam(req);
					updatePrjItem(next,req,locals,prjitem,res);
				}
			});	
		}
	});
	
	// Render the view
	view.render('project');
}

exports.delete = function(req, res) {
	//var view = new keystone.View(req, res);
	var PrjModel = keystone.list('Project').model;
	var locals = res.locals;

	initLocals(locals,'project','delete',req.body);
	
	PrjModel.remove({_id:req.params.prjid}).exec(function(err) {
		if (err) {
			req.flash('error', err.errors);	
		}
		return res.redirect('/project');
	});

	//TODO remove project folder
	// Render the view	
}

exports.status = function(req, res) {
	var PrjModel = keystone.list('Project').model;
	var locals = res.locals;	
	var reqType = req.url.split("/");

	initLocals(locals,'project','status',req.body);

	if (reqType.length >2 && (reqType[2] =="published"||reqType[2] =="draft")) {
		PrjModel.update(
			{_id:req.params.prjid },
			{ $set: { "status": reqType[2] } }

			).exec(function(err) {
			if (err) {
				req.flash('error', err.errors);	
			}
			return res.redirect('/project');
		});
	} else {
		return res.redirect('/project');
	}
}

// AJAX Server JS
exports.deletefile = function(req, res) {	
	

	//removeUploadFile(req.params.fileid);
	var prjId = getUrlLastField(req.headers.referer);	
	var folder = getUploadFolder(req.user._id,prjId);
	var fileList = folder+"filelist.json";
	var file = folder+req.params.fileid;

	if(!req.params.fileid || !req.user || !prjId) {
		res.status(400);
		res.end("Request URL Error");
		return;
	}

	removeUploadFile(res,file,fileList);	
}

exports.uploadfile = function(req, res) {
	var uploadFolder;
	var fileList;

	if(!req.user || !req.params.prjid || !req.files || !req.files.myFile) {
		res.status(400);
		res.end("Request URL Error");
		return;
	}

	uploadFolder = getUploadFolder(req.user._id,req.params.prjid);
	fileList = uploadFolder + "filelist.json";


	if(req.files && req.files.myFile) {
		oldPath = req.files.myFile.path;
		newPath = uploadFolder+"upload_"+req.files.myFile.name;

	} else {
		res.status(400);
		res.end("Transfer File Error");
		return;
	}

	saveUploadFile(oldPath,newPath,res,req.files.myFile,fileList);
}


exports.listfile = function(req, res) {
	
	if(!req.user || !req.params.prjid){
		res.status(400);
		res.end("URL File Error");
		return;
	}

	var url = "/doc/user_"+req.user._id+"/prj_"+req.params.prjid+"/filelist.json";	
	res.redirect(url);
}


// Private Method
function prepareParam(req){

	if(req.user){
		req.body.author=req.user._id;
	}
	if(req.displayAttach){
		if(req.body.displayAttach == 'on') {
			req.body.displayAttach = true;
		} else {
			req.body.displayAttach = false;
		}
		
	}	
	//if(req.files.fselect) {
		//req.body.docsPath=req.files.fselect.path;
		//prepareImage(req.body.docsPath);
	//}

	return req;
}

// currently not used
function prepareImage(pdfFile){

	var PDFImage = require("pdf-image").PDFImage;
	var pdfImage = new PDFImage(pdfFile);
	console.log(pdfFile);
	pdfImage.convertPage(0).then(function (imagePath) {
	  // 0-th page (first page) of the slide.pdf is available as slide-0.png 
	  console.log(imagePath);
	  //fs.existsSync("/tmp/slide-0.png") // => true 
	});
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

function loadStatusList(next, status_list){

	var results = keystone.list('Project').schema.path('status').enumValues;
	results.forEach(function(item,index,array){
			status_list.push(item);
	});		
	next();
}

function updatePrjItem(next,req,locals,prjitem,res){
	// queryType:status,edit,create	
	
	var updateField = 'name, author, description,category,displayAttach';

	if (locals.queryType == 'status') {
		updateField = 'status';
	}	
	
	updater = prjitem.getUpdateHandler(req);	
	updater.process(req.body, {
			flashErrors: true,
			fields: updateField,
			errorMessage: 'There was a problem submitting your project:'
	}, function(err) {

		if (err) {
			locals.validationErrors = err.errors;
		} else {
			locals.userSubmitted = true;
			req.flash('success', (locals.queryType == 'create')?'Create Success':'Update Success');	
			
			if (locals.queryType == 'create' && prjitem.id && req.user) {
				createUploadFolder(req.user._id,prjitem.id);
			} 

			if( (locals.queryType == 'create') || (locals.queryType == 'edit')){
				return res.redirect('/project');
			}

		}		
		next();
	});

}

function showItem(next,locals,prjitem){
	
	locals.formData.name = prjitem.name;
	locals.formData.author = prjitem.author;
	locals.formData.description = prjitem.description;
	locals.formData.category = prjitem.category;	
	locals.formData.displayAttach = prjitem.displayAttach;
	//locals.formData.reviewDocs	= prjitem.reviewDocs;	
	//locals.formData.docsPath	= prjitem.docsPath;	
	locals.formData.status	= prjitem.status;

	
	next();
}

function initLocals(locals,section,queryType,formData){

	locals.section = section;
	locals.queryType = queryType;
	locals.formData = formData || {};

	// default initial data
	locals.validationErrors = {};
	//locals.option_list=[	{value:0,label:"(Select One)"}];
	locals.option_list=[	];
	locals.userSubmitted = false;
	locals.status_list=[];
}


function createUserFolder(userId) {

	var usrDir = getUserFolder(userId);
	try {
		if(!fs.existsSync(usrDir)) {
			fs.mkdirSync(usrDir);
		}
	}catch(err){
		console.log(err);
	}
}

function createUploadFolder(userId,prjId){

	var prjDir = getUploadFolder(userId,prjId);
	var oldDir =getUploadFolder(userId,"create");

	//TODO condition user folder exist > Done
	//user folder should be existing

	try {
		if (prjId == "create") {
			if(!fs.existsSync(prjDir)) {
				fs.mkdirSync(prjDir);
				fs.writeFileSync(prjDir+"filelist.json","[]");				
			}
		} else if (prjId.length > 0 ) {
			fs.renameSync(oldDir, prjDir);
		}
	}catch(err){
		console.log(err);
	}

}

function getUploadFolder(userId,prjId){

	return getUserFolder(userId) + "prj_" + prjId + "/";
}

function getUserFolder(userId) {

	return path.join(__dirname, '../../public/doc/user_') + userId + "/";
}

function saveFile2Json(file,jsonFile) {
	
	var fileListObj;
	var userId="";

	try {
		fileListObj=jsonfile.readFileSync(jsonFile);
	}catch(err){
		fileListObj=[];
		console.log(err);
	}
	
	var tmparray = jsonFile.split("/");

	if(tmparray.length > 3) {
		userId = tmparray[tmparray.length-3].substring(5);
	}	

	fileListObj.push({'originalName':file.originalname,'saveName':"upload_"+file.name,'userId':userId});

	try {
		jsonfile.writeFileSync(jsonFile, fileListObj,{spaces: 2});
	}catch(err){
		console.log(err);
	}
	
}

function removeFileFromJson(fileName,jsonFile) {
	
	var fileListObj;
	var index = 0;
	
	if(!fileName || !jsonFile) {
		return;
	}

	try {
		fileListObj=jsonfile.readFileSync(jsonFile);
	}catch(err){
		fileListObj=[];
		console.log(err);
	}

	for(index=0;index < fileListObj.length; index++){
		if(fileListObj[index].saveName ==fileName){
			break;
		}
	}		
	
	if(index < fileListObj.length) {
		fileListObj.splice(index,1);		
	}

	try {
		jsonfile.writeFileSync(jsonFile, fileListObj,{spaces: 2});
	}catch(err){
		console.log(err);
	}
}

function removeUploadFile(res,file,fileList){
	
	fs.unlink(file, function(err) {
		if(err) {
			console.log(err);
		}
		var fileName =getUrlLastField(file);
		if(fileName && fileList) {
			removeFileFromJson(fileName,fileList);
		}
		res.status(200);
		res.end();
		return;
	});
}


function saveUploadFile(oldPath,newPath,res,myFile,fileList){

	fs.readFile(oldPath, function(err, data) {
		if(err) {
			res.status(500);
			res.end("Server File Reading Error");
			return;
		}
		fs.writeFile(newPath, data, function(err) {
			if(err) {
				res.status(500);
				res.end("Server File Save Error");
				return;
			}
			fs.unlink(oldPath, function(err) {
				
				saveFile2Json(myFile,fileList);
				res.status(200);
				res.end();
				return;
			});
		});
	});
}

function getUrlLastField(url) {

	var result = "";
	var tmparray = url.split("/");
	if( tmparray.length > 0) {
		result = tmparray[tmparray.length-1];
	}
	return result;
}