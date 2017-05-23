/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var api = {};
module.exports = api;

var protractor = global.protractor;
var EC = protractor.ExpectedConditions;

api.archive = function() {
  element(by.attribute('ng-click', '$ctrl.archive()')).click();
};

api.delete = function() {
  element(by.attribute('ng-click', '$ctrl.delete()')).click();
};

api.newer = function() {
  return element(by.linkText('Newer'));
};

api.older = function() {
  return element(by.linkText('Older'));
};

api.returnButton = function() {
  var returnButton = element(by.buttonText('Return to Messages'));
  browser.wait(EC.elementToBeClickable(returnButton), 3000);
  return returnButton;
};

api.waitForLoad = function() {
  browser.wait(EC.visibilityOf($('br-message-viewer')), 3000);
  browser.wait(EC.invisibilityOf($('i.fa-spin')), 3000);
};
