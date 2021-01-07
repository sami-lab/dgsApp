const AppError = require('../utils/appError');

//MiddleWare to check whether user have given roles or not
//parameter roles is an array of roles which we will check against user roles
module.exports = (type) => {
  return (req, res, next) => {
    switch (type) {
      case 'image':
        req.allowedType = /\.(jpg|JPG|jpeg|JPEG|png|PNG)$/;
        break;
      case 'video':
        req.allowedType = /\.(wmv|avi|mov|3gp|mp4|flv)$/;
        break;
      case 'document':
        req.allowedType = /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|pdf|doc|docx)$/;
        break;
      default:
        break;
    }

    next();
  };
};
