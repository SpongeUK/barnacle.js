describe('Given I have a SCORM compliant interface', function () {
  var expect = require('expect.js'),
      sinon = require('sinon'),
      jQuery = {
        post: sinon.stub()
      },
      API = require('../../Web/scripts/barnacle.js')(jQuery);

  beforeEach(function () {
    jQuery.post.reset();
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

  describe('when commiting with a default setup', function(){
    it('should post the data to default server url', function(){
      API.LMSInitialize('');
      API.LMSSetValue('cmi.core.lesson_status', 'passed');
      API.LMSSetValue('cmi.core.score.raw', '81');
      API.LMSCommit('');
      expect(jQuery.post.calledWith('commit')).to.be(true);
    });
  });

  describe('when commiting with a configured setup', function(){
    it('should post the data to configured server url', function(){
      var serverUrl = 'Course/Commit/HS002';
      API.setup({ serverUrl: serverUrl});
      API.LMSInitialize('');
      API.LMSSetValue('cmi.core.lesson_status', 'passed');
      API.LMSSetValue('cmi.core.score.raw', '81');
      API.LMSCommit('');
      expect(jQuery.post.calledWith(serverUrl)).to.be(true);
    });
  });

  describe('when commiting twice when nothing has changed', function(){
    it('should not post', function(){
      var serverUrl = 'Course/Commit/HS002';
      API.setup({ serverUrl: serverUrl});
      API.LMSInitialize('');
      API.LMSSetValue('cmi.core.lesson_status', 'passed');
      API.LMSSetValue('cmi.core.score.raw', '81');
      API.LMSCommit('');

      jQuery.post.reset();
      API.LMSCommit('');
      expect(jQuery.post.called).to.be(false);
    });
  });

});