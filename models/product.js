const fs = require('fs')
const path = require('path')

const rootDir = require('../utils/path')

const p = path.join(rootDir, 'data', 'products.json')

const getProductsFromFile = (cb) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) {
      return cb([])
    }
    cb(JSON.parse(fileContent))
  })
}
module.exports = class Product {
  constructor(t, imageUrl, description, price) {
    this.title = t
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    this.id = Math.random().toString()
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(id, cb) {
    return new Promise((resolve) => {
      getProductsFromFile(products => {
        const product = products.find(p => p.id === id)
        resolve(product)
      })
    })
    /*getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })*/
  }
}