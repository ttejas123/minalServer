const mongoose = require('mongoose')
const schemaToLoad = mongoose.Schema

const imagesSchema = new mongoose.Schema({
	name: {
		type: String
	},
	url: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		required: true
	},
	ext: {
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

module.exports = mongoose.model('imagesSchema', imagesSchema)