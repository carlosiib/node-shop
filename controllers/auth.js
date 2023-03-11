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

exports.postSignup = (req, res, next) => { };


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
