/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory(
  $interval, $location, brIdentityService, brMessagesService,
  brSessionService) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: requirejs.toUrl(
      'bedrock-angular-messages/messages-notification.html'),
    link: Link
  };

  function Link(scope, elem, attrs) {
    var model = scope.model = {};
    model.loggedIn = false;
    model.unreadCount = 0;
    model.messagesService = brMessagesService;
    var identityBaseUrl = null;

    init();

    scope.$watch(function() {
      return brSessionService.session.identity;
    }, function(identity) {
      model.loggedIn = !!identity;
      init();
    });

    model.viewMessages = function() {
      $location.url(identityBaseUrl + '/messages');
    };

    function init() {
      if(model.loggedIn) {
        identityBaseUrl =
          brIdentityService.generateUrl({identityMethod: 'relative'});
        $interval(checkMessages, 30000);
      }
    }
    function checkMessages() {
      brMessagesService.getAll()
        .then(function() {
          scope.$apply();
        });
    }
  }
}

return {brMessagesNotification: factory};

});
