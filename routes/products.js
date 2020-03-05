import express from 'express'
import axios from 'axios'
import { redSky as url } from './../constants'
import Products from './../model/Products'
import verifyJWT from './../middleware/verifyJWT'
import getProductData from './../getProductData'

const router = express.Router()

router.route('/:id')
  .put(verifyJWT, async (req, res) => {
    const { id } = req.params

    const productsURL = `${url}/${id}`

    let price = null

    if (req.body.price) {
      price = req.body.price
    }

    try {
      if (!price) {
        const data = await getProductData(productsURL, { params: { excludes: 'taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics' } })
        price = data.product.price.listPrice.price
      }
      price = parseFloat(price)
      if (isNaN(price)) {
        throw new Error(`Price expected to be a number. Instead received ${typeof req.query.price}`)
      }
      const update = await Products.update({ product_id: id }, { current_price: { value: price, currency_code: 'USD' } }, { upsert: true })
      return res.send({ update })
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })
  .get(async (req, res) => {
    try {
      const { id } = req.params
      const productsURL = `${url}/${id}`

      const priceData = Products.findOne({ product_id: id })
        .then(doc => {
          return doc
        })
        .catch(err => {
          return err
        })

      const productData = axios
        .get(productsURL,
          {
            params: {
              excludes: 'taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics'
            }
          })

      const allProductData = await Promise.all([priceData, productData])
        .then(data => { return data })
        .catch(err => err)

      let [price, product] = allProductData

      if (!price) {
        // If we don't get a price from the DB we'll need to get it from the service.
        const data = await getProductData(productsURL, { params: { excludes: 'taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics' } })
        price = {
          current_price: {
            value: data.product.price.listPrice.price,
            currency_code: 'USD'
          }
        }
      }

      const name = product.data.product.item.product_description.title
      const { current_price: currentPrice } = price

      const response = {
        id,
        name,
        current_price: currentPrice
      }

      return res.send(response)
    } catch (error) {
      return res.status(400).send({ error: error.message })
    }
  })

export default router
