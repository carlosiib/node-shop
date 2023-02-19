const Product = require("../models/product")

exports.getProducts = async (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch((error) => console.log(error))
}

exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findByPk(productId)
    console.log(product)
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
    const p = await Product.findAll()
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
    const cart = await req.user.getCart()
    const products = await cart.getProducts()
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
    const cart = await req.user.getCart()
    const products = await cart.getProducts({ where: { id: productId } })

    // product already exists in cart
    let newQuantity = 1
    if (products.length > 0) {
      const oldQty = products[0].cartItem.quantity
      newQuantity = oldQty + 1
      await cart.addProduct(products[0], { through: { quantity: newQuantity } })
    }

    // adding product for first time
    const newProd = await Product.findByPk(productId)
    await cart.addProduct(newProd, { through: { quantity: newQuantity } })

    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

exports.postCartDeleteProduct = async (req, res) => {
  try {
    const { productId } = req.body
    const cart = await req.user.getCart()
    const [product] = await cart.getProducts({ where: { id: productId } })
    await product.cartItem.destroy()
    res.redirect("/cart")
  } catch (error) {
    console.log(error)
  }
}

exports.postOrder = async (req, res) => {
  try {
    const cart = await req.user.getCart()
    const products = await cart.getProducts()
    const order = await req.user.createOrder()
    await order.addProducts(products.map(p => {
      p.orderItem = { quantity: p.cartItem.quantity }
      return p
    }
    ))

    // Empty cart items 
    await cart.setProducts(null)
    res.redirect('/orders')
  } catch (error) {
    console.log(error)
  }
}

exports.getOrders = (req, res) => {
  try {
    res.render('shop/orders', {
      pageTitle: 'Orders',
      path: '/orders',
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