/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const api = {};
module.exports = api;

const protractor = global.protractor;
const EC = protractor.ExpectedConditions;

api.archive = () => {
  element(by.attribute('ng-click', '$ctrl.archive()')).click();
};

api.delete = () => {
  element(by.attribute('ng-click', '$ctrl.delete()')).click();
};

api.newer = () => {
  return element(by.linkText('Newer'));
};

api.older = () => {
  return element(by.linkText('Older'));
};

api.returnButton = () => {
  const returnButton = element(by.buttonText('Return to Messages'));
  browser.wait(EC.elementToBeClickable(returnButton), 3000);
  return returnButton;
};

api.waitForLoad = () => {
  browser.wait(EC.visibilityOf($('br-message-viewer')), 3000);
  browser.wait(EC.invisibilityOf($('i.fa-spin')), 3000);
};
