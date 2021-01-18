const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const fetch = require('node-fetch');
const breatheModel = require('../Models/breatheModel');

//To filter Some fields from req.body so we can update only these fields
const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).filter((el) => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.delete = catchAsync(async (req, res, next) => {
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

  if (req.files && req.files.thumbnail && req.files.video) {
    filterBody.thumbnail = req.files.thumbnail[0].filename;
    filterBody.video = req.files.video[0].filename;
  } else {
    return next(new AppError('thumbnail or video is missing', 403));
  }
  filterBody.postedBy = req.user.id;
  const doc = await breatheModel.create(filterBody);

  //type: "Video"
  var notification = {
    id: doc.id,
    title: doc.title,
    text: doc.description,
    image: doc.thumbnail,
    vibrate: 1,
    sound: 1,
    content_available: true,
  };
  // "image": "url-to-image"
  var fcmTokens = [];
  var notificationBody = {
    notification: notification,
    data: {
      item: {
        date: doc.date,
        postedBy: doc.postedBy,
        id: doc.id,
        title: doc.title,
        description: doc.description,
        video: doc.video,
      },
    },
    to: '/topics/video',
  };
  //registration_ids: fcmTokens,

  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: 'key=' + process.env.FIREBASE_SERVER_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notificationBody),
  })
    .then(() => {
      res.status(201).json({
        status: 'success',
        data: {
          doc,
          message: 'Notifications send to all users',
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: 'success',
        data: {
          doc,
          message: 'Fail to send Notifications to users',
        },
      });
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
    data: { doc },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  let query = breatheModel
    .find()
    .sort({ date: -1 })
    .populate('category')
    .populate('postedBy', 'name');
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 15;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    const total = await breatheModel.countDocuments();
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
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  //Case 1: when with both params
  if (req.params.categoryId !== 'null' && req.params.search !== 'null') {
    const reg = new RegExp(`.*${req.params.search}.*`, 'i');

    query = breatheModel
      .find({
        $and: [
          { category: mongoose.Types.ObjectId(req.params.categoryId) },
          {
            $or: [{ description: { $regex: reg } }, { title: { $regex: reg } }],
          },
        ],
      })
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await breatheModel.countDocuments({
        $and: [
          { category: mongoose.Types.ObjectId(req.params.categoryId) },
          {
            $or: [{ description: { $regex: reg } }, { title: { $regex: reg } }],
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
    query = breatheModel
      .find({
        category: mongoose.Types.ObjectId(req.params.categoryId),
      })
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await breatheModel.countDocuments({
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
    query = breatheModel
      .find({
        $or: [{ description: { $regex: reg } }, { title: { $regex: reg } }],
      })
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await breatheModel.countDocuments({
        $or: [{ description: { $regex: reg } }, { title: { $regex: reg } }],
      });
      if (skip >= total) next(new AppError('This Page Does not exist', 404));
    }
  }
  //Case 4: find all
  else {
    query = breatheModel
      .find()
      .sort({ date: -1 })
      .populate('category')
      .populate('postedBy', 'name');

    if (req.query.page) {
      const total = await breatheModel.countDocuments();
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
