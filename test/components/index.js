/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import TestHarnessComponent from './test-harness-component.js';

const module = angular.module('bedrock.messages-test', [
  'bedrock.alert', 'bedrock.authn', 'bedrock.authn-password',
  'bedrock.form', 'bedrock.identity', 'bedrock.messages',
  'ngMaterial', 'ngMessages'
]);

bedrock.setRootModule(module);

module.component('brTestHarness', TestHarnessComponent);

/* @ngInject */
module.config($routeProvider => {
  $routeProvider
    .when('/', {
      title: 'Test Harness',
      template: '<br-test-harness></br-test-harness>'
    })
    .when('/messages', {
      title: 'Messages Test',
      template: '<br-messages-list></br-messages-list>'
    })
    .when('/messages/:id', {
      title: 'Message',
      template: '<br-message-viewer></br-message-viewer>'
    });
});
