const fs = require('fs')
const path = require('path')

const rootDir = require('../utils/path')
module.exports = class Product {
  constructor(t) {
    this.title = t
  }

  save() {
    const p = path.join(rootDir, 'data', 'products.json')
    fs.readFile(p, (error, fileContent) => {
      let products = []
      if (!error) {
        products = JSON.parse(fileContent)
      }
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(error)
      })
    })
  }

  static fetchAll(cb) {
    const p = path.join(rootDir, 'data', 'products.json')
    fs.readFile(p, (error, fileContent) => {
      if (error) {
        cb([])
      }
      cb(JSON.parse(fileContent))
    })
  }
}