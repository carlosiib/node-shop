const bcrypt = require('bcryptjs')
const User = require("../models/user");

exports.getLogin = async (req, res) => {
  const [error] = req.flash('error')
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: error?.length > 0 ? error : null
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
      req.flash('error', 'Invalid email or password')
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

    req.flash('error', 'Invalid password')
    res.redirect('/login')
  } catch (error) {
    console.log(error)
    req.session.isLoggedIn = false
    req.session.user = null
    res.redirect("/login")
  }
}

exports.getSignup = (req, res) => {
  const [error] = req.flash('error')
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: error?.length > 0 ? error : null
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })

    // User already exists
    if (user) {
      req.flash('error', 'Email already exists')
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
