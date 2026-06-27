const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./user')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://Homesh:Homesh123@cluster0.cx6z6ru.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log(err))

// GET all users
app.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

// POST a new user
app.post('/users', async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email
  })
  await newUser.save()
  res.json(newUser)
})

// DELETE a user
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted!' })
})

// UPDATE a user
app.put('/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, email: req.body.email },
    { new: true }
  )
  res.json(updatedUser)
})

const { signup, login } = require('./auth')

// add these routes:
app.post('/signup', signup)
app.post('/login', login)

app.listen(5000, () => {
  console.log('Server is running on port 5000!')
})