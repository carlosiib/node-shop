const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check')
const authController = require('../controllers/auth')

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', [check('email').isEmail().withMessage('Please enter a valid email.'), check('password').isLength({ min: 6 }).withMessage('Password needs to be at least 6 characters long.')], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;