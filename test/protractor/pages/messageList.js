var bedrock = global.bedrock;

var api = {};
module.exports = api;

var by = global.by;
var element = global.element;
var should = global.should;
var expect = global.expect;
var protractor = global.protractor;

api.waitForLoad = function() {
  browser.wait(function() {
    return browser.isElementPresent(
      by.attribute('ng-click', '$ctrl.inboxTab()'));
  }, 8000);
};

api.inboxTab = function(select) {
  var inboxElement = element(by.attribute('ng-click', '$ctrl.inboxTab()'));
  if(!select) {
    return inboxElement;
  }
  inboxElement.click();
};

api.archiveTab = function(select) {
  var archiveElement = element(by.attribute('ng-click', '$ctrl.archiveTab()'));
  if(!select) {
    return archiveElement;
  }
  archiveElement.click();
};

api.messages = function() {
  var messages = element.all(by.repeater('message in $ctrl.messages'));
  return messages;
};

api.clickMessage = function(message) {
  message.element(by.attribute('ng-click', '$ctrl.view(message.id)'))
    .click();
};

api.selectMessage = function(message) {
  message.element(by.model('message.selected')).click();
};

api.archiveSelected = function() {
  element(by.attribute('ng-click', '$ctrl.archiveSelected()')).click();
};

api.deleteSelected = function() {
  element(by.attribute('ng-click', '$ctrl.deleteSelected()')).click();
};
