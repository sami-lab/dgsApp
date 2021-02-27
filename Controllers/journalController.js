const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const journalModel = require('../Models/journalModel');

//To filter Some fields from req.body so we can update only these fields
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.delete = catchAsync(async (req, res, next) => {
  const check = await journalModel.find({
    $and: [{ postedBy: req.user.id }, { _id: req.params.id }],
  });
  if (!check) return next(new AppError('Requested Id not found', 403));
  const doc = await journalModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});
exports.update = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(req.body, 'title', 'description', 'image');
  if (!filterBody.image) filterBody.image = undefined;
  //filtering unwanted Field
  if (req.file) filterBody.image = req.file.filename;
  const doc = await journalModel.findByIdAndUpdate(req.params.id, filterBody, {
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
  const filterBody = filterObj(req.body, 'title', 'description'); //filtering unwanted Field
  if (req.file) filterBody.image = req.file.filename;
  filterBody.postedBy = req.user.id;

  const doc = await journalModel.create(filterBody);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await journalModel.findById(req.params.id);
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: { doc },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await journalModel
    .find({ postedBy: req.user.id })
    .sort({ date: -1 });

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: { doc },
  });
});
