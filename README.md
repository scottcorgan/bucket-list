# Bucket List

Get a file list from an Amazon S3 bucket.

Supports **streams** and **callbacks**.

## Install

```
npm install bucket-list
```

## Usage

```javascript

var BucketList = require('bucket-list');
var bucket = BucketList.connect({
  key: 's3-key',
  secret: 's3-secretn'
  bucket: 'name-of-the-s3-bucket'
});


// Stream bucket files

var bucketStream = bucket('folder_name');

bucketStream.on('data', function (fileNameWithPath) {
  console.log(fileNameWithPath);
});


// Callback style with bucket files

bucket('folder_name', function (err, files) {
  console.log(files);
});
```