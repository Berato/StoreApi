import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import productRoute from './routes/products'

const app = express();

app.use(bodyParser.json())

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/products', productRoute)
 
app.listen('3000', () => {
    console.log('Listening on port 3000')
})