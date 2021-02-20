const express = require('express');
const journalController = require('../Controllers/journalController');

const upload = require('../middleware/fileUpload');
const protect = require('../middleware/protect');
//const restrictTo = require('../middleware/restrictedTo');

const router = express.Router();
router.use(protect);

//For admin only
//router.use(restrictTo(['Admin']));
router.post('/', upload.single('image'), journalController.createOne);

router.get('/', journalController.getAll);
router.get('/:id', journalController.getOne);
router.patch('/:id', upload.single('image'), journalController.update);
router.delete('/:id', journalController.delete);

module.exports = router;
