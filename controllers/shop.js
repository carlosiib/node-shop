const Product = require("../models/product")
const Order = require("../models/order")

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
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
    const p = await Product.find()
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
    const { cart: { items } } = await req.user.populate('cart.items.productId')
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: items
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
    await req.user.removeFromCart(productId)
    res.redirect("/cart")
  } catch (error) {
    console.log(error)
  }
}

exports.postOrder = async (req, res) => {
  try {
    const { name, _id: userId } = req.user
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
        name,
        userId
      }
    })
    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
}

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
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