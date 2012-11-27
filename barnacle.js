(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    var library = factory();
    root.API = library;
    root.API_1484_11 = library;
  }
}(this, function () {
  var scorm = {},
      cmi = {
        empty: '',
        bool : {
          TRUE : "true",
          FALSE : "false"
        },
        score : {
          raw : 'cmi.core.score.raw',
          min : 'cmi.core.score.min',
          max : 'cmi.core.score.max'
        },
        lesson : {
          status : 'cmi.core.lesson_status',
          mode : 'cmi.core.lesson_mode'
        },
        suspend : 'cmi.suspend_data',
        sessionTime : 'cmi.session_time'
      },
      defaults = {
        onCommit : function (data) {
          if(options.debug)
            console.log('Commiting.');
        },
        debug : false
      },
      options = {},
      store = {},
      lastError,
      hasCommitted = false;

  var ok = function () {
    lastError = "0";
    return cmi.bool.TRUE;
  };

  scorm.setup = function (opts){
    options.debug = !this.console ? false : opts.debug;
    options.onCommit = opts.onCommit;
    options.hasBeenSetup = true;
  };

  scorm.defaultSetup = function (opts){
    scorm.setup(defaults);
  };

  scorm.initialise = function () {
    if(options.hasBeenSetup !== true) {
      scorm.defaultSetup();
    }
    store[cmi.lesson.mode] = 'normal';
    store[cmi.lesson.status] = 'not attempted';
    hasCommitted = false;
    return ok();
  };

  scorm.terminate = function () {
    return cmi.bool.TRUE;
  };

  scorm.getValue = function (ref) {
    if(options.debug)
      console.log('get: ' + ref + ' ' + store[ref]);

    return store[ref] || cmi.empty;
  };

  scorm.setValue = function (ref, value) {
    if(options.debug)
      console.log(ref, value);

    if(store[ref] === value) return ok();
    store[ref] = value;
    hasCommitted = false;
    return ok();
  };

  scorm.canCommit = function () {
    return !hasCommitted;
  };

  scorm.commit = function () {
    if(scorm.canCommit()) {
      var data = {
        "score": store[cmi.score.raw],
        "lessonStatus": store[cmi.lesson.status]
      };

      if(options.onCommit)
        options.onCommit(data);
      defaults.onCommit(data);

      hasCommitted = true;
    }
    return ok();
  };

  scorm.getLastError = function () {
    return lastError || "0";
  };

  scorm.getErrorString = function (errorCode) {
    return {
      "0" : "No Error",
      "101" : "General Exception",
      "102" : "General Initialization Failure",
      "103" : "Already Initialized",
      "104" : "Content Instance Terminated",
      "111" : "General Termination Failure",
      "112" : "Termination Before Initialization",
      "113" : "Termination After Termination",
      "123" : "Retrieve Data Before Initialization",
      "132" : "Store Data Before Initialization",
      "133" : "Store Data After Termination",
      "142" : "Commit Before Initialization",
      "201" : "General Argument Error",
      "301" : "General Get Failure",
      "351" : "General Set Failure",
      "391" : "General Commit Failure",
      "401" : "Undefined Data Model Element",
      "402" : "Unimplemented Data Model Element",
      "403" : "Data Model Element Value Not Initialized",
      "404" : "Data Model Element Is Read Only ",
      "405" : "Data Model Element Is Write Only",
      "406" : "Data Model Element Type Mismatch",
      "407" : "Data Model Element Value Out Of Range",
      "408" : "Data Model Dependency Not Established"
    }[errorCode] || "";
  };

  scorm.getDiagnostic = function (errorCode) {
    return '';
  };

  scorm.LMSInitialize = scorm.Initialize = scorm.initialise;
  scorm.LMSFinish = scorm.Terminate = scorm.terminate;
  scorm.LMSGetValue = scorm.GetValue = scorm.getValue;
  scorm.LMSSetValue = scorm.SetValue = scorm.setValue;
  scorm.LMSCommit = scorm.Commit = scorm.commit;
  scorm.LMSGetLastError = scorm.GetLastError = scorm.getLastError;
  scorm.LMSGetErrorString = scorm.GetErrorString = scorm.getErrorString;

  scorm.cmi = cmi;

  return scorm;
}));