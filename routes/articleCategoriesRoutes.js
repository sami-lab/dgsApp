const express = require('express');
const articleCategoriesController = require('../Controllers/articleCategoriesController');

const protect = require('../middleware/protect');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
//router.use(protect);

router
  .route('/')
  .get(articleCategoriesController.getAll)
  .post(articleCategoriesController.createOne);

router
  .route('/:id')
  .get(articleCategoriesController.getOne)
  .patch(articleCategoriesController.update)
  .delete(articleCategoriesController.delete);
module.exports = router;
