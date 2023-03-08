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
