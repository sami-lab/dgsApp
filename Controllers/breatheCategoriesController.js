const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const breatheCategoriesModel = require('../Models/breatheCategories');
const breatheModel = require('../Models/breatheModel');

//For admin only
exports.delete = catchAsync(async (req, res, next) => {
  const check = await breatheModel.find({
    category: mongoose.Types.ObjectId(req.params.id),
  });
  if (check) return next(new AppError('Category are already in use', 403));
  const doc = await breatheCategoriesModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const {name} = req.body;
  const doc = await breatheCategoriesModel.findByIdAndUpdate(
    req.params.id,
    {name},
    {
      new: true,
      runValidators: true,
    },
  );
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
  const {name} = req.body;
  const doc = await breatheCategoriesModel.create({
    name,
  });

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await breatheCategoriesModel.findById(req.params.id);
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: {doc},
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await breatheCategoriesModel.find().sort({date: 1});

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {doc},
  });
});
