const express = require('express');
const ImageGallaryController = require('../Controllers/ImageGallaryController');

const protect = require('../middleware/protect');
const upload = require('../middleware/fileUpload');
const setMimetype = require('../middleware/setMimetype');

//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
router.use(protect);

router
  .route('/')
  .get(ImageGallaryController.getAll)
  .post(upload.single('image'), ImageGallaryController.createOne);

router
  .route('/:id')
  .get(ImageGallaryController.getOne)
  .patch(upload.single('image'), ImageGallaryController.update)
  .delete(ImageGallaryController.delete);
module.exports = router;
