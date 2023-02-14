const db = require('../utils/database')

const Cart = require('./cart')

module.exports = class Product {
  constructor(id, t, price, description, imageUrl) {
    this.id = id
    this.title = t
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  save() {
    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ? ,?)', [this.title, this.price, this.description, this.imageUrl])
  }

  static deleteById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * FROM products')
  }

  static findById(id) {
  }

}