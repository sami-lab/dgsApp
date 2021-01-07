const express = require('express');
const breatheCategoriesController = require('../Controllers/breatheCategoriesController');

const protect = require('../middleware/protect');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
//router.use(protect);

router
  .route('/')
  .get(breatheCategoriesController.getAll)
  .post(breatheCategoriesController.createOne);

router
  .route('/:id')
  .get(breatheCategoriesController.getOne)
  .patch(breatheCategoriesController.update)
  .delete(breatheCategoriesController.delete);
module.exports = router;
