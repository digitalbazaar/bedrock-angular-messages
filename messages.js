/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './messages-list-directive',
  './message-viewer-directive',
  './messages-notification-directive',
  './messages-service'
], function(
  angular,
  messageViewer,
  messagesDirective,
  messagesNotificationDirective,
  messagesService) {

'use strict';

var module = angular.module('bedrock.messages', []);

module.directive(messagesDirective);
module.directive(messagesNotificationDirective);
module.directive(messageViewer);
module.service(messagesService);

/* @ngInject */
module.config(function($routeProvider) {
  // FIXME: basepath should be configurable somehow and not tied to an IdP
  var basePath = window.data.idp.identityBasePath;
  $routeProvider
    .when(basePath + '/:identity/messages', {
      title: 'Messages',
      templateUrl: requirejs.toUrl('bedrock-angular-messages/messages.html')
    })
    .when('/messages/:id', {
      title: 'Message',
      templateUrl:
        requirejs.toUrl('bedrock-angular-messages/message.html')
    });
});

/* @ngInject */
// module.run(function(brNavbarService, brSessionService, config) {
//   config.site = config.site || {};
//   config.site.navbar = config.site.navbar || {};
//   config.site.navbar.templates = config.site.navbar.templates || [];
//   config.site.navbar.templates.push(requirejs.toUrl(
//     'bedrock-angular-messages/navbar/messages-notification.html'));
// });

return module.name;

});
