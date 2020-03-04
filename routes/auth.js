import { Router } from 'express'

const router = Router()

router.post('/register', (req, res) => {
  res.send('Registering')
})

router.post('/login', (req, res) => {
  res.send('Logging in')
})

export default router
