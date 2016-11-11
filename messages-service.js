/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.service('brMessagesService', factory);
}

/* @ngInject */
function factory($http, config) {
  var service = {};
  service.unreadCount = 0;
  var messagesEndpoint =
    config.data['bedrock-angular-messages'].endpoints.messages;
  service.messageListUrl = '';
  if(!messagesEndpoint) {
    throw new Error(
      'bedrock-angular-messages messages endpoint not configured; is ' +
      'bedrock-messages installed on the server?');
  }

  service.get = function(id) {
    return $http({method: 'GET', url: messagesEndpoint + '?id=' + id});
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

    return $http({
      method: 'GET',
      url: url + query,
      headers: {
        'Accept': 'application/ld+json, application/json'
      }
    }).then(function(results) {
      var messages = results.data;
      service.unreadCount = messages.filter(function(message) {
        return !message.meta.read && !message.meta.archived;
      }).length;
      return results;
    });
  };

  service.delete = function(message) {
    return $http.delete(messagesEndpoint + '?id=' + message.id);
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
    return $http({
      url: messagesEndpoint,
      method: 'PATCH',
      data: JSON.stringify(request),
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    });
  };

  service.archive = function(message) {
    var request = [];
    var operation = {
      op: 'archive',
      id: message.id
    };
    request.push(operation);

    return $http({
      url: messagesEndpoint,
      method: 'PATCH',
      data: JSON.stringify(request),
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    });
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

    return $http({
      url: messagesEndpoint,
      method: 'PATCH',
      data: JSON.stringify(request),
      headers: {'Content-Type': 'application/json;charset=utf-8'}
    });
  };

  service.setMessageListUrl = function(url) {
    service.messageListUrl = url;
  };

  return service;
}

return register;

});
