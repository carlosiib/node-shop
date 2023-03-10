const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const app = express()

const MONGODB_URI = 'mongodb://carlosiia96:BHkkdJkhrR8mmAc9@ac-8mf0rts-shard-00-00.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-01.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-02.zsc21y9.mongodb.net:27017/?ssl=true&replicaSet=atlas-pqpcdj-shard-0&authSource=admin&w=majority'

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
})


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const errorController = require('./controllers/error')
const User = require('./models/user')

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))

// Middleware for getting user methods from mongoose Model
app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next()
  }

  try {
    const user = await User.findById(req.session.user._id)
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})

app.use('/admin', adminRoute)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

async function init() {
  try {
    await mongoose.connect(MONGODB_URI)
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

