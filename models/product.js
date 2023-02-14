const db = require('../utils/database')

const Cart = require('./cart')

module.exports = class Product {
  constructor(id, t, imageUrl, description, price) {
    this.id = id
    this.title = t
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {

  }

  static deleteById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * FROM products')
  }

  static findById(id) {
  }

}