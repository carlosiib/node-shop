const { check } = require('express-validator/check')
// check('imageUrl').isURL()
const productValidation = [check('title').isString().isLength({ min: 3 }).trim(), check('price').isFloat(), check('description').isLength({ min: 3, max: 200 }).trim()]

module.exports = {
  productValidation
};