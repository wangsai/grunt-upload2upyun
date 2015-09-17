/*
 * Support upload to UPYUN.
 * Copyright (c) 2015 WangSai
 * Licensed under the MIT license.
 *
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */


var path = require('path');
var UPYUN = require('upyun');
var async = require('async');
var mime = require('mime');

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('upload2upyun', 'Copy files to UPYUN.', function() {

    var options = this.options({
      encoding: grunt.file.defaultEncoding,
      endpoint: 'v0' 
    });

    var isExpandedPair;
    var dirs = {};
    var tally = {
      dirs: 0,
      files: 0,
    };

    var upyun;
    var done = this.async();

    if(!options.bucket || !options.operator || !options.password) {
        grunt.fatal('"bucket", "operator" and "password" must be set!');
    }

    upyun = new UPYUN(options.bucket, options.operator, options.password, options.endpoint);

    grunt.log.writeln('Connecting UPYUN bucket: ', options.bucket.green, ' with operator: ', options.operator.green);
    grunt.log.writeln();

    async.eachSeries(this.files, function(filePair, callback) {

      var dest = filePair.dest;
      isExpandedPair = filePair.orig.expand || false;

      async.eachSeries(filePair.src, function(src, cb) {
        src = unixifyPath(src);
        dest = unixifyPath(dest);

        if (detectDestType(dest) === 'directory') {
          dest = (isExpandedPair) ? dest : path.join(dest, src);
        }

        // No need to create directory!
        if (grunt.file.isDir(src)) {
          grunt.log.writeln('>>'.green, 'Ignored directory : ', src.blue);
          tally.dirs++;

          return cb(null);
        } else {
          grunt.log.writeln('>>'.green, 'Copying ' + src.green + ' -> ' + dest.green);

          upyun.uploadFile(dest, src, mime.lookup(src), true, function(err, result){

            if(err) {
              return cb(err);
            } else if(result.error) {
              return cb(new Error('error_code: ' + result.error.error_code + '\nmessage: ' + result.error.message));
            }

            tally.files++;

            return cb(null);
          });

        }
      }, function(err){
        return callback(err);
      });
    }, function(err){
      if(!err) {
        if (tally.files) {
          grunt.log.writeln();
          grunt.log.writeln('Copied ', tally.files.toString().green, ' file(s)');
          grunt.log.writeln('Ignored ', tally.dirs.toString().green, ' dir(s)');
        }
      }

      done(err);
    });
    
  });

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };
};