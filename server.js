const {
  PORT,
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD
} = process.env
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const pg = require('pg')
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const findface = require('./controllers/findface')
app = express()
  .use(cors())
  .use(express.static(__dirname + '/public'))
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: false,
    }),
  )

const db = knex({
  client: 'pg',
  connection: {
    host: DATABASE_URL,
    ssl: true,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
})

app.get('/', (req, res) => {
  res.json('It is working!')
})

app.post('/signin', signin.handleSignIn(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/findface', findface.handleImage(db))
app.post('/imageUrl', findface.handleApiCall())

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT} !`)
})
