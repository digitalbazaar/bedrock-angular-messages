/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory(brMessagesService, $location) {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-messages/messages-list.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.messages = null;
    model.totalMessages = 0;
    model.loading = true;
    model.sorting = {
      date: '-'
    };
    model.orderBy = ['-date', '+id'];
    model.showDeleteSuccessAlert = false;
    model.showDeleteFailAlert = false;
    if(brMessagesService.returningFrom === 'archive') {
      model.inboxActive = false;
      model.archiveActive = true;
      brMessagesService.returningFrom = null;
    } else {
      model.inboxActive = true;
      model.archiveActive = false;
    }
    model.scrollLoading = false;

    model.limit = 0;

    var allMessages = [];
    processMessageLists();

    // The paging function will get called when the directive
    // first gets instantiated, we don't want to display the
    // loading widget on this part.
    model.firstLoad = true;
    model.pagingFunction = function(limit, offset, done) {
      model.limit = limit;
      if(!model.firstLoad) {
        model.scrollLoading = true;
      }
      model.firstLoad = false;
      setTimeout(function() {
        processMessageLists();
        if(!model.firstLoad) {
          model.scrollLoading = false;
        }
        scope.$apply();
        done();
      }, 30);
    };

    // Update the message service with the list's current URL so we can path back to it later
    brMessagesService.setMessageListUrl($location.path());

    brMessagesService.getAll()
      .then(function(result) {
        allMessages = result.data;
        allMessages.forEach(function(message) {
          message.selected = false;
        });
        processMessageLists();
        model.loading = false;
        scope.$apply();
      });

    model.view = function(id) {
      // TODO: $location doesn't do a full page refresh, which makes the page look a little weird
      // when moving over because it rapidly shrinks and expands from the loading html
      $location.url('/messages/' + id);
    };

    model.sortClick = function(field) {
      switch(field) {
        case 'date':
          model.sorting.date = (model.sorting.date === '+') ? '-' : '+';
          model.orderBy = [
            model.sorting.date + 'date'
          ];
          break;
      }
    };

    model.inboxTab = function() {
      model.firstLoad = true;
      model.inboxActive = true;
      model.archiveActive = false;
      model.showDeleteSuccessAlert = false;
      model.showDeleteFailAlert = false;
      allMessages.forEach(function(message) {
        message.selected = false;
      });
      processMessageLists();
    };

    model.archiveTab = function() {
      model.firstLoad = true;
      model.inboxActive = false;
      model.archiveActive = true;
      model.showDeleteSuccessAlert = false;
      model.showDeleteFailAlert = false;
      allMessages.forEach(function(message) {
        message.selected = false;
      });
      processMessageLists();
    };

    model.shouldShowDeleteButton = function() {
      var shouldShow = false;
      model.messages.forEach(function(message) {
        if(message.selected) {
          shouldShow = true;
          return false;
        }
      });

      return shouldShow;
    };

    model.deleteSelected = function() {
      var selectedMessages = model.messages.filter(function(message) {
        return message.selected;
      });
      var selectedIds = selectedMessages.map(function(message) {
        return message.id;
      });
      brMessagesService.deleteBatch(selectedIds)
        .then(function(response) {
          selectedMessages.forEach(function(message, i, array) {
            var index = allMessages.indexOf(message);
            if(index >= 0) {
              allMessages.splice(index, 1);
            }
          });
          model.showDeleteSuccessAlert = true;
          model.showDeleteFailAlert = false;
          processMessageLists();
          scope.$apply();
        }).catch(function(error) {
          model.showDeleteFailAlert = true;
          model.showDeleteSuccessAlert = false;
          scope.$apply();
        });
    };

    model.archiveSelected = function() {
      var selectedMessages = model.messages.filter(function(message) {
        return message.selected;
      });
      var selectedIds = selectedMessages.map(function(message) {
        return message.id;
      });
      brMessagesService.archiveBatch(selectedIds)
        .then(function(result) {
          // Mark selected objects as archived
          selectedMessages.forEach(function(message) {
            message.meta.archived = true;
          });
          model.showDeleteSuccessAlert = true;
          model.showDeleteFailAlert = false;
          processMessageLists();
          scope.$apply();
        }).catch(function(error) {
          model.showDeleteFailAlert = true;
          model.showDeleteSuccessAlert = false;
          scope.$apply();
        });
    };

    function processMessageLists() {
      model.totalMessages = totalMessages();

      var limit = model.limit;
      var curr = 0;
      if(model.inboxActive) {
        model.messages = allMessages.filter(function(message) {
          curr = curr + 1;
          return !message.meta.archived && curr <= limit;
        });
      } else {
        model.messages = allMessages.filter(function(message) {
          curr = curr + 1;
          return message.meta.archived && curr <= limit;
        });
      }
    }
    function totalMessages() {
      var amount = 0;
      if(model.inboxActive) {
        allMessages.forEach(function(message) {
          if(!message.meta.archived) {
            amount = amount + 1;
          }
        });
      } else {
        allMessages.forEach(function(message) {
          if(message.meta.archived) {
            amount = amount + 1;
          }
        });
      }
      return amount;
    };
  }
}

return {brMessages: factory};

});
