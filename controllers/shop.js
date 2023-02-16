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
    const [product] = await Product.findById(productId)
    console.log(product[0])
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
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

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = async (req, res) => {
  const { productId } = req.body
  const p = await Product.findById(productId)
  Cart.addProduct(productId, p.price)
  res.redirect('/cart')
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