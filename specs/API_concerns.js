describe('Given I have a SCORM compliant interface', function () {
  var expect = require('expect.js'),
      sinon = require('sinon'),
      onCommit = sinon.stub(),
      API = require('../barnacle.js')();

  beforeEach(function () {
    onCommit.reset();
    API.defaultSetup();
  });

  describe('when I initialise it', function (){
    it('should return a confirmation', function(){
      expect(API.LMSInitialize('')).to.eql('true');
    });
  });

  describe('when I suspend data', function () {
    it('I should be able to recover it', function(){
      var state = 'viewed=1,2,3,4,5,6,7,8,9,10';
      expect(API.LMSSetValue('cmi.suspend_data', state)).to.eql('true');
      expect(API.LMSGetValue('cmi.suspend_data')).to.eql(state);
    });
  });

  describe('when I set the lesson status', function () {
    it('should provide me the correct lesson status', function(){
      var lesson_status = 'passed';
      API.LMSInitialize('');
      expect(API.LMSSetValue('cmi.core.lesson_status', lesson_status)).to.eql('true');
      expect(API.LMSGetValue('cmi.core.lesson_status')).to.eql(lesson_status);
    });
  });

 describe('when commiting with a configured setup', function(){
    it('should callback', function(){
      API.setup({onCommit : onCommit});
      API.LMSInitialize('');
      API.LMSSetValue('cmi.core.lesson_status', 'passed');
      API.LMSSetValue('cmi.core.score.raw', '81');
      API.LMSCommit('');
      expect(onCommit.called).to.be(true);
    });
  });

 describe('when commiting with a configured setup but no data', function(){
    it('should not callback', function(){
      API.setup({onCommit : onCommit});
      API.LMSInitialize('');
      API.LMSCommit('');
      expect(onCommit.called).to.be(false);
    });
  });

  describe('when commiting twice when nothing has changed', function(){
    it('should not post', function(){
      API.setup({onCommit : onCommit});
      API.LMSInitialize('');
      API.LMSSetValue('cmi.core.lesson_status', 'passed');
      API.LMSSetValue('cmi.core.score.raw', '81');
      API.LMSCommit('');

      onCommit.reset();
      API.LMSCommit('');
      expect(onCommit.called).to.be(false);
    });
  });

});