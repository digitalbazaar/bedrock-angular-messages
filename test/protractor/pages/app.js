/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const protractor = global.protractor;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

api.messageNotification = () => {
  const m = $('br-messages-notification');
  browser.wait(EC.visibilityOf(m), 3000);
  return m.element(by.partialLinkText('Messages'));
};

api.login = (identity) => {
  element(by.buttonText('Sign In')).click();
  const c = $('br-authn-password');
  c.element(by.brModel('$ctrl.sysIdentifier')).sendKeys(identity.sysIdentifier);
  c.element(by.brModel('$ctrl.password')).sendKeys(identity.password);
  c.element(by.buttonText('Sign In')).click();
};

api.createIdentity = (identity) => {
  element(by.brModel('$ctrl.sysSlug'))
    .clear()
    .sendKeys(identity.sysIdentifier);
  element(by.buttonText('Create Identity')).click();
};
