// Dependencies
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

// Start up Express
const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
  next()
})

// Set up bodyParser to use json and set it to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Instantiate the express-jwt middleware
const jwtMW = expressJWT({
  secret: 'I loafe and invite my soul'
})

// Mockup DB for testing
let users = [
  {
    id: 1,
    username: 'test1',
    password: 'abc123'
  },
  {
    id: 2,
    username: 'test2',
    password: 'def456'
  }
]

// LOGIN ROUTE
app.post('/login', (req, res) => {
  const { username, password } = req.body
  // Obvs can use the DB ORM to make this comparison.
  for (let user of users) {
    console.log('username: ', username, 'user.username:', user.username)
    if (username === user.username && password === user.password) { // should be hash pw checking
      // If all creds are correct, then:
      let token = jwt.sign({ id: user.id, username: user.username }, 'I loaf and invite my soul', { expiresIn: 129600 })
      res.json({
        success: true,
        err: null,
        token
      })
      break // ??
    } else {
      res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect'
      })
    }
  }
})

app.get('/', jwtMW, (req, res) => {
  res.send('You are authenticated!')
})

// Error handline
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send(err)
  } else {
    next(err)
  }
})

// Fire it up!
const PORT = 8080
app.listen(PORT, () => {
  console.log(`A candle burns on port ${PORT}`)
})
