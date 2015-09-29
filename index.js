var assert = require('assert');
var s3 = require('s3');
var Stream = require('stream');

exports.connect = function (opts) {
  assert.ok(opts, 'AWS S3 options must be defined.');
  assert.notEqual(opts.key, undefined, 'Requires S3 AWS Key.');
  assert.notEqual(opts.secret, undefined, 'Requres S3 AWS Secret');
  assert.notEqual(opts.bucket, undefined, 'Requires AWS S3 bucket name.');
  
  return function (path, params, callback) {
    
    // Need a trailing slash
    if (path.charAt(path.length-1) !== '/') {
      path += '/';
    }
    
    // Create client for s3
    var client = s3.createClient({
      s3Options: {
        accessKeyId: opts.key,
        secretAccessKey: opts.secret
      }
    });

    var stream = new Stream();
    var buffer = [];

    var list = client.listObjects(
      {s3Params: {Bucket: opts.bucket, Prefix: path, Delimiter: '/'},
      recursive: params ? params.recursive : false});

    stream.readable = true
    
    list.on('data', function(data) {
      data.Contents.forEach(function (content) {
        var data = content.Key;    
        // Don't return directories
        if (data.charAt(data.length-1) !== '/') {
          stream.emit('data', data);
          if (callback) {
            buffer.push(data);
          }
        }
      });
    });

    list.on('error', function(err) {
      if (callback) {
        return callback(err, null)
      }
    });

    list.on('end', function() {
      if (callback) {
        callback(null, buffer)
      }
      stream.emit('end');
    });

    return stream;
    
  };
    
};