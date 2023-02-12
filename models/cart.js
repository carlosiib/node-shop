const fs = require('fs')
const path = require('path')

const rootDir = require('../utils/path')

const p = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (error, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!error) {
        cart = JSON.parse(fileContent)
      }

      const existingProductIndex = cart.products.findIndex(p => p.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct;

      // add new product
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty += 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }

      cart.totalPrice = cart.totalPrice + parseInt(productPrice)

      fs.writeFile(p, JSON.stringify(cart), (error) => {
        console.log(error)
      })
    })
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
      if (!product) return;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * product.qty;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
}