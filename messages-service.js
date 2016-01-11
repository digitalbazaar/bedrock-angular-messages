/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($http, config, brIdentityService) {
  var service = {};
  service.unreadCount = 0;
  var messagesEndpoint =
    config.data['bedrock-angular-messages'].endpoints.messages;
  var searchEndpoint =
    config.data['bedrock-angular-messages'].endpoints.messagesSearch;

  service.get = function(id) {
    return Promise.resolve(
      $http({method: 'GET', url: messagesEndpoint + '/' + id}));
  };
  service.getAll = function() {
    return Promise.resolve(
      $http({method: 'POST', url: searchEndpoint + '/' +
      brIdentityService.identity.id}))
      .then(function(results) {
        var messages = results.data;
        service.unreadCount = messages.filter(function(message) {
          return !message.meta.read;
        }).length;
        console.log('UNREAD MESSAGES', service.unreadCount);
        return new Promise(function(resolve, reject) {
          resolve(results);
        });
      });
  };

  return service;
}

return {brMessagesService: factory};

});
