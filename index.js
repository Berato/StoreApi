import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import productRoute from './routes/products'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

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

app.listen('3000', () => {
  console.log('Listening on port 3000')
})