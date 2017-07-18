var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */


var Project = new keystone.List('Project');

Project.add({
	name: { type: Types.Text, initial: false,required: true, index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	category: { type: Types.Relationship, ref: 'ProjectCategory',required: true,initial: false},
	description: { type: Types.Html,  initial: false, required: true, index: false },
	//reviewDocs: { type: Types.Text, initial: false, required: false, index: false },
	//docsPath: { type: Types.Text, initial: false, required: false, index: false },
	displayAttach: { type: Types.Boolean, initial: true, required: false, default: true},
	status: { type: Types.Select, options: 'draft, published, reviewed', default: 'draft', index: true },
	updateTime: { type: Types.Datetime, initial: false, required: true, index: false, default: Date.now}
});


// Provide access to Keystone

/**
 * Relationships
 */


/**
 * Registration
 */

Project.defaultColumns = 'name, category';
Project.register();
