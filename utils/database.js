const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = async (cb) => {
  try {
    const client = await MongoClient.connect('mongodb://carlosiia96:BHkkdJkhrR8mmAc9@ac-8mf0rts-shard-00-00.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-01.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-02.zsc21y9.mongodb.net:27017/?ssl=true&replicaSet=atlas-pqpcdj-shard-0&authSource=admin&retryWrites=true&w=majority')
    return client
  } catch (error) {
    console.log(error)
  }
}

module.exports = mongoConnect

