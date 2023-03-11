const User = require("../models/user");

exports.getLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (error) {
    console.log(error)
  }
}

exports.postLogin = async (req, res) => {
  try {
    const user = await User.findById('6406c073eec6bd5a6bf0866b')
    req.session.isLoggedIn = true
    req.session.user = user
    req.session.save(() => {
      res.redirect('/')
    })
  } catch (error) {
    req.session.isLoggedIn = false
    req.session.user = null
    console.log(error)
  }
}

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })
    // User already exists
    if (user) {
      return res.redirect('/signup')
    }

    // User doesn't exists
    const newUser = new User({
      email,
      password,
      cart: { items: [] }
    })
    await newUser.save()
    res.redirect('/login')

  } catch (error) {
    console.log(error)
  }
};


exports.postLogout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/')
    })
  } catch (error) {
    req.session.isLoggedIn = false
    req.session.user = null
    console.log(error)
  }
}
