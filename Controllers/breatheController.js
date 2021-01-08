const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const breatheModel = require('../Models/breatheModel');
const breatheCategories = require('../Models/breatheCategories');

//To filter Some fields from req.body so we can update only these fields
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.delete = catchAsync(async (req, res, next) => {
  const check = await breatheCategories.find({
    category: mongoose.Types.ObjectId(req.params.id),
  });
  if (check) return next(new AppError('Category are already in use', 403));
  const doc = await breatheModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});
exports.update = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'title', 'description', 'category'); //filtering unwanted Field
  if (req.files && req.files.thumbnail[0].filename) {
    filterBody.thumbnail = req.file.thumbnail;
  }
  if (req.files && req.files.video[0]) {
    filterBody.video = req.files.video[0].filename;
  }
  const doc = await breatheModel.findByIdAndUpdate(req.params.id, filterBody, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('requested Id not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'title', 'description', 'category'); //filtering unwanted Field
  if (req.files && req.files.thumbnail[0] && req.files.video[0]) {
    filterBody.thumbnail = req.files.thumbnail[0].filename;
    filterBody.video = req.files.video[0].filename;
  } else {
    return next(new AppError('thumbnail or video is missing', 403));
  }
  filterBody.addedBy = req.user.id;
  const doc = await breatheModel.create(filterBody);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await breatheModel
    .findById(req.params.id)
    .populate('category')
    .populate('postedBy', 'name');
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: {doc},
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await breatheModel
    .find()
    .sort({date: 1})
    .populate('category')
    .populate('postedBy', 'name');

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {doc},
  });
});

exports.getAllWithCategory = catchAsync(async (req, res, next) => {
  const doc = await breatheModel
    .find({
      category: mongoose.Types.ObjectId(req.params.categoryId),
    })
    .sort({date: 1})
    .populate('category')
    .populate('postedBy', 'name');

  res.status(200).json({
    status: 'success',
    result: doc.length,
    categoryId: req.params.categoryId,
    data: {doc},
  });
});
