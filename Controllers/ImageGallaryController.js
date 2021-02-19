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
    { image: req.file.filename },
    {
      new: true,
      runValidators: true,
    }
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
    image: req.file.filename,
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
    'name'
  );
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: { doc },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const total = await ImageGallaryModel.countDocuments();
  let query = ImageGallaryModel.find({
    $query: {},
    $orderby: { date: -1 },
  }).populate('postedBy', 'name');

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    if (skip >= total) next(new AppError('This Page Does not exist', 404));
  }
  const doc = await query;
  res.status(200).json({
    status: 'success',
    total,
    result: doc.length,
    data: { doc },
  });
});
