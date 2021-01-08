const express = require('express');
const breatheController = require('../Controllers/breatheController');

const upload = require('../middleware/fileUpload');
const protect = require('../middleware/protect');
const setMimetype = require('../middleware/setMimetype');

//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
router.use(protect);

//For admin only
//router.use(restrictTo(['Admin']));
router.route('/').post(
  upload.fields([
    {name: 'thumbnail', maxCount: 1},
    {name: 'video', maxCount: 1},
  ]),
  breatheController.createOne,
);

router.get('/videos/:categoryId', breatheController.getAllWithCategory);
router.get('/', breatheController.getAll);
router.get('/:id', breatheController.getOne);
router.patch(
  '/:id',
  setMimetype('image'),
  upload.single('thumbnail'),
  setMimetype('video'),
  upload.single('video'),
  breatheController.update,
);
router.delete('/:id', breatheController.delete);

module.exports = router;
