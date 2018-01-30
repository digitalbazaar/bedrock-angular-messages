/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* @ngInject */
export default function factory($http, config) {
  const service = {};
  service.unreadCount = 0;
  const messagesEndpoint =
    config.data['bedrock-angular-messages'].endpoints.messages;
  service.messageListUrl = '';
  if(!messagesEndpoint) {
    throw new Error(
      'bedrock-angular-messages messages endpoint not configured; is ' +
      'bedrock-messages installed on the server?');
  }

  service.get = id => {
    return $http({method: 'GET', url: messagesEndpoint + '?id=' + id});
  };

  service.getAll = options => {
    const url = messagesEndpoint;

    var query = '';
    if(options) {
      query = '?';
      for(var option in options) {
        query = query + option + '=' + options[option] + '&';
      }
      query = query.splice(0, -1); // Remove trailing &
    }

    return $http({
      method: 'GET',
      url: url + query,
      headers: {
        'Accept': 'application/ld+json, application/json'
      }
    }).then(results => {
      const messages = results.data;
      service.unreadCount = messages.filter(message => {
        return !message.meta.read && !message.meta.archived;
      }).length;
      return results;
    });
  };

  service.delete = message => {
    return $http.delete(messagesEndpoint + '?id=' + message.id);
  };

  service.deleteBatch = messages => {
    const request = [];
    messages.forEach(function(message) {
      const operation = {
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

  service.archive = message => {
    const request = [];
    const operation = {
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

  service.archiveBatch = messages => {
    const request = [];
    messages.forEach(message => {
      const operation = {
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

  service.setMessageListUrl = url => {
    service.messageListUrl = url;
  };

  return service;
}
