const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', [check('title').isString().isLength({ min: 3 }).trim(), check('imageUrl').isURL(), check('price').isFloat(), check('description').isLength({ min: 3, max: 200 }).trim()], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [check('title').isString().isLength({ min: 3 }).trim(), check('imageUrl').isURL(), check('price').isFloat(), check('description').isLength({ min: 3, max: 200 }).trim()], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = router;
