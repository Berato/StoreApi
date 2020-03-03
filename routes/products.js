const express = require('express')
const axios = require('axios')
const url = require('./../constants')

const router = express.Router()

router.route('/:id')
.put(async (req, res) => {
    /* TODO: Update product in DB here. */
})
.get( async (req, res) => {


    try {

        const { id } = req.params

        const productsURL = `${url}/${id}`


        const product = await axios.get(productsURL, { params: { excludes: 'taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics'}})
        
        /*TODO Refactor to make a parallel call to the DB to check for item price */

        const { product:item } = product.data

        const response = {
            id,
            name: item.item.product_description.title, 
            current_price: { // Will come from the DB
                value: item.price.listPrice.price,
                currency_code: 'USD'
            }
        }
        
        return res.send(response)

    } catch (error) {

       return res.send({error: error.message}) 

    }   
})

router.get('/', async (req, res) => {
    try {

        const products = await axios.get(url)

        return res.send({products})

    } catch(error){

        return res.send({error: error.message})

    }
})

module.exports = router