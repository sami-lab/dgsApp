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
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  breatheController.createOne
);

router.get(
  '/videos/:categoryId/:search',
  breatheController.getAllWithCategorySearch
);
router.get('/', breatheController.getAll);
router.get('/getRandomVideos', breatheController.getRandomVideos);

router.get('/:id', breatheController.getOne);
router.patch(
  '/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  breatheController.update
);
router.delete('/:id', breatheController.delete);

module.exports = router;
