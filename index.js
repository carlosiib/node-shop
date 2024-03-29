const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const MongoDBStore = require('connect-mongodb-session')(session)
const app = express()

const MONGODB_URI = 'mongodb://carlosiia96:BHkkdJkhrR8mmAc9@ac-8mf0rts-shard-00-00.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-01.zsc21y9.mongodb.net:27017,ac-8mf0rts-shard-00-02.zsc21y9.mongodb.net:27017/?ssl=true&replicaSet=atlas-pqpcdj-shard-0&authSource=admin&w=majority'

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
})
const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // path to store image
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    // setting filename
    const generateNumber = () => Math.floor(Math.random() * 100 + 1)
    cb(null, `${generateNumber()}-${generateNumber()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const errorController = require('./controllers/error')
const User = require('./models/user')

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())

// Middleware for getting user methods from mongoose Model
app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next()
  }

  try {
    const user = await User.findById(req.session.user._id)
    if (!user) {
      return next()
    }
    req.user = user
    next()
  } catch (error) {
    throw new Error(error)
  }
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoute)
app.use(shopRoutes)
app.use(authRoutes)

app.use('/500', errorController.get500)
app.use(errorController.get404)

app.use((error, req, res, next) => {
  res.redirect('/500')
})

async function init() {
  try {
    await mongoose.connect(MONGODB_URI)
    return app.listen(3000)
  } catch (error) {
    console.log(error)
  }
}
init()

