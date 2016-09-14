/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
require('bedrock-messages');

module.exports = function(bedrock) {
  // export bedrock-messages location for UI
  var vars = bedrock.config.views.vars;
  vars['bedrock-angular-messages'] = {
    endpoints: bedrock.config.messages.endpoints
  };
};
