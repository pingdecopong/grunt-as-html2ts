var _ = require('lodash');
var fs = require('fs');
var path = require('path');
/////////////////////////////////////////////////////////////////////
// HTML -> TS
////////////////////////////////////////////////////////////////////
// html -> js processing functions:
// Originally from karma-html2js-preprocessor
// Refactored nicely in html2js grunt task
// https://github.com/karlgoldstein/grunt-html2js/blob/master/tasks/html2js.js
// Modified nlReplace to be an empty string
var escapeContent = function (content, quoteChar) {
  if (quoteChar === void 0) { quoteChar = '\''; }
  var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
  var nlReplace = '';
  return content.replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace)
    // remove newline / carriage return
    .replace(/\n/g, "")
    // remove whitespace (space and tabs) before tags
    .replace(/[\t ]+</g, "<")
    // remove whitespace between tags
    .replace(/>[\t ]+</g, "><")
    // remove whitespace after tags
    .replace(/>[\t ]+$/g, ">");
};
// Remove bom when reading utf8 files
function stripBOM(str) {
  return 0xFEFF === str.charCodeAt(0) ? str.substring(1) : str;
}
function trimStart(character, string) {
  var startIndex = 0;
  while (string[startIndex] === character) {
    startIndex++;
  }
  return string.substr(startIndex);
}
var htmlTemplate = _.template(
  '/* tslint:disable:max-line-length */\n' +
  'module <%= modulename %> {\n' +
  '\'use strict\';\n' +
  '  export var <%= varname %>: string = \'<%= content %>\';\n' +
  '}\n');
// Compile an HTML file to a TS file
// Return the filename. This filename will be required by reference.ts
function compileHTML(filename, options) {
  var htmlContent = escapeContent(fs.readFileSync(filename).toString());
  htmlContent = stripBOM(htmlContent);
  var moduleName = path.dirname(filename).replace(/\//gi, ".").toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
  if(options.truncateNamespace) {
    var truncateRegexp = new RegExp('^' + options.truncateNamespace + '.');
    moduleName = moduleName.replace(truncateRegexp, "");
  }
  if(options.namespace) {
    moduleName = options.namespace;
  }
  var ext = path.extname(filename).replace('.', '');
  var extFreename = path.basename(filename, '.' + ext).toLowerCase().replace(/[-.](.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
  if(options.propertyName) {
    extFreename = options.propertyName;
  }
  var fileContent = htmlTemplate({ modulename: moduleName, varname: extFreename, content: htmlContent });
  var outputfile = getOutputFile(filename, options.htmlOutDir, options.truncateDir, options.flatten);
  mkdirParent(path.dirname(outputfile));
  fs.writeFileSync(outputfile, fileContent);
  return outputfile;
}
exports.compileHTML = compileHTML;
function getOutputFile(filename, htmlOutDir, truncateDir, flatten) {
  var outputfile = filename;
  // NOTE If an htmlOutDir was specified
  if (htmlOutDir !== null) {
    var dir = getPath(htmlOutDir);
    var truncateRegexp = new RegExp('^' + truncateDir);
    var relativeFilename = trimStart('/', filename.replace(truncateRegexp, ""));
    if (flatten) {
      relativeFilename = path.basename(filename);
    }
    outputfile = path.join(dir, relativeFilename);
  }
  return outputfile + '.ts';
}
function getPath(dir) {
  // NOTE If we don't have a valid absolute path
  if (!fs.existsSync(dir)) {
    // NOTE Try relative from the current working directory
    dir = path.join(process.cwd(), dir);
  }
  return dir;
}
function mkdirParent(dirPath, mode) {
  try {
    fs.mkdirSync(dirPath, mode);
  }
  catch (error) {
    // NOTE When it fail in this way, do the custom steps
    if (error && error.code === 'ENOENT') {
      // NOTE Create all the parents recursively
      mkdirParent(path.dirname(dirPath), mode);
      // NOTE And then the directory
      mkdirParent(dirPath, mode);
    }
  }
}
