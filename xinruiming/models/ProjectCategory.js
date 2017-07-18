var keystone = require('keystone');

/**
 * ProjectCategory Model
 * ==================
 */


/*var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});*/

var ProjectCategory = new keystone.List('ProjectCategory');

ProjectCategory.add({
	name: { type: String, required: true }
});

//ProjectCategory.relationship({ ref: 'Project', path: 'categories' });

ProjectCategory.register();
