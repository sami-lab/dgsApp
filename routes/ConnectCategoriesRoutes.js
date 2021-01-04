const express = require('express');
const connectCategoriesController = require('../Controllers/connectCategoriesController');

const protect = require('../middleware/protect');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
//router.use(protect);

router
  .route('/')
  .get(connectCategoriesController.getAll)
  .post(connectCategoriesController.createOne);

router
  .route('/:id')
  .get(connectCategoriesController.getOne)
  .patch(connectCategoriesController.update)
  .delete(connectCategoriesController.delete);
module.exports = router;
