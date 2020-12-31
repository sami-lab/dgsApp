const express = require('express');
const rolesController = require('../Controllers/rolesController');

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();

//router.use(protect);
//router.use(restrictTo(["Admin"]));

router.route('/').get(rolesController.getAll).post(rolesController.createOne);
router
  .route('/:id')
  .get(rolesController.getOne)
  .patch(rolesController.update)
  .delete(rolesController.delete);

module.exports = router;
