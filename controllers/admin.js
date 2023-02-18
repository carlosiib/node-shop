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
    // req.user -> obj from middleware 
    // createProduct() -> method created on the fly by Sequelize, which inherits all properties from associations
    await req.user.createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.postEditProduct = async (req, res) => {
  try {
    const { productId, title, description, price, imageUrl } = req.body
    const product = await Product.findByPk(productId)
    product.title = title
    product.description = description
    product.price = price
    product.imageUrl = imageUrl
    await product.save()
    res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.postDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.body
    const product = await Product.findByPk(productId)
    await product.destroy()
    res.redirect("/admin/products")
  } catch (error) {
    console.log(error)
  }
}

exports.getEditProduct = async (req, res, next) => {
  try {
    const { edit } = req.query
    const { productId } = req.params

    const [product] = await req.user.getProducts({ where: { id: productId } })

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
    const products = await req.user.getProducts()
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  } catch (error) {
    console.log(error)
  }
}