const express = require('express');

const asycMiddleware = require('../middleware/async');

const router = express.Router();

const authController = require('../controllers/account');

router.post('/',asycMiddleware(authController.Login));


router.post('/registration',asycMiddleware(authController.Registration));

router.put('/verifyEmail',asycMiddleware(authController.VerifyEmail));


module.exports = router;