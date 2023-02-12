const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
}

exports.postAddProduct = (req, res, next) => {
  const { title, description, price, imageUrl } = req.body
  const product = new Product(title, imageUrl, description, price)
  product.save()
  res.redirect('/');
}

exports.postEditProduct = (req, res) => {
  const { productId, title, description, price, imageUrl } = req.body
  const updated = new Product(productId, title, imageUrl, description, price)
  updated.save()
  res.redirect("/admin/products")
}

exports.postDeleteProduct = async (req, res) => {
  const { productId } = req.body
  await Product.deleteById(productId)
  res.redirect("/admin/products")
}

exports.getEditProduct = async (req, res, next) => {
  const { edit } = req.query
  const { productId } = req.params

  if (!edit) {
    return res.redirect('/')
  }

  const product = await Product.findById(productId)

  if (!product) {
    return res.redirect('/')
  }

  console.log(edit)
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: edit,
    product
  });
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