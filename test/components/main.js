/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './test-harness-component'
], function(angular) {

'use strict';

var module = angular.module('bedrock.messages-test', [
  'bedrock.authn', 'bedrock.authn-password', 'bedrock.form', 'bedrock.identity',
  'bedrock.messages'
]);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Test Harness',
      template: '<br-test-harness></br-test-harness>'
    })
    .when('/messages', {
      title: 'Messages Test',
      template: '<br-messages></br-messages>'
    })
    .when('/messages/:id', {
      title: 'Message',
      template: '<br-message-viewer></br-message-viewer>'
    });
});

});
