const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error')
const sequelize = require('./utils/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1)
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }

})

app.use('/admin', adminRoute)
app.use(shopRoutes)

app.use(errorController.get404)

// Relation - association
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
User.hasMany(Product)

// 1-1
User.hasOne(Cart)
Cart.belongsTo(User)

// n-n
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// Sync -> creating tables IF NOT exists
sequelize.sync()
  .then(res => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: "foo", email: "foo@gmail.com" })
    }
    return user
  })
  .then(user => {
    return user.createCart()
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("App running on port 3000")
    })
  })
  .catch(error => {
    console.log(error)
  })
