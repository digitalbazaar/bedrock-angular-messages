/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var bedrock = global.bedrock;

var api = {};
module.exports = api;

var by = global.by;
var element = global.element;
var should = global.should;
var expect = global.expect;
var protractor = global.protractor;
var EC = protractor.ExpectedConditions;

api.waitForLoad = function() {
  browser.wait(
    EC.presenceOf(element(by.attribute('ng-if', '$ctrl.message'))));
};

api.delete = function() {
  element(by.attribute('ng-click', '$ctrl.delete()')).click();
};

api.archive = function() {
  element(by.attribute('ng-click', '$ctrl.archive()')).click();
};
