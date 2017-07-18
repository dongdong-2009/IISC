var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Commnet Model
 * ==========
 */

var Comment = new keystone.List('Comment');

Comment.add({
	fromUser: { type: Types.Relationship, ref: 'User'},
	toUser: { type: Types.Relationship, ref: 'User'},		
	updateDate: { type: Types.Datetime, initial: false, required: true, index: false, default: Date.now},
	content: {type: Types.Text, initial: false,required: true},
	rating:{type:Types.Number},
	canDelete: { type: Types.Boolean, initial: false, default: false},
	projectId: { type: Types.Relationship, ref: 'Project'}
});

Comment.defaultColumns = 'content';
Comment.register();
