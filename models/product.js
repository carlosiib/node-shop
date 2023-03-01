const getDb = require('../utils/database').getDb
class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  async save() {
    try {
      const db = getDb()
      const product = await db.collection('products').insertOne(this)
      return product
    } catch (error) {
      console.log(error)
    }
  }

  static async fetchAll() {
    try {
      const db = getDb()
      const products = await db.collection('products').find().toArray()
      return products
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Product