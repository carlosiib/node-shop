const mongodb = require('mongodb')
const getDb = require('../utils/database').getDb
class User {
  constructor(username, email) {
    this.name = username
    this.email = email
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