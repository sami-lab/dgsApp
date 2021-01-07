const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Roles = require('./rolesModel');

var UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A User must have a name'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'A user must have an username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'A User must have an email'],
      unique: true,
      validate: [validator.isEmail, 'Please Provide a Valid Email'],
    },
    divorseStatus: {
      type: String,
      required: [true, 'Please Select at least one option.'],
      enum: {
        values: [
          'Thinking of separating',
          'I’m going through a divorce',
          'I’m already divorced',
        ],
        message: 'Please Select at least one option.',
      },
    },
    country: {
      type: String,
      required: [true, 'Please Select country'],
    },
    city: {
      type: String,
      required: [true, 'Please Select City'],
    },
    gender: {
      type: String,
      required: [true, 'A User must have an Gender'],
      enum: {
        values: ['Male', 'Female'],
        message: 'Please Select at least one option.',
      },
    },
    age: {
      type: String,
      required: [true, 'Please Select your age'],
      enum: {
        values: ['30 or under', '31-40', '41-50', '51-60', '51-60', 'over 60'],
        message: 'Please Select at least one option.',
      },
    },
    password: {
      type: String,
      required: [true, 'A User must have a Password'],
      minlength: [
        5,
        'A User Password must have more or equal then 5 characters',
      ],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please Enter Confirm Password'],
      validate: {
        //Only work For Create or Save
        validator: function (val) {
          return val === this.password;
        },
        message: 'Confirm Password Did not match with Password!!!',
      },
    },
    // emailVerified: {
    //   type: Boolean,
    //   default: false,
    //   select: false,
    // },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles',
        validate: {
          validator: async function (v) {
            return await Roles.findById(v, (err, rec) => rec !== null);
          },
          message: 'Invalid Object ID',
        },
        required: true,
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    changedPasswordAt: Date,
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);
UserSchema.pre('save', async function (next) {
  //hashing password
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// UserSchema.pre('save', function(next){ //reset change password date
//   if(!this.isModified('password') || this.isNew) return next()
//     this.changedPasswordAt= Date.now()-1000;
//   next()
// })
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.changedPasswordAt) {
    const changedTime = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
    return JWTtimestamp < changedTime; //token_issued < changed time(mean Pass changed time)
  }
  return false; //Not Changed
};
UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(2).toString('hex');
  this.passwordResetToken = crypto
    .createHash('Sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  return resetToken;
};
UserSchema.methods.createEmailVerificationToken = function () {
  const Token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('Sha256')
    .update(Token)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 2 * 60 * 60 * 1000;
  return Token;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
