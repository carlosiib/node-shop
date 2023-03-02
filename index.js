const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error')
const mongoConnect = require('./utils/database').mongoConnect
const User = require('./models/user')

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('640039855dea820e9cb6b1a1')
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
  const client = await mongoConnect()
  console.log(client)
  return app.listen(3000)
}
init()

