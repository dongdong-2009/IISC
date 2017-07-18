var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Text, required: false, index: true ,required: true },
	email: { type: Types.Email, initial: false, required: false, index: true ,required: true},
	depart: { type: Types.Select, options: [
		{ value: '1', label: 'CSMC-Consumer Sales & Mktg Co.' },
		{ value: '2', label: 'EDMC-Electronic Devices Marketing China' },
		{ value: '3', label: 'PSC- Professional Solutions China' },
		{ value: '4', label: 'SGMOC-Sony Global Manufacturing & Operations-China' },
		{ value: '5', label: 'ATG-Accounting and Taxation Group' },
		{ value: '6', label: 'CCOM & CI-Corporate Communications & CI Management Group' },
		{ value: '7', label: 'CSC-China Software Center' },
		{ value: '8', label: 'CWSC-Corporate Workplace Solutions, China' },
		{ value: '9', label: 'EAG-External Affairs Gp' },
		{ value: '10', label: 'HRG-Human Resources Group' },
		{ value: '11', label: 'IPSG-Intellectual Property&Standardization Group' },
		{ value: '12', label: 'ISCN-Information Systems China' },
		{ value: '13', label: 'LCG-Legal & Compliance Group' },
		{ value: '14', label: 'Product Quality & Environment Group' },
		{ value: '15', label: 'SCRL-Sony China Research Laboratory' },
		{ value: '16', label: 'SSCS-SSCS China' },
		{ value: '17', label: 'BRM Office' },
		{ value: '18', label: 'CC-Creative Center' },
		{ value: '19', label: 'CPCD-Corporate Planning & Control Division' },
		{ value: '20', label: 'CRCD-China Risk & Control Division' },
		{ value: '21', label: 'EGISD-Electronics Global Information Security Division' },
		{ value: '22', label: 'FND-Finance Div' },
		{ value: '23', label: 'Life Science Business Division' },
		{ value: '24', label: 'Network Business Division' },
		{ value: '25', label: 'New Business Incubation Division' },
		{ value: '26', label: 'SCE-SCE Shanghai Div' },
		{ value: '27', label: 'TV Engineering Division' },
		{ value: '28', label: 'SVPC' },
		{ value: '29', label: 'SSGE' },
		{ value: '30', label: 'SEH' },
		{ value: '31', label: 'SGS' }

	] , initial: false, required: false, index: false,required: true},
	//project: { type: Types.Text, initial: false, required: false, index: true },
	password: { type: Types.Password, initial: false, required: true, index: false },
}, 'Roles', {
	isAdmin: { type: Boolean, label: 'Admin Access', index: false },
	isUser: { type: Boolean, label: 'User Access', index: false }
});


// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.virtual('canAccessMember').get(function() {
	return this.isUser;
});

/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email';
User.register();
