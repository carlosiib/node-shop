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
      const cartProductIndex = this.cart.items.findIndex(p => p.productId.toString() === product._id.toString())
      const updatedCartItems = [...this.cart.items]

      // Update - PRODUCT ALREADY EXISTS
      let newQuantity = 1
      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
      } else {
        updatedCartItems.push({
          productId: new mongodb.ObjectId(product._id),
          quantity: newQuantity
        })
      }

      // cart update
      const updatedCart = { items: updatedCartItems }

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