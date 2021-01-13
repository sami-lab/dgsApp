const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const ConnectProfessionalsModel = require('../Models/ConnectProfessionalsModel');

//To filter Some fields from req.body so we can update only these fields
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.delete = catchAsync(async (req, res, next) => {
  const doc = await ConnectProfessionalsModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});
exports.update = catchAsync(async (req, res, next) => {
  if (req.body.connectCategory && !Array.isArray(req.body.connectCategory))
    return next(new AppError('Data are not Correct Format', 500));
  const filterBody = filterObj(
    req.body,
    'name',
    'email',
    'phone',
    'website',
    'connectCategory',
    'description',
  ); //filtering unwanted Field
  if (req.file) filterBody.image = req.file.filename;
  const doc = await ConnectProfessionalsModel.findByIdAndUpdate(
    req.params.id,
    filterBody,
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
  if (req.body.connectCategory && !Array.isArray(req.body.connectCategory))
    return next(new AppError('Data are not Correct Format', 500));
  const filterBody = filterObj(
    req.body,
    'name',
    'email',
    'phone',
    'website',
    'connectCategory',
    'description',
  ); //filtering unwanted Field
  if (req.file) filterBody.image = req.file.filename;
  filterBody.addedBy = req.user.id;
  const doc = await ConnectProfessionalsModel.create(filterBody);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await ConnectProfessionalsModel.findById(req.params.id)
    .populate('connectCategory')
    .populate('addedBy', 'name');
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: {doc},
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await ConnectProfessionalsModel.find()
    .sort({date: 1})
    .populate('connectCategory')
    .populate('addedBy', 'name');

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {doc},
  });
});

exports.getAllWithCategory = catchAsync(async (req, res, next) => {
  const doc = await ConnectProfessionalsModel.find({
    connectCategory: mongoose.Types.ObjectId(req.params.categoryId),
  })
    .sort({date: 1})
    .populate('connectCategory')
    .populate('addedBy', 'name');

  res.status(200).json({
    status: 'success',
    result: doc.length,
    categoryId: req.params.categoryId,
    data: {doc},
  });
});
