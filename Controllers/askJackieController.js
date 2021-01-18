const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendQuestionMail } = require('../utils/sendQuestionMail');
const AskJackieModel = require('../Models/askJackieModel');

//For admin only
exports.delete = catchAsync(async (req, res, next) => {
  const doc = await AskJackieModel.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Requested Id not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: 'deleted Successfully',
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { subject, question } = req.body;
  const doc = await AskJackieModel.findByIdAndUpdate(
    req.params.id,
    { subject, question, user: req.user.id },
    //{ subject, question, attachment: req.file.filename, user: req.user.id },
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

exports.updateStatus = catchAsync(async (req, res, next) => {
  const doc = await AskJackieModel.findByIdAndUpdate(req.params.id, {
    status: true,
  }).select('+status');
  if (!doc) return next(new AppError('No Question Exist with this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const { subject, question } = req.body;
  const doc = await AskJackieModel.create({
    subject,
    question,
    // attachment: req.file ? req.file.filename : undefined,
    user: req.user.id,
  });

  sendQuestionMail(
    {
      subject,
      question,
      // attachment: req.file ? req.file.filename : undefined,
      user: req.user,
    },
    req,
    res
  );
});
exports.getOne = catchAsync(async (req, res, next) => {
  let doc = await AskJackieModel.findById(req.params.id);
  if (!doc) return next(new AppError('requested Id not found', 404));

  res.status(200).json({
    status: 'success',
    data: { doc },
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const doc = await AskJackieModel.find({ status: false }).sort({ date: 1 });

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: { doc },
  });
});
