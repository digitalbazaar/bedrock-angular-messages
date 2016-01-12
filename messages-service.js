/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($http, config) {
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
  service.getAll = function(options) {
    var url = searchEndpoint;
    if(options && options.recipient) {
      url = searchEndpoint + '/' + options.recipient;
    }
    return Promise.resolve(
      $http({method: 'POST', url: url}))
        .then(function(results) {
          var messages = results.data;
          service.unreadCount = messages.filter(function(message) {
            return !message.meta.read;
          }).length;
          return new Promise(function(resolve, reject) {
            resolve(results);
          });
        });
  };
  return service;
}

return {brMessagesService: factory};

});
