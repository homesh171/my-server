const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./user')

const SECRET_KEY = 'mysecretkey123'

async function signup(req, res) {
  const { name, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    name,
    email,
    password: hashedPassword
  })

  await newUser.save()
  res.json({ message: 'User created successfully!' })
}

async function login(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ message: 'User not found!' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Wrong password!' })
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY)
  res.json({ token, name: user.name })
}

module.exports = { signup, login }