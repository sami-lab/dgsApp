const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const articleModels = require('../Models/articleModel');

//To filter Some fields from req.body so we can update only these fields
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.delete = catchAsync(async (req, res, next) => {
  const doc = await articleModels.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});
exports.update = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(
    req.body,
    'title',
    'matter',
    'description',
    'category',
  ); //filtering unwanted Field
  if (req.files && req.files.imageCover)
    filterBody.imageCover = req.files.imageCover[0].filename;
  if (req.files && req.files.images)
    filterBody.images = req.files.images.filter((item) => item.filename);
  filterBody.postedBy = req.user.id; //images
  const doc = await articleModels.findByIdAndUpdate(req.params.id, filterBody, {
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
  const filterBody = filterObj(
    req.body,
    'title',
    'matter',
    'description',
    'category',
  ); //filtering unwanted Field
  if (req.files && req.files.imageCover)
    filterBody.imageCover = req.files.imageCover[0].filename;
  else return next(new AppError('Image Cover not uploaded', 403));

  if (req.files && req.files.images)
    filterBody.images = req.files.images.filter((item) => item.filename);
  else return next(new AppError('articles Images Cover not uploaded', 403));
  filterBody.addedBy = req.user.id;
  const doc = await articleModels.create(filterBody);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await articleModels
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
  const doc = await articleModels
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
  const doc = await articleModels
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
