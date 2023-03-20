const bcrypt = require('bcryptjs')
const User = require("../models/user");

exports.getLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
    });
  } catch (error) {
    console.log(error)
  }
}

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.redirect('/login')
    }

    // Validate user
    const doMatch = await bcrypt.compare(password, user.password)

    if (doMatch) {
      req.session.isLoggedIn = true
      req.session.user = user
      await req.session.save()
      return res.redirect('/')
    }

    res.redirect('/login')
  } catch (error) {
    console.log(error)
    req.session.isLoggedIn = false
    req.session.user = null
    res.redirect("/login")
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

    // Create user if it doesn't exists
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      email,
      password: hashedPassword,
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
