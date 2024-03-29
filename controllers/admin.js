const Product = require("../models/product")
const { validationResult } = require('express-validator/check')
const fileHelper = require('../utils/file')

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
    const { _id: userId } = req.user

    const image = req.file
    if (!image) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasErrors: true,
        errorMessage: "Attached file is not an image",
        validationErrors: [],
        product: {
          title,
          description,
          price,
        }
      })
    }

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
        }
      });
    }

    const product = new Product({
      title,
      price,
      description,
      imageUrl: image.path,
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
    const { productId, title, description, price } = req.body
    const { _id } = req.user
    const image = req.file

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
    if (image) {
      fileHelper.deleteFile(p.imageUrl)
      p.imageUrl = image.path
    }
    await p.save()
    res.redirect("/admin/products")
  } catch (err) {
    const error = new Error("Edit product failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    const { _id } = req.user

    const product = await Product.findById(productId)
    if (!product) {
      throw new Error("Delete: Product not found")
    }

    fileHelper.deleteFile(product.imageUrl)
    await Product.deleteOne({ _id: productId, userId: _id })
    res.status(200).json({ message: 'success' })
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' })
  }
}

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body
    const { _id } = req.user

    const product = await Product.findById(productId)
    if (!product) {
      throw new Error("Delete: Product not found")
    }

    fileHelper.deleteFile(product.imageUrl)
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