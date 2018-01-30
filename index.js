/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import MessagesListComponent from './messages-list-component.js';
import MessageViewerComponent from './message-viewer-component.js';
import MessagesNotificationComponent from
  './messages-notification-component.js';
import MessagesService from './messages-service.js';

const module = angular.module('bedrock.messages', [
  'bedrock.alert', 'bedrock.paging', 'md.data.table',
  'ngSanitize', 'ngMaterial'
]);

module.component('brMessagesList', MessagesListComponent);
module.component('brMessageViewer', MessageViewerComponent);
module.component('brMessagesNotification', MessagesNotificationComponent);
module.service('brMessagesService', MessagesService);
