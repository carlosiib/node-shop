const mongodb = require('mongodb')
const getDb = require('../utils/database').getDb
class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart
    this._id = id
  }

  async save() {
    try {
      const db = getDb()
      const user = await db.collection('users').insertOne(this)
      return user
    } catch (error) {
      console.log()
    }
  }

  async addToCart(product) {
    try {
      // const cartProduct= this.cart.items.findIndex(p => p._id === product._id)

      // cart init
      const updatedCart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }] }

      const db = getDb()
      const user = await db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
        $set: { cart: updatedCart }
      })
      return user
    } catch (error) {
      console.log(error)
    }
  }

  static async findById(userId) {
    try {
      const db = getDb()
      const user = await db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
      return user
    } catch (error) {
      console.log()
    }
  }
}

module.exports = User