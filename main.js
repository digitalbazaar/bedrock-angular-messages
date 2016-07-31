/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './messages-list-component',
  './message-viewer-component',
  './messages-notification-component',
  './messages-service'
], function(angular) {

'use strict';

var module = angular.module('bedrock.messages', [
  'bedrock.alert', 'bedrock.paging'
]);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

});
