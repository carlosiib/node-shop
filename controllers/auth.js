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
    const { email, password } = req.body
    res.setHeader('Set-Cookie', 'loggedIn=true')
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
}
