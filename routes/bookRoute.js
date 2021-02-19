const express = require('express');
const bookController = require('../Controllers/bookController');

const upload = require('../middleware/fileUpload');
const protect = require('../middleware/protect');
const setMimetype = require('../middleware/setMimetype');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
router.use(protect);

//For admin only
//router.use(restrictTo(['Admin']));
router.post(
  '/',
  setMimetype('image'),
  upload.single('image'),
  bookController.createOne
);

router.get('/', bookController.getAll);
router.get('/:id', bookController.getOne);
router.patch(
  '/:id',
  setMimetype('image'),
  upload.single('image'),
  bookController.update
);
router.delete('/:id', bookController.delete);

module.exports = router;
