const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }]
  }
})

UserSchema.methods.addToCart = async function (product) {
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
        productId: product._id,
        quantity: newQuantity
        // name: product.title,
      })
    }

    // cart update
    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart

    return this.save()
  } catch (error) {
    console.log(error)
  }
}

UserSchema.methods.removeFromCart = async function (pId) {
  try {
    const updatedCart = this.cart.items.filter(i => i.productId.toString() !== pId.toString())
    this.cart.items = updatedCart
    return this.save()
  } catch (error) {
    console.log(error)
  }
}

UserSchema.methods.clearCart = async function () {
  try {
    this.cart = { items: [] }
    return this.save()
  } catch (error) {
    console.log(error)
  }
}

module.exports = mongoose.model('User', UserSchema)

// const mongodb = require('mongodb')
// const getDb = require('../utils/database').getDb
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username
//     this.email = email
//     this.cart = cart
//     this._id = id
//   }

//   async save() {
//     try {
//       const db = getDb()
//       const user = await db.collection('users').insertOne(this)
//       return user
//     } catch (error) {
//       console.log()
//     }
//   }

//   async addToCart(product) {
//     try {
//       const cartProductIndex = this.cart.items.findIndex(p => p.productId.toString() === product._id.toString())
//       const updatedCartItems = [...this.cart.items]

//       // Update - PRODUCT ALREADY EXISTS
//       let newQuantity = 1
//       if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1
//         updatedCartItems[cartProductIndex].quantity = newQuantity
//       } else {
//         updatedCartItems.push({
//           productId: new mongodb.ObjectId(product._id),
//           // name: product.title,
//           quantity: newQuantity
//         })
//       }

//       // cart update
//       const updatedCart = { items: updatedCartItems }

//       const db = getDb()
//       const user = await db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
//         $set: { cart: updatedCart }
//       })
//       return user
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async getCart() {
//     try {
//       const db = getDb()
//       const productsIds = this.cart.items.map(i => i.productId)
//       const cart = await db.collection('products').find({ _id: { $in: productsIds } }).toArray()

//       const products = cart.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => { return i.productId.toString() === p._id.toString() }).quantity
//         }
//       })
//       return products
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async deleteCartItem(pId) {
//     try {
//       const items = this.cart.items.filter(i => i.productId.toString() !== pId.toString())
//       const db = getDb()
//       const updatedCartItems = await db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
//         $set: { cart: { items: items } }
//       })
//       return updatedCartItems
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async addOrder() {
//     try {
//       const db = getDb()
//       const cart = await this.getCart()
//       const createOrder = {
//         items: cart,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.name
//         }
//       }
//       await db.collection('orders').insertOne(createOrder)
//       this.cart = { items: [] }
//       const order = await db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {
//         $set: { cart: { items: [] } }
//       })
//       return order
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   async getOrders() {
//     try {
//       const db = getDb()
//       const orders = await db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).
//         toArray()
//       return orders
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async findById(userId) {
//     try {
//       const db = getDb()
//       const user = await db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
//       return user
//     } catch (error) {
//       console.log()
//     }
//   }
// }

// module.exports = User