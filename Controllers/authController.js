const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const Roles = require('../Models/rolesModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/emails');

const createLoginToken = (user, statusCode, req, res) => {
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  user.password = undefined; //not saving
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//This route is only for User Registeration
exports.signUp = catchAsync(async (req, res, next) => {
  const roleId = await Roles.findOne({name: 'User'});
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    divorseStatus: req.body.divorseStatus,
    country: req.body.country,
    city: req.body.city,
    gender: req.body.gender,
    age: req.body.age,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    roles: [roleId._id],
  };

  if (req.file) newUser.photo = req.file.filename;
  newUser = await User.create(newUser);
  //const url = `${req.protocol}://${req.get('host')}/Login`;
  //await new Email(newUser,url).sendWelcome();
  createLoginToken(newUser, 200, req, res);
});
exports.validateUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});
exports.validateUsername = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (user) return next(new AppError('username already exist!', 400));
  res.status(200).json({
    status: 'success',
  });
});
exports.validateEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) return next(new AppError('email already exist!', 400));
  res.status(200).json({
    status: 'success',
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  //Comparing Token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    emailVerificationToken: hashToken,
    emailVerificationExpires: {$gt: Date.now()},
  });
  if (!user) return next(new AppError('Token is Invalid or expired', 400));
  //Updating Field if there token verifies
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({validateBeforeSave: false});

  const homepage = `${req.protocol}://${req.get('host')}/`;
  try {
    await new Email(user, homepage, homepage).sendWelcome();
    //await new Email(newUser, url).sendWelcome();
    res.status(200).json({
      status: 'success',
      message: 'Email Veification Sucessful! Login To continue',
    });
  } catch (err) {
    console.log(err);
    return next(
      new AppError('There was an error sending an email, Try Again Later', 500),
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const {username, password} = req.body;
  if (!username || !password) {
    return next(new AppError('Please Provide username and password', 400));
  }
  const user = await User.findOne({username}).select('+password');
  //Comparing password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Username or password', 401));
  }
  createLoginToken(user, 200, req, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get User Based on Email
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return next(new AppError('There is No User with These Email', 404));
  }
  //Generate Random Token
  const resetToken = user.createResetPasswordToken();
  await user.save({validateBeforeSave: false}); //Saving only 2 Fields
  //Sending Email
  const resettoken = `${req.protocol}://${req.get(
    'host',
  )}/api/users/resetPassword/${resetToken}`;
  const homepage = `${req.protocol}://${req.get('host')}/`;
  try {
    await new Email(user, resetToken, homepage).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token Sent to Email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});
    return next(
      new AppError('There was an error sending an email, Try Again Later', 500),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //Comparing Token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {$gt: Date.now()},
  });
  if (!user) return next(new AppError('Token is Invalid or expired', 400));
  if (user && user.password != user.confirmPassword)
    return next(
      new AppError('Password and Confirm Password does not match', 400),
    );
  //Updating Field if there token verifies
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  this.changedPasswordAt = Date.now() - 1000;
  await user.save();
  //update passwordChangedAt property
  //Login To the User
  res.status(200).json({
    status: 'success',
    message: 'Password Change Success! Login to continue',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1 Get User From Collection
  const user = await User.findById(req.user.id).select('+password');
  //2 Check If Posted Current Password is Correct
  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError('Your Current Password is Wrong', 401));
  }
  //3 If So, Update Password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save(); //User.findByIdAndUpdate will not work here
  //4 Log User in,send JWT
  createLoginToken(user, 200, req, res);
});
