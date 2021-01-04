const express = require('express');
const connectProfessionalsController = require('../Controllers/connectProfessionalsController');

const upload = require('../middleware/fileUpload');
const protect = require('../middleware/protect');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
router.use(protect);

//For admin only
//router.use(restrictTo(['Admin']));
router.post(
  '/',
  upload.single('image'),
  connectProfessionalsController.createOne,
);

router.get(
  '/professionals/:categoryId',
  connectProfessionalsController.getAllWithCategory,
);
router.get('/', connectProfessionalsController.getAll);
router.get('/:id', connectProfessionalsController.getOne);
router.patch('/:id', connectProfessionalsController.update);
router.delete('/:id', connectProfessionalsController.delete);

// router.post('/validateUsername', authController.validateUsername);
// router.post('/validateEmail', authController.validateEmail);
// router.post('/verifyEmail/:token', authController.verifyEmail);
// router.post('/login', authController.login);
// router.post('/forgetpassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);
// router.post('/validateToken', protect, authController.validateUser);
// router.patch('/updatePassword', authController.updatePassword);
// router.get('/me', userController.getMe, userController.getUser);
// router.patch('/updateMe', upload.single('photo'), userController.updateMe);
// router.delete('/deleteMe', userController.deleteMe);

//router.use(restrictTo(['Admin']));
//router.route('/').get(userController.getalluser);
// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
