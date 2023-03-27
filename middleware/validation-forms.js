const { check } = require('express-validator/check')

const productValidation = [check('title').isString().isLength({ min: 3 }).trim(), check('imageUrl').isURL(), check('price').isFloat(), check('description').isLength({ min: 3, max: 200 }).trim()]

module.exports = {
  productValidation
};