var multer = require('multer');
const AppError = require('../utils/appError');

var fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (fs.existsSync('/public/files')) {
      callback(null, 'public/files');
    } else {
      fs.mkdir('/public/files', {recursive: true}, () => {
        callback(null, 'public/files');
      });
    }
  },
  filename: (req, file, callback) => {
    //const ext = file.mimetype.split('/')[1]
    callback(null, `${Date.now()}-${file.originalname}`);
    //callback(null,`user-${req.user.id}-${Data.now()}-${file.filename}.${ext}`)
  },
});

const multerFilter = (req, file, cb) => {
  console.log(req.allowedType);
  if (file.originalname.match(req.allowedType)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid Format', 400), false);
  }
};
module.exports = multer({
  storage: storage,
  fileFilter: multerFilter,
  onError: function (err, next) {
    next(next(new AppError('Error in Updloading Image.', 404)));
  },
});

//use this middleware with .single or .array to upload photo to public images
