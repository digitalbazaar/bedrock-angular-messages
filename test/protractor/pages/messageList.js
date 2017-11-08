/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const api = {};
module.exports = api;

api.waitForLoad = () => {
  browser.wait(() => {
    return browser.isElementPresent(
      by.attribute('ng-click', '$ctrl.inboxTab()'));
  }, 8000);
};

api.inboxTab = (select) => {
  const inboxElement = element(by.attribute('ng-click', '$ctrl.inboxTab()'));
  if(!select) {
    return inboxElement;
  }
  inboxElement.click();
};

api.archiveTab = (select) => {
  const archiveElement = element(by.attribute('ng-click', '$ctrl.archiveTab()'));
  if(!select) {
    return archiveElement;
  }
  archiveElement.click();
};

api.messages = () => {
  const messages = element.all(by.repeater('message in $ctrl.messages'));
  return messages;
};

api.clickMessage = (message) => {
  message.element(by.attribute('ng-click', '$ctrl.view(message.id)'))
    .click();
};

api.selectMessage = (message) => {
  message.element(by.model('message.selected')).click();
};

api.archiveSelected = () => {
  element(by.attribute('ng-click', '$ctrl.archiveSelected()')).click();
};

api.deleteSelected = () => {
  element(by.attribute('ng-click', '$ctrl.deleteSelected()')).click();
};
