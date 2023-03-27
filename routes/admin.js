const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const { productValidation } = require('../middleware/validation-forms')

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', productValidation, isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', productValidation, isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = router;
