/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-messages/message-viewer-component.html'
};

/* @ngInject */
function Ctrl(
  $routeParams, $location, $scope, brMessagesService, brAlertService) {
  var self = this;
  self.message = null;
  self.loading = true;

  brMessagesService.get($routeParams.id)
    .then(function(result) {
      self.message = result.data;
    })
    // TODO: In order to operate prev/next buttons, we have to pull
    // in all of the user's messages -- would be nice if
    // there was an endpoint that only pulled in a limited
    // number of the user's messages
    .then(function() {
      return brMessagesService.getAll().then(function(result) {
        var messages = result.data;
        // Only pull in messages that belong to the same archived class as
        // the current message
        self.messages = messages.filter(function(message) {
          return message.meta.archived === self.message.meta.archived;
        });
        // Sort the messages by date
        self.messages.sort(function(message1, message2) {
          return new Date(message1.content.date).getTime() -
            new Date(message2.content.date).getTime();
        });

        // Take the message's index so we can operate previous/next
        self.index = findMessageIndex(self.messages);
      });
    })
    .catch(function(err) {
      brAlertService.add('error', err, {scope: $scope})
        .then(function() {
          $scope.$apply();
        });
    })
    .then(function() {
      self.loading = false;
    });

  self.view = function(id) {
    $location.url('/messages/' + id);
  };

  self.viewMessages = function() {
    if(brMessagesService.messageListUrl) {
      if(!self.message || !self.message.meta.archived) {
        brMessagesService.returningFrom = 'inbox';
      } else {
        brMessagesService.returningFrom = 'archive';
      }
      $location.url(brMessagesService.messageListUrl);
    }
  };

  self.delete = function() {
    brMessagesService.delete(self.message)
      .then(function() {
        self.viewMessages();
      }).catch(function() {
        self.showFailAlert = true;
      });
  };

  self.archive = function() {
    brMessagesService.archive(self.message)
      .then(function() {
        self.viewMessages();
      }).catch(function() {
        self.showFailAlert = true;
      });
  };

  function findMessageIndex(messages) {
    for(var i = 0; i < messages.length; ++i) {
      if(messages[i].id === $routeParams.id) {
        return i;
      }
    }
    return -1;
  }
}
