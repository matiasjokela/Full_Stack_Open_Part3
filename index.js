require('dotenv').config();
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors');
const Person = require('./models/person');
const { response } = require('express');

app.use(express.json())
morgan.token('body', (req, res) => {
	if (req.method === 'POST')
	{
		return JSON.stringify(req.body)
	} else {
		return ' '
	}
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))


let persons = [
	  {
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	  },
	  {
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	  },
	  {
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": 3
	  },
	  {
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	  }
	]

app.get('/api/persons/', (req, res, next) => {
	Person.find({}).then(people => {
		res.json(people)
	}).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(note => {
		if (note) {
			response.json(note)
		} else {
			response.status(404).end()
		}
	}).catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
	const body = req.body
	
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'Must have a name and a number'
		})
	}
	// if (names.includes(body.name)) {
	// 	return res.status(400).json({
	// 		error: 'Name must be unique'
	// 	})
	// }
	const person = new Person({
		name: body.name,
		number: body.number,
	})
	person.save().then(savedPerson => {
		console.log('person', savedPerson)
		return res.json(savedPerson)
	}).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	console.log('täsä')
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}
	console.log('person:', person)
	Person.findByIdAndUpdate(request.params.id, person, {new: true}).then(updatedPerson => {
		response.json(updatedPerson)
	}).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id).then(result => {
		res.status(204).end()
	}).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
	date = new Date()
	Person.find({}).then(people => {
		res.send(`<div>Phonebook has info for ${people.length} people<div/>
		<div/> ${date}<div/>`)
	}).catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
	console.log('herja', error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({error})
	}
	  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

