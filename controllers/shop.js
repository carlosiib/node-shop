const Product = require("../models/product")

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll()
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products',
    });
  } catch (error) {
    console.log(error)
  }


}

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findById(productId)
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    })
  } catch (error) {
    console.log(error)
  }

}

exports.getIndex = async (req, res) => {
  try {
    const p = await Product.fetchAll()
    res.render('shop/product-list', {
      prods: p,
      pageTitle: 'All products',
      path: '/products',
    });
  } catch (error) {
    console.log(error)
  }
}

exports.getCart = async (req, res) => {
  try {
    const products = await req.user.getCart()
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  } catch (error) {
    console.log(error)
  }
};

exports.postCart = async (req, res) => {
  try {
    const { productId } = req.body
    const product = await Product.findById(productId)
    await req.user.addToCart(product)
    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

exports.postCartDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.body
    await req.user.deleteCartItem(productId)
    res.redirect("/cart")
  } catch (error) {
    console.log(error)
  }
}

exports.postOrder = async (req, res) => {
  try {
    await req.user.addOrder()
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
}

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] })
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
      orders,
    });
  } catch (error) {
    console.log(error)
  }
}


exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/cart',
  });
}