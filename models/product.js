const fs = require('fs')
const path = require('path')

const Cart = require('./cart')
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
  constructor(id = null, t, imageUrl, description, price) {
    this.id = id
    this.title = t
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile((products) => {
      // editing product
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id)
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err)
        })
      } else {
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err)
        })
      }
    })
  }

  static deleteById(id) {
    return new Promise((resolve) => {
      getProductsFromFile(products => {
        const product = products.find(p => p.id === id)
        const updatedProd = products.filter(p => p.id !== id)
        fs.writeFile(p, JSON.stringify(updatedProd), (error) => {
          if (!error) {
            Cart.deleteProduct(id, product.price)
            resolve(updatedProd)
          }
          console.log(error)
        })
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