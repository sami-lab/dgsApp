const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const bookModel = require('../Models/bookModel');

//To filter Some fields from req.body so we can update only these fields
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.delete = catchAsync(async (req, res, next) => {
  const doc = await bookModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});
exports.update = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'website', 'description'); //filtering unwanted Field
  if (req.file) filterBody.image = req.file.filename;
  const doc = await bookModel.findByIdAndUpdate(req.params.id, filterBody, {
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
  const filterBody = filterObj(req.body, 'website', 'description'); //filtering unwanted Field
  if (req.file) filterBody.image = req.file.filename;
  const doc = await bookModel.create(filterBody);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await bookModel.findById(req.params.id);
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: { doc },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await bookModel.find().sort({ date: -1 });

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: { doc },
  });
});
