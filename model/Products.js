import mongoose from 'mongoose'

const Products = mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    max: 8,
    unique: true
  },

  current_price: {
    value: {
      type: Number,
      required: true
    },

    currency_code: {
      type: String,
      required: true
    }
  }
})

export default mongoose.model('Products', Products)
