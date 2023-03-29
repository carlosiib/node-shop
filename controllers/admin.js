const Product = require("../models/product")
const { validationResult } = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
  try {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasErrors: false,
      errorMessage: null,
      validationErrors: []
    });
  } catch (err) {
    const error = new Error("Getting products failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, description, price } = req.body
    const image = req.file
    console.log(image)
    const { _id: userId } = req.user

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasErrors: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        product: {
          title,
          description,
          price,
          image
        }
      });
    }

    const product = new Product({
      title,
      price,
      description,
      image,
      userId
    })
    await product.save()
    res.redirect("/admin/products")
  } catch (err) {
    const error = new Error("Creating product failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, description, price, imageUrl } = req.body
    const { _id } = req.user

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasErrors: true,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        product: {
          _id: productId,
          title,
          description,
          price,
          imageUrl
        }
      });
    }

    const p = await Product.findById(productId)

    if (p.userId.toString() !== _id.toString()) {
      return res.redirect('/')
    }

    p.title = title
    p.description = description
    p.price = price
    p.imageUrl = imageUrl
    await p.save()
    res.redirect("/admin/products")
  } catch (err) {
    const error = new Error("Edit product failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body
    const { _id } = req.user
    await Product.deleteOne({ _id: productId, userId: _id })
    res.redirect("/admin/products")
  } catch (err) {
    const error = new Error("Deleting product failed")
    error.httpStatusCode = 500
    return next(error)
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
      hasErrors: false,
      errorMessage: null,
      validationErrors: [],
      product
    });
  } catch (err) {
    const error = new Error("Editing product failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getProducts = async (req, res, next) => {
  try {
    const { _id } = req.user

    // Admin - Products created only by current user
    const products = await Product.find({ userId: _id })
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
    //throw Error("Test error middleware")
  } catch (err) {
    const error = new Error("Getting products failed")
    error.httpStatusCode = 500
    return next(error)
  }
}