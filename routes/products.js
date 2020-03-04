import express from 'express'
import axios from 'axios'
import { redSky as url } from './../constants'
import Products from './../model/Products'

const router = express.Router()

router.route('/:id')
  .put(async (req, res) => {
    /* TODO Add JWT authorization to this verb endpoint */
    const { id } = req.params
    const productsURL = `${url}/${id}`
    let price = null
    if (req.query.price) {
      price = req.query.price
    }

    try {
      if (!price) {
        const { data } = await axios.get(productsURL, { params: { excludes: 'taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics' } })
        price = data.product.price.listPrice.price
      }
      price = parseFloat(price)
      if (isNaN(price)) {
        throw new Error(`Price expected to be a number. Instead received ${typeof req.query.price}`)
      }
      const update = await Products.update({ product_id: id }, { current_price: { value: price, currency_code: 'USD' } }, { upsert: true })
      return res.send({ update })
    } catch (error) {
      return res.status(error.response.status || 400).send({ error: error.message })
    }
  })
  .get(async (req, res) => {
    try {
      const { id } = req.params
      const productsURL = `${url}/${id}`

      const priceData = await Products.findOne({ product_id: id })
        .then(doc => {
          return doc
        })
        .catch(err => {
          return err
        })

      const productData = await axios
        .get(productsURL,
          {
            params: {
              excludes: 'taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics'
            }
          })

      const allProductData = await Promise.all([priceData, productData])
        .then(data => { return data })
        .catch(err => err)

      const [price, product] = allProductData
      const name = product.data.product.item.product_description.title
      const { current_price } = price // Standard Style wants CamelCase but I'm doing snake case to be consistent with the exercise.

      const response = {
        id,
        name,
        current_price
      }

      return res.send(response)
    } catch (error) {
      return res.status(error.response.status || 400).send({ error: error.message })
    }
  })

router.get('/', async (req, res) => {
  try {
    const products = await axios.get(url)
    return res.send({ products })
  } catch (error) {
    return res.status(error.response.status || 400).send({ error: error.message })
  }
})

export default router
