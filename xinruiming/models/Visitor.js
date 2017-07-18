var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Visitor Model
 * =============
 */

var Visitor = new keystone.List('Visitor', {
	nocreate: true,
	noedit: true
});

Visitor.add({
	name: { type: Types.Name,  index: true ,required: true },
	email: { type: Types.Email, initial: false, index: true ,required: true },
	GID: { type: Types.Text, required: true },
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
		{ value: '12', label: 'SGSCN' },
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
		{ value: '28', label: 'Others' }
	] , initial: false,index: false,required: true},
	Other: { type: Types.Text, initial: false,index: false,required: true },
	location: { type: Types.Select, options: [
		{ value: '1', label: '9/27 BJ Citychamp' },
		{ value: '2', label: '10/18 SH STC' },
	] , initial: false,index: false,required: true},
	v_id:{type: Types.Text,required: true},
	ucard: { type: Types.Select, options: [
		{ value: '1', label: 'BJ Citychamp Building 8F M10' },
		{ value: '2', label: 'SH STC 2F M205' },
		{ value: '3', label: 'No Need' },
	] , initial: false,index: false,required: true},
	createdAt: { type: Date, default: Date.now }
});

Visitor.defaultSort = '-createdAt';
Visitor.defaultColumns = 'name, email, createdAt';
Visitor.register();
