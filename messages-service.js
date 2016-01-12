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
  var messagesBatchEndpoint =
    config.data['bedrock-angular-messages'].endpoints.messagesBatch;
  var searchEndpoint =
    config.data['bedrock-angular-messages'].endpoints.messagesSearch;
  service.messageListUrl = '';

  service.get = function(id) {
    return Promise.resolve(
      $http({method: 'GET', url: messagesEndpoint + '?id=' + id}));
  };
  service.getAll = function(options) {
    var url = messagesEndpoint;

    var query = '';
    if(options) {
      query = '?';
      for(var option in options) {
        query = query + option + '=' + options[option] + '&';
      }
      query = query.splice(0, -1);  // Remove trailing &
    }

    return Promise.resolve(
      $http({method: 'GET', url: url + query}))
        .then(function(results) {
          var messages = results.data;
          service.unreadCount = messages.filter(function(message) {
            return !message.meta.read && !message.meta.archived;
          }).length;
          return results;
        });
  };

  service.delete = function(message) {
    return Promise.resolve(
      $http.delete(messagesEndpoint + '?id=' + message.id));
  };

  service.deleteBatch = function(messages) {
    var request = [];
    messages.forEach(function(message) {
      var operation = {
        op: 'delete',
        id: message
      };
      request.push(operation);
    });
    return Promise.resolve(
      $http({
        url: messagesEndpoint,
        method: 'PATCH',
        data: JSON.stringify(request),
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }));
  };

  service.archive = function(message) {
    var request = [];
    var operation = {
      op: 'archive',
      id: message.id
    };
    request.push(operation);

    return Promise.resolve(
      $http({
        url: messagesEndpoint,
        method: 'PATCH',
        data: JSON.stringify(request),
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }));
  };

  service.archiveBatch = function(messages) {
    var request = [];
    messages.forEach(function(message) {
      var operation = {
        op: 'archive',
        id: message
      };
      request.push(operation);
    });

    return Promise.resolve(
      $http({
        url: messagesEndpoint,
        method: 'PATCH',
        data: JSON.stringify(request),
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }));
  };

  service.setMessageListUrl = function(url) {
    service.messageListUrl = url;
  };

  return service;
}

return {brMessagesService: factory};

});
