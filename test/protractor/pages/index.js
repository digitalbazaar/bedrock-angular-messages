/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var pages = global.bedrock.pages || {};

pages['bedrock-angular-messages'] = {};
pages['bedrock-angular-messages'].app = require('./app');
pages['bedrock-angular-messages'].messageList = require('./messageList');
pages['bedrock-angular-messages'].message = require('./message');

module.exports = global.bedrock.pages = pages;
