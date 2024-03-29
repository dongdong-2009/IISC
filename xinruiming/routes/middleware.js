/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	if (req.user) {
		locals.navLinks = [
			{ label: 'Home',		key: 'home',		href: '/' },					
			//{ label: 'Innovation Item',		key: 'project',		href: '/project' },
			//{ label: 'Review Status',		key: 'contact',		href: '/contact' },			
			{ label: 'Item Review',		key: 'itemreview',		href: '/itemreview' },
			{ label: 'Notice',		key: 'notice',		href: 'notice'},
//				{label: 'Calendar',  	key: 'calendar', 	href: '/notice'},
//				{label: 'Selection',  	key: 'selection', 	href: '/visit'},
//				]},
			{ label: 'Contact',		key: 'contact',		href: '/contact' },
			{ label: 'Password',		key: 'password',		href: '/password' },
      //TODO delete on 2017/07/03 for requirement_01
			// { label: 'Visit',		key: 'visit',		href: '/visit' },
			// { label: 'Template',		key: 'template',	href: '/template' },
      // TODO add by wtshuai 20170620
			{ label: 'Themes',		key: 'themes' },
      		{ label: 'Spacelab',		key: 'thText'}
			
		];
		locals.notice =[ 
				{ label: 'IISC Calendar',		key: 'calendar',		href: '/calendar' },
				{ label: 'Selection Result',		key: 'result',		href: '/result' },						
		];

    locals.themes =[{label:'Cerulean',key:'Cerulean'},{label:'Journal',key:'Journal'},
			{label:'Paper',key:'Paper'},{label:'Readable',key:'Readable'},{label:'Slate',key:'Slate'},
			{label:'Cosmo',key:'Cosmo'},{label:'Custom',key:'Custom'},
      {label:'Cyborg',key:'Cyborg'},{label:'Darkly',key:'Darkly'},
      {label:'Flatly',key:'Flatly'},{label:'Lumen',key:'Lumen'},
      {label:'Sandstone',key:'Sandstone'},{label:'Simplex',key:'Simplex'},
      {label:'Spacelab',key:'Spacelab'},{label:'Superhero',key:'Superhero'},
      {label:'United',key:'United'},{label:'Yeti',key:'Yeti'},
		];
	} else {
		locals.navLinks = [
			{ label: 'Home',		key: 'home',		href: '/' },
			{ label: 'Register',		key: 'register',	href: '/register' },
			//{ label: 'Notice',		key: 'notice',		pages:[
			//	{label: 'Calendar',  	key: 'calendar', 	href: '/notice'},
			//	{label: 'Selection',  	key: 'selection', 	href: '/visit'},
			//	]},
			{ label: 'Notice',		key: 'notice',		href: '/notice' },
			{ label: 'Contact',		key: 'contact',		href: '/contact' },
			//TODO delete on 2017/07/03 for requirement_01
      //{ label: 'Visit',		key: 'visit',		href: '/visit' },
			//{ label: 'Template',		key: 'template',	href: '/template' },
      
      // TODO add by wtshuai 20170620
			{ label: 'Themes',		key: 'themes'},
      { label: 'Spacelab',		key: 'thText'}
		];
		locals.notice =[ { label: 'IISC Calendar',		key: 'calendar',		href: '/calendar' },
				{ label: 'Selection Result',		key: 'result',		href: '/result' },						
		];
    locals.themes =[{label:'Cerulean',key:'Cerulean'},{label:'Journal',key:'Journal'},
			{label:'Paper',key:'Paper'},{label:'Readable',key:'Readable'},{label:'Slate',key:'Slate'},
			{label:'Cosmo',key:'Cosmo'},{label:'Custom',key:'Custom'},
      {label:'Cyborg',key:'Cyborg'},{label:'Darkly',key:'Darkly'},
      {label:'Flatly',key:'Flatly'},{label:'Lumen',key:'Lumen'},
      {label:'Sandstone',key:'Sandstone'},{label:'Simplex',key:'Simplex'},
      {label:'Spacelab',key:'Spacelab'},{label:'Superhero',key:'Superhero'},
      {label:'United',key:'United'},{label:'Yeti',key:'Yeti'},
		];    
	}
	
	

	locals.user = req.user;
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


