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
  const filterBody = filterObj(req.body, 'title', 'matter', 'category'); //filtering unwanted Field
  if (req.files && req.files.thumbnail)
    filterBody.imageCover = req.files.thumbnail[0].filename;
  if (req.files && req.files.files)
    filterBody.files = req.files.files.filter((item) => item.filename);
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
  const filterBody = filterObj(req.body, 'title', 'matter', 'category'); //filtering unwanted Field
  if (req.files && req.files.thumbnail)
    filterBody.thumbnail = req.files.thumbnail[0].filename;
  else return next(new AppError('Image Cover not uploaded', 403));

  if (req.files && req.files.files)
    filterBody.files = req.files.files.filter((item) => item.filename);

  filterBody.postedBy = req.user.id;
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
    data: { doc },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  let query = articleModels
    .find()
    .sort({ date: -1 })
    .populate('category')
    .populate('postedBy', 'name');

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    const total = await articleModels.countDocuments();
    if (skip >= total) next(new AppError('This Page Does not exist', 404));
  }
  const doc = await query;
  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: { doc },
  });
});

//1 seatch by both
//2 when search is empty
//3 when category is empty
//4 when both params is empty
exports.getAllWithCategorySearch = catchAsync(async (req, res, next) => {
  let query = null;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 30;
  const skip = (page - 1) * limit;

  //Case 1: when with both params
  if (req.params.categoryId !== 'null' && req.params.search !== 'null') {
    const reg = new RegExp(`.*${req.params.search}.*`, 'i');
    query = articleModels
      .find({
        $and: [
          { category: mongoose.Types.ObjectId(req.params.categoryId) },
          {
            title: { $regex: reg },
          },
        ],
      })
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await articleModels.countDocuments({
        $and: [
          { category: mongoose.Types.ObjectId(req.params.categoryId) },
          {
            title: { $regex: reg },
          },
        ],
      });
      if (skip >= total) next(new AppError('This Page Does not exist', 404));
    }
  }
  //Case 2
  else if (
    !req.params.search ||
    req.params.search == 'null' ||
    (req.params.search == '' &&
      req.params.categoryId &&
      req.params.categoryId != null)
  ) {
    query = articleModels
      .find({
        category: mongoose.Types.ObjectId(req.params.categoryId),
      })
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await articleModels.countDocuments({
        category: mongoose.Types.ObjectId(req.params.categoryId),
      });
      if (skip >= total) next(new AppError('This Page Does not exist', 404));
    }
  }
  //Case 3: find all videos includes search text in description
  else if (
    req.params.search &&
    req.params.search != null &&
    (!req.params.categoryId ||
      req.params.categoryId == 'null' ||
      req.params.categoryId == '')
  ) {
    const reg = new RegExp(`.*${req.params.search}.*`, 'i');
    query = articleModels
      .find({
        title: { $regex: reg },
      })
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await articleModels.countDocuments({
        title: { $regex: reg },
      });
      if (skip >= total) next(new AppError('This Page Does not exist', 404));
    }
  }
  //Case 4: find all
  else {
    query = articleModels
      .find()
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await articleModels.countDocuments();
      if (skip >= total) next(new AppError('This Page Does not exist', 404));
    }
  }
  query = query.skip(skip).limit(limit);
  const doc = await query;

  res.status(200).json({
    status: 'success',
    result: doc.length,
    categoryId: req.params.categoryId,
    data: { doc },
  });
});
