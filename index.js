
var path = require.resolve('hogan.js/web/builds/3.0.2/template-3.0.2.js');
var Hogan = require('hogan.js');
var fs = require('co-fs');
var read = fs.readFile;
var extensions = /(hogan|hg|mustache|ms)$/;

module.exports = hogan;

function hogan (options) {
  options || (options = { asString: true });
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

    var cobj = Hogan.compile(file.src, options);
    file.src = 'var Template = require(\'hogan-runtime\').Template;' + 
      'module.exports = new Template(' + cobj + ');';
  }
}