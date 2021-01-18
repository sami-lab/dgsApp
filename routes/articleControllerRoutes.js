const express = require('express');
const articleController = require('../Controllers/articleController');

const upload = require('../middleware/fileUpload');
const protect = require('../middleware/protect');

//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
router.use(protect);

//For admin only
//router.use(restrictTo(['Admin']));
router
  .route('/')
  .post(
    upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'files' }]),
    articleController.createOne
  );

router.get(
  '/articles/:categoryId/:search',
  articleController.getAllWithCategorySearch
);
router.get('/', articleController.getAll);
router.get('/:id', articleController.getOne);
router.patch(
  '/:id',
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'files' }]),
  articleController.update
);
router.delete('/:id', articleController.delete);

module.exports = router;
