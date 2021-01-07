const express = require('express');
const connectProfessionalsController = require('../Controllers/connectProfessionalsController');

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
  connectProfessionalsController.createOne,
);

router.get(
  '/professionals/:categoryId',
  connectProfessionalsController.getAllWithCategory,
);
router.get('/', connectProfessionalsController.getAll);
router.get('/:id', connectProfessionalsController.getOne);
router.patch(
  '/:id',
  setMimetype('image'),
  upload.single('image'),
  connectProfessionalsController.update,
);
router.delete('/:id', connectProfessionalsController.delete);

module.exports = router;
