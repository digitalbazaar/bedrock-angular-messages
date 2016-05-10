/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory(brMessagesService, $routeParams, $location) {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-messages/message-viewer.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.message = null;
    model.loading = true;

    brMessagesService.get($routeParams.id)
      .then(function(result) {
        model.message = result.data;
        // TODO: In order to operate prev/next buttons, we have to pull
        // in all of the user's messages -- would be nice if
        // there was an endpoint that only pulled in a limited
        // number of the user's messages
        brMessagesService.getAll()
          .then(function(result) {
            var messages = result.data;
            // Only pull in messages that belong to the same archived class as
            // the current message
            model.messages = messages.filter(function(message) {
              return message.meta.archived === model.message.meta.archived;
            });
            // Sort the messages by date
            model.messages.sort(function(message1, message2) {
              return new Date(message1.content.date).getTime() -
                new Date(message2.content.date).getTime();
            });
            // Take the message's index so we can operate previous/next
            model.index = model.messages.findIndex(function(message) {
              return message.id === $routeParams.id;
            });
            model.loading = false;
            scope.$apply();
          });
      });

    model.view = function(id) {
      $location.url('/messages/' + id);
    };

    model.viewMessages = function() {
      if(brMessagesService.messageListUrl) {
        if(!model.message || !model.message.meta.archived) {
          brMessagesService.returningFrom = 'inbox';
        } else {
          brMessagesService.returningFrom = 'archive';
        }
        $location.url(brMessagesService.messageListUrl);
      }
    };

    model.delete = function() {
      brMessagesService.delete(model.message)
        .then(function(result) {
          model.viewMessages();
          scope.$apply();
        }).catch(function(error) {
          model.showFailAlert = true;
          scope.$apply();
        });
    };

    model.archive = function() {
      brMessagesService.archive(model.message)
        .then(function(result) {
          model.viewMessages();
          scope.$apply();
        }).catch(function(error) {
          model.showFailAlert = true;
          scope.$apply();
        });
    };
  }
}

return {brMessageViewer: factory};

});
