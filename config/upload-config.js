// Multer S3 Upload Configuration
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const uuid = require('uuid');
const s3 = require('./aws.config').s3;

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, uuid.v4() + path.extname(file.originalname));
        }
    })
});

module.exports = upload;
