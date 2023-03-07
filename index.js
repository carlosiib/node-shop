const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const app = express()


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error')
const User = require('./models/user')

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('6406c073eec6bd5a6bf0866b')
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use('/admin', adminRoute)
app.use(shopRoutes)

app.use(errorController.get404)

async function init() {
  try {
    await mongoose.connect('mongodb://carlosiia96:BHkkdJkhrR8mmAc9@ac-8mf0rts-shard-00-00.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-01.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-02.zsc21y9.mongodb.net:27017/?ssl=true&replicaSet=atlas-pqpcdj-shard-0&authSource=admin&retryWrites=true&w=majority')
    const existingUser = await User.findOne()
    if (!existingUser) {
      const user = new User({
        name: "foo",
        email: "foo@gmail.com",
        cart: {
          items: []
        }
      })
      user.save()
    }
    return app.listen(3000)
  } catch (error) {
    console.log(error)
  }
}
init()

