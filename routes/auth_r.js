const router = require('express').Router();

const authController = require('../controllers/auth_c');

router.post("/login_user", authController.loginUser);

module.exports = router;