const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema)

// const mongodb = require('mongodb')
// const getDb = require('../utils/database').getDb
// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title
//     this.price = price
//     this.description = description
//     this.imageUrl = imageUrl
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId
//   }

//   async save() {
//     try {
//       const db = getDb()
//       // updating product
//       if (this._id) {
//         const product = await db.collection('products').updateOne({ _id: this._id }, { $set: this })
//         return product
//       }

//       const product = await db.collection('products').insertOne(this)
//       return product
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async fetchAll() {
//     try {
//       const db = getDb()
//       const products = await db.collection('products').find().toArray()
//       return products
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async findById(prodId) {
//     try {
//       const db = getDb()
//       //TODO: FIX argument 12 bytes from ObjectId
//       const product = await db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
//       return product
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   static async deleteById(prodId) {
//     try {
//       const db = getDb()
//       const product = await db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       return product
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

// module.exports = Product