const Product = require("../models/product")
const Order = require("../models/order")
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit')

const ITEMS_PER_PAGE = 2

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    const error = new Error("Fetch products failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    const product = await Product.findById(productId)
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (err) {
    const error = new Error("Fetch products failed")
    error.httpStatusCode = 500
    return next(error)
  }

}

exports.getIndex = async (req, res, next) => {
  try {

    const { page } = req.query
    const totalProds = await Product.find().countDocuments()
    const p = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    res.render('shop/product-list', {
      prods: p,
      pageTitle: 'All products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken(),
      totalProducts: totalProds,
      hasNextPage: ITEMS_PER_PAGE * page < totalProds,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalProds / ITEMS_PER_PAGE)
    });
  } catch (err) {
    const error = new Error("Fetch products failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getCart = async (req, res, next) => {
  try {
    const { cart: { items } } = await req.user.populate('cart.items.productId')
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: items,
      isAuthenticated: req.session.isLoggedIn,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    const error = new Error("Fetching cart failed")
    error.httpStatusCode = 500
    return next(error)
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const { productId } = req.body
    const product = await Product.findById(productId)
    await req.user.addToCart(product)
    res.redirect('/cart')
  } catch (err) {
    const error = new Error("Add cart failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body
    await req.user.removeFromCart(productId)
    res.redirect("/cart")
  } catch (err) {
    const error = new Error("Delete cart product failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.postOrder = async (req, res, next) => {
  try {
    const { email, _id: userId } = req.user
    const { cart: { items } } = await req.user.populate('cart.items.productId')
    const products = items.map(p => {
      return {
        quantity: p.quantity,
        product: { ...p.productId._doc }
      }
    })
    const order = new Order({
      products,
      user: {
        email: email,
        userId
      }
    })
    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')
  } catch (err) {
    const error = new Error("Post order failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    const error = new Error("Getting orders failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)

    //Invoice only corresponding to user
    if (!order) {
      return next(new Error("No order found for user"))
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"))
    }

    const invoiceName = 'udmy.pdf'
    const invoicePath = path.join('invoices', invoiceName)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')

    const pdfDoc = new PDFDocument()
    // generate and save on server
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    // send to client
    pdfDoc.pipe(res)
    pdfDoc.fontSize(26).text("Invoice")
    pdfDoc.fontSize(16).text("Order - " + order._id)
    pdfDoc.fontSize(26).text("-------")
    let totalPrice = 0
    order.products.forEach(p => {
      totalPrice += p.quantity * p.product.price
      pdfDoc.fontSize(16).text(p.product.title + " - " + p.quantity + " x " + "$" + p.product.price)
    })
    pdfDoc.fontSize(26).text("-------")
    pdfDoc.text('Total: $' + totalPrice)
    pdfDoc.end()

  } catch (err) {
    const error = new Error("Getting invoice failed")
    error.httpStatusCode = 500
    return next(error)
  }
}

exports.getCheckout = (req, res, next) => {
  try {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/cart',
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (err) {
    const error = new Error("Getting checkout failed")
    error.httpStatusCode = 500
    return next(error)
  }
}