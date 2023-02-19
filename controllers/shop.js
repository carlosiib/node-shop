const Product = require("../models/product")
const Cart = require("../models/cart")

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
    //let fetchedCart
    const cart = await req.user.getCart()
    let fetchedCart = cart
    const products = await cart.getProducts({ where: { id: productId } })

    let product
    if (products.length > 0) {
      product = products[0]
    }

    // product already exists in cart
    // cartItems -> generated on the fly by sequelize
    let newQuantity = 1
    if (product) {
      const oldQty = product.cartItem.quantity
      newQuantity = oldQty + 1
      await fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    }

    // adding product for first time
    const newProd = await Product.findByPk(productId)
    await fetchedCart.addProduct(newProd, { through: { quantity: newQuantity } })

    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

exports.postCartDeleteProduct = async (req, res) => {
  const { productId } = req.body
  const p = await Product.findById(productId)
  Cart.deleteProduct(productId, p.price)
  res.redirect("/cart")

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