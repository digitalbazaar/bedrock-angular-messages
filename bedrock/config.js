/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var fs = require('fs');
var path = require('path');

module.exports = function(bedrock) {
  // FIXME: overrides config set elsewhere
  // export bedrock-key location for UI
  var vars = bedrock.config.views.vars;
  vars['bedrock-angular-messages'] = vars['bedrock-angular-messages'] || {};
  if('messages' in bedrock.config) {
    vars['bedrock-angular-messages'].endpoints =
      bedrock.config.messages.endpoints || '';
  } else {
    vars['bedrock-angular-messages'].endpoints = {};
  }
};
