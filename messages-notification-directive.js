/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory($interval, $location, brMessagesService) {
  return {
    restrict: 'E',
    scope: {
      id: '=brId',
      identityUrl: '=brIdentityUrl'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-messages/messages-notification.html'),
    link: Link
  };

  function Link(scope, elem, attrs) {
    var model = scope.model = {};
    model.messagesService = brMessagesService;

    init();

    model.viewMessages = function() {
      $location.url(scope.identityUrl + '/messages');
    };

    function init() {
      if(scope.id) {
        checkMessages();
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
