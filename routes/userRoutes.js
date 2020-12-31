const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

const upload = require('../middleware/fileUpload');
const protect = require('../middleware/protect');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();

router.post('/signup', upload.single('photo'), authController.signUp);
router.post('/validateUsername', authController.validateUsername);
router.post('/validateEmail', authController.validateEmail);
router.post('/verifyEmail/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgetpassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/validateToken', protect, authController.validateUser);
router.use(protect);
router.patch('/updatePassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

//router.use(restrictTo(['Admin']));
//router.route('/').get(userController.getalluser);
// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
