/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-messages/messages-list-component.html'
};

/* @ngInject */
function Ctrl($location, $scope, $timeout, brMessagesService, brAlertService) {
  const self = this;
  self.messages = null;
  self.selectedMessages = [];
  self.totalMessages = 0;
  self.loading = true;
  self.inboxCount = 0;
  self.archiveCount = 0;
  self.orderBy = '-date';

  self.showDeleteSuccessAlert = false;
  self.showDeleteFailAlert = false;
  if(brMessagesService.returningFrom === 'archive') {
    self.inboxActive = false;
    self.archiveActive = true;
    brMessagesService.returningFrom = null;
  } else {
    self.inboxActive = true;
    self.archiveActive = false;
    brMessagesService.returningFrom = null;
  }
  self.scrollLoading = false;

  var allMessages = [];
  // processMessageLists();

  // The paging function will get called when the directive
  // first gets instantiated, we don't want to display the
  // loading widget on this part.
  /* not sure this is necessary anymore
  self.firstLoad = true;
  self.onLoadPage = () => {
    self.firstLoad = false;
  };
  */

  // Update the message service with the list's current URL so we can path back
  // to it later
  brMessagesService.setMessageListUrl($location.path());

  brMessagesService.getAll()
    .catch(err => {
      brAlertService.add('error', 'You need to log in first', {scope: $scope});
      $location.url('/');
      return;
    })
    .then(result => {
      allMessages = result.data;
      allMessages.forEach(function(message) {
        message.selected = false;
      });
      processMessageLists();
    })
    .then(() => {
      self.loading = false;
    });

  self.view = id => {
    // TODO: $location doesn't do a full page refresh, which makes the page
    // look a little weird when moving over because it rapidly shrinks and
    // expands from the loading html
    $location.url('/messages/' + id);
  };

  /* only used for debugging at this point
  self.sortClick = () => {
    console.log('sortClick');
    console.log(self.orderBy);
  };
  */

  /* only using this for debugging at this point
  self.logItemSelect = item => {
    console.log('logItem');
    console.log(self.selectedMessages);
  };
  */

  self.inboxTab = () => {
    self.firstLoad = true;
    self.inboxActive = true;
    self.archiveActive = false;
    self.showDeleteSuccessAlert = false;
    self.showDeleteFailAlert = false;
    processMessageLists();
  };

  self.archiveTab = () => {
    self.firstLoad = true;
    self.inboxActive = false;
    self.archiveActive = true;
    self.showDeleteSuccessAlert = false;
    self.showDeleteFailAlert = false;
    processMessageLists();
  };

  self.deleteSelected = () => {
    const selectedIds = self.selectedMessages.map(message => {
      return message.id;
    });
    brMessagesService.deleteBatch(selectedIds)
      .then(() => {
        self.selectedMessages.forEach(message => {
          const index = allMessages.indexOf(message);
          if(index >= 0) {
            allMessages.splice(index, 1);
          }
        });
        self.showDeleteSuccessAlert = true;
        self.showDeleteFailAlert = false;
        // clearSelection();
        processMessageLists();
      }).catch(() => {
        self.showDeleteFailAlert = true;
        self.showDeleteSuccessAlert = false;
      });
  };

  self.archiveSelected = () => {
    const selectedIds = self.selectedMessages.map(message => {
      return message.id;
    });
    brMessagesService.archiveBatch(selectedIds)
      .then(() => {
        // Mark selected objects as archived
        self.selectedMessages.forEach(message => {
          message.meta.archived = true;
        });
        self.showDeleteSuccessAlert = true;
        self.showDeleteFailAlert = false;
        processMessageLists();
      }).catch(() => {
        self.showDeleteFailAlert = true;
        self.showDeleteSuccessAlert = false;
      });
  };

  function clearSelection() {
    self.selectedMessages = [];
  }

  function processMessageLists() {
    setMessageCounts();
    clearSelection();

    if(self.inboxActive) {
      self.messages = allMessages.filter(message => {
        return !message.meta.archived;
      });
    } else {
      self.messages = allMessages.filter(message => {
        return message.meta.archived;
      });
    }
    return;
  }

  function setMessageCounts() {
    self.totalMessages = 0;
    self.inboxCount = 0;
    self.archiveCount = 0;

    allMessages.forEach(message => {
      if(!message.meta.archived) {
        self.inboxCount++;
      } else {
        self.archiveCount++;
      }
    });

    self.totalMessages = self.inboxCount + self.archiveCount;
    return;
  }
}
