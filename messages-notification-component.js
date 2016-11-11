/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function register(module) {
  module.component('brMessagesNotification', {
    bindings: {
      id: '<brId',
      identityUrl: '<?brIdentityUrl'
    },
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-messages/messages-notification-component.html')
  });
}

function Ctrl($interval, $location, $route, $scope, brMessagesService) {
  var self = this;
  self.identityUrl = self.identityUrl || "";
  self.messagesService = brMessagesService;
  brMessagesService.setMessageListUrl(self.identityUrl + '/messages');
  init();

  self.viewMessages = function() {
    if($location.url() === self.identityUrl + '/messages') {
      // We're already on the page, perform a reload
      $route.reload();
      return;
    }
    $location.url(self.identityUrl + '/messages');
  };

  function init() {
    if(self.id) {
      checkMessages();
      $interval(checkMessages, 30000);
    }
  }

  function checkMessages() {
    brMessagesService.getAll();
  }
}

return register;

});
