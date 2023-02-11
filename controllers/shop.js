const Product = require("../models/product")

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products',
    });
  })
}

exports.getProduct = async (req, res) => {
  const { productId } = req.params
  const product = await Product.findById(productId)
  res.render('shop/product-detail', {
    product,
    pageTitle: product.title,
    path: '/products'
  })

  /*Product.findById(productId, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: 'Shop',
      path: '/'
    });
  })*/
}

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
}

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart',
  });
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/cart',
  });
}