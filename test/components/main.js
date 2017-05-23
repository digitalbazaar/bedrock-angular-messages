/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import TestHarnessComponent from './test-harness-component.js';

var module = angular.module('bedrock.messages-test', [
  'bedrock.authn', 'bedrock.authn-password', 'bedrock.form',
  'bedrock.identity',
  'bedrock.messages'
]);

module.component('brTestHarness', TestHarnessComponent);

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
