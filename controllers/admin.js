const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
}

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, description, price, imageUrl } = req.body
    const product = new Product(
      title,
      price,
      imageUrl,
      description,
      null,
      req.user._id
    )
    await product.save()
    res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.postEditProduct = async (req, res) => {
  try {
    const { productId, title, description, price, imageUrl } = req.body
    const newProd = new Product(title, price, description, imageUrl, productId)
    await newProd.save()
    res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.postDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.body
    await Product.deleteById(productId)
    res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.getEditProduct = async (req, res, next) => {
  try {
    const { edit } = req.query
    const { productId } = req.params

    const product = await Product.findById(productId)

    if (!edit || !product) {
      return res.redirect('/')
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: edit,
      product
    });
  } catch (error) {
    console.log(error)
  }
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.fetchAll()
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  } catch (error) {
    console.log(error)
  }
}