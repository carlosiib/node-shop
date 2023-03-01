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

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  // try {
  //   const user = await User.findByPk(1)
  //   req.user = user
  //   next()
  // } catch (error) {
  //   console.log(error)
  // }
  next()
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

