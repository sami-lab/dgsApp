const express = require('express');
const shopController = require('../Controllers/shopController');

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
  shopController.createOne
);

router.get('/', shopController.getAll);
router.get('/:id', shopController.getOne);
router.patch(
  '/:id',
  setMimetype('image'),
  upload.single('image'),
  shopController.update
);
router.delete('/:id', shopController.delete);

module.exports = router;
