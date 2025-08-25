const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateBody, schemas } = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');


router.post('/register', validateBody(schemas.registerSchema), authController.register);
router.post('/login', validateBody(schemas.loginSchema), authController.login);
router.get('/me', protect, authController.getMe);
router.put('/me', protect, validateBody(schemas.updateSchema), authController.update);
router.delete('/me', protect, authController.softDelete);
router.post('/forgot-password', validateBody(schemas.forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateBody(schemas.resetPasswordSchema), authController.resetPassword);


module.exports = router;