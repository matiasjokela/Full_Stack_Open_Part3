const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url).then(res => {
	console.log('connected to MongoDB')
	console.log(res)
}).catch(error => {
	console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		minlength: 8,
		validate: {
			validator: (v) => {
				console.log('value', v)
				return /^\d{2,3}-\d{5,}$/.test(v)
			},
		},
		required: true
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)