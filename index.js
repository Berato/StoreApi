const express = require('express');

const app = express();
const bodyParser = require('body-parser')
const productRoute = require('./routes/products');
const cors = require('cors')

app.use(bodyParser.json())

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/products', productRoute)
 
app.listen('3000', () => {
    console.log('Listening on port 3000')
})