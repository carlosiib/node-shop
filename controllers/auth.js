const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config();
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USER_ID_MAILTRAP,
    pass: process.env.USER_PASS_MAILTRAP
  }
});

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
    errorMessage: error?.length > 0 ? error : null,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: []
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: { email: email, password: password, confirmPassword: confirmPassword },
        validationErrors: errors.array()
      });
    }

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

    const message = {
      from: "foo@gmail.com",
      to: email,
      subject: "Account created successfully",
      html: "<h1>Welcome to Shop</h1><p>Your account was created successfully </p>",
    };

    transporter.sendMail(message, function (error, info) {
      if (error) {
        throw Error("Signup: sending email failed");
      } else {
        console.log("Signup - Email sent: " + info.response);
      }
    });

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

exports.getReset = (req, res) => {
  try {
    const [error] = req.flash('error')
    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      errorMessage: error?.length > 0 ? error : null
    });
  } catch (error) {
    console.log(error)
  }
}

exports.postReset = (req, res) => {
  try {
    const { email } = req.body
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        res.redirect('/reset')
        throw Error("Generating crypto failed")
      }

      const token = buffer.toString('hex')
      const user = await User.findOne({ email: email })

      if (!user) {
        req.flash('error', "No account found with email " + email)
        return res.redirect('/reset')
      }

      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3_600_000
      await user.save()

      const message = {
        from: "foo@gmail.com",
        to: email,
        subject: "Password reset",
        html: `<h1>Reset your password at:</h1> <a href="http://localhost:3000/reset/${token}">Reset</a>`,
      };

      transporter.sendMail(message, function (error, info) {
        if (error) {
          throw Error("Reset password: sending email failed");
        } else {
          console.log("Email sent, reset password: " + info.response);
        }
      });

      res.redirect('/')

    })
  } catch (error) {
    console.log(error)
  }
}

exports.getNewPassword = async (req, res) => {
  try {
    const { token } = req.params

    // $gt ->  grater than
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })

    if (!user) {
      res.redirect("/login")
      throw Error("Invalid user for resetting password")
    }

    const [error] = req.flash('error')
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Update Password',
      errorMessage: error?.length > 0 ? error : null,
      userId: user._id.toString(),
      passwordToken: token
    });
  } catch (error) {
    console.log(error)
  }
}

exports.postNewPassword = async (req, res) => {
  try {
    const { password, userId, passwordToken } = req.body

    const user = await User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })

    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = undefined

    await user.save()
    res.redirect('/login')
  } catch (error) {
    console.log(error)
  }
}
