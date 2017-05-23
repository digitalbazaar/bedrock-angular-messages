/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-messages/messages-list-component.html'
};

/* @ngInject */
function Ctrl($location, $scope, $timeout, brMessagesService) {
  var self = this;
  self.messages = null;
  self.totalMessages = 0;
  self.loading = true;
  self.sorting = {
    date: '-'
  };
  self.orderBy = ['-date', '+id'];
  self.showDeleteSuccessAlert = false;
  self.showDeleteFailAlert = false;
  if(brMessagesService.returningFrom === 'archive') {
    self.inboxActive = false;
    self.archiveActive = true;
    brMessagesService.returningFrom = null;
  } else {
    self.inboxActive = true;
    self.archiveActive = false;
  }
  self.scrollLoading = false;

  self.limit = 10;
  self.pageAmount = 10;

  var allMessages = [];
  processMessageLists();

  // The paging function will get called when the directive
  // first gets instantiated, we don't want to display the
  // loading widget on this part.
  self.firstLoad = true;
  self.onLoadPage = function() {
    self.firstLoad = false;
    self.limit = self.limit + self.pageAmount;
    return $timeout(function() {
      processMessageLists();
    }, 30);
  };

  // Update the message service with the list's current URL so we can path back
  // to it later
  brMessagesService.setMessageListUrl($location.path());

  brMessagesService.getAll()
    .then(function(result) {
      allMessages = result.data;
      allMessages.forEach(function(message) {
        message.selected = false;
      });
      processMessageLists();
      self.loading = false;
    });

  self.view = function(id) {
    // TODO: $location doesn't do a full page refresh, which makes the page
    // look a little weird when moving over because it rapidly shrinks and
    // expands from the loading html
    $location.url('/messages/' + id);
  };

  self.sortClick = function(field) {
    switch(field) {
      case 'date':
        self.sorting.date = (self.sorting.date === '+') ? '-' : '+';
        self.orderBy = [
          self.sorting.date + 'date'
        ];
        break;
    }
  };

  self.inboxTab = function() {
    self.firstLoad = true;
    self.inboxActive = true;
    self.archiveActive = false;
    self.showDeleteSuccessAlert = false;
    self.showDeleteFailAlert = false;
    self.limit = 10;
    allMessages.forEach(function(message) {
      message.selected = false;
    });
    processMessageLists();
  };

  self.archiveTab = function() {
    self.firstLoad = true;
    self.inboxActive = false;
    self.archiveActive = true;
    self.showDeleteSuccessAlert = false;
    self.showDeleteFailAlert = false;
    self.limit = 10;
    allMessages.forEach(function(message) {
      message.selected = false;
    });
    processMessageLists();
  };

  self.showDeleteButton = function() {
    var show = false;
    for(var i = 0; i < self.messages.length; i++) {
      if(self.messages[i].selected) {
        show = true;
        break;
      }
    }
    return show;
  };

  self.deleteSelected = function() {
    var selectedMessages = self.messages.filter(function(message) {
      return message.selected;
    });
    var selectedIds = selectedMessages.map(function(message) {
      return message.id;
    });
    brMessagesService.deleteBatch(selectedIds)
      .then(function() {
        selectedMessages.forEach(function(message) {
          var index = allMessages.indexOf(message);
          if(index >= 0) {
            allMessages.splice(index, 1);
          }
        });
        self.showDeleteSuccessAlert = true;
        self.showDeleteFailAlert = false;
        processMessageLists();
      }).catch(function() {
        self.showDeleteFailAlert = true;
        self.showDeleteSuccessAlert = false;
      });
  };

  self.archiveSelected = function() {
    var selectedMessages = self.messages.filter(function(message) {
      return message.selected;
    });
    var selectedIds = selectedMessages.map(function(message) {
      return message.id;
    });
    brMessagesService.archiveBatch(selectedIds)
      .then(function() {
        // Mark selected objects as archived
        selectedMessages.forEach(function(message) {
          message.meta.archived = true;
        });
        self.showDeleteSuccessAlert = true;
        self.showDeleteFailAlert = false;
        processMessageLists();
      }).catch(function() {
        self.showDeleteFailAlert = true;
        self.showDeleteSuccessAlert = false;
      });
  };

  function processMessageLists() {
    self.totalMessages = totalMessages();

    var limit = self.limit;
    var curr = 0;
    if(self.inboxActive) {
      self.messages = allMessages.filter(function(message) {
        curr = curr + 1;
        return !message.meta.archived && curr <= limit;
      });
    } else {
      self.messages = allMessages.filter(function(message) {
        curr = curr + 1;
        return message.meta.archived && curr <= limit;
      });
    }
  }

  function totalMessages() {
    var amount = 0;
    if(self.inboxActive) {
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
  }
}
