exports.getLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: false
    });
  } catch (error) {
    console.log(error)
  }
}

exports.postLogin = async (req, res) => {
  try {

    req.session.isLoggedIn = true
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}
