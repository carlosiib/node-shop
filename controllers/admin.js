const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
}

exports.postAddProduct = (req, res, next) => {
  const { title, description, price, imageUrl } = req.body
  const product = new Product(title, imageUrl, description, price)
  product.save()
  res.redirect('/');
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  })
}