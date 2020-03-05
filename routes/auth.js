import { Router } from 'express'
import validation from '../validations/validation'
import Users from './../model/Users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  // Validate body
  try {
    await validation.validateAsync(req.body)
  } catch (err) {
    return res.status(400).send({ error: err.details[0].message })
  }

  // Check for an existing user
  try {
    const existingUser = await Users.findOne({ username })

    if (existingUser) throw new Error('User already exists.')
  } catch (err) {
    return res.status(400).send({ error: err.message })
  }

  // Salt Password
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(password, salt)

  try {
    // Add user to DB

    const user = new Users({ username, password: hashedPass })

    await user.save()

    return res.send(`User ${username} successfully stored in DB`)
  } catch (err) {
    return res.status(400).send({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  // Try to validate body
  try {
    await validation.validateAsync(req.body)
  } catch (err) {
    return res.status(400).send({ error: err.details[0].message })
  }

  try {
    // Try to find the user
    const user = await Users.findOne({ username })

    if (!user) throw new Error('username/password not found')

    // Verify password match
    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) throw new Error('username/password not found')

    // sign jwt
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    return res.header('auth-token', token).send(`User ${username} succesfully logged in.`)
  } catch (error) {
    return res.status(400).send({ error: error.message })
  }
})

export default router
