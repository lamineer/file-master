const authController = require('../controllers/authController');
const express = require('express')
const router = express.Router()

router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.post('/register', authController.registerUser);

module.exports = router