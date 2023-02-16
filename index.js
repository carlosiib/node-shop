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

//npm start
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoute)
app.use(shopRoutes)

app.use(errorController.get404)

// Sync -> creating tables IF NOT exists
sequelize.sync().then(res => {
  app.listen(3000, () => {
    console.log("App running on port 3000")
  })
}).catch(error => {
  console.log(error)
})
