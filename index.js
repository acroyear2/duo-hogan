
var path = require.resolve('hogan.js/web/builds/3.0.2/template-3.0.2.js');
var Hogan = require('hogan.js');
var fs = require('co-fs');
var read = fs.readFile;
var extensions = /(hogan|hg|mustache|ms)$/;
var extend = require('util')._extend;
var minify = require('html-minifier').minify;

module.exports = hogan;

var minifierDefaults = {
    removeComments               : true,
    collapseWhitespace           : true,
    removeAttributeQuotes        : false,
    removeCommentsFromCDATA      : false,
    removeCDATASectionsFromCDATA : false,
    collapseBooleanAttributes    : false,
    removeRedundantAttributes    : false,
    useShortDoctype              : false,
    removeOptionalTags           : false,
    removeEmptyElements          : false
};

function hogan (options) {
  options || (options = {});
  options = extend(options, {asString: true});

  var f = true;
  return function *hogan (file, entry) {
    if (!extensions.test(file.type) || 'js' != entry.type)
      return;
    file.type = 'js';
    if (f) {
      runtime = yield read(path, 'utf8');
      entry.include('hogan-runtime', runtime);
      f = false;
    }

    if (options.minify) file.src = minify(file.src, minifierDefaults);
    var cobj = Hogan.compile(file.src, options);
    file.src = 'var Template = require(\'hogan-runtime\').Template;' + 
      'module.exports = new Template(' + cobj + ');';
  }
}