const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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

app.get('/api/persons/', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => {
		return person.id === id
	})
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons/', (req, res) => {
	const body = req.body
	const names = persons.map(person => person.name)
	
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'Must have a name and a number'
		})
	}
	if (names.includes(body.name)) {
		return res.status(400).json({
			error: 'Name must be unique'
		})
	}
	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 1000000)
	}
	persons = persons.concat(person)
	res.json(persons)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	res.status(204).end()
})

app.get('/info', (req, res) => {
	date = new Date()
	console.log(date)
	res.send(`<div>Phonebook has info for ${persons.length} people<div/>
	<div/> ${date}<div/>`)
})

const PORT = 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

