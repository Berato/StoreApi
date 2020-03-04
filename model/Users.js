import mongoose from 'mongoose'

const Users = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    max: 1024
  }
})

export default mongoose.model('Users', Users)
