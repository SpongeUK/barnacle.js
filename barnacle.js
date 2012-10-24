(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.API = factory(root.jQuery);
  }
}(this, function ($) {
  if(!$) throw new Error('jQuery (or compatible library) is required.');
  var scorm = {};
      cmi = {
        empty: '',
        bool : {
          TRUE: "true",
          FALSE: "false"
        }
      },
      defaults = {
        serverUrl : 'commit'
      },
      options = {},
      store = {},
      hasCommitted = false;

  scorm.setup = function (opts){
    options.serverUrl = opts.serverUrl;
    options.debug = opts.debug;
    options.hasBeenSetup = true;
  };

  scorm.defaultSetup = function (opts){
    scorm.setup(defaults);
  };

  scorm.canCommit = function () {
    if(hasCommitted) return false;
    return (store['cmi.core.score.raw'] >= 1) && (store['cmi.core.lesson_status'] === 'passed');
  };

  //SCORM 1.2
  scorm.LMSInitialize = function () {
    if(options.hasBeenSetup !== true) {
      scorm.defaultSetup();
    }
    hasCommitted = false;
    return cmi.bool.TRUE;
  };
  scorm.LMSFinish = function () {
    return cmi.bool.TRUE;
  };
  scorm.LMSGetValue = function (ref) {
    return store[ref] || cmi.empty;
  };
  scorm.LMSSetValue = function (ref, value) {
    if(options.debug)
      console.log(ref, value);

    if(store[ref] === value) return cmi.bool.TRUE;
    store[ref] = value;
    hasCommitted = false;

    return cmi.bool.TRUE;
  };
  scorm.LMSCommit = function () {
    if(scorm.canCommit()) {
      console.log('committing...');
      $.post(options.serverUrl, {
        values: store,
        score: store['cmi.core.score.raw'],
        lessonStatus: store['cmi.core.lesson_status']
      });
      hasCommitted = true;
    }
    return cmi.bool.TRUE;
  };
  scorm.LMSGetLastError = function () {
    return '0';
  };
  scorm.LMSGetErrorString = function (errorCode) {
    return '';
  };
  scorm.LMSGetDiagnostic = function (errorCode) {
    return '';
  };

  return scorm;
}));