const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const schemaToLoad = mongoose.Schema
mongoose.plugin(slug)
const subInfoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true
	},
	username: {
	    type: String,
	    required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		required: true,
		default: Date.now
	}
})
 subInfoSchema.index({name: 'text', subscriberChannel: 'text'});
// subInfoSchema.plugin(slug, { tmpl: '<%=name%>' });
module.exports = mongoose.model('sub', subInfoSchema)