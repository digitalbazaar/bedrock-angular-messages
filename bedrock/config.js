/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
module.exports = function(bedrock) {
  // FIXME: overrides config set elsewhere
  // export bedrock-messages location for UI
  var vars = bedrock.config.views.vars;
  vars['bedrock-angular-messages'] = vars['bedrock-angular-messages'] || {};
  if('messages' in bedrock.config) {
    vars['bedrock-angular-messages'].endpoints =
      bedrock.config.messages.endpoints || {};
  } else {
    vars['bedrock-angular-messages'].endpoints = {};
  }
};
