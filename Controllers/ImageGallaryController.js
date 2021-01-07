const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const ImageGallaryModel = require('../Models/ImageGallaryModel');

//For admin only
exports.delete = catchAsync(async (req, res, next) => {
  const doc = await ImageGallaryModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Image not uploaded', 403));
  const doc = await ImageGallaryModel.findByIdAndUpdate(
    req.params.id,
    {url: req.file.filename},
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
  if (!req.file) return next(new AppError('Image not uploaded', 403));
  const doc = await ImageGallaryModel.create({
    postedBy: req.user.id,
    url: req.file.filename,
  });

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await ImageGallaryModel.findById(req.params.id).populate(
    'postedBy',
    'name',
  );
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: {doc},
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await ImageGallaryModel.find()
    .sort({date: 1})
    .populate('postedBy', 'name');

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {doc},
  });
});
