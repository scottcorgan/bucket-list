var assert = require('assert');
var aws2js = require('aws2js');
var xml = require('xml-object-stream');
var Stream = require('stream');

exports.connect = function (opts) {
  assert.ok(opts, 'AWS S3 options must be defined.');
  assert.notEqual(opts.key, undefined, 'Requires S3 AWS Key.');
  assert.notEqual(opts.secret, undefined, 'Requres S3 AWS Secret');
  assert.notEqual(opts.bucket, undefined, 'Requires AWS S3 bucket name.');
  
  
  //
  return function (path, callback) {
    // Create instance for s3 bucket
    var s3 = aws2js.load("s3", opts.key, opts.secret);
    var stream = new Stream();
    var url = "?prefix=" + encodeURI(path);
    var buffer = [];
    
    s3.setBucket(opts.bucket);
    stream.readable = true
    
    s3.get(url, 'stream', function(err, s3Data) {
      if (err) {
        return callback(err, null);
      }
      
      var parser = xml.parse(s3Data);
      
      parser.each('Contents', function (content) {
        var data = content.Key.$text;
        
        if (callback) {
          buffer.push(data);
        }
        
        stream.emit('data', data);
      });
      
      parser.on('end', function () {
        if (callback) {
          callback(null, buffer);
        }
        
        stream.emit('end');
      });
      
    });
    
    return stream;
  }
};