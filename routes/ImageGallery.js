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
  .post(
    setMimetype('image'),
    upload.single('url'),
    ImageGallaryController.createOne,
  );

router
  .route('/:id')
  .get(ImageGallaryController.getOne)
  .patch(
    setMimetype('image'),
    upload.single('url'),
    ImageGallaryController.update,
  )
  .delete(ImageGallaryController.delete);
module.exports = router;
