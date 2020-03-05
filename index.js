import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import productRoute from './routes/products'
import authRoute from './routes/auth'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
const path = process.env.NODE_ENV === 'dev' ? '.env' : '.env.production'

dotenv.config({
  path
})

const app = express()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected to DB') })
  .catch(e => {
    throw e
  })

app.use(bodyParser.json())

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/products', productRoute)
app.use('/auth', authRoute)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
