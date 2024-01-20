// AWS Configuration
const { S3Client } = require('@aws-sdk/client-s3');
// const aws = require('aws-sdk');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// aws.config.update({
//     secretAccessKey: process.env.ACCESS_KEY,
//     accessKeyId: process.env.ACCESS_KEY_ID,
//     region: 'ap-southeast-1'
// });

const s3 = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID, 
        secretAccessKey: process.env.ACCESS_KEY
    }
});

const bucketName = process.env.BUCKET_NAME;

module.exports = { s3, getSignedUrl, bucketName };
