/*
 * grunt-html2ts
 * https://github.com/BerndWessels/grunt-html2ts.git
 *
 * Copyright (c) 2015 Bernd Wessels
 * Licensed under the MIT license.
 */

'use strict';

var convert = require('./modules/convert');
var _ = require('lodash');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('as-html2ts', 'Create typescript string templates for html files.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      namespace: null,
      propertyName: null,
      truncateNamespace: null,
      truncateDir: null,
      htmlOutDir: null,
      flatten: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });
      var optionCp = _.clone(options);
      var fileOptions = _.merge(optionCp, file.options);
      src.forEach(function(filepath){
        // convert.compileHTML(filepath, options);
        convert.compileHTML(filepath, fileOptions);
      });
    });
  });

};
