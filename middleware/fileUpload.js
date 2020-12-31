var multer = require('multer');
const AppError = require('../utils/appError');

var fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(fs.existsSync('/public/files'));
    if (fs.existsSync('/public/files')) {
      console.log('exist', fs.existsSync('/public/files'));
      callback(null, 'public/files');
    } else {
      fs.mkdir('/public/files', {recursive: true}, () => {
        callback(null, 'public/files');
      });
    }
  },
  filename: (req, file, callback) => {
    //const ext = file.mimetype.split('/')[1]
    console.log(file);
    callback(null, `${Date.now()}-${file.originalname}`);
    //callback(null,`user-${req.user.id}-${Data.now()}-${file.filename}.${ext}`)
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|pdf|doc|docx)$/)
  ) {
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
